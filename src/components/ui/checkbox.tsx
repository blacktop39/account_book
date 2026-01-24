"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            className={cn(
              "peer h-4 w-4 appearance-none rounded border border-[var(--border)]",
              "bg-transparent transition-colors duration-200",
              "checked:bg-white checked:border-white",
              "focus:outline-none focus:ring-2 focus:ring-white/20",
              className
            )}
            {...props}
          />
          <Check
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
            strokeWidth={3}
          />
        </div>
        {label && (
          <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
