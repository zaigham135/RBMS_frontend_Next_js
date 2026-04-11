"use client";

import { useState, useCallback, useEffect } from "react";
import { managerDashboardService } from "@/services/managerDashboardService";
import type { ManagerDashboardStats, ManagerActivityEntry, TaskCompletionTrendPoint } from "@/types/managerDashboard";
import type { ManagerTeamStats, EmployeeWithWorkload } from "@/types/managerTeam";

export function useManagerDashboard() {
  const [stats, setStats] = useState<ManagerDashboardStats | null>(null);
  const [activity, setActivity] = useState<ManagerActivityEntry[]>([]);
  const [trend, setTrend] = useState<TaskCompletionTrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, activityRes, trendRes] = await Promise.all([
        managerDashboardService.getStats(),
        managerDashboardService.getActivity(),
        managerDashboardService.getCompletionTrend(),
      ]);
      setStats(statsRes.data ?? null);
      setActivity(activityRes.data ?? []);
      setTrend(trendRes.data ?? []);
    } catch {
      setError("Failed to load dashboard data");
      // Keep zeros as fallback
      setStats({ activeProjects: 0, pendingTasks: 0, completedThisWeek: 0, teamMembers: 0, activeProjectsTrend: "", teamMembersTrend: "", completedThisWeekTrend: "" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { stats, activity, trend, isLoading, error, refetch: fetchAll };
}

export function useManagerTeam() {
  const [teamStats, setTeamStats] = useState<ManagerTeamStats | null>(null);
  const [employees, setEmployees] = useState<EmployeeWithWorkload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, empRes] = await Promise.all([
        managerDashboardService.getTeamStats(),
        managerDashboardService.getEmployeesWithWorkload(),
      ]);
      setTeamStats(statsRes.data ?? null);
      setEmployees(empRes.data ?? []);
    } catch {
      setTeamStats({ totalMembers: 0, avgWorkload: 0, tasksCompletedThisMonth: 0, overloadedMembers: 0, totalMembersTrend: "" });
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { teamStats, employees, isLoading, refetch: fetchAll };
}
