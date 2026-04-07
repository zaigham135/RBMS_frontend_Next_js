"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { projectService } from "@/services/projectService";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import {
  FolderKanban, ClipboardList, Users, TrendingUp,
} from "lucide-react";

interface Stats {
  totalProjects: number;
  totalTasks: number;
  totalEmployees: number;
  totalManagers: number;
}

const statCards = (s: Stats) => [
  { label: "Total Projects", value: s.totalProjects, icon: FolderKanban, color: "from-violet-500 to-indigo-500", bg: "bg-violet-50", text: "text-violet-700" },
  { label: "Total Tasks", value: s.totalTasks, icon: ClipboardList, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-700" },
  { label: "Employees", value: s.totalEmployees, icon: Users, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  { label: "Managers", value: s.totalManagers, icon: TrendingUp, color: "from-orange-500 to-amber-500", bg: "bg-orange-50", text: "text-orange-700" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, totalTasks: 0, totalEmployees: 0, totalManagers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, tasksRes, usersRes] = await Promise.all([
          projectService.getAllProjects(),
          taskService.getTasks({ page: 0, size: 1 }),
          userService.getAllEmployees(),
        ]);
        const users = usersRes.data ?? [];
        setStats({
          totalProjects: projectsRes.data?.length ?? 0,
          totalTasks: tasksRes.data?.totalElements ?? 0,
          totalEmployees: users.filter((u) => u.role === "EMPLOYEE").length,
          totalManagers: users.filter((u) => u.role === "MANAGER").length,
        });
      } catch { /* silently fail */ }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Overview of your entire system" />

      {isLoading ? <CardSkeleton count={4} /> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards(stats).map((card) => (
            <div key={card.label} className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight">{card.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} shadow-sm`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${card.color} opacity-0 transition-opacity group-hover:opacity-100`} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Manage Projects", href: "/admin/projects", desc: "Create, edit & delete projects" },
            { label: "Manage Tasks", href: "/admin/tasks", desc: "View and assign all tasks" },
            { label: "Manage Users", href: "/admin/users", desc: "Update roles & user status" },
          ].map((a) => (
            <a key={a.href} href={a.href}
              className="flex flex-col gap-1 rounded-lg border p-4 transition-all hover:border-primary hover:bg-primary/5">
              <p className="font-semibold text-sm">{a.label}</p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
