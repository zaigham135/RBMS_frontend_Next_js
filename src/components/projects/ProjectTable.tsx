"use client";

import { memo } from "react";
import { DataTable } from "@/components/common/DataTable";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/project";
import { Pencil, Trash2 } from "lucide-react";

interface ProjectTableProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  showManager?: boolean;
}

export const ProjectTable = memo(function ProjectTable({
  projects, onEdit, onDelete, showManager = true,
}: ProjectTableProps) {
  return (
    <DataTable
      data={projects}
      keyExtractor={(p) => p.id}
      emptyMessage="No projects found"
      columns={[
        { header: "Name", cell: (p) => <span className="font-medium">{p.name}</span> },
        { header: "Description", cell: (p) => <span className="text-muted-foreground line-clamp-1">{p.description || "—"}</span> },
        ...(showManager ? [{
          header: "Manager",
          cell: (p: Project) => (
            <div className="flex items-center gap-3">
              <UserAvatar name={p.managerName} src={p.managerPhoto} className="h-8 w-8" />
              <div className="min-w-0">
                <p className="truncate font-medium">{p.managerName}</p>
                {p.managerEmail && <p className="truncate text-xs text-muted-foreground">{p.managerEmail}</p>}
              </div>
            </div>
          ),
        }] : []),
        { header: "Due Date", cell: (p) => formatDate(p.dueDate) },
        {
          header: "Actions",
          cell: (p) => (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button variant="ghost" size="icon" onClick={() => onEdit(p)} title="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="icon" onClick={() => onDelete(p)}
                  title="Delete" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ),
        },
      ]}
    />
  );
});
