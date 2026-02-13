import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// 카테고리 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, icon, color } = body;

    // 카테고리 존재 확인
    const existing = await prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이름 중복 검사 (다른 카테고리와)
    if (name && name !== existing.name) {
      const duplicate = await prisma.category.findFirst({
        where: {
          userId,
          name,
          type: existing.type,
          NOT: { id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "이미 같은 이름의 카테고리가 있습니다" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(icon && { icon }),
        ...(color && { color }),
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("카테고리 수정 실패:", error);
    return NextResponse.json(
      { error: "카테고리 수정에 실패했습니다" },
      { status: 500 }
    );
  }
}

// 카테고리 삭제 (커스텀 카테고리만)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { id } = await params;

    // 카테고리 존재 확인
    const existing = await prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 기본 카테고리는 삭제 불가
    if (existing.isDefault) {
      return NextResponse.json(
        { error: "기본 카테고리는 삭제할 수 없습니다" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("카테고리 삭제 실패:", error);
    return NextResponse.json(
      { error: "카테고리 삭제에 실패했습니다" },
      { status: 500 }
    );
  }
}
