"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/lib/budget/types";
import { formatAmount, formatAmountShort } from "@/lib/budget/utils";

interface YearlySummaryProps {
  transactions: Transaction[];
}

export function YearlySummary({ transactions }: YearlySummaryProps) {
  const { data, summary } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const byMonth: Record<string, { income: number; expense: number }> = {};

    // 12개월 초기화
    for (let i = 1; i <= 12; i++) {
      const monthKey = `${currentYear}-${String(i).padStart(2, "0")}`;
      byMonth[monthKey] = { income: 0, expense: 0 };
    }

    // 거래 합산 (현재 연도만)
    for (const t of transactions) {
      if (t.date.startsWith(String(currentYear))) {
        const month = t.date.substring(0, 7);
        if (byMonth[month]) {
          if (t.type === "income") {
            byMonth[month].income += t.amount;
          } else {
            byMonth[month].expense += t.amount;
          }
        }
      }
    }

    // 누적 합계 계산
    let cumIncome = 0;
    let cumExpense = 0;

    const chartData = Object.entries(byMonth).map(([month, values]) => {
      cumIncome += values.income;
      cumExpense += values.expense;
      return {
        month: month.substring(5) + "월",
        수입: values.income,
        지출: values.expense,
        누적수입: cumIncome,
        누적지출: cumExpense,
        누적순수익: cumIncome - cumExpense,
      };
    });

    const totalIncome = cumIncome;
    const totalExpense = cumExpense;
    const totalNet = totalIncome - totalExpense;
    const avgMonthlyIncome = Math.round(totalIncome / 12);
    const avgMonthlyExpense = Math.round(totalExpense / 12);
    const savingsRate =
      totalIncome > 0 ? Math.round((totalNet / totalIncome) * 100) : 0;

    return {
      data: chartData,
      summary: {
        year: currentYear,
        totalIncome,
        totalExpense,
        totalNet,
        avgMonthlyIncome,
        avgMonthlyExpense,
        savingsRate,
      },
    };
  }, [transactions]);

  const hasData = data.some((d) => d.수입 > 0 || d.지출 > 0);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{summary.year}년 요약</h3>
        {hasData && (
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${
              summary.savingsRate >= 0
                ? "bg-[var(--success)]/20 text-[var(--success)]"
                : "bg-[var(--error)]/20 text-[var(--error)]"
            }`}
          >
            저축률 {summary.savingsRate}%
          </span>
        )}
      </div>

      {!hasData ? (
        <div className="py-8 text-center text-[var(--text-muted)]">
          {summary.year}년 거래 내역이 없습니다
        </div>
      ) : (
        <>
          {/* 누적 차트 */}
          <div className="h-[200px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d68f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d68f" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888888", fontSize: 10 }}
                  interval={1}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888888", fontSize: 10 }}
                  tickFormatter={(value) => formatAmountShort(value)}
                  width={45}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0]?.payload;
                      return (
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium mb-2">{label}</p>
                          <p className="text-xs text-[#00d68f]">
                            누적 수입: ₩{formatAmount(item.누적수입)}
                          </p>
                          <p className="text-xs text-[#ff4444]">
                            누적 지출: ₩{formatAmount(item.누적지출)}
                          </p>
                          <p
                            className={`text-xs ${item.누적순수익 >= 0 ? "text-[#4dabf7]" : "text-[var(--error)]"}`}
                          >
                            누적 순수익: ₩{formatAmount(item.누적순수익)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="누적수입"
                  stroke="#00d68f"
                  strokeWidth={2}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="누적지출"
                  stroke="#ff4444"
                  strokeWidth={2}
                  fill="url(#colorExpense)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 연간 총계 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[var(--success)]/10 rounded-lg p-4">
              <p className="text-xs text-[var(--text-muted)] mb-1">연간 총 수입</p>
              <p className="text-xl font-bold text-[var(--success)]">
                ₩{formatAmount(summary.totalIncome)}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                월 평균 ₩{formatAmount(summary.avgMonthlyIncome)}
              </p>
            </div>
            <div className="bg-[var(--error)]/10 rounded-lg p-4">
              <p className="text-xs text-[var(--text-muted)] mb-1">연간 총 지출</p>
              <p className="text-xl font-bold text-[var(--error)]">
                ₩{formatAmount(summary.totalExpense)}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                월 평균 ₩{formatAmount(summary.avgMonthlyExpense)}
              </p>
            </div>
          </div>

          {/* 순수익 */}
          <div
            className={`rounded-lg p-4 ${
              summary.totalNet >= 0
                ? "bg-[#4dabf7]/10"
                : "bg-[var(--error)]/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  연간 순수익
                </p>
                <p
                  className={`text-xl font-bold ${
                    summary.totalNet >= 0 ? "text-[#4dabf7]" : "text-[var(--error)]"
                  }`}
                >
                  ₩{formatAmount(summary.totalNet)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--text-muted)] mb-1">저축률</p>
                <p
                  className={`text-2xl font-bold ${
                    summary.savingsRate >= 0
                      ? "text-[var(--success)]"
                      : "text-[var(--error)]"
                  }`}
                >
                  {summary.savingsRate}%
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
