"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategorySelect } from "@/components/ui/category-select";
import { TransactionType } from "@/lib/budget/types";
import { getToday } from "@/lib/budget/utils";
import { Category } from "@/lib/hooks/use-categories";

interface TransactionFormProps {
  type: TransactionType;
  onSubmit: (data: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    description: string;
    date: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    amount: number;
    categoryId: string;
    description: string;
    date: string;
  };
  mode?: "add" | "edit";
  categories: Category[];
}

export function TransactionForm({
  type,
  onSubmit,
  onCancel,
  initialData,
  mode = "add",
  categories,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(
    initialData?.amount ? String(initialData.amount) : ""
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [date, setDate] = useState(initialData?.date || getToday());
  const [errors, setErrors] = useState<{
    amount?: string;
    categoryId?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "금액을 입력해주세요";
    }
    if (!categoryId) {
      newErrors.categoryId = "카테고리를 선택해주세요";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      type,
      amount: Number(amount),
      categoryId,
      description,
      date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        label="금액"
        placeholder="0"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          setErrors((prev) => ({ ...prev, amount: undefined }));
        }}
        error={errors.amount}
        autoFocus
      />

      <CategorySelect
        label="카테고리"
        categories={categories}
        value={categoryId}
        onChange={(value) => {
          setCategoryId(value);
          setErrors((prev) => ({ ...prev, categoryId: undefined }));
        }}
        placeholder="카테고리 선택"
        error={errors.categoryId}
      />

      <Input
        type="text"
        label="내용 (선택)"
        placeholder="예: 점심식사, 지하철 등"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input
        type="date"
        label="날짜"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
        >
          취소
        </Button>
        <Button type="submit" className="flex-1">
          {mode === "edit"
            ? "수정"
            : type === "income"
              ? "수입 추가"
              : "지출 추가"}
        </Button>
      </div>
    </form>
  );
}
