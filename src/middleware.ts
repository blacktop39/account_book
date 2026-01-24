import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 보호된 경로
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // 인증 페이지 (로그인 상태에서 접근 시 리다이렉트)
  const authRoutes = ["/", "/signup", "/forgot-password"];
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // 보호된 경로에 비로그인 상태로 접근 시
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 로그인 상태에서 인증 페이지 접근 시
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // 보호할 경로
    "/dashboard/:path*",
    // 인증 페이지
    "/",
    "/signup",
    "/forgot-password",
  ],
};
