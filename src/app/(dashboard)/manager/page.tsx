"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { projectService } from "@/services/projectService";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import { FolderKanban, ClipboardList, Users, CheckSquare } from "lucide-react";

export default function ManagerDashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, team: 0, done: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, taskRes, teamRes] = await Promise.all([
          projectService.getMyProjects(),
          taskService.getTasks({ page: 0, size: 1 }),
          userService.getManagerEmployees(),
        ]);
        const allTasks = await taskService.getTasks({ page: 0, size: 100, status: "DONE" });
        setStats({
          projects: projRes.data?.length ?? 0,
          tasks: taskRes.data?.totalElements ?? 0,
          team: teamRes.data?.length ?? 0,
          done: allTasks.data?.totalElements ?? 0,
        });
      } catch { /* silently fail */ }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  const cards = [
    { label: "My Projects", value: stats.projects, icon: FolderKanban, color: "from-blue-500 to-cyan-500" },
    { label: "Total Tasks", value: stats.tasks, icon: ClipboardList, color: "from-violet-500 to-purple-500" },
    { label: "Team Members", value: stats.team, icon: Users, color: "from-emerald-500 to-teal-500" },
    { label: "Tasks Done", value: stats.done, icon: CheckSquare, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div>
      <PageHeader title="Manager Dashboard" description="Overview of your projects and team" />

      {isLoading ? <CardSkeleton count={4} /> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
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
            { label: "My Projects", href: "/manager/projects", desc: "View and manage your projects" },
            { label: "Manage Tasks", href: "/manager/tasks", desc: "Create and update tasks" },
            { label: "View Team", href: "/manager/team", desc: "See your team members" },
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
