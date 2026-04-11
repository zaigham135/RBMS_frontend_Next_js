"use client";

import { useEffect, useState } from "react";
import { Download, FolderOpen, ListChecks, CheckCircle2, Users } from "lucide-react";
import { AppTopBar } from "@/components/common/AppTopBar";
import { ActionButton } from "@/components/common/NexusUI";
import { StatCard } from "@/components/manager/StatCard";
import { QuickActionsPanel } from "@/components/manager/QuickActionsPanel";
import { AssignedProjectsSection } from "@/components/manager/AssignedProjectsSection";
import { TaskCompletionTrendChart } from "@/components/manager/TaskCompletionTrendChart";
import { TeamWorkloadSection } from "@/components/manager/TeamWorkloadSection";
import { RecentActivityFeed } from "@/components/manager/RecentActivityFeed";
import { TaskFormModal } from "@/components/modals/TaskFormModal";
import { useManagerDashboard, useManagerTeam } from "@/hooks/useManagerDashboard";
import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { downloadTextFile } from "@/lib/download";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";

export default function ManagerDashboard() {
  const { stats, activity, trend, isLoading } = useManagerDashboard();
  const { employees } = useManagerTeam();
  const { projects, fetchMyProjects } = useProjects();
  const { activeEmployees, fetchManagerEmployees } = useUsers();
  const { name } = useAuth();
  const firstName = (name ?? "Manager").split(" ")[0];
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchMyProjects();
    fetchManagerEmployees();
  }, [fetchMyProjects, fetchManagerEmployees]);

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      <AppTopBar title="Dashboard" searchPlaceholder="Search projects or tasks..." />

      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[14px] font-medium text-[#607089] dark:text-[#94a3b8]">Welcome back, {firstName}</p>
          <ActionButton
            icon={Download}
            className="px-4 py-2.5 text-[13px]"
            onClick={() => downloadTextFile(
              "manager-dashboard-summary.txt",
              [
                `Active Projects: ${stats?.activeProjects ?? 0}`,
                `Pending Tasks: ${stats?.pendingTasks ?? 0}`,
                `Completed This Week: ${stats?.completedThisWeek ?? 0}`,
                `Team Members: ${stats?.teamMembers ?? 0}`,
              ].join("\n")
            )}
          >
            Export Snapshot
          </ActionButton>
        </div>

        {/* Stats + Quick Actions */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                icon={<FolderOpen className="h-5 w-5 text-blue-600" />}
                label="Active Projects"
                value={stats?.activeProjects ?? 0}
                trend={stats?.activeProjectsTrend}
                iconBg="bg-blue-50"
              />
              <StatCard
                icon={<ListChecks className="h-5 w-5 text-amber-600" />}
                label="Pending Tasks"
                value={stats?.pendingTasks ?? 0}
                iconBg="bg-amber-50"
              />
              <StatCard
                icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
                label="Completed This Week"
                value={stats?.completedThisWeek ?? 0}
                trend={stats?.completedThisWeekTrend}
                trendColor="green"
                iconBg="bg-green-50"
              />
              <StatCard
                icon={<Users className="h-5 w-5 text-purple-600" />}
                label="Team Members"
                value={stats?.teamMembers ?? 0}
                trend={stats?.teamMembersTrend}
                iconBg="bg-purple-50"
              />
            </>
          )}
        </div>

        {/* Main content + sidebar */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Left column */}
          <div className="space-y-6">
            <AssignedProjectsSection projects={projects} />
            <TaskCompletionTrendChart data={trend} />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <QuickActionsPanel onCreateTask={() => setCreateOpen(true)} />
            <TeamWorkloadSection employees={employees} />
            <RecentActivityFeed activity={activity} />
          </div>
        </div>
      </div>

      <TaskFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async () => {}}
        projects={projects}
        employees={activeEmployees}
        isLoading={false}
      />
    </div>
  );
}
