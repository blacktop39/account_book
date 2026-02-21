import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verifyUser } from "@/lib/users";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  events: {
    // OAuth 로그인 시 이메일 자동 인증
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            emailVerified: true,
            emailVerifiedAt: new Date(),
          },
        });
      }
    },
  },

  providers: [
    // Google OAuth
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, // 기존 이메일 계정에 연결 허용
    }),

    // 이메일/비밀번호 로그인
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          return null;
        }

        const user = await verifyUser(email, password);
        if (!user) {
          return null;
        }

        // 이메일 인증 체크
        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: { emailVerified: true },
        });

        if (dbUser && !dbUser.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
});
