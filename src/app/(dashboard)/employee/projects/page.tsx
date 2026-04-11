"use client";

import { useEffect } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { ActionButton, NexusPageIntro, NexusTopbar, Panel, ProgressBar } from "@/components/common/NexusUI";
import { ArrowRight } from "lucide-react";

export default function EmployeeProjectsPage() {
  const { name, profilePhoto } = useAuth();
  const { projects, fetchMyProjects } = useProjects();

  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  const visibleProjects = projects.slice(0, 3);

  return (
    <div className="min-h-full bg-[#f7fbff]">
      <NexusTopbar
        title="Employee Workspace"
        searchPlaceholder="Search projects..."
        tabs={[
          { label: "Dashboard", href: "/employee" },
          { label: "Docs" },
          { label: "Support" },
        ]}
        userName={name}
        userPhoto={profilePhoto}
        signOutLabel="Sign Out"
      />

      <div className="space-y-6 px-5 py-5 lg:px-7 lg:py-6">
        <NexusPageIntro
          compact
          title="My Projects"
          description="Track the projects you contribute to and keep an eye on upcoming delivery milestones."
          actions={<ActionButton size="compact" href="/employee/tasks" icon={ArrowRight}>Go To My Tasks</ActionButton>}
        />

        <div className="grid gap-4 xl:grid-cols-3">
          {(visibleProjects.length ? visibleProjects : [
            { id: 1, name: "Nexus UI Refresh", description: "Polish shared enterprise components", dueDate: "2026-04-24" },
            { id: 2, name: "Audit Prep", description: "Support the Q4 infrastructure review", dueDate: "2026-04-28" },
            { id: 3, name: "Docs Update", description: "Refresh internal project handoff notes", dueDate: "2026-05-03" },
          ]).map((project) => (
            <Panel key={project.id} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#eef4ff] text-[13px] font-bold text-[#1557d6]">
                  {project.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="rounded-full bg-[#edf4fa] px-3 py-1.5 text-[12px] font-semibold text-[#475467]">{project.dueDate}</span>
              </div>
              <h3 className="mt-5 text-[18px] font-bold tracking-[-0.03em] text-[#1f2937]">{project.name}</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#556274]">{project.description}</p>
              <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]">Estimated Progress</div>
              <ProgressBar value={66} className="mt-3" />
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
