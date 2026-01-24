"use client";

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
  HelpCircle,
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
  Gamepad2,
  Receipt,
  MoreHorizontal,
};

interface CategoryBadgeProps {
  categoryId: string;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryBadge({
  categoryId,
  showLabel = true,
  size = "md",
  className,
}: CategoryBadgeProps) {
  const category = getCategoryById(categoryId);

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
