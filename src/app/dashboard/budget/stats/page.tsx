"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExpenseChart } from "@/components/budget/expense-chart";
import { MonthlyTrend } from "@/components/budget/monthly-trend";
import { CategoryBadge } from "@/components/budget/category-badge";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { formatAmount, formatMonth } from "@/lib/budget/utils";

export default function StatsPage() {
  const { transactions, monthTransactions, currentMonth, isLoading } = useTransactions();

  // 상위 지출 카테고리
  const topExpenses = useMemo(() => {
    const expenses = monthTransactions.filter((t) => t.type === "expense");
    const byCategory: Record<string, number> = {};

    for (const t of expenses) {
      byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
    }

    return Object.entries(byCategory)
      .map(([categoryId, amount]) => ({ categoryId, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [monthTransactions]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard/budget"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">통계</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {formatMonth(currentMonth)} 기준
            </p>
          </div>
        </header>

        <div className="space-y-6">
          {/* 카테고리별 지출 파이 차트 */}
          <ExpenseChart transactions={monthTransactions} />

          {/* 월별 추이 바 차트 */}
          <MonthlyTrend transactions={transactions} />

          {/* 상위 지출 카테고리 */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">상위 지출 카테고리</h3>

            {topExpenses.length === 0 ? (
              <div className="py-4 text-center text-[var(--text-muted)]">
                지출 내역이 없습니다
              </div>
            ) : (
              <div className="space-y-3">
                {topExpenses.map((item, index) => (
                  <div
                    key={item.categoryId}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[var(--text-muted)] w-4">
                        {index + 1}
                      </span>
                      <CategoryBadge categoryId={item.categoryId} />
                    </div>
                    <span className="font-medium text-[var(--error)]">
                      -₩{formatAmount(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
