import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/task";

const config: Record<TaskStatus, { label: string; className: string }> = {
  TODO: { label: "Todo", className: "bg-gray-100 text-gray-700 border-gray-200" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-50 text-blue-700 border-blue-200" },
  DONE: { label: "Done", className: "bg-green-50 text-green-700 border-green-200" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status] ?? config.TODO;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", className)}>
      <span className={cn(
        "mr-1.5 h-1.5 w-1.5 rounded-full",
        status === "TODO" ? "bg-gray-500" : status === "IN_PROGRESS" ? "bg-blue-500" : "bg-green-500"
      )} />
      {label}
    </span>
  );
}
