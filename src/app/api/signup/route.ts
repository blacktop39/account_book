import { NextResponse } from "next/server";
import { createUser, sanitizeUser } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // 입력 검증
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "비밀번호는 8자 이상이어야 합니다" },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "유효한 이메일 주소를 입력해주세요" },
        { status: 400 }
      );
    }

    // 사용자 생성
    const user = await createUser(email, name, password);

    if (!user) {
      return NextResponse.json(
        { error: "이미 가입된 이메일입니다" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "회원가입 성공", user: sanitizeUser(user) },
      { status: 201 }
    );
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
