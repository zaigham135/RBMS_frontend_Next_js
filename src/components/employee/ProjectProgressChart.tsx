"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ProjectProgressChartProps {
  completed: number;
  total: number;
}

export function ProjectProgressChart({ completed, total }: ProjectProgressChartProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = 100 - pct;

  const data = [
    { name: "Completed", value: pct },
    { name: "Remaining", value: remaining },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] mb-4">Project Progress</h3>
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill="#3b82f6" />
              <Cell fill="#e5e7eb" />
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
              formatter={(v: number) => [`${v}%`]}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900 dark:text-[#f1f5f9]">{pct}%</span>
          <span className="text-[10px] text-gray-400 dark:text-[#64748b] mt-0.5">Project Ended</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-500 dark:text-[#94a3b8]">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-[#475569]" />
          <span className="text-xs text-gray-500 dark:text-[#94a3b8]">In Progress</span>
        </div>
      </div>
    </div>
  );
}
