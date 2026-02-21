"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { MonthSummary as MonthSummaryType } from "@/lib/budget/types";
import { formatAmountShort } from "@/lib/budget/utils";

interface MonthSummaryProps {
  summary: MonthSummaryType;
  className?: string;
}

export function MonthSummary({ summary, className }: MonthSummaryProps) {
  const items = [
    {
      label: "수입",
      value: summary.totalIncome,
      icon: TrendingUp,
      color: "var(--success)",
    },
    {
      label: "지출",
      value: summary.totalExpense,
      icon: TrendingDown,
      color: "var(--error)",
    },
    {
      label: "잔액",
      value: summary.balance,
      icon: Wallet,
      color: summary.balance >= 0 ? "var(--success)" : "var(--error)",
    },
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <item.icon
              className="w-4 h-4"
              style={{ color: item.color }}
            />
            <span className="text-sm text-[var(--text-secondary)]">
              {item.label}
            </span>
          </div>
          <p
            className="text-xl font-semibold tabular-nums whitespace-nowrap"
            style={{ color: item.color }}
          >
            {item.label === "잔액" && item.value < 0 ? "-" : ""}₩{formatAmountShort(Math.abs(item.value))}
          </p>
        </div>
      ))}
    </div>
  );
}
