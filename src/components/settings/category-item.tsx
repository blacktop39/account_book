"use client";

import { Pencil, Trash2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconMap } from "./icon-picker";
import { Category } from "@/lib/hooks/use-categories";

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryItem({ category, onEdit, onDelete }: CategoryItemProps) {
  const IconComponent = iconMap[category.icon];

  return (
    <div className="group flex items-center justify-between py-3 px-4 hover:bg-white/5 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          {IconComponent ? (
            <IconComponent
              className="w-5 h-5"
              style={{ color: category.color }}
            />
          ) : (
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: category.color }}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{category.name}</span>
          {category.isDefault && (
            <span title="기본 카테고리">
              <Lock className="w-3 h-3 text-[var(--text-muted)]" />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
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
