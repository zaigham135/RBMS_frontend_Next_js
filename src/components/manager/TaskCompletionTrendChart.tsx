"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { TaskCompletionTrendPoint } from "@/types/managerDashboard";

interface TaskCompletionTrendChartProps {
  data: TaskCompletionTrendPoint[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function TaskCompletionTrendChart({ data }: TaskCompletionTrendChartProps) {
  const chartData = data.map((d) => ({ ...d, label: formatDate(d.date) }));

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#f1f5f9]">Task Completion Trend</h3>
        <span className="text-xs text-gray-400 dark:text-[#64748b] rounded-lg border border-gray-200 dark:border-[#334155] px-2 py-1">Last 30 Days</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} interval={4} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #334155", fontSize: 12, backgroundColor: "#1e293b", color: "#f1f5f9" }} labelStyle={{ color: "#94a3b8" }} />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
