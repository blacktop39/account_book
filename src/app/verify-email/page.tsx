"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Logo } from "@/components/auth/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("유효하지 않은 링크입니다");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setErrorMessage(data.error || "인증에 실패했습니다");
          return;
        }

        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMessage("서버 오류가 발생했습니다");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <Logo className="mb-8" />

        <AnimatePresence mode="wait">
          {status === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[var(--text-primary)] animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">이메일 인증 중...</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                잠시만 기다려주세요
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[var(--success)]" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                이메일 인증 완료! 🎉
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                가계부를 시작할 준비가 되었습니다
                <br />
                로그인하여 서비스를 이용해보세요
              </p>
              <Button onClick={() => router.push("/")} className="w-full">
                로그인하기
              </Button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[var(--error)]/10 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-[var(--error)]" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">인증 실패</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                {errorMessage}
              </p>
              <p className="text-xs text-[var(--text-muted)] mb-6">
                인증 링크가 만료되었거나 이미 사용되었을 수 있습니다
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full"
                  variant="secondary"
                >
                  로그인 페이지로
                </Button>
                <p className="text-xs text-[var(--text-muted)]">
                  인증 이메일을 다시 받으시려면 로그인 페이지에서
                  <br />
                  "인증 이메일 다시 받기"를 클릭해주세요
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            로그인으로 돌아가기
          </Link>
        </div>
      </AuthCard>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center p-4">
          <AuthCard>
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-[var(--text-primary)] border-t-transparent rounded-full" />
            </div>
          </AuthCard>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
