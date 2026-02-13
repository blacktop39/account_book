"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = [
  { id: "Banknote", icon: Banknote, label: "지폐" },
  { id: "Gift", icon: Gift, label: "선물" },
  { id: "Plus", icon: Plus, label: "플러스" },
  { id: "Utensils", icon: Utensils, label: "식사" },
  { id: "Car", icon: Car, label: "자동차" },
  { id: "ShoppingBag", icon: ShoppingBag, label: "쇼핑" },
  { id: "Gamepad2", icon: Gamepad2, label: "게임" },
  { id: "Receipt", icon: Receipt, label: "영수증" },
  { id: "MoreHorizontal", icon: MoreHorizontal, label: "기타" },
  { id: "Coffee", icon: Coffee, label: "커피" },
  { id: "Beer", icon: Beer, label: "술" },
  { id: "CreditCard", icon: CreditCard, label: "카드" },
  { id: "Home", icon: Home, label: "집" },
  { id: "Heart", icon: Heart, label: "건강" },
  { id: "BookOpen", icon: BookOpen, label: "교육" },
  { id: "Music", icon: Music, label: "음악" },
  { id: "Film", icon: Film, label: "영화" },
  { id: "Plane", icon: Plane, label: "비행기" },
  { id: "Train", icon: Train, label: "기차" },
  { id: "Bus", icon: Bus, label: "버스" },
  { id: "Shirt", icon: Shirt, label: "옷" },
  { id: "Package", icon: Package, label: "택배" },
  { id: "PiggyBank", icon: PiggyBank, label: "저금" },
  { id: "Smartphone", icon: Smartphone, label: "폰" },
  { id: "Wifi", icon: Wifi, label: "인터넷" },
  { id: "Dumbbell", icon: Dumbbell, label: "운동" },
  { id: "Pill", icon: Pill, label: "약" },
  { id: "Baby", icon: Baby, label: "육아" },
  { id: "Dog", icon: Dog, label: "반려동물" },
  { id: "Scissors", icon: Scissors, label: "미용" },
];

export const iconMap: Record<string, React.ElementType> = Object.fromEntries(
  ICONS.map((i) => [i.id, i.icon])
);

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  color?: string;
}

export function IconPicker({ value, onChange, color = "#868e96" }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedIcon = ICONS.find((i) => i.id === value);
  const SelectedIconComponent = selectedIcon?.icon || MoreHorizontal;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--text-muted)] transition-colors"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <SelectedIconComponent className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-sm">
          {selectedIcon?.label || "아이콘 선택"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-6 gap-2">
            {ICONS.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    value === item.id
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                  )}
                  title={item.label}
                >
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: value === item.id ? color : "var(--text-secondary)" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
