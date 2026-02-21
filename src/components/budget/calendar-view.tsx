"use client";

import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Transaction } from "@/lib/budget/types";

interface CalendarViewProps {
  month: string; // YYYY-MM
  transactions: Transaction[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

export function CalendarView({
  month,
  transactions,
  onDateSelect,
  selectedDate,
}: CalendarViewProps) {
  const monthDate = useMemo(() => {
    const [year, m] = month.split("-").map(Number);
    return new Date(year, m - 1);
  }, [month]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [monthDate]);

  const transactionsByDate = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    for (const t of transactions) {
      if (!map[t.date]) {
        map[t.date] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        map[t.date].income += t.amount;
      } else {
        map[t.date].expense += t.amount;
      }
    }
    return map;
  }, [transactions]);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs font-medium py-2",
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-[var(--text-muted)]"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const isCurrentMonth = isSameMonth(day, monthDate);
          const isSelected = selectedDate === dateStr;
          const dayData = transactionsByDate[dateStr];
          const dayOfWeek = day.getDay();

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect?.(dateStr)}
              disabled={!isCurrentMonth}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center rounded-lg transition-colors",
                isCurrentMonth
                  ? "hover:bg-white/10 cursor-pointer"
                  : "opacity-30 cursor-default",
                isSelected && "bg-white/20",
                isToday(day) && "ring-1 ring-white/50"
              )}
            >
              <span
                className={cn(
                  "text-sm",
                  !isCurrentMonth && "text-[var(--text-muted)]",
                  dayOfWeek === 0 && isCurrentMonth && "text-red-400",
                  dayOfWeek === 6 && isCurrentMonth && "text-blue-400"
                )}
              >
                {format(day, "d")}
              </span>

              {/* 거래 표시 점 */}
              {dayData && isCurrentMonth && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayData.income > 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                  )}
                  {dayData.expense > 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--error)]" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
