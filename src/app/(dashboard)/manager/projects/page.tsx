"use client";

import { useEffect, useState, useCallback } from "react";
import { AppTopBar } from "@/components/common/AppTopBar";
import { FilterBar } from "@/components/common/FilterBar";
import { ViewToggle } from "@/components/manager/ViewToggle";
import { ProjectsTable } from "@/components/manager/ProjectsTable";
import { ProjectKanbanBoard } from "@/components/manager/ProjectKanbanBoard";
import { ProjectFormModal } from "@/components/modals/ProjectFormModal";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import type { Project, UpdateProjectRequest } from "@/types/project";
import type { User } from "@/types/user";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { toast } from "sonner";

const STATUS_PILLS = [
  { value: "",          label: "All",       idle: "bg-gray-100 text-gray-600 hover:bg-gray-200",   active: "bg-gray-700 text-white shadow-sm" },
  { value: "ACTIVE",    label: "Active",    idle: "bg-green-50 text-green-700 hover:bg-green-100", active: "bg-green-600 text-white shadow-sm" },
  { value: "ON_HOLD",   label: "On Hold",   idle: "bg-amber-50 text-amber-700 hover:bg-amber-100", active: "bg-amber-500 text-white shadow-sm" },
];

export default function ManagerProjectsPage() {
  const { projects, isLoading, fetchMyProjects, updateProject } = useProjects();
  const { name, profilePhoto, userId, email } = useAuth();

  const [view, setView]                   = useState<string>("List View");
  const [statusFilter, setStatusFilter]   = useState("");
  const [editProject, setEditProject]     = useState<Project | null>(null);
  const [formOpen, setFormOpen]           = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);

  useEffect(() => { fetchMyProjects(); }, [fetchMyProjects]);

  const currentManagerAsUser: User = {
    id: Number(userId) || 0,
    name: name || "",
    email: email || "",
    role: "MANAGER",
    status: "ACTIVE",
    profilePhoto: profilePhoto ?? undefined,
    createdAt: "",
  };

  const managersForModal: User[] = currentManagerAsUser.id ? [currentManagerAsUser] : [];

  const handleEdit = useCallback(async (data: UpdateProjectRequest) => {
    if (!editProject) return;
    setIsSubmitting(true);
    try { await updateProject(editProject.id, data); fetchMyProjects(); setFormOpen(false); }
    catch { /* toasted by hook */ }
    finally { setIsSubmitting(false); }
  }, [editProject, updateProject, fetchMyProjects]);

  const handleArchiveConfirm = useCallback(async () => {
    if (!archiveTarget) return;
    toast.info(`"${archiveTarget.name}" has been archived.`);
    setArchiveTarget(null);
  }, [archiveTarget]);

  // Client-side status filter
  const filteredProjects = projects.filter(p => {
    if (!statusFilter) return true;
    return (p.status ?? "ACTIVE") === statusFilter;
  });

  const handleClearAll = () => { setStatusFilter(""); };

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      <AppTopBar title="My Projects" searchPlaceholder="Search projects..." />

      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <ViewToggle options={["List View", "Kanban"]} value={view} onChange={setView} />
        </div>

        <FilterBar
          statusPills={{ value: statusFilter, pills: STATUS_PILLS, onChange: v => { setStatusFilter(v); } }}
          onClearAll={handleClearAll}
        />

        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : view === "List View" ? (
          <ProjectsTable
            projects={filteredProjects}
            onEdit={p => { setEditProject(p); setFormOpen(true); }}
            onArchive={p => setArchiveTarget(p)}
          />
        ) : (
          <ProjectKanbanBoard projects={filteredProjects} />
        )}
      </div>

      <ProjectFormModal
        open={formOpen}
        onOpenChange={o => { setFormOpen(o); if (!o) setEditProject(null); }}
        onSubmit={data => handleEdit(data as UpdateProjectRequest)}
        project={editProject}
        managers={managersForModal}
        isAdmin={false}
        isLoading={isSubmitting}
      />

      <ConfirmModal
        open={!!archiveTarget}
        onOpenChange={o => !o && setArchiveTarget(null)}
        title="Archive Project?"
        description={`Archive "${archiveTarget?.name}"? It will be hidden from active views.`}
        onConfirm={handleArchiveConfirm}
        isLoading={false}
      />
    </div>
  );
}
