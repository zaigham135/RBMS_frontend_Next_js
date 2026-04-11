"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Activity, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import { AppTopBar } from "@/components/common/AppTopBar";
import { StatCard } from "@/components/manager/StatCard";
import { TeamRosterTable } from "@/components/manager/TeamRosterTable";
import { WorkloadDistributionChart } from "@/components/manager/WorkloadDistributionChart";
import { TaskFormModal } from "@/components/modals/TaskFormModal";
import { useManagerTeam } from "@/hooks/useManagerDashboard";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import type { EmployeeWithWorkload } from "@/types/managerTeam";
import type { User } from "@/types/user";
import type { CreateTaskRequest } from "@/types/task";

export default function ManagerTeamPage() {
  const { teamStats, employees, isLoading } = useManagerTeam();
  const { projects, fetchMyProjects } = useProjects();
  const { createTask } = useTasks();

  const [assignTarget, setAssignTarget] = useState<EmployeeWithWorkload | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchMyProjects(); }, [fetchMyProjects]);

  const handleAssign = (emp: EmployeeWithWorkload) => {
    setAssignTarget(emp);
    setAssignOpen(true);
  };

  const handleAssignSubmit = useCallback(async (data: CreateTaskRequest) => {
    setIsSubmitting(true);
    try {
      await createTask(data);
      setAssignOpen(false);
      setAssignTarget(null);
    } catch {
      // error toasted by hook
    } finally {
      setIsSubmitting(false);
    }
  }, [createTask]);

  // Convert EmployeeWithWorkload[] to User[] for TaskFormModal
  const employeesAsUsers: User[] = employees.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    role: e.role as any,
    status: e.status as any,
    profilePhoto: e.profilePhoto,
    createdAt: "",
  }));

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      <AppTopBar title="Team Roster" searchPlaceholder="Search members..." />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
                icon={<Users className="h-5 w-5 text-blue-600" />}
                label="Total Members"
                value={teamStats?.totalMembers ?? 0}
                trend={teamStats?.totalMembersTrend}
                iconBg="bg-blue-50"
              />
              <StatCard
                icon={<Activity className="h-5 w-5 text-amber-600" />}
                label="Avg Workload"
                value={`${Math.round(teamStats?.avgWorkload ?? 0)}%`}
                iconBg="bg-amber-50"
              />
              <StatCard
                icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
                label="Tasks Completed"
                value={teamStats?.tasksCompletedThisMonth ?? 0}
                iconBg="bg-green-50"
              />
              <StatCard
                icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                label="Overloaded Members"
                value={teamStats?.overloadedMembers ?? 0}
                trendColor="red"
                iconBg="bg-red-50"
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#f1f5f9]">Team Roster</h2>
          <button type="button" onClick={() => { setAssignTarget(null); setAssignOpen(true); }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Assign Task
          </button>
        </div>

        {/* Roster table */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <TeamRosterTable employees={employees} onAssign={handleAssign} />
        )}

        {/* Workload chart */}
        {employees.length > 0 && (
          <WorkloadDistributionChart employees={employees} />
        )}
      </div>

      {/* Assign Task Modal — pre-populates assignee when coming from row button */}
      <TaskFormModal
        open={assignOpen}
        onOpenChange={(o) => {
          setAssignOpen(o);
          if (!o) setAssignTarget(null);
        }}
        onSubmit={handleAssignSubmit}
        projects={projects}
        employees={employeesAsUsers}
        isLoading={isSubmitting}
        defaultAssigneeId={assignTarget?.id}
      />
    </div>
  );
}
