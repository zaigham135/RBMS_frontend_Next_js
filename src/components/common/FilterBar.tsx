"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, ChevronDown, X, Check } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface FilterOption {
  value: string;
  label: string;
}

export interface StatusPillConfig {
  value: string;
  label: string;
  idle: string;
  active: string;
}

export interface DropdownFilterConfig {
  id: string;
  placeholder: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  chipLabel: string;
}

interface FilterBarProps {
  statusPills?: {
    value: string;
    pills: StatusPillConfig[];
    onChange: (value: string) => void;
  };
  dropdowns?: DropdownFilterConfig[];
  actions?: React.ReactNode;
  onClearAll?: () => void;
}

// ── Custom Dropdown ────────────────────────────────────────────────────────────

function CustomDropdown({ dd }: { dd: DropdownFilterConfig }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Deduplicate options by value — guards against duplicate data from any source
  const uniqueOptions = Array.from(
    new Map(dd.options.map(o => [o.value, o])).values()
  );

  const selected = uniqueOptions.find(o => o.value === dd.value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (value: string) => {
    dd.onChange(value);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    dd.onChange("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all duration-150 min-w-[140px] ${
          open || dd.value
            ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300 shadow-sm"
            : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:border-blue-700"
        }`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 opacity-60" />
        <span className="flex-1 text-left truncate">
          {selected ? selected.label : dd.placeholder}
        </span>
        {dd.value ? (
          <span
            role="button"
            aria-label={`Clear ${dd.chipLabel}`}
            onClick={handleClear}
            className="shrink-0 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
          >
            <X className="h-3 w-3" />
          </span>
        ) : (
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 opacity-50 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] py-1.5 shadow-xl shadow-gray-200/60 dark:shadow-black/40 animate-in fade-in-0 zoom-in-95 duration-100">
          {/* All / clear option */}
          <button
            type="button"
            onClick={() => handleSelect("")}
            className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors ${
              !dd.value
                ? "bg-gray-50 text-gray-900 dark:bg-[#334155] dark:text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-[#94a3b8] dark:hover:bg-[#334155] dark:hover:text-white"
            }`}
          >
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${!dd.value ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-[#475569]"}`}>
              {!dd.value && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
            </span>
            {dd.placeholder}
          </button>

          {uniqueOptions.length > 0 && <div className="my-1 border-t border-gray-50 dark:border-[#334155]" />}

          {uniqueOptions.map(opt => {
            const isSelected = dd.value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-[#94a3b8] dark:hover:bg-[#334155] dark:hover:text-white"
                }`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-[#475569]"}`}>
                  {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                </span>
                <span className="truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── FilterBar ──────────────────────────────────────────────────────────────────

export function FilterBar({ statusPills, dropdowns = [], actions, onClearAll }: FilterBarProps) {
  const hasActiveStatus  = statusPills && statusPills.value !== "";
  const activeDropdowns  = dropdowns.filter(d => d.value !== "");
  const hasActiveFilter  = hasActiveStatus || activeDropdowns.length > 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] px-4 py-3 shadow-sm space-y-3">

      {/* ── Row 1: controls ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Status pills */}
        {statusPills && (
          <div className="flex items-center gap-2 flex-wrap">
            {statusPills.pills.map(pill => {
              const isActive = statusPills.value === pill.value;
              return (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => statusPills.onChange(pill.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                    isActive ? pill.active : pill.idle
                  }`}
                >
                  {isActive && pill.value !== "" && (
                    <span
                      role="button"
                      aria-label={`Remove ${pill.label} filter`}
                      onClick={e => { e.stopPropagation(); statusPills.onChange(""); }}
                      className="flex items-center"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  )}
                  {pill.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Right side: custom dropdowns + actions */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {dropdowns.map(dd => (
            <CustomDropdown key={dd.id} dd={dd} />
          ))}
          {actions}
        </div>
      </div>

      {/* ── Row 2: active filter chips ──────────────────────────────── */}
      {hasActiveFilter && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-50 dark:border-[#334155]">
          <span className="text-[11px] font-medium text-gray-400 dark:text-[#475569] uppercase tracking-wide">
            Active filters:
          </span>

          {hasActiveStatus && statusPills && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300">
              Status: {statusPills.pills.find(p => p.value === statusPills.value)?.label}
              <button type="button" aria-label="Remove status filter" onClick={() => statusPills.onChange("")} className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-100">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeDropdowns.map(dd => (
            <span key={dd.id} className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:border-purple-900 dark:text-purple-300">
              {dd.chipLabel}: {dd.options.find(o => o.value === dd.value)?.label ?? dd.value}
              <button type="button" aria-label={`Remove ${dd.chipLabel} filter`} onClick={() => dd.onChange("")} className="ml-0.5 hover:text-purple-900 dark:hover:text-purple-100">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {onClearAll && (
            <button type="button" onClick={onClearAll} className="ml-auto text-[11px] font-medium text-gray-400 hover:text-red-500 dark:text-[#475569] dark:hover:text-red-400 transition-colors">
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
