import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH: 거래 수정
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;

    // 거래 존재 및 소유권 확인
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "거래를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }

    const body = await request.json();
    const { type, amount, categoryId, description, date } = body;

    // 부분 업데이트 데이터 구성
    const updateData: {
      type?: string;
      amount?: number;
      categoryId?: string;
      description?: string;
      date?: string;
    } = {};

    if (type !== undefined) {
      if (!["income", "expense"].includes(type)) {
        return NextResponse.json(
          { error: "유효하지 않은 거래 유형입니다" },
          { status: 400 }
        );
      }
      updateData.type = type;
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        return NextResponse.json(
          { error: "금액은 0보다 커야 합니다" },
          { status: 400 }
        );
      }
      updateData.amount = Math.round(amount);
    }

    if (categoryId !== undefined) {
      updateData.categoryId = categoryId;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (date !== undefined) {
      updateData.date = date;
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error("거래 수정 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// DELETE: 거래 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;

    // 거래 존재 및 소유권 확인
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "거래를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    if (transaction.userId !== session.user.id) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 }
      );
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("거래 삭제 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
