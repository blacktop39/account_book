"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Calendar } from "lucide-react";
import { ExpenseChart } from "@/components/budget/expense-chart";
import { IncomeChart } from "@/components/budget/income-chart";
import { MonthlyTrend } from "@/components/budget/monthly-trend";
import { MonthComparison } from "@/components/budget/month-comparison";
import { YearlySummary } from "@/components/budget/yearly-summary";
import { CategoryBadge } from "@/components/budget/category-badge";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { formatAmount, formatMonth } from "@/lib/budget/utils";

type TabType = "monthly" | "yearly";

export default function StatsPage() {
  const { transactions, monthTransactions, currentMonth, isLoading } =
    useTransactions();
  const [activeTab, setActiveTab] = useState<TabType>("monthly");

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

  // 상위 수입 카테고리
  const topIncomes = useMemo(() => {
    const incomes = monthTransactions.filter((t) => t.type === "income");
    const byCategory: Record<string, number> = {};

    for (const t of incomes) {
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
        <header className="flex items-center gap-4 mb-6">
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

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "monthly"
                ? "bg-white/10 text-white"
                : "text-[var(--text-muted)] hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            이번 달
          </button>
          <button
            onClick={() => setActiveTab("yearly")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "yearly"
                ? "bg-white/10 text-white"
                : "text-[var(--text-muted)] hover:bg-white/5"
            }`}
          >
            <Calendar className="w-4 h-4" />
            연간
          </button>
        </div>

        {activeTab === "monthly" ? (
          <div className="space-y-6">
            {/* 전월 대비 */}
            <MonthComparison
              transactions={transactions}
              currentMonth={currentMonth}
            />

            {/* 카테고리별 차트 - 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ExpenseChart transactions={monthTransactions} />
              <IncomeChart transactions={monthTransactions} />
            </div>

            {/* 상위 카테고리 - 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 상위 지출 카테고리 */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-base font-semibold mb-4">상위 지출</h3>

                {topExpenses.length === 0 ? (
                  <div className="py-4 text-center text-[var(--text-muted)] text-sm">
                    지출 내역이 없습니다
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topExpenses.map((item, index) => (
                      <div
                        key={item.categoryId}
                        className="flex items-center justify-between py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-muted)] w-4">
                            {index + 1}
                          </span>
                          <CategoryBadge
                            categoryId={item.categoryId}
                            size="sm"
                          />
                        </div>
                        <span className="text-sm font-medium text-[var(--error)]">
                          -₩{formatAmount(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 상위 수입 카테고리 */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-base font-semibold mb-4">상위 수입</h3>

                {topIncomes.length === 0 ? (
                  <div className="py-4 text-center text-[var(--text-muted)] text-sm">
                    수입 내역이 없습니다
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topIncomes.map((item, index) => (
                      <div
                        key={item.categoryId}
                        className="flex items-center justify-between py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-muted)] w-4">
                            {index + 1}
                          </span>
                          <CategoryBadge
                            categoryId={item.categoryId}
                            size="sm"
                          />
                        </div>
                        <span className="text-sm font-medium text-[var(--success)]">
                          +₩{formatAmount(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 연간 요약 */}
            <YearlySummary transactions={transactions} />

            {/* 월별 추이 (6개월) */}
            <MonthlyTrend transactions={transactions} />
          </div>
        )}
      </div>
    </main>
  );
}
