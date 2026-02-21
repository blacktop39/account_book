"use client";

import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/lib/budget/types";
import { formatAmount } from "@/lib/budget/utils";
import { CategoryBadge } from "./category-badge";
import { Category } from "@/lib/hooks/use-categories";

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export function TransactionItem({
  transaction,
  category,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isIncome = transaction.type === "income";

  return (
    <div className="group flex items-center justify-between py-3 px-4 hover:bg-white/5 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <CategoryBadge categoryId={transaction.categoryId} category={category} showLabel={false} />
        <div>
          <p className="text-sm font-medium">
            {transaction.description || "내역 없음"}
          </p>
          {transaction.place && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {transaction.place}
            </p>
          )}
          <CategoryBadge
            categoryId={transaction.categoryId}
            category={category}
            showLabel={true}
            size="sm"
            className="mt-0.5"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "font-medium tabular-nums",
            isIncome ? "text-[var(--success)]" : "text-[var(--error)]"
          )}
        >
          {isIncome ? "+" : "-"}₩{formatAmount(transaction.amount)}
        </span>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 transition-all"
              title="수정"
            >
              <Pencil className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 transition-all"
              title="삭제"
            >
              <Trash2 className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
