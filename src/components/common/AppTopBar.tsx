"use client";

import Link from "next/link";
import { Bell, Moon, Search, Settings2, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useEffect, useState } from "react";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled
        ? "border-b border-[#e3ebf5]/60 dark:border-[#1e293b]/60 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-2xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.3)]"
        : "border-b border-transparent bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-xl"
    } px-5 py-3 lg:px-7`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-[18px] font-bold tracking-[-0.03em] text-[#101828] dark:text-white">{title}</h1>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {/* Search */}
          <label className="flex w-full max-w-[300px] items-center gap-2.5 rounded-[14px] bg-[#edf4fa]/80 dark:bg-[#1e293b]/80 px-3.5 py-2 text-[#667085] dark:text-[#94a3b8] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:shadow-none lg:w-[300px]">
            <Search className="h-4 w-4 shrink-0" />
            <input
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#7b8aa2] dark:placeholder:text-[#475569]"
            />
          </label>

          {/* Theme toggle */}
          <button
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3ebf5] dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-[#51607a] dark:text-[#94a3b8] transition-colors hover:bg-[#f8fbff] dark:hover:bg-[#334155]"
          >
            {isDark
              ? <Sun  className="h-4 w-4 text-amber-400" />
              : <Moon className="h-4 w-4" />
            }
          </button>

          {/* Notification bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e3ebf5] dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-[#51607a] dark:text-[#94a3b8] transition-colors hover:bg-[#f8fbff] dark:hover:bg-[#334155]"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d14343]" />
          </button>

          {/* Settings */}
          <button
            type="button"
            aria-label="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e3ebf5] dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-[#51607a] dark:text-[#94a3b8] transition-colors hover:bg-[#f8fbff] dark:hover:bg-[#334155]"
          >
            <Settings2 className="h-4 w-4" />
          </button>

          {/* User profile */}
          <Link
            href={accountPath}
            className="flex items-center gap-2.5 rounded-[16px] px-2 py-1.5 transition-colors hover:bg-[#f4f8fc]/80 dark:hover:bg-[#1e293b]/80"
          >
            <UserAvatar name={name} src={profilePhoto} className="h-9 w-9 ring-0" />
            <div className="text-left leading-tight">
              <div className="text-[13px] font-semibold text-[#111827] dark:text-white">{name ?? "User"}</div>
              <div className="text-[11px] uppercase tracking-[0.08em] text-[#6b7280] dark:text-[#64748b]">{roleLabel}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
