import { Category } from "./types";

export const DEFAULT_CATEGORIES: Category[] = [
  // 수입
  {
    id: "salary",
    name: "급여",
    icon: "Banknote",
    color: "#00d68f",
    type: "income",
  },
  {
    id: "bonus",
    name: "보너스",
    icon: "Gift",
    color: "#00b377",
    type: "income",
  },
  {
    id: "other-income",
    name: "기타수입",
    icon: "Plus",
    color: "#009966",
    type: "income",
  },

  // 지출
  {
    id: "food",
    name: "식비",
    icon: "Utensils",
    color: "#ff6b6b",
    type: "expense",
  },
  {
    id: "transport",
    name: "교통",
    icon: "Car",
    color: "#4dabf7",
    type: "expense",
  },
  {
    id: "shopping",
    name: "ShoppingBag",
    icon: "ShoppingBag",
    color: "#f783ac",
    type: "expense",
  },
  {
    id: "entertainment",
    name: "여가",
    icon: "Gamepad2",
    color: "#da77f2",
    type: "expense",
  },
  {
    id: "bills",
    name: "공과금",
    icon: "Receipt",
    color: "#ffd43b",
    type: "expense",
  },
  {
    id: "other-expense",
    name: "기타",
    icon: "MoreHorizontal",
    color: "#868e96",
    type: "expense",
  },
];

export function getCategoryById(id: string): Category | undefined {
  return DEFAULT_CATEGORIES.find((c) => c.id === id);
}

export function getCategoriesByType(
  type: "income" | "expense"
): Category[] {
  return DEFAULT_CATEGORIES.filter((c) => c.type === type);
}
