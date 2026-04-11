import { cn } from "@/lib/utils";

type StatusKey = string;

interface StatusConfig {
  label: string;
  dot: string;
  className: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  TODO:        { label: "Pending",     dot: "bg-gray-400",   className: "bg-gray-100 text-gray-600 border-gray-200" },
  PLANNED:     { label: "Planned",     dot: "bg-gray-400",   className: "bg-gray-100 text-gray-600 border-gray-200" },
  IN_PROGRESS: { label: "In Progress", dot: "bg-blue-500",   className: "bg-blue-50 text-blue-700 border-blue-200" },
  ACTIVE:      { label: "Active",      dot: "bg-green-500",  className: "bg-green-50 text-green-700 border-green-200" },
  IN_REVIEW:   { label: "In Review",   dot: "bg-amber-500",  className: "bg-amber-50 text-amber-700 border-amber-200" },
  DONE:        { label: "Completed",   dot: "bg-green-500",  className: "bg-green-50 text-green-700 border-green-200" },
  COMPLETED:   { label: "Completed",   dot: "bg-green-500",  className: "bg-green-50 text-green-700 border-green-200" },
  ON_HOLD:     { label: "On Hold",     dot: "bg-red-500",    className: "bg-red-50 text-red-700 border-red-200" },
};

const FALLBACK: StatusConfig = { label: "Unknown", dot: "bg-gray-400", className: "bg-gray-100 text-gray-600 border-gray-200" };

export function StatusBadge({ status }: { status: StatusKey }) {
  const cfg = STATUS_MAP[status?.toUpperCase()] ?? FALLBACK;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", cfg.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
