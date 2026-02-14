"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Transaction } from "@/lib/budget/types";
import { formatAmount } from "@/lib/budget/utils";
import { Category } from "@/lib/hooks/use-categories";

interface IncomeChartProps {
  transactions: Transaction[];
  categories?: Category[];
}

export function IncomeChart({ transactions, categories = [] }: IncomeChartProps) {
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  // 카테고리 ID → 부모 카테고리 매핑 생성
  const categoryToParent = useMemo(() => {
    const map: Record<string, Category> = {};
    for (const cat of categories) {
      map[cat.id] = cat;
      if (cat.children) {
        for (const child of cat.children) {
          map[child.id] = cat;
        }
      }
    }
    return map;
  }, [categories]);

  // 카테고리 ID로 카테고리 정보 조회
  const getCategoryInfo = (categoryId: string): Category | null => {
    for (const cat of categories) {
      if (cat.id === categoryId) return cat;
      const child = cat.children?.find((c) => c.id === categoryId);
      if (child) return child;
    }
    return null;
  };

  // 부모 카테고리별 집계 데이터
  const parentData = useMemo(() => {
    const incomes = transactions.filter((t) => t.type === "income");
    const byParent: Record<string, number> = {};

    for (const t of incomes) {
      const parent = categoryToParent[t.categoryId];
      const parentId = parent?.id || t.categoryId;
      byParent[parentId] = (byParent[parentId] || 0) + t.amount;
    }

    const items = Object.entries(byParent)
      .map(([categoryId, amount]) => {
        const category = getCategoryInfo(categoryId);
        const hasChildren = categories.find((c) => c.id === categoryId)?.children?.length ?? 0;
        return {
          id: categoryId,
          name: category?.name || "기타",
          value: amount,
          color: category?.color || "#868e96",
          hasChildren: hasChildren > 0,
        };
      })
      .sort((a, b) => b.value - a.value);

    const sum = items.reduce((acc, item) => acc + item.value, 0);

    return items.map((item) => ({
      ...item,
      percent: sum > 0 ? ((item.value / sum) * 100).toFixed(1) : "0",
    }));
  }, [transactions, categories, categoryToParent]);

  // 선택된 부모의 서브카테고리별 집계
  const childData = useMemo(() => {
    if (!selectedParentId) return [];

    const parent = categories.find((c) => c.id === selectedParentId);
    if (!parent?.children?.length) return [];

    const incomes = transactions.filter((t) => t.type === "income");
    const byChild: Record<string, number> = {};

    for (const t of incomes) {
      const parentOfTx = categoryToParent[t.categoryId];
      if (parentOfTx?.id === selectedParentId) {
        byChild[t.categoryId] = (byChild[t.categoryId] || 0) + t.amount;
      }
    }

    const items = Object.entries(byChild)
      .map(([categoryId, amount]) => {
        const category = getCategoryInfo(categoryId);
        return {
          id: categoryId,
          name: category?.name || "기타",
          value: amount,
          color: category?.color || parent.color,
          hasChildren: false,
        };
      })
      .sort((a, b) => b.value - a.value);

    const sum = items.reduce((acc, item) => acc + item.value, 0);

    return items.map((item) => ({
      ...item,
      percent: sum > 0 ? ((item.value / sum) * 100).toFixed(1) : "0",
    }));
  }, [selectedParentId, transactions, categories, categoryToParent]);

  const data = selectedParentId ? childData : parentData;
  const selectedParent = categories.find((c) => c.id === selectedParentId);

  if (data.length === 0 && !selectedParentId) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">카테고리별 수입</h3>
        <div className="py-8 text-center text-[var(--text-muted)]">
          수입 내역이 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-4">
        {selectedParentId && (
          <button
            onClick={() => setSelectedParentId(null)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h3 className="text-lg font-semibold">
          {selectedParent ? `${selectedParent.name} 상세` : "카테고리별 수입"}
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="py-8 text-center text-[var(--text-muted)]">
          {selectedParent?.name} 수입 내역이 없습니다
        </div>
      ) : (
        <>
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
                    if (!active || !payload?.length) return null;
                    const item = payload[0].payload;
                    return (
                      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          ₩{formatAmount(item.value)} ({item.percent}%)
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {data.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.hasChildren && !selectedParentId) {
                    setSelectedParentId(item.id);
                  }
                }}
                disabled={!item.hasChildren || !!selectedParentId}
                className={`w-full flex items-center justify-between py-1 px-2 -mx-2 rounded transition-colors ${
                  item.hasChildren && !selectedParentId
                    ? "hover:bg-white/5 cursor-pointer"
                    : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  {item.hasChildren && !selectedParentId && (
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                </div>
                <span className="text-sm text-[var(--text-secondary)]">
                  {item.percent}%
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
