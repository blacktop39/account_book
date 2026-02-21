"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction, TransactionType } from "@/lib/budget/types";
import {
  getCurrentMonth,
  filterTransactionsByMonth,
  groupTransactionsByDate,
  calculateMonthSummary,
  getAdjacentMonth,
} from "@/lib/budget/utils";

export function useTransactions() {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());

  // React Query로 거래 데이터 가져오기
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch("/api/budget/transactions");
      if (!res.ok) throw new Error("거래 조회 실패");
      const data = await res.json();
      return data.transactions || [];
    },
  });

  // 거래 추가 Mutation
  const addTransactionMutation = useMutation({
    mutationFn: async (data: {
      type: TransactionType;
      amount: number;
      categoryId: string;
      description: string;
      place: string;
      date: string;
    }) => {
      const res = await fetch("/api/budget/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("거래 추가 실패");
      const { transaction } = await res.json();
      return transaction;
    },
    onSuccess: (newTransaction) => {
      queryClient.setQueryData<Transaction[]>(["transactions"], (old = []) => [
        newTransaction,
        ...old,
      ]);
    },
  });

  // 거래 수정 Mutation
  const updateTransactionMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        type: TransactionType;
        amount: number;
        categoryId: string;
        description: string;
        place: string;
        date: string;
      }>;
    }) => {
      const res = await fetch(`/api/budget/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("거래 수정 실패");
      const { transaction } = await res.json();
      return transaction;
    },
    onSuccess: (updatedTransaction) => {
      queryClient.setQueryData<Transaction[]>(["transactions"], (old = []) =>
        old.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
      );
    },
  });

  // 거래 삭제 Mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/budget/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("거래 삭제 실패");
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Transaction[]>(["transactions"], (old = []) =>
        old.filter((t) => t.id !== deletedId)
      );
    },
  });

  // 편의 함수들
  const addTransaction = useCallback(
    (data: Parameters<typeof addTransactionMutation.mutateAsync>[0]) => {
      return addTransactionMutation.mutateAsync(data);
    },
    [addTransactionMutation]
  );

  const updateTransaction = useCallback(
    (id: string, data: Parameters<typeof updateTransactionMutation.mutateAsync>[0]["data"]) => {
      return updateTransactionMutation.mutateAsync({ id, data });
    },
    [updateTransactionMutation]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      return deleteTransactionMutation.mutateAsync(id);
    },
    [deleteTransactionMutation]
  );

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
    updateTransaction,
    deleteTransaction,
    isLoading,
  };
}
