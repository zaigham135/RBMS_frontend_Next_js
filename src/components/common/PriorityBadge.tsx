import { cn } from "@/lib/utils";
import type { Priority } from "@/types/task";

const config: Record<Priority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "bg-green-50 text-green-700 border-green-200" },
  MEDIUM: { label: "Medium", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  HIGH: { label: "High", className: "bg-red-50 text-red-700 border-red-200" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = config[priority] ?? config.LOW;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", className)}>
      {label}
    </span>
  );
}
