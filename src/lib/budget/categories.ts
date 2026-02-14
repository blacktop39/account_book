import { Category, TransactionType } from "./types";

// 기본 카테고리 정의 (서브카테고리 포함)
export interface DefaultCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  children?: Omit<DefaultCategory, "type" | "children">[];
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
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
    children: [
      { id: "food-meal", name: "주식", icon: "Utensils", color: "#ff6b6b" },
      { id: "food-grocery", name: "부식", icon: "ShoppingCart", color: "#ff5252" },
      { id: "food-snack", name: "간식", icon: "Cookie", color: "#ff8a65" },
      { id: "food-dining", name: "외식", icon: "Coffee", color: "#ff7043" },
    ],
  },
  {
    id: "transport",
    name: "교통",
    icon: "Car",
    color: "#4dabf7",
    type: "expense",
    children: [
      { id: "transport-public", name: "대중교통", icon: "Train", color: "#4dabf7" },
      { id: "transport-taxi", name: "택시", icon: "Car", color: "#339af0" },
      { id: "transport-fuel", name: "주유", icon: "Fuel", color: "#228be6" },
      { id: "transport-maintain", name: "차량유지", icon: "Wrench", color: "#1c7ed6" },
    ],
  },
  {
    id: "shopping",
    name: "쇼핑",
    icon: "ShoppingBag",
    color: "#f783ac",
    type: "expense",
    children: [
      { id: "shopping-clothes", name: "의류", icon: "Shirt", color: "#f783ac" },
      { id: "shopping-daily", name: "생활용품", icon: "Package", color: "#e64980" },
      { id: "shopping-electronics", name: "전자제품", icon: "Smartphone", color: "#d6336c" },
    ],
  },
  {
    id: "entertainment",
    name: "여가",
    icon: "Gamepad2",
    color: "#da77f2",
    type: "expense",
    children: [
      { id: "entertainment-movie", name: "영화/공연", icon: "Film", color: "#da77f2" },
      { id: "entertainment-game", name: "게임", icon: "Gamepad2", color: "#be4bdb" },
      { id: "entertainment-hobby", name: "취미", icon: "Heart", color: "#ae3ec9" },
      { id: "entertainment-sports", name: "운동", icon: "Dumbbell", color: "#9c36b5" },
    ],
  },
  {
    id: "bills",
    name: "공과금",
    icon: "Receipt",
    color: "#ffd43b",
    type: "expense",
    children: [
      { id: "bills-electric", name: "전기", icon: "Zap", color: "#ffd43b" },
      { id: "bills-water", name: "수도", icon: "Droplet", color: "#fab005" },
      { id: "bills-gas", name: "가스", icon: "Flame", color: "#f59f00" },
      { id: "bills-telecom", name: "통신", icon: "Wifi", color: "#f08c00" },
    ],
  },
  {
    id: "other-expense",
    name: "기타",
    icon: "MoreHorizontal",
    color: "#868e96",
    type: "expense",
  },
];

// 플랫 리스트로 변환 (하위 호환용)
export function getFlatCategories(): Category[] {
  const result: Category[] = [];
  for (const cat of DEFAULT_CATEGORIES) {
    result.push({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      type: cat.type,
    });
    if (cat.children) {
      for (const child of cat.children) {
        result.push({
          id: child.id,
          name: child.name,
          icon: child.icon,
          color: child.color,
          type: cat.type,
          parentId: cat.id,
        });
      }
    }
  }
  return result;
}

export function getCategoryById(id: string): Category | undefined {
  for (const cat of DEFAULT_CATEGORIES) {
    if (cat.id === id) {
      return {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        type: cat.type,
      };
    }
    if (cat.children) {
      const child = cat.children.find((c) => c.id === id);
      if (child) {
        return {
          id: child.id,
          name: child.name,
          icon: child.icon,
          color: child.color,
          type: cat.type,
          parentId: cat.id,
        };
      }
    }
  }
  return undefined;
}

export function getCategoriesByType(type: TransactionType): Category[] {
  return getFlatCategories().filter((c) => c.type === type);
}
