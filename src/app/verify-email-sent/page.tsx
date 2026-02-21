"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Logo } from "@/components/auth/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

function VerifyEmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;

    setIsResending(true);
    setResendMessage("");

    try {
      const response = await fetch("/api/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResendMessage(data.error || "이메일 전송에 실패했습니다");
        return;
      }

      setResendMessage("인증 이메일이 재전송되었습니다");
      setResendCooldown(60); // 60초 쿨다운
    } catch {
      setResendMessage("서버 오류가 발생했습니다");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <Logo className="mb-8" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-[var(--success)]" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-2">이메일을 확인해주세요</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {email ? (
              <>
                <span className="text-[var(--text-primary)]">{email}</span>
                으로
                <br />
                인증 링크를 보냈습니다
              </>
            ) : (
              <>가입하신 이메일로 인증 링크를 보냈습니다</>
            )}
          </p>

          {/* 인증 안내 */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[var(--text-secondary)]">
                <p className="mb-2">
                  이메일에 있는 인증 링크를 클릭하면
                  <br />
                  회원가입이 완료됩니다
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  인증 링크는 24시간 동안 유효합니다
                </p>
              </div>
            </div>
          </div>

          {/* 재발송 버튼 */}
          <div className="space-y-3">
            {resendMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${
                  resendMessage.includes("실패") || resendMessage.includes("오류")
                    ? "bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)]"
                    : "bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)]"
                }`}
              >
                <p className="text-sm">{resendMessage}</p>
              </motion.div>
            )}

            <Button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              variant="secondary"
              className="w-full"
              isLoading={isResending}
            >
              {resendCooldown > 0
                ? `다시 받기 (${resendCooldown}초)`
                : "인증 이메일 다시 받기"}
            </Button>
          </div>

          {/* 스팸 폴더 안내 */}
          <p className="text-xs text-[var(--text-muted)] mt-4">
            이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요
          </p>
        </motion.div>

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

export default function VerifyEmailSentPage() {
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
      <VerifyEmailSentContent />
    </Suspense>
  );
}
