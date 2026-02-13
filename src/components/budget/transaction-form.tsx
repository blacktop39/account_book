"use client";

import { useState } from "react";
import {
  Banknote,
  Gift,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  MoreHorizontal,
  Coffee,
  Beer,
  CreditCard,
  Home,
  Heart,
  BookOpen,
  Music,
  Film,
  Plane,
  Train,
  Bus,
  Shirt,
  Package,
  PiggyBank,
  Smartphone,
  Wifi,
  Dumbbell,
  Pill,
  Baby,
  Dog,
  Scissors,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TransactionType } from "@/lib/budget/types";
import { getCategoriesByType } from "@/lib/budget/categories";
import { getToday } from "@/lib/budget/utils";

const iconMap: Record<string, React.ReactNode> = {
  Banknote: <Banknote className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
  Plus: <Plus className="w-4 h-4" />,
  Utensils: <Utensils className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  Gamepad2: <Gamepad2 className="w-4 h-4" />,
  Receipt: <Receipt className="w-4 h-4" />,
  MoreHorizontal: <MoreHorizontal className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Beer: <Beer className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Music: <Music className="w-4 h-4" />,
  Film: <Film className="w-4 h-4" />,
  Plane: <Plane className="w-4 h-4" />,
  Train: <Train className="w-4 h-4" />,
  Bus: <Bus className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  PiggyBank: <PiggyBank className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  Wifi: <Wifi className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  Pill: <Pill className="w-4 h-4" />,
  Baby: <Baby className="w-4 h-4" />,
  Dog: <Dog className="w-4 h-4" />,
  Scissors: <Scissors className="w-4 h-4" />,
};

interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

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
  categories?: CategoryOption[];
}

export function TransactionForm({
  type,
  onSubmit,
  onCancel,
  initialData,
  mode = "add",
  categories: externalCategories,
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

  // 외부 카테고리가 있으면 사용, 없으면 기본 카테고리 사용
  const categories = externalCategories || getCategoriesByType(type);
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
    icon: iconMap[c.icon] || <HelpCircle className="w-4 h-4" />,
    color: c.color,
  }));

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

      <Select
        label="카테고리"
        options={categoryOptions}
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
