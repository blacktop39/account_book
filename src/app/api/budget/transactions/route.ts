import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: 거래 조회 (페이지네이션 지원)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // YYYY-MM 형식
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "0");

    const where: { userId: string; date?: { startsWith: string } } = {
      userId: session.user.id,
    };

    if (month) {
      where.date = { startsWith: month };
    }

    // 페이지네이션 적용 (page/limit이 0이면 전체 조회)
    const usePagination = page > 0 && limit > 0;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        ...(usePagination && {
          skip: (page - 1) * limit,
          take: limit,
        }),
      }),
      usePagination ? prisma.transaction.count({ where }) : Promise.resolve(0),
    ]);

    if (usePagination) {
      return NextResponse.json({
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      });
    }

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("거래 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// POST: 새 거래 추가
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = await request.json();
    const { type, amount, categoryId, description, date } = body;

    // 유효성 검증
    if (!type || !["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "유효하지 않은 거래 유형입니다" },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "금액을 입력해주세요" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "카테고리를 선택해주세요" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: "날짜를 입력해주세요" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: Math.round(amount),
        categoryId,
        description: description || "",
        date,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error("거래 추가 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
