import { cn } from "@/lib/utils";

interface WorkloadBarProps {
  percent: number;
  showLabel?: boolean;
  className?: string;
}

function getWorkloadConfig(percent: number) {
  if (percent >= 75) return { label: "High",    barColor: "bg-orange-400", labelColor: "text-orange-600" };
  if (percent >= 40) return { label: "Optimal", barColor: "bg-blue-500",   labelColor: "text-blue-600" };
  return               { label: "Low",     barColor: "bg-green-500",  labelColor: "text-green-600" };
}

export function WorkloadBar({ percent, showLabel = true, className }: WorkloadBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const { label, barColor, labelColor } = getWorkloadConfig(clamped);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 w-8 text-right">{clamped}%</span>
      {showLabel && (
        <span className={cn("text-xs font-semibold w-12", labelColor)}>{label}</span>
      )}
    </div>
  );
}

export function getWorkloadLabel(percent: number) {
  return getWorkloadConfig(percent).label;
}
