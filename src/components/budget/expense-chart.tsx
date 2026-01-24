"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Transaction } from "@/lib/budget/types";
import { getCategoryById } from "@/lib/budget/categories";
import { formatAmount } from "@/lib/budget/utils";

interface ExpenseChartProps {
  transactions: Transaction[];
}

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const byCategory: Record<string, number> = {};

    for (const t of expenses) {
      byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
    }

    return Object.entries(byCategory)
      .map(([categoryId, amount]) => {
        const category = getCategoryById(categoryId);
        return {
          name: category?.name || "기타",
          value: amount,
          color: category?.color || "#868e96",
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">카테고리별 지출</h3>
        <div className="py-8 text-center text-[var(--text-muted)]">
          지출 내역이 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">카테고리별 지출</h3>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const percent = ((item.value / total) * 100).toFixed(1);
                  return (
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        ₩{formatAmount(item.value)} ({percent}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((item) => {
          const percent = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
