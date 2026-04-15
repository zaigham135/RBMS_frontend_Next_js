"use client";

import { memo } from "react";
import { DataTable } from "@/components/common/DataTable";
import { UserAvatar } from "@/components/common/UserAvatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/types/task";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface TaskTableProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onUpdate?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export const TaskTable = memo(function TaskTable({ tasks, onView, onUpdate, onDelete }: TaskTableProps) {
  return (
    <DataTable
      data={tasks}
      keyExtractor={(t) => t.id}
      emptyMessage="No tasks found"
      columns={[
        { header: "Title", cell: (t) => <span className="font-medium">{t.title}</span> },
        { header: "Project", accessor: "projectName" },
        {
          header: "Assigned By",
          cell: (t) => (
            <div className="flex items-center gap-3">
              <UserAvatar name={t.managerName ?? t.createdByName} src={t.managerPhoto} className="h-8 w-8" />
              <div className="min-w-0">
                <p className="truncate font-medium">{t.managerName ?? t.createdByName ?? "—"}</p>
                {t.managerEmail && <p className="truncate text-xs text-muted-foreground">{t.managerEmail}</p>}
              </div>
            </div>
          ),
        },
        { header: "Priority", cell: (t) => <PriorityBadge priority={t.priority} /> },
        { header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
        { header: "Due Date", cell: (t) => formatDate(t.dueDate) },
        {
          header: "Actions",
          cell: (t) => (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => onView(t)} title="View">
                <Eye className="h-4 w-4" />
              </Button>
              {onUpdate && (
                <Button variant="ghost" size="icon" onClick={() => onUpdate(t)} title="Update">
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="icon" onClick={() => onDelete(t)} title="Delete"
                  className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ),
        },
      ]}
    />
  );
});
