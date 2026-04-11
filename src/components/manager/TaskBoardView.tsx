import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { Task, TaskStatus } from "@/types/task";

interface TaskBoardViewProps {
  tasks: Task[];
  onView?: (task: Task) => void;
}

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "TODO",        label: "Pending" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "DONE",        label: "Completed" },
];

export function TaskBoardView({ tasks, onView }: TaskBoardViewProps) {
  const grouped = COLUMNS.reduce<Record<TaskStatus, Task[]>>((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, { TODO: [], IN_PROGRESS: [], DONE: [] });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => (
        <div key={col.key} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">{col.label}</span>
            <span className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">
              {grouped[col.key].length}
            </span>
          </div>
          <div className="space-y-3">
            {grouped[col.key].map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onView?.(task)}
                className="w-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm text-left hover:border-blue-200 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{task.title}</div>
                <div className="text-xs text-gray-400 mb-2">{task.projectName}</div>
                <div className="flex items-center justify-between">
                  <PriorityBadge priority={task.priority} />
                  <UserAvatar name={task.assignedToName} src={task.assignedToPhoto} className="h-6 w-6" />
                </div>
              </button>
            ))}
            {grouped[col.key].length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
