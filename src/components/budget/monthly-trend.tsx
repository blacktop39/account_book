"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
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
  const data = useMemo(() => {
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

    return Object.entries(byMonth).map(([month, values]) => ({
      month: month.substring(5) + "월",
      수입: values.income,
      지출: values.expense,
    }));
  }, [transactions]);

  const hasData = data.some((d) => d.수입 > 0 || d.지출 > 0);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">월별 추이</h3>

      {!hasData ? (
        <div className="py-8 text-center text-[var(--text-muted)]">
          거래 내역이 없습니다
        </div>
      ) : (
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888888", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888888", fontSize: 12 }}
                tickFormatter={(value) => formatAmountShort(value)}
                width={50}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium mb-1">{label}</p>
                        {payload.map((entry) => (
                          <p
                            key={entry.name}
                            className="text-sm"
                            style={{ color: entry.color }}
                          >
                            {entry.name}: ₩{formatAmount(entry.value as number)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="text-sm text-[var(--text-secondary)]">
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="수입" fill="#00d68f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="지출" fill="#ff4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
