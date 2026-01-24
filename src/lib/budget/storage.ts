import { BudgetData, Transaction } from "./types";

const STORAGE_KEY = "budget-data";
const CURRENT_VERSION = 1;

function getEmptyData(): BudgetData {
  return { transactions: [], version: CURRENT_VERSION };
}

export function getBudgetData(): BudgetData {
  if (typeof window === "undefined") {
    return getEmptyData();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return getEmptyData();
  }

  try {
    const data = JSON.parse(raw) as BudgetData;
    return migrate(data);
  } catch {
    return getEmptyData();
  }
}

export function saveBudgetData(data: BudgetData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addTransaction(transaction: Transaction): BudgetData {
  const current = getBudgetData();
  const updated: BudgetData = {
    ...current,
    transactions: [...current.transactions, transaction],
  };
  saveBudgetData(updated);
  return updated;
}

export function deleteTransaction(id: string): BudgetData {
  const current = getBudgetData();
  const updated: BudgetData = {
    ...current,
    transactions: current.transactions.filter((t) => t.id !== id),
  };
  saveBudgetData(updated);
  return updated;
}

export function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): BudgetData {
  const current = getBudgetData();
  const updated: BudgetData = {
    ...current,
    transactions: current.transactions.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    ),
  };
  saveBudgetData(updated);
  return updated;
}

function migrate(data: BudgetData): BudgetData {
  // 버전별 마이그레이션 로직 (필요시 추가)
  return { ...data, version: CURRENT_VERSION };
}
