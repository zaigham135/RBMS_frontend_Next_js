"use client";

import { useState } from "react";
import Link from "next/link";
import { Folder } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ProjectDetailsModal } from "@/components/manager/ProjectDetailsModal";
import type { Project } from "@/types/project";

interface AssignedProjectsSectionProps {
  projects: Project[];
}

function getProjectStatus(project: Project): string {
  // Use real status from backend if available
  if (project.status) return project.status;
  if (!project.dueDate) return "ACTIVE";
  return new Date(project.dueDate) < new Date() ? "ON_HOLD" : "ACTIVE";
}

function isOverdue(project: Project): boolean {
  return !!project.dueDate && new Date(project.dueDate) < new Date();
}

export function AssignedProjectsSection({ projects }: AssignedProjectsSectionProps) {
  const displayed = projects.slice(0, 4);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-[#f1f5f9]">Assigned Projects</h3>
        </div>
        <p className="text-sm text-gray-400 dark:text-[#64748b] text-center py-6">No projects assigned yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-[#f1f5f9]">Assigned Projects</h3>
          {projects.length > 4 && (
            <Link href="/manager/projects" className="text-sm font-medium text-blue-600 hover:underline">
              View All
            </Link>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {displayed.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedProject(project)}
              className="rounded-xl border border-gray-100 dark:border-[#334155] dark:bg-[#0f172a] p-4 text-left hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-[#1e3a5f]">
                  <Folder className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={getProjectStatus(project)} />
                  {isOverdue(project) && (
                    <span className="text-[10px] font-semibold text-red-500">⚠ Overdue</span>
                  )}
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] line-clamp-1">{project.name}</div>
              <div className="text-xs text-gray-400 dark:text-[#64748b] mt-0.5 line-clamp-1">{project.description || "Internal"}</div>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center -space-x-1.5">
                    {(project.members && project.members.length > 0 ? project.members.slice(0, 3) : []).map((m) => (
                      <UserAvatar key={m.id} name={m.name} src={m.profilePhoto} className="h-5 w-5 ring-1 ring-white dark:ring-[#1e293b]" />
                    ))}
                    {project.members && project.members.length > 3 && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 dark:bg-[#334155] ring-1 ring-white dark:ring-[#1e293b] text-[9px] font-semibold text-gray-500 dark:text-[#94a3b8]">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-blue-600">View →</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-[#334155] mt-1">
                  <div className="h-full w-1/2 rounded-full bg-blue-500" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ProjectDetailsModal
        open={!!selectedProject}
        onOpenChange={(o) => !o && setSelectedProject(null)}
        project={selectedProject}
      />
    </>
  );
}
