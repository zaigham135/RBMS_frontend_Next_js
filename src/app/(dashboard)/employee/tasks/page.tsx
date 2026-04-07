"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskUpdateFormModal } from "@/components/modals/TaskUpdateFormModal";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { Pagination } from "@/components/common/Pagination";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { useTasks } from "@/hooks/useTasks";
import type { Task, UpdateTaskRequest } from "@/types/task";

const PAGE_SIZE = 5;

export default function EmployeeTasksPage() {
  const { paginatedData, selectedTask, isLoading, isDetailLoading, fetchTasks, fetchTaskById, updateTask } = useTasks();

  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [updateTarget, setUpdateTarget] = useState<Task | null>(null);
  const [viewTarget, setViewTarget] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(() => {
    fetchTasks({ page, size: PAGE_SIZE, status });
  }, [page, status, fetchTasks]);

  useEffect(() => { load(); }, [load]);

  const handleView = useCallback(async (task: Task) => {
    setViewTarget(task);
    await fetchTaskById(task.id);
  }, [fetchTaskById]);

  const handleUpdate = async (taskId: number, data: UpdateTaskRequest) => {
    setIsSubmitting(true);
    try { await updateTask(taskId, data); load(); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div>
      <PageHeader
        title="My Tasks"
        description="View and update your assigned tasks"
      />

      <div className="mb-4">
        <TaskFilters
          projectId=""
          status={status}
          onProjectChange={() => {}}
          onStatusChange={(v) => { setStatus(v); setPage(0); }}
        />
      </div>

      {isLoading ? <TableSkeleton rows={5} cols={6} /> : (
        <>
          <TaskTable
            tasks={paginatedData?.content ?? []}
            onView={handleView}
            onUpdate={(t) => setUpdateTarget(t)}
          />
          <Pagination page={page} totalPages={paginatedData?.totalPages ?? 0} onPageChange={setPage} />
        </>
      )}

      {/* Employee can only update status, description, comment */}
      <TaskUpdateFormModal
        open={!!updateTarget}
        onOpenChange={(o) => !o && setUpdateTarget(null)}
        task={updateTarget}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        canEditPriorityAndDueDate={false}
      />

      <TaskDetailsModal
        open={!!viewTarget}
        onOpenChange={(o) => !o && setViewTarget(null)}
        task={selectedTask ?? viewTarget}
        isLoading={isDetailLoading}
      />
    </div>
  );
}
