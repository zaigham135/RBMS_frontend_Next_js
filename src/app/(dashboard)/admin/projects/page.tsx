"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, Pencil, Trash2, Plus } from "lucide-react";
import { ProjectFormModal } from "@/components/modals/ProjectFormModal";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import type { Project, CreateProjectRequest, UpdateProjectRequest } from "@/types/project";
import { useAuth } from "@/hooks/useAuth";
import { AppTopBar } from "@/components/common/AppTopBar";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  ActionButton,
  DataTableShell,
  Panel,
  PaginationDisplay,
  StatCard,
} from "@/components/common/NexusUI";
import { FilterBar } from "@/components/common/FilterBar";
import { downloadTextFile } from "@/lib/download";
import { BriefcaseBusiness, CheckCircle2, Clock, FolderOpen } from "lucide-react";

const PAGE_SIZE = 5;

export default function AdminProjectsPage() {
  const { name, profilePhoto, userId } = useAuth();
  const {
    paginatedData,
    isLoading,
    fetchPaginatedProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();
  const { managers, fetchAllUsers } = useUsers();

  const [page, setPage] = useState(0);
  const [managerId, setManagerId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(() => {
    fetchPaginatedProjects(page, PAGE_SIZE, managerId);
  }, [page, managerId, fetchPaginatedProjects]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetchAllUsers(); }, [fetchAllUsers]);

  const handleCreate = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    setIsSubmitting(true);
    try { await createProject(data as CreateProjectRequest); load(); }
    finally { setIsSubmitting(false); }
  };

  const handleEdit = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    if (!editProject) return;
    setIsSubmitting(true);
    try { await updateProject(editProject.id, data as UpdateProjectRequest); load(); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { await deleteProject(deleteTarget.id); load(); }
    finally { setIsDeleting(false); setDeleteTarget(null); }
  };

  const projects = paginatedData?.content ?? [];
  const total = paginatedData?.totalElements ?? 0;

  // Client-side status filter
  const filteredProjects = projects.filter((p) => {
    if (!statusFilter) return true;
    const isOverdue = p.dueDate && new Date(p.dueDate) < new Date();
    const isDueSoon = p.dueDate && !isOverdue && (new Date(p.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 7;
    if (statusFilter === "overdue") return isOverdue;
    if (statusFilter === "due-soon") return isDueSoon;
    if (statusFilter === "active") return !isOverdue && !isDueSoon;
    return true;
  });

  return (
    <div className="min-h-full bg-[#f7fbff] dark:bg-[#0f172a]">
      <AppTopBar title="Projects" searchPlaceholder="Search projects..." />

      <div className="space-y-6 px-6 py-6">
        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-4">
          <StatCard icon={BriefcaseBusiness} label="Total Projects" value={String(total || 0)} iconClassName="bg-[#eef4ff] text-[#1557d6]" />
          <StatCard icon={FolderOpen} label="Active" value={String(projects.filter((p) => p.dueDate && new Date(p.dueDate) >= new Date()).length)} iconClassName="bg-[#eef9f1] text-[#16a34a]" />
          <StatCard icon={Clock} label="Due Soon" value={String(projects.filter((p) => { if (!p.dueDate) return false; const diff = (new Date(p.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24); return diff >= 0 && diff <= 7; }).length)} iconClassName="bg-[#fff4e8] text-[#f97316]" />
          <StatCard icon={CheckCircle2} label="Completed" value={String(projects.filter((p) => p.dueDate && new Date(p.dueDate) < new Date()).length)} iconClassName="bg-[#f5f1ff] text-[#7c3aed]" />
        </div>

        {/* Project Portfolio table */}
        <Panel className="overflow-hidden">
          {/* Table header bar */}
          <div className="border-b border-[#edf2f7] px-6 py-4 dark:border-[#334155]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[16px] font-bold text-[#1f2937] dark:text-[#f1f5f9]">Project Portfolio</span>
                <span className="rounded-full bg-[#edf4fa] px-2.5 py-0.5 text-[12px] font-semibold text-[#556274] dark:bg-[#1e3a5f] dark:text-[#93c5fd]">{total} Total</span>
              </div>
              <div className="flex items-center gap-2">
                <ActionButton size="compact" icon={Plus} variant="primary" onClick={() => { setEditProject(null); setFormOpen(true); }}>
                  New Project
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="border-b border-[#edf2f7] px-6 py-3 dark:border-[#334155]">
            <FilterBar
              statusPills={{
                value: statusFilter,
                pills: [
                  { value: "",          label: "All",       idle: "bg-gray-100 text-gray-600 hover:bg-gray-200",   active: "bg-gray-700 text-white shadow-sm" },
                  { value: "active",    label: "Active",    idle: "bg-green-50 text-green-700 hover:bg-green-100", active: "bg-green-600 text-white shadow-sm" },
                  { value: "due-soon",  label: "Due Soon",  idle: "bg-amber-50 text-amber-700 hover:bg-amber-100", active: "bg-amber-500 text-white shadow-sm" },
                  { value: "overdue",   label: "Overdue",   idle: "bg-red-50 text-red-700 hover:bg-red-100",       active: "bg-red-600 text-white shadow-sm" },
                ],
                onChange: v => { setStatusFilter(v); setPage(0); },
              }}
              dropdowns={[{
                id: "manager",
                placeholder: "All Managers",
                value: managerId,
                options: managers.map(m => ({ value: String(m.id), label: m.name })),
                onChange: v => { setManagerId(v); setPage(0); },
                chipLabel: "Manager",
              }]}
              onClearAll={() => { setManagerId(""); setStatusFilter(""); setPage(0); }}
            />
          </div>

          {/* Column headers */}
          <div className="grid min-w-[860px] grid-cols-12 bg-[#f8fbff] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7b8794] dark:bg-[#1e293b] dark:text-[#64748b]">
            <div className="col-span-4">Project Name</div>
            <div className="col-span-3">Manager</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Deadline</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div>
            {(isLoading ? Array.from({ length: PAGE_SIZE }, (_, i) => ({ id: i })) : filteredProjects).map((project: any, index) => {
              const isOverdue = project.dueDate && new Date(project.dueDate) < new Date();
              const isDueSoon = project.dueDate && !isOverdue && (new Date(project.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 7;

              return (
                <div key={project.id ?? index} className="grid min-w-[860px] grid-cols-12 items-center border-b border-[#edf2f7] px-6 py-4 last:border-b-0 dark:border-[#334155]">
                  {/* Project Name */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef4fa] text-[12px] font-bold text-[#1557d6] dark:bg-[#1e3a5f]">
                      {project.name ? project.name.slice(0, 2).toUpperCase() : ""}
                    </div>
                    <div>
                      {project.name ? (
                        <>
                          <div className="text-[14px] font-semibold text-[#1f2937] dark:text-[#f1f5f9]">{project.name}</div>
                          {project.description && <div className="text-[12px] text-[#7b8794] line-clamp-1 dark:text-[#64748b]">{project.description}</div>}
                        </>
                      ) : <div className="h-4 w-32 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
                    </div>
                  </div>

                  {/* Manager */}
                  <div className="col-span-3 flex items-center gap-2">
                    {project.managerName ? (
                      <>
                        <UserAvatar name={project.managerName} src={project.managerPhoto} className="h-8 w-8 ring-0" />
                        <div>
                          <div className="text-[13px] font-medium text-[#1f2937] dark:text-[#f1f5f9]">{project.managerName}</div>
                          {project.managerEmail && <div className="text-[11px] text-[#7b8794] dark:text-[#64748b]">{project.managerEmail}</div>}
                        </div>
                      </>
                    ) : <div className="h-4 w-24 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    {project.name ? (
                      <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${isOverdue ? "bg-[#fff1f1] text-[#b33d36]" : isDueSoon ? "bg-[#fff8e8] text-[#b45309]" : "bg-[#eef9f1] text-[#16a34a]"}`}>
                        • {isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "Active"}
                      </span>
                    ) : <div className="h-6 w-16 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
                  </div>

                  {/* Deadline */}
                  <div className="col-span-2">
                    {project.dueDate ? (
                      <div>
                        <div className={`text-[13px] font-medium ${isOverdue ? "text-[#b33d36]" : "text-[#1f2937] dark:text-[#f1f5f9]"}`}>
                          {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        {isOverdue && <div className="text-[11px] text-[#b33d36]">Overdue</div>}
                      </div>
                    ) : <div className="h-4 w-20 rounded-full bg-[#edf2f7] dark:bg-[#334155]" />}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button type="button" onClick={() => { if (!project.id) return; setEditProject(project); setFormOpen(true); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#495667] hover:bg-[#eff4fb] dark:text-[#94a3b8] dark:hover:bg-[#1e293b]">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => project.id && setDeleteTarget(project)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#b33d36] hover:bg-[#fff1f1]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer pagination */}
          <div className="flex items-center justify-between border-t border-[#edf2f7] px-6 py-4 dark:border-[#334155]">
            <span className="text-[13px] text-[#556274] dark:text-[#64748b]">
              {`Showing ${projects.length ? `${page * PAGE_SIZE + 1} to ${page * PAGE_SIZE + projects.length}` : "0"} of ${total} results`}
            </span>
            <PaginationDisplay compact page={Math.min(page + 1, Math.max(1, paginatedData?.totalPages ?? 1))} total={Math.max(1, paginatedData?.totalPages ?? 1)} onPageChange={(p) => setPage(p - 1)} />
          </div>
        </Panel>
      </div>

      <ProjectFormModal open={formOpen} onOpenChange={setFormOpen} onSubmit={editProject ? handleEdit : handleCreate} project={editProject} managers={managers} isAdmin isLoading={isSubmitting} />
      <ConfirmModal open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Delete Project?" description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`} onConfirm={handleDelete} isLoading={isDeleting} />
    </div>
  );
}
