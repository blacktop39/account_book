"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {/* Vercel 스타일 삼각형 로고 */}
      <svg
        className="h-8 w-8"
        viewBox="0 0 76 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white" />
      </svg>
    </div>
  );
}
