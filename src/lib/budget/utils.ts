import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ko } from "date-fns/locale";
import { Transaction, MonthSummary } from "./types";

// ID 생성
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 금액 포맷
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

// 금액 축약 (1,000,000 -> 100만)
export function formatAmountShort(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만`;
  }
  return formatAmount(amount);
}

// 날짜 포맷
export function formatDate(dateStr: string): string {
  const date = parse(dateStr, "yyyy-MM-dd", new Date());
  return format(date, "M월 d일 (EEE)", { locale: ko });
}

// 월 포맷
export function formatMonth(dateStr: string): string {
  const date = parse(dateStr, "yyyy-MM", new Date());
  return format(date, "yyyy년 M월", { locale: ko });
}

// 오늘 날짜 (YYYY-MM-DD)
export function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}

// 현재 월 (YYYY-MM)
export function getCurrentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

// 이전/다음 월 계산
export function getAdjacentMonth(month: string, offset: number): string {
  const date = parse(month, "yyyy-MM", new Date());
  date.setMonth(date.getMonth() + offset);
  return format(date, "yyyy-MM");
}

// 월의 시작/끝 날짜
export function getMonthRange(month: string): { start: Date; end: Date } {
  const date = parse(month, "yyyy-MM", new Date());
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

// 월의 모든 날짜 배열
export function getDaysInMonth(month: string): Date[] {
  const { start, end } = getMonthRange(month);
  return eachDayOfInterval({ start, end });
}

// 특정 월의 거래 필터링
export function filterTransactionsByMonth(
  transactions: Transaction[],
  month: string
): Transaction[] {
  return transactions.filter((t) => t.date.startsWith(month));
}

// 날짜별 거래 그룹핑
export function groupTransactionsByDate(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};

  for (const transaction of transactions) {
    if (!grouped[transaction.date]) {
      grouped[transaction.date] = [];
    }
    grouped[transaction.date].push(transaction);
  }

  // 날짜 내림차순 정렬
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const result: Record<string, Transaction[]> = {};
  for (const date of sortedDates) {
    result[date] = grouped[date];
  }

  return result;
}

// 월별 요약 계산
export function calculateMonthSummary(
  transactions: Transaction[],
  month: string
): MonthSummary {
  const monthTransactions = filterTransactionsByMonth(transactions, month);

  let totalIncome = 0;
  let totalExpense = 0;
  const byCategory: Record<string, number> = {};

  for (const t of monthTransactions) {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }

    byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
  }

  return {
    month,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    byCategory,
  };
}
