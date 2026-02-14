"use client";

import { Transaction } from "@/lib/budget/types";
import { formatDate } from "@/lib/budget/utils";
import { TransactionItem } from "./transaction-item";
import { Category } from "@/lib/hooks/use-categories";

interface TransactionListProps {
  groupedTransactions: Record<string, Transaction[]>;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  categories?: Category[];
}

export function TransactionList({
  groupedTransactions,
  onEdit,
  onDelete,
  categories,
}: TransactionListProps) {
  const dates = Object.keys(groupedTransactions);

  // 플랫 카테고리 맵 생성 (ID -> Category)
  const categoryMap = new Map<string, Category>();
  if (categories) {
    for (const cat of categories) {
      categoryMap.set(cat.id, cat);
      if (cat.children) {
        for (const child of cat.children) {
          categoryMap.set(child.id, child);
        }
      }
    }
  }

  if (dates.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-[var(--text-muted)]">거래 내역이 없습니다</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          위의 버튼으로 수입이나 지출을 추가해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {dates.map((date) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2 px-4">
            {formatDate(date)}
          </h3>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden divide-y divide-[var(--border)]">
            {groupedTransactions[date].map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                category={categoryMap.get(transaction.categoryId)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
