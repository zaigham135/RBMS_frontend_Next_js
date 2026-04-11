"use client";

import Link from "next/link";
import { Bell, Mail, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/common/UserAvatar";

interface EmployeeTopBarProps {
  pageTitle: string;
  pageSubtitle?: string;
  searchPlaceholder?: string;
}

export function EmployeeTopBar({ pageTitle, pageSubtitle, searchPlaceholder = "Search task..." }: EmployeeTopBarProps) {
  const { name, profilePhoto, email } = useAuth();

  return (
    <div className="border-b border-gray-100 bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{pageTitle}</h1>
          {pageSubtitle && <p className="text-sm text-gray-400 mt-0.5">{pageSubtitle}</p>}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-9 w-56 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center rounded border border-gray-200 bg-white px-1.5 text-[10px] font-medium text-gray-400">
              ⌘P
            </kbd>
          </div>

          {/* Mail */}
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
            <Mail className="h-4 w-4" />
          </button>

          {/* Notification bell */}
          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User profile */}
          <Link href="/employee/account" className="flex items-center gap-2.5 rounded-lg px-2 py-1 hover:bg-gray-50">
            <UserAvatar name={name} src={profilePhoto} className="h-8 w-8" />
            <div className="hidden lg:block text-right">
              <div className="text-sm font-semibold text-gray-800 leading-tight">{name || "Employee"}</div>
              <div className="text-xs text-gray-400">{email || "employee@company.com"}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
