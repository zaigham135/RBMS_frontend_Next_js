import { cn } from "@/lib/utils";
import type { Priority } from "@/types/task";

const config: Record<Priority, { label: string; className: string }> = {
  LOW:    { label: "Low",    className: "text-green-600 font-semibold" },
  MEDIUM: { label: "Medium", className: "text-amber-600 font-semibold" },
  HIGH:   { label: "High",   className: "text-red-600 font-semibold" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = config[priority] ?? config.LOW;
  return (
    <span className={cn("text-sm", className)}>
      {label}
    </span>
  );
}
