"use client";

import {
  Banknote,
  Gift,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  ShoppingCart,
  Gamepad2,
  Receipt,
  MoreHorizontal,
  HelpCircle,
  Coffee,
  Cookie,
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
  Fuel,
  Wrench,
  Shirt,
  Package,
  PiggyBank,
  Smartphone,
  Wifi,
  Zap,
  Droplet,
  Flame,
  Dumbbell,
  Pill,
  Baby,
  Dog,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryById } from "@/lib/budget/categories";

const iconMap: Record<string, React.ElementType> = {
  Banknote,
  Gift,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  ShoppingCart,
  Gamepad2,
  Receipt,
  MoreHorizontal,
  Coffee,
  Cookie,
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
  Fuel,
  Wrench,
  Shirt,
  Package,
  PiggyBank,
  Smartphone,
  Wifi,
  Zap,
  Droplet,
  Flame,
  Dumbbell,
  Pill,
  Baby,
  Dog,
  Scissors,
};

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  color: string;
  children?: CategoryData[];
}

interface CategoryBadgeProps {
  categoryId: string;
  category?: CategoryData;
  categories?: CategoryData[];
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryBadge({
  categoryId,
  category: externalCategory,
  categories = [],
  showLabel = true,
  size = "md",
  className,
}: CategoryBadgeProps) {
  // 카테고리 조회 함수
  const findCategory = (id: string): CategoryData | null => {
    for (const cat of categories) {
      if (cat.id === id) return cat;
      const child = cat.children?.find((c) => c.id === id);
      if (child) return child;
    }
    return null;
  };

  // 외부 카테고리 > DB 카테고리 > 기본 카테고리 순으로 조회
  const category = externalCategory || findCategory(categoryId) || getCategoryById(categoryId);

  if (!category) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className={cn(
            "flex items-center justify-center rounded-lg bg-gray-500/20",
            size === "sm" ? "w-6 h-6" : "w-8 h-8"
          )}
        >
          <HelpCircle
            className={cn(
              "text-gray-400",
              size === "sm" ? "w-3 h-3" : "w-4 h-4"
            )}
          />
        </div>
        {showLabel && <span className="text-sm text-gray-400">알 수 없음</span>}
      </div>
    );
  }

  const Icon = iconMap[category.icon] || HelpCircle;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg",
          size === "sm" ? "w-6 h-6" : "w-8 h-8"
        )}
        style={{ backgroundColor: `${category.color}20` }}
      >
        <Icon
          className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")}
          style={{ color: category.color }}
        />
      </div>
      {showLabel && (
        <span className="text-sm" style={{ color: category.color }}>
          {category.name}
        </span>
      )}
    </div>
  );
}
