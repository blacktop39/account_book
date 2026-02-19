import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge Runtime 호환 미들웨어 (Prisma 없음)
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // 보호할 경로
    "/budget/:path*",
    "/settings/:path*",
    // 인증 페이지
    "/",
    "/signup",
    "/forgot-password",
  ],
};
