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
import { Divider } from "@/components/ui/divider";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요";
    }

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
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "회원가입에 실패했습니다" });
        setIsLoading(false);
        return;
      }

      // 회원가입 성공 후 자동 로그인
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/budget");
        router.refresh();
      } else {
        // 회원가입은 성공했지만 로그인 실패 시 로그인 페이지로
        router.push("/?registered=true");
      }
    } catch {
      setErrors({ general: "서버 오류가 발생했습니다" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <AuthCard>
        <Logo className="mb-8" />

        <h1 className="text-2xl font-semibold text-center mb-2">
          계정 만들기
        </h1>
        <p className="text-sm text-[var(--text-secondary)] text-center mb-8">
          새 계정을 만들어 시작하세요
        </p>

        <div className="space-y-3 mb-6">
          <SocialButton provider="google" />
        </div>

        <Divider text="또는" className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20">
              <p className="text-sm text-[var(--error)]">{errors.general}</p>
            </div>
          )}

          <Input
            type="text"
            label="이름"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoComplete="name"
          />

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

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            가입하기
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/"
            className="text-[var(--text-primary)] hover:underline"
          >
            로그인
          </Link>
        </p>
      </AuthCard>
    </main>
  );
}
