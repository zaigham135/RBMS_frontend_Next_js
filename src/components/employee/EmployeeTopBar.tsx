"use client";

import Link from "next/link";
import { Bell, Mail, Search, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useEffect, useRef, useState } from "react";

interface EmployeeTopBarProps {
  pageTitle: string;
  pageSubtitle?: string;
  searchPlaceholder?: string;
}

export function EmployeeTopBar({ pageTitle, pageSubtitle, searchPlaceholder = "Search task..." }: EmployeeTopBarProps) {
  const { name, profilePhoto, email } = useAuth();
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  return (
    <div className={`sticky top-0 z-40 transition-all duration-300 px-4 py-3 sm:px-6 sm:py-4 ${
      scrolled
        ? "border-b border-gray-200/60 dark:border-[#1e293b]/60 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-2xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.3)]"
        : "border-b border-transparent bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-xl"
    }`}>
      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="absolute inset-0 z-10 flex items-center gap-2 px-4 py-3 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-2xl sm:hidden">
          <Search className="h-4 w-4 shrink-0 text-gray-400 dark:text-[#94a3b8]" />
          <input ref={searchRef} placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-[14px] text-gray-900 dark:text-white outline-none placeholder:text-gray-400" />
          <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[17px] sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">{pageTitle}</h1>
          {pageSubtitle && <p className="text-xs sm:text-sm text-gray-400 dark:text-[#475569] mt-0.5 truncate">{pageSubtitle}</p>}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#475569]" />
            <input type="text" placeholder={searchPlaceholder}
              className="h-9 w-44 lg:w-56 rounded-lg border border-gray-200/80 dark:border-[#1e293b] bg-gray-50/80 dark:bg-[#1e293b]/80 pl-9 pr-3 text-sm text-gray-700 dark:text-[#94a3b8] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center rounded border border-gray-200 dark:border-[#334155] bg-white/80 dark:bg-[#1e293b] px-1.5 text-[10px] font-medium text-gray-400 dark:text-[#475569]">⌘P</kbd>
          </div>
          <button type="button" onClick={() => setSearchOpen(true)}
            className="flex sm:hidden h-9 w-9 items-center justify-center rounded-lg border border-gray-200/80 dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-gray-500 dark:text-[#94a3b8]">
            <Search className="h-4 w-4" />
          </button>

          <button type="button" className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200/80 dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-gray-500 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors">
            <Mail className="h-4 w-4" />
          </button>

          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200/80 dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-gray-500 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <Link href="/employee/account" className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-gray-50/80 dark:hover:bg-[#1e293b]/80 transition-colors">
            <UserAvatar name={name} src={profilePhoto} className="h-8 w-8 shrink-0" />
            <div className="hidden lg:block text-right">
              <div className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{name || "Employee"}</div>
              <div className="text-xs text-gray-400 dark:text-[#64748b]">{email || "employee@company.com"}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
