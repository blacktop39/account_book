"use client";

import { cn } from "@/lib/utils";

const COLORS = [
  { id: "#00d68f", label: "초록" },
  { id: "#00b377", label: "진한 초록" },
  { id: "#009966", label: "청록" },
  { id: "#ff6b6b", label: "빨강" },
  { id: "#4dabf7", label: "파랑" },
  { id: "#f783ac", label: "분홍" },
  { id: "#da77f2", label: "보라" },
  { id: "#ffd43b", label: "노랑" },
  { id: "#868e96", label: "회색" },
  { id: "#74c0fc", label: "하늘" },
  { id: "#ff922b", label: "주황" },
  { id: "#20c997", label: "민트" },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {COLORS.map((color) => (
        <button
          key={color.id}
          type="button"
          onClick={() => onChange(color.id)}
          className={cn(
            "w-10 h-10 rounded-lg transition-all",
            value === color.id
              ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--background)] scale-110"
              : "hover:scale-105"
          )}
          style={{ backgroundColor: color.id }}
          title={color.label}
        />
      ))}
    </div>
  );
}

export { COLORS };
