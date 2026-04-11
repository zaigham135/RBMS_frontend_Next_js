"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DatePickerProps {
  value: string;           // "yyyy-MM-dd" or ""
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  minDate?: string;        // "yyyy-MM-dd" — dates before this are disabled
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function parseDate(val: string): Date | null {
  if (!val) return null;
  const d = new Date(val + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplay(val: string): string {
  const d = parseDate(val);
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function DatePicker({ value, onChange, placeholder = "Select date", disabled, minDate }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = parseDate(value);
  const today = new Date();

  const [viewYear, setViewYear]   = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  // Sync view when value changes externally
  useEffect(() => {
    if (selected) { setViewYear(selected.getFullYear()); setViewMonth(selected.getMonth()); }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const handleSelect = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    onChange(toISO(d));
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const isSelected = (day: number) =>
    selected?.getFullYear() === viewYear &&
    selected?.getMonth() === viewMonth &&
    selected?.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const isDisabled = (day: number) => {
    if (!minDate) return false;
    const min = parseDate(minDate);
    if (!min) return false;
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    min.setHours(0, 0, 0, 0);
    return d < min;
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(v => !v)}
        className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-150 ${
          open
            ? "border-blue-400 bg-blue-50/50 dark:border-blue-600 dark:bg-blue-950/30 ring-2 ring-blue-200 dark:ring-blue-900"
            : "border-gray-200 bg-white dark:border-[#334155] dark:bg-[#1e293b] hover:border-blue-300 dark:hover:border-blue-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <CalendarDays className={`h-4 w-4 shrink-0 ${open ? "text-blue-500" : "text-gray-400 dark:text-[#64748b]"}`} />
        <span className={`flex-1 text-left ${value ? "text-gray-800 dark:text-[#f1f5f9]" : "text-gray-400 dark:text-[#475569]"}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        {value && !disabled && (
          <span
            role="button"
            onClick={handleClear}
            className="shrink-0 rounded-full p-0.5 text-gray-400 hover:text-red-500 dark:text-[#64748b] dark:hover:text-red-400 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {/* Calendar panel */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] shadow-xl shadow-gray-200/60 dark:shadow-black/40 animate-in fade-in-0 zoom-in-95 duration-150 p-4">

          {/* Month / Year header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">
                {MONTHS[viewMonth]}
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {viewYear}
              </span>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-[#64748b] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isDisabled(day)}
                  onClick={() => !isDisabled(day) && handleSelect(day)}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-100 ${
                    isDisabled(day)
                      ? "text-gray-300 dark:text-[#334155] cursor-not-allowed"
                      : sel
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900"
                        : tod
                          ? "border border-blue-400 text-blue-600 dark:border-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                          : "text-gray-700 dark:text-[#cbd5e1] hover:bg-gray-100 dark:hover:bg-[#334155]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-[#334155] pt-3">
            <button
              type="button"
              onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={() => { onChange(""); setOpen(false); }}
                className="text-xs font-medium text-gray-400 dark:text-[#64748b] hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
