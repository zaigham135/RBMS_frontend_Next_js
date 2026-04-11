"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Calendar, Folder, Users, AlertTriangle, CheckCircle2, PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

function getProjectStatus(project: Project): string {
  if (project.status) return project.status;
  if (!project.dueDate) return "ACTIVE";
  return new Date(project.dueDate) < new Date() ? "ON_HOLD" : "ACTIVE";
}

function isOverdue(project: Project): boolean {
  return !!project.dueDate && new Date(project.dueDate) < new Date();
}

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch { return d; }
}

export function ProjectDetailsModal({ open, onOpenChange, project }: ProjectDetailsModalProps) {
  if (!project) return null;

  const status = getProjectStatus(project);
  const overdue = isOverdue(project);
  const members = project.members ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1e293b] dark:border-[#334155]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-[#f1f5f9]">Project Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1e3a5f]">
              <Folder className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#f1f5f9] leading-tight">{project.name}</h2>
              <p className="text-sm text-gray-500 dark:text-[#94a3b8] mt-0.5">{project.description || "No description provided."}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <StatusBadge status={status} />
              {overdue && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-3 w-3" /> Overdue
                </span>
              )}
            </div>
          </div>

          {/* Status banner */}
          <div className={cn(
            "flex items-center gap-3 rounded-xl p-3 border",
            status === "ACTIVE" && !overdue
              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
              : status === "ON_HOLD"
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                : overdue
                  ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                  : "bg-gray-50 dark:bg-[#0f172a] border-gray-200 dark:border-[#334155]"
          )}>
            {status === "ACTIVE" && !overdue && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
            {status === "ON_HOLD" && <PauseCircle className="h-5 w-5 text-amber-600 shrink-0" />}
            {overdue && <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />}
            <div>
              <div className={cn(
                "text-sm font-semibold",
                status === "ACTIVE" && !overdue ? "text-green-700 dark:text-green-400" :
                status === "ON_HOLD" ? "text-amber-700 dark:text-amber-400" :
                "text-red-700 dark:text-red-400"
              )}>
                {overdue ? "Project is overdue" : status === "ON_HOLD" ? "Project is on hold" : "Project is active"}
              </div>
              {overdue && project.dueDate && (
                <div className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                  Due date was {fmtDate(project.dueDate)}
                </div>
              )}
              {!overdue && project.dueDate && (
                <div className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5">
                  Due {fmtDate(project.dueDate)}
                </div>
              )}
            </div>
          </div>

          {/* Manager + Due Date */}
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-100 dark:border-[#334155] bg-gray-50 dark:bg-[#0f172a] p-4">
            <div className="flex items-center gap-3">
              <UserAvatar name={project.managerName} src={project.managerPhoto} className="h-9 w-9 shrink-0" />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#64748b]">Project Manager</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-[#f1f5f9]">{project.managerName}</div>
                {project.managerEmail && (
                  <div className="text-xs text-gray-400 dark:text-[#64748b]">{project.managerEmail}</div>
                )}
              </div>
            </div>

            {project.dueDate && (
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  overdue ? "bg-red-50 dark:bg-red-950/30" : "bg-orange-50 dark:bg-orange-950/20"
                )}>
                  <Calendar className={cn("h-4 w-4", overdue ? "text-red-500" : "text-orange-500")} />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#64748b]">Due Date</div>
                  <div className={cn("text-sm font-semibold", overdue ? "text-red-600 dark:text-red-400" : "text-gray-800 dark:text-[#f1f5f9]")}>
                    {fmtDate(project.dueDate)}
                    {overdue && " (Overdue)"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-gray-400 dark:text-[#64748b]" />
              <span className="text-sm font-semibold text-gray-700 dark:text-[#cbd5e1]">
                Team Members
                {members.length > 0 && (
                  <span className="ml-2 rounded-full bg-blue-50 dark:bg-[#1e3a5f] px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-300">
                    {members.length}
                  </span>
                )}
              </span>
            </div>

            {members.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 dark:border-[#334155] p-6 text-center">
                <p className="text-sm text-gray-400 dark:text-[#64748b]">No team members assigned yet.</p>
                <p className="text-xs text-gray-300 dark:text-[#475569] mt-1">Members appear here once tasks are assigned.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b] px-4 py-3 hover:border-blue-100 dark:hover:border-blue-800 transition-colors"
                  >
                    <UserAvatar name={member.name} src={member.profilePhoto} className="h-9 w-9 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] truncate">{member.name}</div>
                      <div className="text-xs text-gray-400 dark:text-[#64748b] truncate">{member.email}</div>
                    </div>
                    {member.role && (
                      <span className="shrink-0 rounded-full bg-gray-100 dark:bg-[#334155] px-2.5 py-0.5 text-[11px] font-medium text-gray-500 dark:text-[#94a3b8] capitalize">
                        {member.role.toLowerCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
