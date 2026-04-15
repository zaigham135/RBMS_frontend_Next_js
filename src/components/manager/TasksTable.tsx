"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { Task } from "@/types/task";

interface TasksTableProps {
  tasks: Task[];
  onView?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TasksTable({ tasks, onView, onEdit, onDelete }: TasksTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-12 text-center shadow-sm">
        <p className="text-sm text-gray-400 dark:text-[#64748b]">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a]">
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Task Name</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Project</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Priority</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Assigned To</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Due Date</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#334155]">
            {tasks.map((task) => {
              const isDone = task.status === "DONE";
              return (
                <tr key={task.id} className="hover:bg-gray-50/50 dark:hover:bg-[#334155]/30 transition-colors">
                  <td className="px-4 py-3">
                    {isDone ? (
                      <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-default" />
                    ) : <span className="block h-4 w-4" />}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${isDone ? "line-through text-gray-400 dark:text-[#475569]" : "text-gray-900 dark:text-[#f1f5f9]"}`}>
                      {task.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#94a3b8]">{task.projectName}</td>
                  <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                  <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={task.assignedToName} src={task.assignedToPhoto} className="h-6 w-6" />
                      <div className="min-w-0">
                        <div className="text-sm text-gray-700 dark:text-[#cbd5e1] truncate">{task.assignedToName ?? "—"}</div>
                        {task.assignedToEmail && <div className="text-[11px] text-gray-400 dark:text-[#64748b] truncate">{task.assignedToEmail}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-[#94a3b8]">{task.dueDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" title="View Details" onClick={() => onView?.(task)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 dark:hover:bg-[#1e3a5f] hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button type="button" title="Edit" onClick={() => onEdit?.(task)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" title="Delete" onClick={() => onDelete?.(task)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
