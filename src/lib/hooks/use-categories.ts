"use client";

import { useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  // React Query로 카테고리 데이터 가져오기
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("카테고리 조회 실패");
      const data = await res.json();
      return data.categories || [];
    },
  });

  // 카테고리 추가 Mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      icon: string;
      color: string;
      type?: TransactionType;
      parentId?: string;
    }) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "카테고리 추가 실패");
      }
      const { category } = await res.json();
      return { category, parentId: data.parentId };
    },
    onSuccess: ({ category, parentId }) => {
      queryClient.setQueryData<Category[]>(["categories"], (old = []) => {
        if (parentId) {
          // 서브카테고리: 부모의 children에 추가
          return old.map((c) =>
            c.id === parentId
              ? { ...c, children: [...(c.children || []), category] }
              : c
          );
        } else {
          // 1차 카테고리: 배열에 추가
          return [...old, category];
        }
      });
    },
  });

  // 카테고리 수정 Mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; icon?: string; color?: string };
    }) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "카테고리 수정 실패");
      }
      const { category } = await res.json();
      return category;
    },
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData<Category[]>(["categories"], (old = []) =>
        old.map((c) => {
          if (c.id === updatedCategory.id) return updatedCategory;
          // 서브카테고리인 경우
          if (c.children) {
            const updatedChildren = c.children.map((child) =>
              child.id === updatedCategory.id ? updatedCategory : child
            );
            return { ...c, children: updatedChildren };
          }
          return c;
        })
      );
    },
  });

  // 카테고리 삭제 Mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "카테고리 삭제 실패");
      }
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Category[]>(["categories"], (old = []) =>
        old
          .filter((c) => c.id !== deletedId)
          .map((c) => ({
            ...c,
            children: c.children?.filter((child) => child.id !== deletedId),
          }))
      );
    },
  });

  // 편의 함수들
  const addCategory = useCallback(
    async (data: Parameters<typeof addCategoryMutation.mutateAsync>[0]) => {
      try {
        await addCategoryMutation.mutateAsync(data);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "카테고리 추가 실패",
        };
      }
    },
    [addCategoryMutation]
  );

  const updateCategory = useCallback(
    async (
      id: string,
      data: Parameters<typeof updateCategoryMutation.mutateAsync>[0]["data"]
    ) => {
      try {
        await updateCategoryMutation.mutateAsync({ id, data });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "카테고리 수정 실패",
        };
      }
    },
    [updateCategoryMutation]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await deleteCategoryMutation.mutateAsync(id);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "카테고리 삭제 실패",
        };
      }
    },
    [deleteCategoryMutation]
  );

  // ID로 카테고리 조회 (서브카테고리 포함)
  const getCategoryById = useCallback(
    (id: string): Category | undefined => {
      for (const cat of categories) {
        if (cat.id === id) return cat;
        const child = cat.children?.find((c: Category) => c.id === id);
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
    () => categories.filter((c: Category) => c.type === "income"),
    [categories]
  );

  const expenseCategories = useMemo(
    () => categories.filter((c: Category) => c.type === "expense"),
    [categories]
  );

  // Refetch 함수
  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }, [queryClient]);

  return {
    categories,
    flatCategories,
    incomeCategories,
    expenseCategories,
    isLoading,
    error: error ? String(error) : null,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    refetch,
  };
}
