// 거래 타입
export type TransactionType = "income" | "expense";

// 카테고리
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

// 거래 내역
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO string
}

// LocalStorage 구조
export interface BudgetData {
  transactions: Transaction[];
  version: number;
}

// 월별 요약
export interface MonthSummary {
  month: string; // YYYY-MM
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: Record<string, number>;
}
