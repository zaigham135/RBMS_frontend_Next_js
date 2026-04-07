"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ProfilePhotoUploader } from "@/components/common/ProfilePhotoUploader";
import {
  LayoutDashboard, FolderKanban, ClipboardList, Users, LogOut,
  ChevronRight, CheckSquare, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type NavItem = { label: string; href: string; icon: React.ReactNode };

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Projects", href: "/admin/projects", icon: <FolderKanban className="h-5 w-5" /> },
  { label: "Tasks", href: "/admin/tasks", icon: <ClipboardList className="h-5 w-5" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="h-5 w-5" /> },
];

const managerNav: NavItem[] = [
  { label: "Dashboard", href: "/manager", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "My Projects", href: "/manager/projects", icon: <FolderKanban className="h-5 w-5" /> },
  { label: "Tasks", href: "/manager/tasks", icon: <ClipboardList className="h-5 w-5" /> },
  { label: "Team", href: "/manager/team", icon: <Users className="h-5 w-5" /> },
];

const employeeNav: NavItem[] = [
  { label: "Dashboard", href: "/employee", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "My Tasks", href: "/employee/tasks", icon: <CheckSquare className="h-5 w-5" /> },
];

const navMap = { ADMIN: adminNav, MANAGER: managerNav, EMPLOYEE: employeeNav };

export function Sidebar() {
  const { role, name, email, profilePhoto, logout, uploadProfilePhoto } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = role ? navMap[role] ?? [] : [];

  const roleColor = {
    ADMIN: "from-violet-600 to-indigo-600",
    MANAGER: "from-blue-600 to-cyan-600",
    EMPLOYEE: "from-emerald-600 to-teal-600",
  }[role ?? "EMPLOYEE"] ?? "from-violet-600 to-indigo-600";

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`bg-gradient-to-br ${roleColor} p-6`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-white/70">TaskFlow</p>
            <p className="text-sm font-bold text-white">{role}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
          <p className="mb-3 text-xs text-white/60">Logged in as</p>
          <ProfilePhotoUploader
            name={name}
            profilePhoto={profilePhoto}
            onUpload={async (file) => {
              await uploadProfilePhoto(file);
            }}
          />
          {email && <p className="mt-3 truncate text-xs text-white/70">{email}</p>}
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${role?.toLowerCase()}` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              {item.label}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-xl transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 border-r bg-background md:flex md:flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
