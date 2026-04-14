"use client";

import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ dark, onToggle, className = "" }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
        dark
          ? "border-white/15 bg-white/8 text-white/70 hover:bg-white/15 hover:text-white"
          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800 shadow-sm"
      } ${className}`}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
