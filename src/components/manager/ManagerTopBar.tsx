"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useEffect, useState } from "react";

interface ManagerTopBarProps {
  pageTitle: string;
  breadcrumbPage: string;
  searchPlaceholder?: string;
}

export function ManagerTopBar({ pageTitle, breadcrumbPage, searchPlaceholder = "Search..." }: ManagerTopBarProps) {
  const { name, profilePhoto } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-40 transition-all duration-300 px-6 py-4 ${
      scrolled
        ? "border-b border-gray-200/60 dark:border-[#1e293b]/60 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-2xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.3)]"
        : "border-b border-transparent bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-xl"
    }`}>
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 dark:text-[#475569] mb-1">
        <span>Management</span>
        <span className="text-blue-500 font-medium">&gt; {breadcrumbPage}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{pageTitle}</h1>

        <div className="flex items-center gap-3 ml-auto">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#475569]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-9 w-56 rounded-lg border border-gray-200/80 dark:border-[#1e293b] bg-gray-50/80 dark:bg-[#1e293b]/80 pl-9 pr-3 text-sm text-gray-700 dark:text-[#94a3b8] placeholder:text-gray-400 dark:placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 backdrop-blur-sm"
            />
          </div>

          {/* Notification bell */}
          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200/80 dark:border-[#1e293b] bg-white/80 dark:bg-[#1e293b]/80 text-gray-500 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors backdrop-blur-sm">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User profile */}
          <Link href="/manager/account" className="flex items-center gap-2.5 rounded-lg px-2 py-1 hover:bg-gray-50/80 dark:hover:bg-[#1e293b]/80 transition-colors">
            <UserAvatar name={name} src={profilePhoto} className="h-8 w-8" />
            <div className="hidden lg:block text-right">
              <div className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{name || "Manager"}</div>
              <div className="text-xs text-gray-400 dark:text-[#64748b]">Project Manager</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
