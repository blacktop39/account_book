import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/budget/categories";

// 사용자의 카테고리 조회 (없으면 기본 카테고리 생성)
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    // 1차 카테고리만 조회 (children 포함)
    let categories = await prisma.category.findMany({
      where: { userId, parentId: null },
      include: {
        children: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [{ type: "asc" }, { isDefault: "desc" }, { createdAt: "asc" }],
    });

    // 카테고리가 없으면 기본 카테고리 생성
    if (categories.length === 0) {
      for (const cat of DEFAULT_CATEGORIES) {
        const parent = await prisma.category.create({
          data: {
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            type: cat.type,
            isDefault: true,
            userId,
          },
        });

        // 서브카테고리 생성
        if (cat.children && cat.children.length > 0) {
          await prisma.category.createMany({
            data: cat.children.map((child) => ({
              name: child.name,
              icon: child.icon,
              color: child.color,
              type: cat.type,
              isDefault: true,
              userId,
              parentId: parent.id,
            })),
          });
        }
      }

      // 재조회
      categories = await prisma.category.findMany({
        where: { userId, parentId: null },
        include: {
          children: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: [{ type: "asc" }, { isDefault: "desc" }, { createdAt: "asc" }],
      });
    } else {
      // 기존 사용자: 서브카테고리 없는 기본 카테고리에 서브카테고리 추가
      let needsRefetch = false;
      for (const category of categories) {
        // DEFAULT_CATEGORIES에서 매칭되는 카테고리 찾기
        const defaultCat = DEFAULT_CATEGORIES.find(
          (dc) => dc.name === category.name && dc.type === category.type
        );

        if (!defaultCat?.children) continue;

        // 서브카테고리가 없으면 생성
        if (!category.children || category.children.length === 0) {
          await prisma.category.createMany({
            data: defaultCat.children.map((child) => ({
              name: child.name,
              icon: child.icon,
              color: child.color,
              type: category.type,
              isDefault: true,
              userId,
              parentId: category.id,
            })),
          });
          needsRefetch = true;
        } else {
          // 기존 서브카테고리의 아이콘이 없으면 업데이트
          for (const child of category.children) {
            if (!child.icon || child.icon === "") {
              const defaultChild = defaultCat.children.find(
                (dc) => dc.name === child.name
              );
              if (defaultChild) {
                await prisma.category.update({
                  where: { id: child.id },
                  data: { icon: defaultChild.icon, color: defaultChild.color },
                });
                needsRefetch = true;
              }
            }
          }
        }
      }

      // 서브카테고리가 추가/수정되었으면 재조회
      if (needsRefetch) {
        categories = await prisma.category.findMany({
          where: { userId, parentId: null },
          include: {
            children: {
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: [{ type: "asc" }, { isDefault: "desc" }, { createdAt: "asc" }],
        });
      }
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
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = await request.json();
    const { name, icon, color, type, parentId } = body;

    // 유효성 검사
    if (!name || !icon || !color) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요" },
        { status: 400 }
      );
    }

    // parentId가 있으면 부모 카테고리 확인
    let categoryType = type;
    if (parentId) {
      const parent = await prisma.category.findFirst({
        where: { id: parentId, userId },
      });
      if (!parent) {
        return NextResponse.json(
          { error: "부모 카테고리를 찾을 수 없습니다" },
          { status: 404 }
        );
      }
      // 2단계 깊이 제한: 부모가 이미 서브카테고리면 불가
      if (parent.parentId) {
        return NextResponse.json(
          { error: "서브카테고리에는 하위 카테고리를 추가할 수 없습니다" },
          { status: 400 }
        );
      }
      categoryType = parent.type;
    } else {
      // 1차 카테고리 생성 시 type 필수
      if (!type || (type !== "income" && type !== "expense")) {
        return NextResponse.json(
          { error: "유효하지 않은 타입입니다" },
          { status: 400 }
        );
      }
    }

    // 중복 검사 (같은 부모 아래)
    const existing = await prisma.category.findFirst({
      where: {
        userId,
        name,
        type: categoryType,
        parentId: parentId || null,
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
        type: categoryType,
        isDefault: false,
        userId,
        parentId: parentId || null,
      },
      include: {
        children: true,
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
