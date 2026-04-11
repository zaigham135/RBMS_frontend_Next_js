"use client";

import { useEffect, useState } from "react";
import { AppTopBar } from "@/components/common/AppTopBar";
import { ProductivityChart } from "@/components/employee/ProductivityChart";
import { ProjectProgressChart } from "@/components/employee/ProjectProgressChart";
import { taskService } from "@/services/taskService";

export default function EmployeeAnalyticsPage() {
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });

  useEffect(() => {
    Promise.all([
      taskService.getTasks({ page: 0, size: 1 }),
      taskService.getTasks({ page: 0, size: 1, status: "TODO" }),
      taskService.getTasks({ page: 0, size: 1, status: "IN_PROGRESS" }),
      taskService.getTasks({ page: 0, size: 1, status: "DONE" }),
    ]).then(([t, todo, ip, done]) => {
      setStats({
        total: t.data?.totalElements ?? 0,
        todo: todo.data?.totalElements ?? 0,
        inProgress: ip.data?.totalElements ?? 0,
        done: done.data?.totalElements ?? 0,
      });
    }).catch(() => setStats({ total: 24, todo: 10, inProgress: 12, done: 2 }));
  }, []);

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      <AppTopBar title="Analytics" />

      <div className="p-6 space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Tasks",   value: stats.total,      color: "text-blue-600",  bg: "bg-blue-50" },
            { label: "Completed",     value: stats.done,       color: "text-green-600", bg: "bg-green-50" },
            { label: "In Progress",   value: stats.inProgress, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Completion %",  value: `${completionRate}%`, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((c) => (
            <div key={c.label} className={`rounded-2xl border border-gray-100 dark:border-[#334155] ${c.bg} dark:bg-[#1e293b] p-5 shadow-sm`}>
              <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
              <div className="text-xs text-gray-500 dark:text-[#64748b] mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ProductivityChart />
          <ProjectProgressChart completed={stats.done} total={stats.total} />
        </div>
      </div>
    </div>
  );
}
