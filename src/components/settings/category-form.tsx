"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPicker } from "./icon-picker";
import { ColorPicker } from "./color-picker";
import { TransactionType } from "@/lib/budget/types";

interface CategoryFormProps {
  type: TransactionType;
  onSubmit: (data: {
    name: string;
    icon: string;
    color: string;
    type: TransactionType;
  }) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    icon: string;
    color: string;
  };
  mode?: "add" | "edit";
}

export function CategoryForm({
  type,
  onSubmit,
  onCancel,
  initialData,
  mode = "add",
}: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [icon, setIcon] = useState(initialData?.icon || "MoreHorizontal");
  const [color, setColor] = useState(initialData?.color || "#868e96");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("카테고리 이름을 입력해주세요");
      return;
    }

    onSubmit({
      name: name.trim(),
      icon,
      color,
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="카테고리 이름"
        placeholder="예: 커피, 통신비 등"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError(null);
        }}
        error={error || undefined}
        autoFocus
      />

      <div>
        <label className="block text-sm font-medium mb-2">아이콘</label>
        <IconPicker value={icon} onChange={setIcon} color={color} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">색상</label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

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
          {mode === "edit" ? "수정" : "추가"}
        </Button>
      </div>
    </form>
  );
}
