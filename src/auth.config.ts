import type { NextAuthConfig } from "next-auth";

// Edge Runtime 호환 설정 (Prisma 없음)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/",
  },

  callbacks: {
    // JWT에 사용자 ID 추가
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // 세션에 사용자 ID 추가
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },

    // 미들웨어에서 인증 체크
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const protectedRoutes = ["/budget", "/settings"];
      const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      const authRoutes = ["/", "/signup", "/forgot-password"];
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);

      if (isProtectedRoute && !isLoggedIn) {
        return false; // 로그인 페이지로 리다이렉트
      }

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/budget", nextUrl));
      }

      return true;
    },
  },

  providers: [], // 미들웨어용 빈 배열 (auth.ts에서 추가)
};
