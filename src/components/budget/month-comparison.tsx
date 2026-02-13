"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Transaction } from "@/lib/budget/types";
import { formatAmount } from "@/lib/budget/utils";

interface MonthComparisonProps {
  transactions: Transaction[];
  currentMonth: string; // "YYYY-MM" 형식
}

export function MonthComparison({
  transactions,
  currentMonth,
}: MonthComparisonProps) {
  const comparison = useMemo(() => {
    // 전월 계산
    const [year, month] = currentMonth.split("-").map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    // 이번 달 거래
    const thisMonthTx = transactions.filter((t) =>
      t.date.startsWith(currentMonth)
    );
    const thisIncome = thisMonthTx
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const thisExpense = thisMonthTx
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // 전월 거래
    const prevMonthTx = transactions.filter((t) => t.date.startsWith(prevMonth));
    const prevIncome = prevMonthTx
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const prevExpense = prevMonthTx
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // 변화율 계산
    const calcChange = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - prev) / prev) * 100);
    };

    return {
      income: {
        current: thisIncome,
        prev: prevIncome,
        change: calcChange(thisIncome, prevIncome),
        diff: thisIncome - prevIncome,
      },
      expense: {
        current: thisExpense,
        prev: prevExpense,
        change: calcChange(thisExpense, prevExpense),
        diff: thisExpense - prevExpense,
      },
      net: {
        current: thisIncome - thisExpense,
        prev: prevIncome - prevExpense,
        change: calcChange(thisIncome - thisExpense, prevIncome - prevExpense),
        diff: thisIncome - thisExpense - (prevIncome - prevExpense),
      },
    };
  }, [transactions, currentMonth]);

  const renderTrend = (change: number, isExpense = false) => {
    // 지출의 경우 증가가 부정적
    const isPositive = isExpense ? change < 0 : change > 0;
    const isNegative = isExpense ? change > 0 : change < 0;

    if (change === 0) {
      return (
        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          <Minus className="w-4 h-4" />
          <span className="text-sm">0%</span>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center gap-1 ${
          isPositive
            ? "text-[var(--success)]"
            : isNegative
              ? "text-[var(--error)]"
              : "text-[var(--text-muted)]"
        }`}
      >
        {change > 0 ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {change > 0 ? "+" : ""}
          {change}%
        </span>
      </div>
    );
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">전월 대비</h3>

      <div className="space-y-4">
        {/* 수입 */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">수입</p>
            <p className="text-lg font-medium text-[var(--success)]">
              ₩{formatAmount(comparison.income.current)}
            </p>
          </div>
          <div className="text-right">
            {renderTrend(comparison.income.change)}
            <p className="text-xs text-[var(--text-muted)] mt-1">
              전월 ₩{formatAmount(comparison.income.prev)}
            </p>
          </div>
        </div>

        {/* 지출 */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">지출</p>
            <p className="text-lg font-medium text-[var(--error)]">
              ₩{formatAmount(comparison.expense.current)}
            </p>
          </div>
          <div className="text-right">
            {renderTrend(comparison.expense.change, true)}
            <p className="text-xs text-[var(--text-muted)] mt-1">
              전월 ₩{formatAmount(comparison.expense.prev)}
            </p>
          </div>
        </div>

        {/* 순수익 */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">순수익</p>
            <p
              className={`text-lg font-medium ${
                comparison.net.current >= 0
                  ? "text-[#4dabf7]"
                  : "text-[var(--error)]"
              }`}
            >
              ₩{formatAmount(comparison.net.current)}
            </p>
          </div>
          <div className="text-right">
            {renderTrend(comparison.net.change)}
            <p className="text-xs text-[var(--text-muted)] mt-1">
              전월 ₩{formatAmount(comparison.net.prev)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
