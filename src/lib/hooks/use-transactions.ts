"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction, TransactionType } from "@/lib/budget/types";
import {
  getCurrentMonth,
  filterTransactionsByMonth,
  groupTransactionsByDate,
  calculateMonthSummary,
  getAdjacentMonth,
} from "@/lib/budget/utils";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [isLoading, setIsLoading] = useState(true);

  // API에서 거래 데이터 가져오기
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/budget/transactions`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("거래 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // 거래 추가
  const addTransaction = useCallback(
    async (data: {
      type: TransactionType;
      amount: number;
      categoryId: string;
      description: string;
      date: string;
    }) => {
      try {
        const res = await fetch("/api/budget/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const { transaction } = await res.json();
          // 낙관적 업데이트
          setTransactions((prev) => [transaction, ...prev]);
          return transaction;
        }
      } catch (error) {
        console.error("거래 추가 실패:", error);
      }
      return null;
    },
    []
  );

  // 거래 삭제
  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/budget/transactions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // 낙관적 업데이트
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("거래 삭제 실패:", error);
    }
  }, []);

  // 현재 월 거래
  const monthTransactions = filterTransactionsByMonth(transactions, currentMonth);

  // 날짜별 그룹
  const groupedTransactions = groupTransactionsByDate(monthTransactions);

  // 월별 요약
  const summary = calculateMonthSummary(transactions, currentMonth);

  // 월 변경
  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => getAdjacentMonth(prev, -1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => getAdjacentMonth(prev, 1));
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
    isLoading,
  };
}
