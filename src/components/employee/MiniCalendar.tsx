"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  date: number;
  month: number;
  year: number;
  title: string;
  time?: string;
  color?: string;
}

interface MiniCalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function MiniCalendar({ events = [], onDateSelect }: MiniCalendarProps) {
  const today = new Date();
  const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() });
  const [selected, setSelected] = useState<number | null>(today.getDate());

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const prev = () => setCurrent(c => c.month === 0 ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year });
  const next = () => setCurrent(c => c.month === 11 ? { month: 0, year: c.year + 1 } : { month: c.month + 1, year: c.year });

  const hasEvent = (day: number) =>
    events.some(e => e.date === day && e.month === current.month && e.year === current.year);

  const isToday = (day: number) =>
    day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();

  const cells = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">
          {MONTHS[current.month]} {current.year}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={prev} className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-[#334155] text-gray-500 dark:text-[#94a3b8]">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={next} className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-[#334155] text-gray-500 dark:text-[#94a3b8]">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 dark:text-[#64748b] py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button
                type="button"
                onClick={() => {
                  setSelected(day);
                  onDateSelect?.(new Date(current.year, current.month, day));
                }}
                className={cn(
                  "relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  isToday(day) && selected !== day && "bg-blue-600 text-white",
                  selected === day && !isToday(day) && "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
                  selected === day && isToday(day) && "bg-blue-600 text-white",
                  !isToday(day) && selected !== day && "text-gray-700 dark:text-[#f1f5f9] hover:bg-gray-100 dark:hover:bg-[#334155]"
                )}
              >
                {day}
                {hasEvent(day) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-orange-400" />
                )}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
