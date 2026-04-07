"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { taskService } from "@/services/taskService";
import { CheckSquare, Clock, ListTodo, TrendingUp } from "lucide-react";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [totalRes, todoRes, inProgressRes, doneRes] = await Promise.all([
          taskService.getTasks({ page: 0, size: 1 }),
          taskService.getTasks({ page: 0, size: 1, status: "TODO" }),
          taskService.getTasks({ page: 0, size: 1, status: "IN_PROGRESS" }),
          taskService.getTasks({ page: 0, size: 1, status: "DONE" }),
        ]);
        setStats({
          total: totalRes.data?.totalElements ?? 0,
          todo: todoRes.data?.totalElements ?? 0,
          inProgress: inProgressRes.data?.totalElements ?? 0,
          done: doneRes.data?.totalElements ?? 0,
        });
      } catch { /* silently fail */ }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  const cards = [
    { label: "Total Tasks", value: stats.total, icon: ListTodo, color: "from-violet-500 to-indigo-500" },
    { label: "Todo", value: stats.todo, icon: Clock, color: "from-gray-400 to-gray-500" },
    { label: "In Progress", value: stats.inProgress, icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
    { label: "Completed", value: stats.done, icon: CheckSquare, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div>
      <PageHeader title="My Dashboard" description="Overview of your assigned tasks" />

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
        <h2 className="text-lg font-semibold mb-2">Getting started</h2>
        <p className="text-sm text-muted-foreground mb-4">Head over to My Tasks to view and update your assignments.</p>
        <a href="/employee/tasks"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          <CheckSquare className="h-4 w-4" /> View My Tasks
        </a>
      </div>
    </div>
  );
}
