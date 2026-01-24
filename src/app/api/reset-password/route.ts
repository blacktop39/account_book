import { NextResponse } from "next/server";
import { resetPassword, verifyResetToken } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token) {
      return NextResponse.json(
        { error: "토큰이 필요합니다" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "비밀번호는 8자 이상이어야 합니다" },
        { status: 400 }
      );
    }

    // 토큰 검증
    const email = verifyResetToken(token);
    if (!email) {
      return NextResponse.json(
        { error: "링크가 만료되었거나 유효하지 않습니다" },
        { status: 400 }
      );
    }

    // 비밀번호 재설정
    const success = await resetPassword(token, password);
    if (!success) {
      return NextResponse.json(
        { error: "비밀번호 재설정에 실패했습니다" },
        { status: 500 }
      );
    }

    console.log(`\n✅ 비밀번호 재설정 완료: ${email}\n`);

    return NextResponse.json({
      message: "비밀번호가 변경되었습니다",
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
