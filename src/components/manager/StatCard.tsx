import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendColor?: "green" | "red" | "blue" | "gray";
  iconBg?: string;
}

const trendColorMap = {
  green: "text-green-600",
  red:   "text-red-500",
  blue:  "text-blue-600",
  gray:  "text-gray-500",
};

export function StatCard({ icon, label, value, trend, trendColor = "blue", iconBg = "bg-blue-50" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
          {icon}
        </div>
        {trend && (
          <span className={cn("text-xs font-semibold", trendColorMap[trendColor])}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-500 dark:text-[#94a3b8]">{label}</div>
        <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-[#f1f5f9] tracking-tight">{value}</div>
      </div>
    </div>
  );
}
