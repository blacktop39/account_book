import { NextResponse } from "next/server";
import { findUserByEmail, createResetToken } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "이메일을 입력해주세요" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    // 보안: 사용자 존재 여부와 관계없이 동일한 응답
    if (user) {
      const token = createResetToken(email);
      const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;

      // 데모 모드: 콘솔에 리셋 링크 출력
      console.log("\n========================================");
      console.log("🔐 비밀번호 재설정 링크 (데모 모드)");
      console.log("========================================");
      console.log(`이메일: ${email}`);
      console.log(`링크: ${resetUrl}`);
      console.log("========================================\n");
    }

    return NextResponse.json({
      message: "이메일이 전송되었습니다",
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
