"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskFormModal } from "@/components/modals/TaskFormModal";
import { TaskUpdateFormModal } from "@/components/modals/TaskUpdateFormModal";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Pagination } from "@/components/common/Pagination";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types/task";
import { Plus } from "lucide-react";

const PAGE_SIZE = 5;

export default function AdminTasksPage() {
  const { paginatedData, selectedTask, isLoading, isDetailLoading, fetchTasks, fetchTaskById, createTask, updateTask, deleteTask } = useTasks();
  const { projects, fetchAllProjects } = useProjects();
  const { activeEmployees, fetchAllUsers } = useUsers();

  const [page, setPage] = useState(0);
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<Task | null>(null);
  const [viewTarget, setViewTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(() => {
    fetchTasks({ page, size: PAGE_SIZE, projectId, status });
  }, [page, projectId, status, fetchTasks]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetchAllProjects(); fetchAllUsers(); }, [fetchAllProjects, fetchAllUsers]);

  const handleView = useCallback(async (task: Task) => {
    setViewTarget(task);
    await fetchTaskById(task.id);
  }, [fetchTaskById]);

  const handleCreate = async (data: CreateTaskRequest) => {
    setIsSubmitting(true);
    try { await createTask(data); load(); }
    finally { setIsSubmitting(false); }
  };

  const handleUpdate = async (taskId: number, data: UpdateTaskRequest) => {
    setIsSubmitting(true);
    try { await updateTask(taskId, data); load(); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { await deleteTask(deleteTarget.id); load(); }
    finally { setIsDeleting(false); setDeleteTarget(null); }
  };

  const tasks = paginatedData?.content ?? [];

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="View and manage all tasks across projects"
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        }
      />

      <div className="mb-4">
        <TaskFilters
          projects={projects}
          projectId={projectId}
          status={status}
          onProjectChange={(v) => { setProjectId(v); setPage(0); }}
          onStatusChange={(v) => { setStatus(v); setPage(0); }}
        />
      </div>

      {isLoading ? <TableSkeleton rows={5} cols={7} /> : (
        <>
          <TaskTable
            tasks={tasks}
            onView={handleView}
            onUpdate={(t) => setUpdateTarget(t)}
            onDelete={(t) => setDeleteTarget(t)}
          />
          <Pagination page={page} totalPages={paginatedData?.totalPages ?? 0} onPageChange={setPage} />
        </>
      )}

      <TaskFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        projects={projects}
        employees={activeEmployees}
        isLoading={isSubmitting}
      />

      <TaskUpdateFormModal
        open={!!updateTarget}
        onOpenChange={(o) => !o && setUpdateTarget(null)}
        task={updateTarget}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        canEditPriorityAndDueDate
      />

      <TaskDetailsModal
        open={!!viewTarget}
        onOpenChange={(o) => !o && setViewTarget(null)}
        task={selectedTask ?? viewTarget}
        isLoading={isDetailLoading}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Task?"
        description={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
