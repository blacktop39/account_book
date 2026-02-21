import { NextResponse } from "next/server";
import { resendVerificationEmail } from "@/lib/users";
import { sendVerificationEmail } from "@/lib/email";

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

    const token = await resendVerificationEmail(email);

    if (!token) {
      return NextResponse.json(
        { error: "이메일을 찾을 수 없거나 이미 인증되었습니다" },
        { status: 400 }
      );
    }

    // 이메일 전송
    await sendVerificationEmail(email, token);

    return NextResponse.json({
      message: "인증 이메일이 전송되었습니다",
      success: true,
    });
  } catch (error) {
    console.error("이메일 재전송 실패:", error);
    return NextResponse.json(
      { error: "이메일 전송에 실패했습니다" },
      { status: 500 }
    );
  }
}
