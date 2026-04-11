"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  ClipboardList, FolderKanban, Grid2x2, LogOut,
  Settings, SquareKanban, SquareStack, UserCog, Users, CheckCircle2, Menu, X,
  CalendarDays, BarChart2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

type NavItem = { label: string; href?: string; icon: React.ReactNode; badgeKey?: string };

const adminNav: NavItem[] = [
  { label: "Admin Dashboard", href: "/admin", icon: <Grid2x2 className="h-[18px] w-[18px]" /> },
  { label: "Admin Projects", href: "/admin/projects", icon: <FolderKanban className="h-[18px] w-[18px]" /> },
  { label: "Admin Tasks", href: "/admin/tasks", icon: <ClipboardList className="h-[18px] w-[18px]" /> },
  { label: "Admin Users", href: "/admin/users", icon: <UserCog className="h-[18px] w-[18px]" /> },
];

const managerNav: NavItem[] = [
  { label: "Manager Dashboard", href: "/manager", icon: <Grid2x2 className="h-[18px] w-[18px]" /> },
  { label: "Manager Projects", href: "/manager/projects", icon: <FolderKanban className="h-[18px] w-[18px]" /> },
  { label: "Manager Tasks", href: "/manager/tasks", icon: <ClipboardList className="h-[18px] w-[18px]" />, badgeKey: "taskCount" },
  { label: "Manager Team", href: "/manager/team", icon: <Users className="h-[18px] w-[18px]" /> },
];

const employeeNav: NavItem[] = [
  { label: "Dashboard", href: "/employee", icon: <Grid2x2 className="h-[18px] w-[18px]" /> },
  { label: "Employee Tasks", href: "/employee/tasks", icon: <ClipboardList className="h-[18px] w-[18px]" /> },
  { label: "Calendar", href: "/employee/calendar", icon: <CalendarDays className="h-[18px] w-[18px]" /> },
  { label: "Analytics", href: "/employee/analytics", icon: <BarChart2 className="h-[18px] w-[18px]" /> },
];

const navMap = { ADMIN: adminNav, MANAGER: managerNav, EMPLOYEE: employeeNav };

export function Sidebar() {
  const { role, name, email, profilePhoto, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [taskCount, setTaskCount] = useState<number | null>(null);

  // Fetch active task count for manager badge
  useEffect(() => {
    if (role !== "MANAGER") return;
    api.get("/api/manager/tasks", { params: { page: 0, size: 1, status: "TODO" } })
      .then(res => {
        const total = res.data?.data?.totalElements ?? 0;
        setTaskCount(total);
      })
      .catch(() => setTaskCount(null));
  }, [role]);

  const navItems = role ? navMap[role] ?? [] : [];
  const helpHref = role === "ADMIN" ? "/admin/help-center" : role === "MANAGER" ? "/manager/help-center" : "/employee/help-center";
  const accountHref = role === "ADMIN" ? "/admin/account" : role === "MANAGER" ? "/manager/account" : "/employee/account";

  const badgeLabel = taskCount !== null ? (taskCount > 99 ? "99+" : taskCount > 0 ? String(taskCount) : null) : null;

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-[#0f172a]">
      {/* Logo */}
      <div className="border-b border-[#eef2f7] dark:border-[#1e293b] px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4c8cff] shadow-[0_10px_20px_rgba(76,140,255,0.22)]">
            <SquareStack className="h-4 w-4 text-white" />
          </div>
          <p className="text-[15px] font-bold tracking-[-0.03em] text-[#101828] dark:text-white">TaskMan</p>
        </div>
      </div>

      {/* Menu label */}
      <div className="px-5 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9aa6ba] dark:text-[#475569]">
        Menu
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-3">
        {navItems.map((item) => {
          const isActive = !!item.href && (pathname === item.href || (item.href !== `/${role?.toLowerCase()}` && pathname.startsWith(item.href)));
          const itemClassName = cn(
            "group flex items-center gap-3 rounded-[14px] px-4 py-2.5 text-[14px] font-medium transition-all duration-200",
            isActive
              ? "bg-[#edf4ff] text-[#2563eb] dark:bg-[#1e3a5f] dark:text-[#60a5fa]"
              : item.href
                ? "text-[#6b7280] hover:bg-[#f8fbff] hover:text-[#334155] dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white"
                : "cursor-default text-[#6b7280] dark:text-[#94a3b8]"
          );

          const content = (
            <>
              <span className={cn("transition-colors", isActive ? "text-[#2563eb] dark:text-[#60a5fa]" : "text-[#7b8794] dark:text-[#64748b]")}>{item.icon}</span>
              {item.label}
            </>
          );

          if (!item.href) return <div key={item.label} className={itemClassName}>{content}</div>;

          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={itemClassName}>
              {content}
              {item.badgeKey === "taskCount" && badgeLabel && (
                <span className="ml-auto rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                  {badgeLabel}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="border-t border-[#eef2f7] dark:border-[#1e293b] px-4 py-4 space-y-1">
        <Link
          href={accountHref}
          className="flex items-center gap-3 rounded-[14px] px-4 py-2.5 text-[14px] text-[#6b7280] transition-colors hover:bg-[#f8fbff] hover:text-[#334155] dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white"
        >
          <Settings className="h-[18px] w-[18px] text-[#7b8794] dark:text-[#64748b]" />
          Settings
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-[14px] px-4 py-2.5 text-[14px] font-medium text-[#6b7280] hover:bg-[#fff5f5] hover:text-[#d14343] dark:text-[#94a3b8] dark:hover:bg-[#2d1515] dark:hover:text-[#f87171]"
          onClick={logout}
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[236px] border-r border-[#eef2f7] dark:border-[#1e293b] shadow-xl transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      <aside className="hidden h-screen w-[236px] shrink-0 border-r border-[#eef2f7] dark:border-[#1e293b] md:flex md:flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
