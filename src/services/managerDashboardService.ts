import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { ManagerDashboardStats, ManagerActivityEntry, TaskCompletionTrendPoint } from "@/types/managerDashboard";
import type { ManagerTeamStats, EmployeeWithWorkload } from "@/types/managerTeam";

export const managerDashboardService = {
  getStats: async (): Promise<ApiResponse<ManagerDashboardStats>> => {
    const res = await api.get("/api/manager/dashboard/stats");
    return res.data;
  },

  getActivity: async (limit = 10): Promise<ApiResponse<ManagerActivityEntry[]>> => {
    const res = await api.get("/api/manager/dashboard/activity", { params: { limit } });
    return res.data;
  },

  getCompletionTrend: async (days = 30): Promise<ApiResponse<TaskCompletionTrendPoint[]>> => {
    const res = await api.get("/api/manager/tasks/completion-trend", { params: { days } });
    return res.data;
  },

  getTeamStats: async (): Promise<ApiResponse<ManagerTeamStats>> => {
    const res = await api.get("/api/manager/team/stats");
    return res.data;
  },

  getEmployeesWithWorkload: async (): Promise<ApiResponse<EmployeeWithWorkload[]>> => {
    const res = await api.get("/api/manager/employees");
    return res.data;
  },

  deleteActivity: async (id: number): Promise<void> => {
    await api.delete(`/api/manager/dashboard/activity/${id}`);
  },
};
