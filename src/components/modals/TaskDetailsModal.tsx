"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/types/task";
import { Calendar, FolderKanban, MessageSquare, Clock } from "lucide-react";
import { formatRelative, parseISO, isValid } from "date-fns";

interface TaskDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  isLoading?: boolean;
}

export function TaskDetailsModal({ open, onOpenChange, task, isLoading }: TaskDetailsModalProps) {

  const formatTime = (dateString: string) => {
    if (!dateString) return "—";
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return formatDate(dateString);
      return formatRelative(date, new Date());
    } catch {
      return formatDate(dateString);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden p-6 sm:rounded-xl">
        <DialogHeader className="shrink-0 mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight">Task Overview</DialogTitle>
          <DialogDescription className="text-muted-foreground">Detailed view of the selected task</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto pr-4">
          {isLoading ? (
            <div className="space-y-4 pb-6">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full rounded-md" />)}
            </div>
          ) : task ? (
            <div className="space-y-6 pb-6 pr-2">
              {/* Title + badges */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="text-2xl font-bold leading-tight">{task.title}</h2>
                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border bg-muted/40 p-4 shadow-sm text-sm">
                {task.projectName && (
                  <div className="flex items-center gap-3 text-muted-foreground bg-background/50 p-2 rounded-lg border border-transparent hover:border-border transition-colors">
                    <div className="p-1.5 bg-primary/10 rounded-md shrink-0"><FolderKanban className="h-4 w-4 text-primary" /></div>
                    <span className="font-medium text-foreground truncate" title={task.projectName}>{task.projectName}</span>
                  </div>
                )}
                {task.assignedToName && (
                  <div className="flex items-center gap-3 text-muted-foreground bg-background/50 p-2 rounded-lg border border-transparent hover:border-border transition-colors">
                    <UserAvatar name={task.assignedToName} src={task.assignedToPhoto} className="h-9 w-9 shrink-0" />
                    <div className="min-w-0">
                      <span className="block truncate font-medium text-foreground" title={task.assignedToName}>{task.assignedToName}</span>
                      {task.assignedToEmail && <span className="block truncate text-xs">{task.assignedToEmail}</span>}
                    </div>
                  </div>
                )}
                {task.managerName && (
                  <div className="flex items-center gap-3 text-muted-foreground bg-background/50 p-2 rounded-lg border border-transparent hover:border-border transition-colors">
                    <UserAvatar name={task.managerName} src={task.managerPhoto} className="h-9 w-9 shrink-0" />
                    <div className="min-w-0">
                      <span className="block truncate font-medium text-foreground" title={task.managerName}>{task.managerName}</span>
                      {task.managerEmail && <span className="block truncate text-xs">{task.managerEmail}</span>}
                    </div>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-3 text-muted-foreground bg-background/50 p-2 rounded-lg border border-transparent hover:border-border transition-colors">
                    <div className="p-1.5 bg-orange-500/10 rounded-md shrink-0"><Calendar className="h-4 w-4 text-orange-600" /></div>
                    <span className="font-medium text-foreground">{formatDate(task.dueDate)}</span>
                  </div>
                )}
                {task.createdAt && (
                  <div className="flex items-center gap-3 text-muted-foreground bg-background/50 p-2 rounded-lg border border-transparent hover:border-border transition-colors">
                    <div className="p-1.5 bg-violet-500/10 rounded-md shrink-0"><Clock className="h-4 w-4 text-violet-600" /></div>
                    <span className="font-medium text-foreground">{formatTime(task.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {task.description && (
                <div className="bg-muted/10 rounded-xl p-4 border shadow-sm">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{task.description}</p>
                </div>
              )}

              {/* Comments */}
              {task.comments && task.comments.length > 0 && (
                <div className="pt-2">
                  <div className="mb-4 flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold tracking-tight">Active Discussion</h3>
                    </div>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                      {task.comments.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {task.comments.map((c) => (
                      <div key={c.id} className="relative rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <UserAvatar name={c.userName} src={c.userPhoto} className="h-8 w-8 shrink-0" />
                            <span className="text-sm font-bold capitalize text-foreground">{c.userName || "Unknown"}</span>
                          </div>
                          <span className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                            {formatTime(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground pl-10">
                          {c.commentText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="p-4 bg-muted/50 rounded-full mb-4">
                <FolderKanban className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-muted-foreground font-medium">Task details unavailable</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
