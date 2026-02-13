"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { TransactionType } from "@/lib/budget/types";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  isDefault: boolean;
  createdAt: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 카테고리 가져오기
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      } else {
        const data = await res.json();
        setError(data.error || "카테고리 조회 실패");
      }
    } catch {
      setError("카테고리를 불러올 수 없습니다");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 카테고리 추가
  const addCategory = useCallback(
    async (data: { name: string; icon: string; color: string; type: TransactionType }) => {
      try {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const { category } = await res.json();
          setCategories((prev) => [...prev, category]);
          return { success: true, category };
        } else {
          const { error } = await res.json();
          return { success: false, error };
        }
      } catch {
        return { success: false, error: "카테고리 추가에 실패했습니다" };
      }
    },
    []
  );

  // 카테고리 수정
  const updateCategory = useCallback(
    async (id: string, data: { name?: string; icon?: string; color?: string }) => {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const { category } = await res.json();
          setCategories((prev) =>
            prev.map((c) => (c.id === id ? category : c))
          );
          return { success: true, category };
        } else {
          const { error } = await res.json();
          return { success: false, error };
        }
      } catch {
        return { success: false, error: "카테고리 수정에 실패했습니다" };
      }
    },
    []
  );

  // 카테고리 삭제
  const deleteCategory = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        return { success: true };
      } else {
        const { error } = await res.json();
        return { success: false, error };
      }
    } catch {
      return { success: false, error: "카테고리 삭제에 실패했습니다" };
    }
  }, []);

  // ID로 카테고리 조회
  const getCategoryById = useCallback(
    (id: string) => {
      return categories.find((c) => c.id === id);
    },
    [categories]
  );

  // 수입/지출 카테고리 분리
  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === "income"),
    [categories]
  );

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "expense"),
    [categories]
  );

  return {
    categories,
    incomeCategories,
    expenseCategories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    refetch: fetchCategories,
  };
}
