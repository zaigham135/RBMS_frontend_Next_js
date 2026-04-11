"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ProductivityChartProps {
  data?: { day: string; tasks: number }[];
}

const defaultData = [
  { day: "Mon", tasks: 3 },
  { day: "Tue", tasks: 5 },
  { day: "Wed", tasks: 4 },
  { day: "Thu", tasks: 7 },
  { day: "Fri", tasks: 6 },
  { day: "Sat", tasks: 2 },
  { day: "Sun", tasks: 1 },
];

export function ProductivityChart({ data = defaultData }: ProductivityChartProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">Personal Productivity</h3>
        <span className="text-xs text-gray-400 dark:text-[#64748b] rounded-lg border border-gray-200 dark:border-[#334155] px-2 py-1">This Week</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            formatter={(v: number) => [v, "Tasks"]}
          />
          <Area
            type="monotone"
            dataKey="tasks"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#prodGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
