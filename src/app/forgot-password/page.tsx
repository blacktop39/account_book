"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Logo } from "@/components/auth/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError("이메일을 입력해주세요");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "오류가 발생했습니다");
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError("서버 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <Logo className="mb-8" />

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-2xl font-semibold text-center mb-2">
                비밀번호 찾기
              </h1>
              <p className="text-sm text-[var(--text-secondary)] text-center mb-8">
                가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  label="이메일"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  재설정 링크 보내기
                </Button>
              </form>
            </motion.div>
          ) : (
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
                이메일을 확인해주세요
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                <span className="text-[var(--text-primary)]">{email}</span>으로
                <br />
                비밀번호 재설정 링크를 보냈습니다
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                이메일이 도착하지 않았나요?{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[var(--text-primary)] hover:underline"
                >
                  다시 보내기
                </button>
              </p>
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
