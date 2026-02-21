import { NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "토큰이 필요합니다" },
        { status: 400 }
      );
    }

    const success = await verifyEmailToken(token);

    if (!success) {
      return NextResponse.json(
        { error: "유효하지 않거나 만료된 토큰입니다" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "이메일 인증이 완료되었습니다",
      success: true,
    });
  } catch (error) {
    console.error("이메일 인증 실패:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
