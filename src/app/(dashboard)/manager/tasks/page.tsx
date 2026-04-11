"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { AppTopBar } from "@/components/common/AppTopBar";
import { FilterBar } from "@/components/common/FilterBar";
import { ViewToggle } from "@/components/manager/ViewToggle";
import { TasksTable } from "@/components/manager/TasksTable";
import { TaskBoardView } from "@/components/manager/TaskBoardView";
import { TaskFormModal } from "@/components/modals/TaskFormModal";
import { TaskUpdateFormModal } from "@/components/modals/TaskUpdateFormModal";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Pagination } from "@/components/common/Pagination";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types/task";

const PAGE_SIZE = 10;

const STATUS_PILLS = [
  { value: "",            label: "All",         idle: "bg-gray-100 text-gray-600 hover:bg-gray-200",   active: "bg-gray-700 text-white shadow-sm" },
  { value: "TODO",        label: "Pending",      idle: "bg-amber-50 text-amber-700 hover:bg-amber-100", active: "bg-amber-500 text-white shadow-sm" },
  { value: "IN_PROGRESS", label: "In Progress",  idle: "bg-blue-50 text-blue-700 hover:bg-blue-100",   active: "bg-blue-600 text-white shadow-sm" },
  { value: "DONE",        label: "Completed",    idle: "bg-green-50 text-green-700 hover:bg-green-100", active: "bg-green-600 text-white shadow-sm" },
];

export default function ManagerTasksPage() {
  const { paginatedData, selectedTask, isLoading, isDetailLoading, fetchTasks, fetchTaskById, createTask, updateTask, deleteTask } = useTasks();
  const { projects, fetchMyProjects } = useProjects();
  const { activeEmployees, fetchManagerEmployees } = useUsers();
  const { userId } = useAuth();

  const [view, setView]           = useState<string>("List View");
  const [page, setPage]           = useState(0);
  const [status, setStatus]       = useState("");
  const [projectId, setProjectId] = useState("");
  const [createOpen, setCreateOpen]       = useState(false);
  const [updateTarget, setUpdateTarget]   = useState<Task | null>(null);
  const [viewTarget, setViewTarget]       = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<Task | null>(null);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);

  const load = useCallback(() => {
    fetchTasks({ page, size: PAGE_SIZE, status, projectId });
  }, [page, status, projectId, fetchTasks]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetchMyProjects(); fetchManagerEmployees(); }, [fetchMyProjects, fetchManagerEmployees]);

  const handleView = useCallback(async (task: Task) => {
    setViewTarget(task);
    await fetchTaskById(task.id);
  }, [fetchTaskById]);

  const handleCreate = async (data: CreateTaskRequest) => {
    setIsSubmitting(true);
    try { await createTask(data); load(); }
    finally { setIsSubmitting(false); setCreateOpen(false); }
  };

  const handleUpdate = async (taskId: number, data: UpdateTaskRequest) => {
    setIsSubmitting(true);
    try { await updateTask(taskId, data); load(); }
    finally { setIsSubmitting(false); setUpdateTarget(null); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { await deleteTask(deleteTarget.id); load(); }
    finally { setIsDeleting(false); setDeleteTarget(null); }
  };

  const handleStatusChange  = (v: string) => { setStatus(v); setPage(0); };
  const handleProjectChange = (v: string) => { setProjectId(v); setPage(0); };
  const handleClearAll      = () => { setStatus(""); setProjectId(""); setPage(0); };

  const tasks = paginatedData?.content ?? [];
  const isOwnAssignedTask = updateTarget
    ? (updateTarget.assignedToId ?? updateTarget.assignedTo) === Number(userId)
    : false;

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      <AppTopBar title="Active Tasks" searchPlaceholder="Search tasks..." />

      <div className="p-6 space-y-4">
        {/* View toggle + filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <ViewToggle options={["List View", "Board"]} value={view} onChange={setView} />
        </div>

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
          actions={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add Task
            </button>
          }
          onClearAll={handleClearAll}
        />

        {isLoading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : view === "List View" ? (
          <>
            <TasksTable tasks={tasks} onView={handleView} onEdit={t => setUpdateTarget(t)} onDelete={t => setDeleteTarget(t)} />
            <Pagination page={page} totalPages={paginatedData?.totalPages ?? 0} onPageChange={setPage} />
          </>
        ) : (
          <TaskBoardView tasks={tasks} onView={handleView} />
        )}
      </div>

      <TaskFormModal open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreate} projects={projects} employees={activeEmployees} isLoading={isSubmitting} />
      <TaskUpdateFormModal open={!!updateTarget} onOpenChange={o => !o && setUpdateTarget(null)} task={updateTarget} onSubmit={handleUpdate} isLoading={isSubmitting} canEditPriorityAndDueDate={!isOwnAssignedTask} />
      <TaskDetailsModal open={!!viewTarget} onOpenChange={o => !o && setViewTarget(null)} task={selectedTask ?? viewTarget} isLoading={isDetailLoading} />
      <ConfirmModal open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)} title="Delete Task?" description={`Delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} isLoading={isDeleting} />
    </div>
  );
}
