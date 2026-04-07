"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project } from "@/types/project";
import type { TaskStatus } from "@/types/task";

interface TaskFiltersProps {
  projects?: Project[];
  projectId: string;
  status: string;
  onProjectChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

export function TaskFilters({ projects, projectId, status, onProjectChange, onStatusChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {projects && (
        <Select value={projectId || "all"} onValueChange={(v) => onProjectChange(v === "all" ? "" : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={status || "all"} onValueChange={(v) => onStatusChange(v === "all" ? "" : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="TODO">Todo</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="DONE">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
