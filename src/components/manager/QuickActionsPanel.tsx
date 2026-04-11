"use client";

import { useRouter } from "next/navigation";
import { Plus, RefreshCw, MessageSquare, ChevronRight } from "lucide-react";

interface QuickActionsPanelProps {
  onCreateTask?: () => void;
}

export function QuickActionsPanel({ onCreateTask }: QuickActionsPanelProps) {
  const router = useRouter();

  const actions = [
    { icon: <Plus className="h-4 w-4 text-blue-600" />, label: "Create Task", onClick: onCreateTask ?? (() => {}) },
    { icon: <RefreshCw className="h-4 w-4 text-green-600" />, label: "Update Status", onClick: () => router.push("/manager/tasks") },
    { icon: <MessageSquare className="h-4 w-4 text-purple-600" />, label: "Message Team", onClick: () => router.push("/manager/team") },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] mb-3">Quick Actions</h3>
      <div className="space-y-1">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="flex w-full items-center justify-between rounded-xl border border-gray-100 dark:border-[#334155] px-3 py-2.5 text-sm text-gray-700 dark:text-[#cbd5e1] hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 dark:bg-[#0f172a]">
                {action.icon}
              </div>
              {action.label}
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-[#64748b]" />
          </button>
        ))}
      </div>
    </div>
  );
}
