import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/budget/categories";

// 사용자의 카테고리 조회 (없으면 기본 카테고리 생성)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    // 사용자 카테고리 조회
    let categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: [{ type: "asc" }, { isDefault: "desc" }, { createdAt: "asc" }],
    });

    // 카테고리가 없으면 기본 카테고리 생성
    if (categories.length === 0) {
      const defaultCategories = DEFAULT_CATEGORIES.map((cat) => ({
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        type: cat.type,
        isDefault: true,
        userId: session.user.id,
      }));

      await prisma.category.createMany({
        data: defaultCategories,
      });

      categories = await prisma.category.findMany({
        where: { userId: session.user.id },
        orderBy: [{ type: "asc" }, { isDefault: "desc" }, { createdAt: "asc" }],
      });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("카테고리 조회 실패:", error);
    return NextResponse.json(
      { error: "카테고리 조회에 실패했습니다" },
      { status: 500 }
    );
  }
}

// 새 카테고리 추가
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = await request.json();
    const { name, icon, color, type } = body;

    // 유효성 검사
    if (!name || !icon || !color || !type) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요" },
        { status: 400 }
      );
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "유효하지 않은 타입입니다" },
        { status: 400 }
      );
    }

    // 중복 검사
    const existing = await prisma.category.findFirst({
      where: {
        userId: session.user.id,
        name,
        type,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "이미 같은 이름의 카테고리가 있습니다" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        icon,
        color,
        type,
        isDefault: false,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("카테고리 추가 실패:", error);
    return NextResponse.json(
      { error: "카테고리 추가에 실패했습니다" },
      { status: 500 }
    );
  }
}
