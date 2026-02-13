"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/auth/logo";
import { LogOut, User, Wallet, ChevronRight, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <Logo />
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </header>

        {/* Welcome Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <User className="w-8 h-8 text-white/60" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                환영합니다, {session?.user?.name || "사용자"}님!
              </h1>
              <p className="text-[var(--text-secondary)]">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
            <p className="text-sm text-[var(--success)]">
              로그인에 성공했습니다. 이 페이지는 인증된 사용자만 볼 수 있습니다.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">빠른 메뉴</h2>
          <Link
            href="/dashboard/budget"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--success)]/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[var(--success)]" />
              </div>
              <div>
                <p className="font-medium">가계부</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  수입/지출 관리
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-white transition-colors" />
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--text-muted)]/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="font-medium">설정</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  카테고리 관리
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-white transition-colors" />
          </Link>
        </div>

        {/* Session Info */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8">
          <h2 className="text-lg font-semibold mb-4">세션 정보</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">이름</span>
              <span>{session?.user?.name || "-"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">이메일</span>
              <span>{session?.user?.email || "-"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[var(--text-secondary)]">상태</span>
              <span className="px-2 py-1 text-xs rounded-full bg-[var(--success)]/20 text-[var(--success)]">
                인증됨
              </span>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-500">
            <strong>데모 모드:</strong> 서버 재시작 시 모든 사용자 데이터가 초기화됩니다.
            프로덕션에서는 데이터베이스를 연결하세요.
          </p>
        </div>
      </div>
    </main>
  );
}
