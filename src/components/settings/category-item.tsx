"use client";

import { Pencil, Trash2, Lock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconMap } from "./icon-picker";
import { Category } from "@/lib/hooks/use-categories";

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAddSub?: () => void;
  isSubCategory?: boolean;
}

export function CategoryItem({
  category,
  onEdit,
  onDelete,
  onAddSub,
  isSubCategory = false,
}: CategoryItemProps) {
  const IconComponent = iconMap[category.icon];

  return (
    <div
      className={cn(
        "group flex items-center justify-between py-3 px-4 hover:bg-white/5 transition-colors",
        isSubCategory && "py-2"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "rounded-lg flex items-center justify-center",
            isSubCategory ? "w-8 h-8" : "w-10 h-10"
          )}
          style={{ backgroundColor: `${category.color}20` }}
        >
          {IconComponent ? (
            <IconComponent
              className={isSubCategory ? "w-4 h-4" : "w-5 h-5"}
              style={{ color: category.color }}
            />
          ) : (
            <div
              className={isSubCategory ? "w-4 h-4" : "w-5 h-5"}
              style={{ backgroundColor: category.color, borderRadius: "50%" }}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("font-medium", isSubCategory ? "text-xs" : "text-sm")}>
            {category.name}
          </span>
          {category.isDefault && (
            <span title="기본 카테고리">
              <Lock className="w-3 h-3 text-[var(--text-muted)]" />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* 서브카테고리 추가 버튼 (1차 카테고리만) */}
        {!isSubCategory && onAddSub && (
          <button
            onClick={onAddSub}
            className={cn(
              "p-1.5 rounded-lg hover:bg-white/10 transition-all",
              "opacity-0 group-hover:opacity-100"
            )}
            title="서브카테고리 추가"
          >
            <Plus className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
        )}
        <button
          onClick={() => onEdit(category)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-white/10 transition-all",
            "opacity-0 group-hover:opacity-100"
          )}
          title="수정"
        >
          <Pencil className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
        {!category.isDefault && (
          <button
            onClick={() => onDelete(category.id)}
            className={cn(
              "p-1.5 rounded-lg hover:bg-white/10 transition-all",
              "opacity-0 group-hover:opacity-100"
            )}
            title="삭제"
          >
            <Trash2 className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
        )}
      </div>
    </div>
  );
}
