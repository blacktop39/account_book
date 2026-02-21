"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Logo } from "@/components/auth/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, XCircle, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [status, setStatus] = useState<"form" | "success" | "error">("form");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrors({ general: "유효하지 않은 링크입니다" });
    }
  }, [token]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error });
        if (response.status === 400 && data.error.includes("만료")) {
          setStatus("error");
        }
        setIsLoading(false);
        return;
      }

      setStatus("success");
    } catch {
      setErrors({ general: "서버 오류가 발생했습니다" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <Logo className="mb-8" />

      <AnimatePresence mode="wait">
        {status === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-2xl font-semibold text-center mb-2">
              새 비밀번호 설정
            </h1>
            <p className="text-sm text-[var(--text-secondary)] text-center mb-8">
              새로운 비밀번호를 입력해주세요
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20">
                  <p className="text-sm text-[var(--error)]">{errors.general}</p>
                </div>
              )}

              <Input
                type="password"
                label="새 비밀번호"
                placeholder="8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="new-password"
              />

              <Input
                type="password"
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                <KeyRound className="w-4 h-4 mr-2" />
                비밀번호 변경
              </Button>
            </form>
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
              비밀번호가 변경되었습니다
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              새 비밀번호로 로그인해주세요
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
            <h2 className="text-xl font-semibold mb-2">링크가 만료되었습니다</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다
            </p>
            <Button
              onClick={() => router.push("/forgot-password")}
              className="w-full"
            >
              다시 요청하기
            </Button>
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
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Suspense
        fallback={
          <AuthCard>
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
            </div>
          </AuthCard>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
