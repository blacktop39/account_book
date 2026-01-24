"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full max-w-[400px] p-8",
        "bg-[var(--surface)] border border-[var(--border)] rounded-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
