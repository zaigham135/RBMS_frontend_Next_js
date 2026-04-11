import { Folder } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Project } from "@/types/project";

interface ProjectKanbanBoardProps {
  projects: Project[];
}

const COLUMNS = [
  { key: "ACTIVE",    label: "Active" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "PLANNED",   label: "Planned" },
  { key: "ON_HOLD",   label: "On Hold" },
];

function getProjectStatus(project: Project): string {
  const due = new Date(project.dueDate);
  const now = new Date();
  if (due < now) return "ON_HOLD";
  return "ACTIVE";
}

export function ProjectKanbanBoard({ projects }: ProjectKanbanBoardProps) {
  const grouped = COLUMNS.reduce<Record<string, Project[]>>((acc, col) => {
    acc[col.key] = projects.filter((p) => getProjectStatus(p) === col.key);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((col) => (
        <div key={col.key} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">{col.label}</span>
            <span className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">
              {grouped[col.key].length}
            </span>
          </div>
          <div className="space-y-3">
            {grouped[col.key].map((project) => (
              <div key={project.id} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50">
                    <Folder className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 line-clamp-1">{project.name}</span>
                </div>
                <StatusBadge status={col.key} />
              </div>
            ))}
            {grouped[col.key].length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No projects</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
