"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AuthCard } from "@/components/auth/auth-card";
import { Logo } from "@/components/auth/logo";
import { SocialButton } from "@/components/auth/social-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setShowResendButton(false);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      // 이메일 미인증 에러 처리
      if (result.error === "EMAIL_NOT_VERIFIED") {
        setErrors({
          general: "이메일 인증이 필요합니다. 가입 시 받은 인증 이메일을 확인해주세요.",
        });
        setShowResendButton(true);
      } else {
        setErrors({ general: "이메일 또는 비밀번호가 올바르지 않습니다" });
      }
    } else if (result?.ok) {
      router.push("/budget");
      router.refresh();
    }
  };

  const handleResendVerification = async () => {
    if (!email || isResending) return;

    setIsResending(true);

    try {
      const response = await fetch("/api/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setErrors({
          general: "인증 이메일이 재전송되었습니다. 이메일을 확인해주세요.",
        });
        setShowResendButton(false);
      } else {
        const data = await response.json();
        setErrors({ general: data.error || "이메일 전송에 실패했습니다" });
      }
    } catch {
      setErrors({ general: "서버 오류가 발생했습니다" });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <Logo className="mb-8" />

        <h1 className="text-2xl font-semibold text-center mb-2">
          로그인
        </h1>
        <p className="text-sm text-[var(--text-secondary)] text-center mb-8">
          계정에 로그인하여 계속하세요
        </p>

        <div className="space-y-3 mb-6">
          <SocialButton provider="google" />
        </div>

        <Divider text="또는" className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20">
                <p className="text-sm text-[var(--error)]">{errors.general}</p>
              </div>
              {showResendButton && (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={handleResendVerification}
                  isLoading={isResending}
                >
                  인증 이메일 다시 받기
                </Button>
              )}
            </div>
          )}

          <Input
            type="email"
            label="이메일"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            type="password"
            label="비밀번호"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <Checkbox
              id="remember"
              label="로그인 상태 유지"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              비밀번호 찾기
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            로그인
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="text-[var(--text-primary)] hover:underline"
          >
            가입하기
          </Link>
        </p>
      </AuthCard>
    </main>
  );
}
