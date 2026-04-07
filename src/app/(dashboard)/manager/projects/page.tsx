"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { ProjectFormModal } from "@/components/modals/ProjectFormModal";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import type { Project, UpdateProjectRequest } from "@/types/project";
import { Plus } from "lucide-react";

export default function ManagerProjectsPage() {
  const { projects, isLoading, fetchMyProjects, updateProject } = useProjects();
  const { managers, fetchAllUsers } = useUsers();

  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchMyProjects(); }, [fetchMyProjects]);
  useEffect(() => { fetchAllUsers(); }, [fetchAllUsers]);

  const handleEdit = useCallback(async (data: UpdateProjectRequest) => {
    if (!editProject) return;
    setIsSubmitting(true);
    try {
      await updateProject(editProject.id, data);
      fetchMyProjects();
    } finally { setIsSubmitting(false); }
  }, [editProject, updateProject, fetchMyProjects]);

  return (
    <div>
      <PageHeader
        title="My Projects"
        description="Projects assigned to you"
        action={
          <Button onClick={() => { setEditProject(null); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        }
      />

      {isLoading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : (
        <ProjectTable
          projects={projects}
          showManager={false}
          onEdit={(p) => { setEditProject(p); setFormOpen(true); }}
        />
      )}

      <ProjectFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={(data) => handleEdit(data as UpdateProjectRequest)}
        project={editProject}
        managers={managers}
        isAdmin={false}
        isLoading={isSubmitting}
      />
    </div>
  );
}
