"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction, TransactionType } from "@/lib/budget/types";
import {
  getBudgetData,
  addTransaction as addTx,
  deleteTransaction as deleteTx,
} from "@/lib/budget/storage";
import {
  generateId,
  getCurrentMonth,
  filterTransactionsByMonth,
  groupTransactionsByDate,
  calculateMonthSummary,
} from "@/lib/budget/utils";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [mounted, setMounted] = useState(false);

  // 클라이언트에서만 LocalStorage 읽기 (초기 마운트 시 1회)
  useEffect(() => {
    const data = getBudgetData();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransactions(data.transactions);
    setMounted(true);
  }, []);

  // 거래 추가
  const addTransaction = useCallback(
    (data: {
      type: TransactionType;
      amount: number;
      categoryId: string;
      description: string;
      date: string;
    }) => {
      const transaction: Transaction = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
      };

      const updated = addTx(transaction);
      setTransactions(updated.transactions);
      return transaction;
    },
    []
  );

  // 거래 삭제
  const deleteTransaction = useCallback((id: string) => {
    const updated = deleteTx(id);
    setTransactions(updated.transactions);
  }, []);

  // 현재 월 거래
  const monthTransactions = filterTransactionsByMonth(transactions, currentMonth);

  // 날짜별 그룹
  const groupedTransactions = groupTransactionsByDate(monthTransactions);

  // 월별 요약
  const summary = calculateMonthSummary(transactions, currentMonth);

  // 월 변경
  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const [year, month] = prev.split("-").map(Number);
      const date = new Date(year, month - 2);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const [year, month] = prev.split("-").map(Number);
      const date = new Date(year, month);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });
  }, []);

  return {
    transactions,
    monthTransactions,
    groupedTransactions,
    summary,
    currentMonth,
    setCurrentMonth,
    goToPrevMonth,
    goToNextMonth,
    addTransaction,
    deleteTransaction,
    isLoading: !mounted,
  };
}
