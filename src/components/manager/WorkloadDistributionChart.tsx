"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from "recharts";
import type { EmployeeWithWorkload } from "@/types/managerTeam";

interface WorkloadDistributionChartProps {
  employees: EmployeeWithWorkload[];
}

function getBarColor(percent: number) {
  if (percent >= 75) return "#f97316";
  if (percent >= 40) return "#3b82f6";
  return "#22c55e";
}

export function WorkloadDistributionChart({ employees }: WorkloadDistributionChartProps) {
  const data = employees.map((e) => ({ name: e.name.split(" ")[0], workload: e.workloadPercent }));

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 dark:text-[#f1f5f9] mb-4">Workload Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #334155", fontSize: 12, backgroundColor: "#1e293b", color: "#f1f5f9" }}
            formatter={(v: number) => [`${v}%`, "Workload"]}
          />
          <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
          <Bar dataKey="workload" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.workload)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
