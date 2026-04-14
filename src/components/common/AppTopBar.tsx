"use client";

import Link from "next/link";
import { Bell, Moon, Search, Settings2, Sun, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useEffect, useRef, useState } from "react";

interface AppTopBarProps {
  title: string;
  searchPlaceholder?: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN:    "Super User",
  MANAGER:  "Project Manager",
  EMPLOYEE: "Team Member",
};

const ACCOUNT_PATHS: Record<string, string> = {
  ADMIN:    "/admin/account",
  MANAGER:  "/manager/account",
  EMPLOYEE: "/employee/account",
};

export function AppTopBar({ title, searchPlaceholder = "Search anything..." }: AppTopBarProps) {
  const { name, profilePhoto, role, userId } = useAuth();
  const { isDark, toggle } = useTheme(userId ?? undefined);
  const accountPath = ACCOUNT_PATHS[role ?? "EMPLOYEE"] ?? "/employee/account";
  const roleLabel   = ROLE_LABELS[role ?? "EMPLOYEE"] ?? "User";
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The layout wraps content in <main class="overflow-y-auto">.
    // window.scrollY is always 0 — we must listen to the scrollable parent.
    const scrollEl = barRef.current?.closest("main") ?? window;
    const getScrollTop = () =>
      scrollEl instanceof Window ? scrollEl.scrollY : (scrollEl as Element).scrollTop;

    const onScroll = () => setScrolled(getScrollTop() > 10);
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <div ref={barRef} className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled
        ? "border-b border-[#e3ebf5]/60 dark:border-[#1e293b]/60 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-2xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.3)]"
        : "border-b border-transparent bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-xl"
    } px-4 py-3 sm:px-5 lg:px-7`}>

      {/* ── Mobile search overlay ── */}
      {searchOpen && (
        <div className="absolute inset-0 z-10 flex items-center gap-2 px-4 py-3 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-2xl sm:hidden">
          <Search className="h-4 w-4 shrink-0 text-[#667085] dark:text-[#94a3b8]" />
          <input
            ref={searchRef}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-[14px] text-[#101828] dark:text-white outline-none placeholder:text-[#94a3b8]"
          />
          <button type="button" onClick={() => setSearchOpen(false)} className="text-[#667085] dark:text-[#94a3b8]">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 min-h-[40px]">
        {/* Title — flex-1 so it takes available space and truncates */}
        <h1 className="flex-1 min-w-0 text-[16px] sm:text-[18px] font-bold tracking-[-0.03em] text-[#101828] dark:text-white truncate">
          {title}
        </h1>

        <div className="flex items-center gap-2 shrink-0">
          {/* Search — full bar on sm+, icon-only on mobile */}
          <label className="hidden sm:flex items-center gap-2.5 rounded-[14px] bg-[#edf4fa]/80 dark:bg-[#1e293b]/80 px-3.5 py-2 text-[#667085] dark:text-[#94a3b8] w-[180px] lg:w-[260px] cursor-text">
            <Search className="h-4 w-4 shrink-0" />
            <input
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#7b8aa2] dark:placeholder:text-[#475569]"
            />
          </label>
          <button
            type="button"
            aria-label="Open search"
            onClick={() => setSearchOpen(true)}
            className="flex sm:hidden h-9 w-9 items-center justify-center rounded-full border border-[#e3ebf5] dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-[#51607a] dark:text-[#94a3b8]"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3ebf5] dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-[#51607a] dark:text-[#94a3b8] transition-colors hover:bg-[#f8fbff] dark:hover:bg-[#334155]"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e3ebf5] dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-[#51607a] dark:text-[#94a3b8] transition-colors hover:bg-[#f8fbff] dark:hover:bg-[#334155]"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d14343]" />
          </button>

          {/* Settings — hidden on small mobile */}
          <button
            type="button"
            aria-label="Settings"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-[#e3ebf5] dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-[#51607a] dark:text-[#94a3b8] transition-colors hover:bg-[#f8fbff] dark:hover:bg-[#334155]"
          >
            <Settings2 className="h-4 w-4" />
          </button>

          {/* User profile */}
          <Link
            href={accountPath}
            className="flex items-center gap-2 rounded-[14px] px-1.5 py-1 transition-colors hover:bg-[#f4f8fc]/80 dark:hover:bg-[#1e293b]/80"
          >
            <UserAvatar name={name} src={profilePhoto} className="h-8 w-8 sm:h-9 sm:w-9 ring-0 shrink-0" />
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-[13px] font-semibold text-[#111827] dark:text-white">{name ?? "User"}</div>
              <div className="text-[11px] uppercase tracking-[0.08em] text-[#6b7280] dark:text-[#64748b]">{roleLabel}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
