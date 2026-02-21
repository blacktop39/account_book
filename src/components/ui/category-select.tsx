"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/hooks/use-categories";

// 아이콘 맵 (lucide-react)
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
  ShoppingCart,
  Cookie,
  Coffee,
  Train,
  Fuel,
  Wrench,
  Shirt,
  Package,
  Smartphone,
  Film,
  Heart,
  Dumbbell,
  Zap,
  Droplet,
  Flame,
  Wifi,
  HelpCircle,
} from "lucide-react";

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
  ShoppingCart,
  Cookie,
  Coffee,
  Train,
  Fuel,
  Wrench,
  Shirt,
  Package,
  Smartphone,
  Film,
  Heart,
  Dumbbell,
  Zap,
  Droplet,
  Flame,
  Wifi,
};

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

export function CategorySelect({
  categories,
  value,
  onChange,
  placeholder = "카테고리 선택",
  label,
  error,
  className,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // 선택된 카테고리 찾기
  const selectedCategory = useMemo(() => {
    for (const cat of categories) {
      if (cat.id === value) return { ...cat, parentName: undefined };
      const child = cat.children?.find((c) => c.id === value);
      if (child) return { ...child, parentName: cat.name };
    }
    return null;
  }, [categories, value]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedParent(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleParentClick = (parent: Category) => {
    if (parent.children && parent.children.length > 0) {
      setSelectedParent(parent);
    } else {
      onChange(parent.id);
      setIsOpen(false);
      setSelectedParent(null);
    }
  };

  const handleChildClick = (childId: string) => {
    onChange(childId);
    setIsOpen(false);
    setSelectedParent(null);
  };

  const handleBack = () => {
    setSelectedParent(null);
  };

  const renderIcon = (iconName: string, color: string) => {
    const Icon = iconMap[iconName] || HelpCircle;
    return <Icon className="w-4 h-4" style={{ color }} />;
  };

  return (
    <div className={cn("relative", className)} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}

      {/* 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-10 px-3 flex items-center justify-between",
          "bg-[var(--surface)] border rounded-lg",
          "text-[var(--text-primary)] text-left",
          "transition-colors duration-200",
          "focus:outline-none focus:border-[var(--accent)]",
          error
            ? "border-[var(--error)]"
            : isOpen
              ? "border-[var(--accent)]"
              : "border-[var(--border)]"
        )}
      >
        <span
          className={cn(
            "flex items-center gap-2",
            !selectedCategory && "text-[var(--text-muted)]"
          )}
        >
          {selectedCategory ? (
            <>
              {renderIcon(selectedCategory.icon, selectedCategory.color)}
              <span>
                {selectedCategory.parentName
                  ? `${selectedCategory.parentName} > ${selectedCategory.name}`
                  : selectedCategory.name}
              </span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[var(--text-muted)] transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* 드롭다운 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg max-h-72 overflow-auto">
          {selectedParent ? (
            // 서브카테고리 목록
            <>
              <button
                type="button"
                onClick={handleBack}
                className="w-full px-3 py-2 flex items-center gap-2 text-left text-[var(--text-primary)] border-b border-[var(--border)] hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="font-medium">{selectedParent.name}</span>
              </button>
              <div className="py-1">
                {/* 부모 카테고리 선택 옵션 */}
                <button
                  type="button"
                  onClick={() => handleChildClick(selectedParent.id)}
                  className={cn(
                    "w-full px-3 py-2 flex items-center gap-2 text-left",
                    "text-[var(--text-secondary)] hover:bg-white/5 transition-colors",
                    selectedParent.id === value && "bg-white/10"
                  )}
                >
                  {renderIcon(selectedParent.icon, selectedParent.color)}
                  <span>{selectedParent.name} (전체)</span>
                </button>
                {/* 서브카테고리들 */}
                {selectedParent.children?.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => handleChildClick(child.id)}
                    className={cn(
                      "w-full px-3 py-2 flex items-center gap-2 text-left",
                      "text-[var(--text-primary)] hover:bg-white/5 transition-colors",
                      child.id === value && "bg-white/10"
                    )}
                  >
                    {renderIcon(child.icon, child.color)}
                    <span>{child.name}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            // 1차 카테고리 목록
            <div className="py-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleParentClick(cat)}
                  className={cn(
                    "w-full px-3 py-2 flex items-center justify-between text-left",
                    "text-[var(--text-primary)] hover:bg-white/5 transition-colors",
                    cat.id === value && "bg-white/10"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {renderIcon(cat.icon, cat.color)}
                    <span>{cat.name}</span>
                  </span>
                  {cat.children && cat.children.length > 0 && (
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
      )}
    </div>
  );
}
