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
  parentId: string | null;
  children?: Category[];
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

  // 카테고리 추가 (서브카테고리 지원)
  const addCategory = useCallback(
    async (data: {
      name: string;
      icon: string;
      color: string;
      type?: TransactionType;
      parentId?: string;
    }) => {
      try {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const { category } = await res.json();
          if (data.parentId) {
            // 서브카테고리: 부모의 children에 추가
            setCategories((prev) =>
              prev.map((c) =>
                c.id === data.parentId
                  ? { ...c, children: [...(c.children || []), category] }
                  : c
              )
            );
          } else {
            // 1차 카테고리: 배열에 추가
            setCategories((prev) => [...prev, category]);
          }
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
            prev.map((c) => {
              if (c.id === id) return category;
              // 서브카테고리인 경우
              if (c.children) {
                const updatedChildren = c.children.map((child) =>
                  child.id === id ? category : child
                );
                return { ...c, children: updatedChildren };
              }
              return c;
            })
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
        setCategories((prev) =>
          prev
            .filter((c) => c.id !== id)
            .map((c) => ({
              ...c,
              children: c.children?.filter((child) => child.id !== id),
            }))
        );
        return { success: true };
      } else {
        const { error } = await res.json();
        return { success: false, error };
      }
    } catch {
      return { success: false, error: "카테고리 삭제에 실패했습니다" };
    }
  }, []);

  // ID로 카테고리 조회 (서브카테고리 포함)
  const getCategoryById = useCallback(
    (id: string): Category | undefined => {
      for (const cat of categories) {
        if (cat.id === id) return cat;
        const child = cat.children?.find((c) => c.id === id);
        if (child) return child;
      }
      return undefined;
    },
    [categories]
  );

  // 플랫 리스트 (모든 카테고리)
  const flatCategories = useMemo(() => {
    const result: Category[] = [];
    for (const cat of categories) {
      result.push(cat);
      if (cat.children) {
        result.push(...cat.children);
      }
    }
    return result;
  }, [categories]);

  // 수입/지출 카테고리 분리 (1차 카테고리만)
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
    flatCategories,
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
