"use client";

import { cn } from "@/lib/utils";

interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className }: DividerProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="flex-1 border-t border-[var(--border)]" />
      {text && (
        <span className="px-4 text-sm text-[var(--text-muted)]">{text}</span>
      )}
      <div className="flex-1 border-t border-[var(--border)]" />
    </div>
  );
}
