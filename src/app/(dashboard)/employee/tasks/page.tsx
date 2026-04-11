"use client";

import { useEffect, useState, useCallback } from "react";
import { AppTopBar } from "@/components/common/AppTopBar";
import { FilterBar } from "@/components/common/FilterBar";
import { TasksTable } from "@/components/manager/TasksTable";
import { TaskUpdateFormModal } from "@/components/modals/TaskUpdateFormModal";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { Pagination } from "@/components/common/Pagination";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { useTasks } from "@/hooks/useTasks";
import { projectService } from "@/services/projectService";
import type { Task, UpdateTaskRequest } from "@/types/task";
import type { Project } from "@/types/project";

const PAGE_SIZE = 10;

const STATUS_PILLS = [
  { value: "",            label: "All",         idle: "bg-gray-100 text-gray-600 hover:bg-gray-200",   active: "bg-gray-700 text-white shadow-sm" },
  { value: "TODO",        label: "Pending",      idle: "bg-amber-50 text-amber-700 hover:bg-amber-100", active: "bg-amber-500 text-white shadow-sm" },
  { value: "IN_PROGRESS", label: "In Progress",  idle: "bg-blue-50 text-blue-700 hover:bg-blue-100",   active: "bg-blue-600 text-white shadow-sm" },
  { value: "DONE",        label: "Completed",    idle: "bg-green-50 text-green-700 hover:bg-green-100", active: "bg-green-600 text-white shadow-sm" },
];

export default function EmployeeTasksPage() {
  const { paginatedData, selectedTask, isLoading, isDetailLoading, fetchTasks, fetchTaskById, updateTask } = useTasks();

  const [page, setPage]           = useState(0);
  const [status, setStatus]       = useState("");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects]   = useState<Project[]>([]);
  const [updateTarget, setUpdateTarget] = useState<Task | null>(null);
  const [viewTarget, setViewTarget]     = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(() => {
    fetchTasks({ page, size: PAGE_SIZE, status, projectId });
  }, [page, status, projectId, fetchTasks]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    projectService.getEmployeeProjects()
      .then(res => setProjects(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProjects([]));
  }, []);

  const handleView = useCallback(async (task: Task) => {
    setViewTarget(task);
    await fetchTaskById(task.id);
  }, [fetchTaskById]);

  const handleUpdate = async (taskId: number, data: UpdateTaskRequest) => {
    setIsSubmitting(true);
    try { await updateTask(taskId, data); load(); }
    finally { setIsSubmitting(false); setUpdateTarget(null); }
  };

  const handleStatusChange = (v: string) => { setStatus(v); setPage(0); };
  const handleProjectChange = (v: string) => { setProjectId(v); setPage(0); };
  const handleClearAll = () => { setStatus(""); setProjectId(""); setPage(0); };

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      <AppTopBar title="My Tasks" searchPlaceholder="Search tasks..." />

      <div className="p-6 space-y-4">
        <FilterBar
          statusPills={{ value: status, pills: STATUS_PILLS, onChange: handleStatusChange }}
          dropdowns={[{
            id: "project",
            placeholder: "All Projects",
            value: projectId,
            options: projects.map(p => ({ value: String(p.id), label: p.name })),
            onChange: handleProjectChange,
            chipLabel: "Project",
          }]}
          onClearAll={handleClearAll}
        />

        {isLoading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : (
          <>
            <TasksTable
              tasks={paginatedData?.content ?? []}
              onView={handleView}
              onEdit={t => setUpdateTarget(t)}
            />
            <Pagination page={page} totalPages={paginatedData?.totalPages ?? 0} onPageChange={setPage} />
          </>
        )}
      </div>

      <TaskUpdateFormModal
        open={!!updateTarget}
        onOpenChange={o => !o && setUpdateTarget(null)}
        task={updateTarget}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        canEditPriorityAndDueDate={false}
      />

      <TaskDetailsModal
        open={!!viewTarget}
        onOpenChange={o => !o && setViewTarget(null)}
        task={selectedTask ?? viewTarget}
        isLoading={isDetailLoading}
      />
    </div>
  );
}
