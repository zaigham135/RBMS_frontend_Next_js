"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { TaskFormModal } from "@/components/modals/TaskFormModal";
import { TaskUpdateFormModal } from "@/components/modals/TaskUpdateFormModal";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { FilterBar } from "@/components/common/FilterBar";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types/task";
import { useAuth } from "@/hooks/useAuth";
import { AppTopBar } from "@/components/common/AppTopBar";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Panel, PaginationDisplay } from "@/components/common/NexusUI";
import { downloadTextFile } from "@/lib/download";

const PAGE_SIZE = 5;

const PRIORITY_STYLES: Record<string, string> = {
  HIGH: "bg-[#fff1f1] text-[#b33d36]",
  MEDIUM: "bg-[#fff8e8] text-[#b45309]",
  LOW: "bg-[#eef9f1] text-[#16a34a]",
};

const STATUS_STYLES: Record<string, string> = {
  TODO: "bg-[#f1f5f9] text-[#475467]",
  IN_PROGRESS: "bg-[#eef4ff] text-[#1557d6]",
  DONE: "bg-[#eef9f1] text-[#16a34a]",
};

const STATUS_LABELS: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function AdminTasksPage() {
  const { name, profilePhoto, userId } = useAuth();
  const { paginatedData, selectedTask, isLoading, isDetailLoading, fetchTasks, fetchTaskById, createTask, updateTask, deleteTask } = useTasks();
  const { projects, fetchAllProjects } = useProjects();
  const { activeEmployees, fetchAllUsers } = useUsers();

  const [page, setPage] = useState(0);
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("");
  const [showManagerTasks, setShowManagerTasks] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<Task | null>(null);
  const [viewTarget, setViewTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(() => {
    // When manager filter is on, fetch all tasks (large page) to filter client-side
    fetchTasks({ page: showManagerTasks ? 0 : page, size: showManagerTasks ? 200 : PAGE_SIZE, projectId, status });
  }, [page, projectId, status, fetchTasks, showManagerTasks]);

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

  const allTasks = paginatedData?.content ?? [];
  // Filter: if showManagerTasks, show only tasks assigned to MANAGER role users
  const tasks = showManagerTasks
    ? allTasks.filter(t => t.assignedToRole === "MANAGER")
    : allTasks;

  return (
    <div className="min-h-full bg-[#f7fbff] dark:bg-[#0f172a]">
      <AppTopBar title="Tasks" searchPlaceholder="Search tasks..." />

      <div className="space-y-6 px-6 py-6">
        {/* Filters + actions bar */}
        <FilterBar
          statusPills={{
            value: status,
            pills: [
              { value: "",            label: "All",         idle: "bg-gray-100 text-gray-600 hover:bg-gray-200",   active: "bg-gray-700 text-white shadow-sm" },
              { value: "TODO",        label: "To Do",       idle: "bg-amber-50 text-amber-700 hover:bg-amber-100", active: "bg-amber-500 text-white shadow-sm" },
              { value: "IN_PROGRESS", label: "In Progress", idle: "bg-blue-50 text-blue-700 hover:bg-blue-100",   active: "bg-blue-600 text-white shadow-sm" },
              { value: "DONE",        label: "Done",        idle: "bg-green-50 text-green-700 hover:bg-green-100", active: "bg-green-600 text-white shadow-sm" },
            ],
            onChange: v => { setStatus(v); setPage(0); },
          }}
          dropdowns={[{
            id: "project",
            placeholder: "All Projects",
            value: projectId,
            options: Array.from(new Map(projects.map(p => [p.id, p])).values())
              .map(p => ({ value: String(p.id), label: p.name })),
            onChange: v => { setProjectId(v); setPage(0); },
            chipLabel: "Project",
          }]}
          actions={
            <div className="flex items-center gap-2">
              {/* Manager Tasks toggle */}
              <button
                type="button"
                onClick={() => { setShowManagerTasks(v => !v); setPage(0); }}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  showManagerTasks
                    ? "border-purple-400 bg-purple-600 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-600 dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8]"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${showManagerTasks ? "bg-white" : "bg-purple-400"}`} />
                Manager Tasks
              </button>
              <button
                type="button"
                onClick={() => downloadTextFile("tasks-export.csv", ["title,project,assignee,priority,status,dueDate", ...tasks.map(t => `"${t.title}","${t.projectName}","${t.assignedToName}","${t.priority}","${t.status}","${t.dueDate}"`)].join("\n"), "text/csv;charset=utf-8")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors dark:border-[#334155] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-[#334155]"
              >
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" /> New Task
              </button>
            </div>
          }
          onClearAll={() => { setProjectId(""); setStatus(""); setPage(0); }}
        />

        {/* Table */}
        <Panel className="overflow-hidden">
          {/* Column headers */}
          <div className="grid min-w-[960px] grid-cols-12 bg-[#f8fbff] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7b8794] dark:bg-[#1e293b] dark:text-[#64748b]">
            <div className="col-span-3">Task Details</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-2">Assignee</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {(isLoading ? Array.from({ length: PAGE_SIZE }, (_, i) => ({ id: i })) : tasks).map((task: any, index) => (
            <div key={task.id ?? index} className="grid min-w-[960px] grid-cols-12 items-center border-b border-[#edf2f7] px-6 py-4 last:border-b-0 dark:border-[#334155]">
              {/* Task Details */}
              <div className="col-span-3">
                {task.title ? (
                  <>
                    <div className="text-[14px] font-semibold text-[#1f2937] line-clamp-1 dark:text-[#f1f5f9]">{task.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[12px] text-[#7b8794] dark:text-[#64748b]">
                      <span>TSK-{task.id}</span>
                      {task.dueDate && <><span>·</span><span>Due {task.dueDate}</span></>}
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />
                    <div className="h-3 w-24 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />
                  </div>
                )}
              </div>

              {/* Project */}
              <div className="col-span-2 text-[13px] text-[#556274] dark:text-[#94a3b8]">
                {task.projectName ? <span className="line-clamp-1">{task.projectName}</span> : <div className="h-4 w-28 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
              </div>

              {/* Assignee */}
              <div className="col-span-2 flex items-center gap-2">
                {task.assignedToName ? (
                  <>
                    <UserAvatar name={task.assignedToName} src={task.assignedToPhoto} className="h-7 w-7 ring-0" />
                    <span className="text-[13px] font-medium text-[#1f2937] line-clamp-1 dark:text-[#f1f5f9]">{task.assignedToName}</span>
                  </>
                ) : <div className="h-4 w-24 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
              </div>

              {/* Priority */}
              <div className="col-span-2">
                {task.priority ? (
                  <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${PRIORITY_STYLES[task.priority] ?? "bg-[#f1f5f9] text-[#475467]"}`}>
                    {task.priority}
                  </span>
                ) : <div className="h-6 w-16 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
              </div>

              {/* Status */}
              <div className="col-span-2">
                {task.status ? (
                  <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${STATUS_STYLES[task.status] ?? "bg-[#f1f5f9] text-[#475467]"}`}>
                    {STATUS_LABELS[task.status] ?? task.status}
                  </span>
                ) : <div className="h-6 w-20 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-1">
                <button type="button" onClick={() => task.id && handleView(task)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#495667] hover:bg-[#eff4fb] dark:text-[#94a3b8] dark:hover:bg-[#1e293b]" title="View">
                  <Eye className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => task.id && setUpdateTarget(task)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#495667] hover:bg-[#eff4fb] dark:text-[#94a3b8] dark:hover:bg-[#1e293b]" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => task.id && setDeleteTarget(task)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#b33d36] hover:bg-[#fff1f1]" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#edf2f7] px-6 py-4 dark:border-[#334155]">
            <span className="text-[13px] text-[#556274] dark:text-[#64748b]">
              {`Showing ${tasks.length ? `${page * PAGE_SIZE + 1} to ${page * PAGE_SIZE + tasks.length}` : "0"} of ${paginatedData?.totalElements ?? 0} tasks`}
            </span>
            <PaginationDisplay compact page={Math.min(page + 1, Math.max(1, paginatedData?.totalPages ?? 1))} total={Math.max(1, paginatedData?.totalPages ?? 1)} onPageChange={(p) => setPage(p - 1)} />
          </div>
        </Panel>
      </div>

      <TaskFormModal open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreate} projects={projects} employees={activeEmployees} isLoading={isSubmitting} />
      <TaskUpdateFormModal open={!!updateTarget} onOpenChange={(o) => !o && setUpdateTarget(null)} task={updateTarget} onSubmit={handleUpdate} isLoading={isSubmitting} canEditPriorityAndDueDate />
      <TaskDetailsModal open={!!viewTarget} onOpenChange={(o) => !o && setViewTarget(null)} task={selectedTask ?? viewTarget} isLoading={isDetailLoading} />
      <ConfirmModal open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Delete Task?" description={`Delete "${deleteTarget?.title}"? This cannot be undone.`} onConfirm={handleDelete} isLoading={isDeleting} />
    </div>
  );
}
