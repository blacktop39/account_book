"use client";

import { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Transaction } from "@/lib/budget/types";
import { formatAmount, formatAmountShort } from "@/lib/budget/utils";

interface MonthlyTrendProps {
  transactions: Transaction[];
}

export function MonthlyTrend({ transactions }: MonthlyTrendProps) {
  const { data, summary } = useMemo(() => {
    const byMonth: Record<string, { income: number; expense: number }> = {};

    // 최근 6개월 초기화
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      byMonth[monthKey] = { income: 0, expense: 0 };
    }

    // 거래 합산
    for (const t of transactions) {
      const month = t.date.substring(0, 7);
      if (byMonth[month]) {
        if (t.type === "income") {
          byMonth[month].income += t.amount;
        } else {
          byMonth[month].expense += t.amount;
        }
      }
    }

    const chartData = Object.entries(byMonth).map(([month, values]) => {
      const net = values.income - values.expense;
      const savingsRate = values.income > 0 ? Math.round((net / values.income) * 100) : 0;
      return {
        month: month.substring(5) + "월",
        fullMonth: month,
        수입: values.income,
        지출: values.expense,
        순수익: net,
        저축률: savingsRate,
      };
    });

    // 총 요약 계산
    const totalIncome = chartData.reduce((sum, d) => sum + d.수입, 0);
    const totalExpense = chartData.reduce((sum, d) => sum + d.지출, 0);
    const totalNet = totalIncome - totalExpense;
    const avgSavingsRate = totalIncome > 0 ? Math.round((totalNet / totalIncome) * 100) : 0;

    return {
      data: chartData,
      summary: {
        totalIncome,
        totalExpense,
        totalNet,
        avgSavingsRate,
      },
    };
  }, [transactions]);

  const hasData = data.some((d) => d.수입 > 0 || d.지출 > 0);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">월별 추이</h3>
        {hasData && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">평균 저축률</span>
            <span
              className={`text-sm font-medium ${
                summary.avgSavingsRate >= 0 ? "text-[var(--success)]" : "text-[var(--error)]"
              }`}
            >
              {summary.avgSavingsRate}%
            </span>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="py-8 text-center text-[var(--text-muted)]">
          거래 내역이 없습니다
        </div>
      ) : (
        <>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} barGap={4}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888888", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888888", fontSize: 12 }}
                  tickFormatter={(value) => formatAmountShort(value)}
                  width={50}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888888", fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  width={40}
                  domain={[-100, 100]}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0]?.payload;
                      return (
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium mb-2">{label}</p>
                          <p className="text-sm text-[#00d68f]">
                            수입: ₩{formatAmount(item.수입)}
                          </p>
                          <p className="text-sm text-[#ff4444]">
                            지출: ₩{formatAmount(item.지출)}
                          </p>
                          <p
                            className={`text-sm ${
                              item.순수익 >= 0 ? "text-[#4dabf7]" : "text-[#ff6b6b]"
                            }`}
                          >
                            순수익: ₩{formatAmount(item.순수익)}
                          </p>
                          <p className="text-sm text-[#da77f2]">
                            저축률: {item.저축률}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 16 }}
                  formatter={(value) => (
                    <span className="text-xs text-[var(--text-secondary)]">
                      {value}
                    </span>
                  )}
                />
                <Bar yAxisId="left" dataKey="수입" fill="#00d68f" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="지출" fill="#ff4444" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="순수익"
                  stroke="#4dabf7"
                  strokeWidth={2}
                  dot={{ fill: "#4dabf7", r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* 6개월 요약 */}
          <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-[var(--text-muted)] mb-1">총 수입</p>
              <p className="text-sm font-medium text-[var(--success)]">
                ₩{formatAmount(summary.totalIncome)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--text-muted)] mb-1">총 지출</p>
              <p className="text-sm font-medium text-[var(--error)]">
                ₩{formatAmount(summary.totalExpense)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--text-muted)] mb-1">순수익</p>
              <p
                className={`text-sm font-medium ${
                  summary.totalNet >= 0 ? "text-[#4dabf7]" : "text-[var(--error)]"
                }`}
              >
                ₩{formatAmount(summary.totalNet)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
