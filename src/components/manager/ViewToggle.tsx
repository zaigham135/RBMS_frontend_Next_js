import { cn } from "@/lib/utils";

interface ViewToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
}

export function ViewToggle({ options, value, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] p-0.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            value === opt
              ? "bg-white dark:bg-[#334155] shadow-sm text-gray-900 dark:text-[#f1f5f9] border border-gray-200 dark:border-[#475569]"
              : "text-gray-500 dark:text-[#94a3b8] hover:text-gray-700 dark:hover:text-white"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
