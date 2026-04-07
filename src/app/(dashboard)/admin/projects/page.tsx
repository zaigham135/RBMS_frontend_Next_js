"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { ProjectFormModal } from "@/components/modals/ProjectFormModal";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Pagination } from "@/components/common/Pagination";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import type { Project, CreateProjectRequest, UpdateProjectRequest } from "@/types/project";
import { Plus } from "lucide-react";

const PAGE_SIZE = 5;

export default function AdminProjectsPage() {
  const { paginatedData, isLoading, fetchPaginatedProjects, createProject, updateProject, deleteProject } = useProjects();
  const { managers, fetchAllUsers } = useUsers();

  const [page, setPage] = useState(0);
  const [managerId, setManagerId] = useState("");
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
    try {
      await createProject(data as CreateProjectRequest);
      load();
    } finally { setIsSubmitting(false); }
  };

  const handleEdit = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    if (!editProject) return;
    setIsSubmitting(true);
    try {
      await updateProject(editProject.id, data as UpdateProjectRequest);
      load();
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      load();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const projects = paginatedData?.content ?? [];

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage all projects across the organisation"
        action={
          <Button onClick={() => { setEditProject(null); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ProjectFilters
          managers={managers}
          managerId={managerId}
          onManagerChange={(v) => { setManagerId(v); setPage(0); }}
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <>
          <ProjectTable
            projects={projects}
            showManager
            onEdit={(p) => { setEditProject(p); setFormOpen(true); }}
            onDelete={(p) => setDeleteTarget(p)}
          />
          <Pagination
            page={page}
            totalPages={paginatedData?.totalPages ?? 0}
            onPageChange={setPage}
          />
        </>
      )}

      <ProjectFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editProject ? handleEdit : handleCreate}
        project={editProject}
        managers={managers}
        isAdmin
        isLoading={isSubmitting}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Project?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
