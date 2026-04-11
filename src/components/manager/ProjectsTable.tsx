"use client";

import { useState } from "react";
import { Eye, Pencil, Archive, Folder } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ProjectDetailsModal } from "@/components/manager/ProjectDetailsModal";
import type { Project } from "@/types/project";

interface ProjectsTableProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onArchive?: (project: Project) => void;
}

function getProjectStatus(project: Project): string {
  // Use real status from backend if available
  if (project.status) return project.status;
  // Fallback: derive from dueDate
  if (!project.dueDate) return "ACTIVE";
  return new Date(project.dueDate) < new Date() ? "ON_HOLD" : "ACTIVE";
}

function isOverdue(project: Project): boolean {
  return !!project.dueDate && new Date(project.dueDate) < new Date();
}

export function ProjectsTable({ projects, onEdit, onArchive }: ProjectsTableProps) {
  const [viewProject, setViewProject] = useState<Project | null>(null);

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-12 text-center shadow-sm">
        <p className="text-sm text-gray-400 dark:text-[#64748b]">No projects found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Project Name</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Health / Progress</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Team</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-[#64748b]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-[#334155]">
              {projects.map((project) => {
                const status = getProjectStatus(project);
                const overdue = isOverdue(project);
                return (
                  <tr key={project.id} className="hover:bg-gray-50/50 dark:hover:bg-[#334155]/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-[#1e3a5f]">
                          <Folder className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">{project.name}</div>
                          <div className="text-xs text-gray-400 dark:text-[#64748b]">
                            {project.description ? project.description.slice(0, 30) + (project.description.length > 30 ? "…" : "") : "Internal"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={status} />
                        {overdue && (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 border border-red-200">⚠ Overdue</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-[#334155] overflow-hidden">
                          <div className={`h-full rounded-full ${overdue ? "bg-red-400" : "bg-blue-500"}`} style={{ width: "50%" }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-[#94a3b8]">50%</span>
                      </div>
                      <div className={`text-[11px] mt-0.5 ${overdue ? "text-red-500" : "text-gray-400 dark:text-[#64748b]"}`}>
                        {overdue ? "Overdue" : "On Track"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center -space-x-2">
                        {(project.members && project.members.length > 0
                          ? project.members.slice(0, 4)
                          : [{ id: project.managerId, name: project.managerName, profilePhoto: project.managerPhoto, email: "" }]
                        ).map((m) => (
                          <UserAvatar key={m.id} name={m.name} src={m.profilePhoto} className="h-7 w-7 ring-2 ring-white dark:ring-[#1e293b]" />
                        ))}
                        {project.members && project.members.length > 4 && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 dark:bg-[#334155] ring-2 ring-white dark:ring-[#1e293b] text-[10px] font-semibold text-gray-600 dark:text-[#94a3b8]">
                            +{project.members.length - 4}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" title="View Details" onClick={() => setViewProject(project)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 dark:hover:bg-[#1e3a5f] hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button type="button" title="Edit" onClick={() => onEdit?.(project)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" title="Archive" onClick={() => onArchive?.(project)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors">
                          <Archive className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        open={!!viewProject}
        onOpenChange={(o) => !o && setViewProject(null)}
        project={viewProject}
      />
    </>
  );
}
