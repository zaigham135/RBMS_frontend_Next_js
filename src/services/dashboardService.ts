import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { AdminDashboardActivity, AdminDashboardStats } from "@/types/dashboard";

export const dashboardService = {
  getAdminStats: async (): Promise<ApiResponse<AdminDashboardStats>> => {
    const res = await api.get("/api/admin/dashboard/stats");
    return res.data;
  },

  getAdminActivity: async (limit = 10): Promise<ApiResponse<AdminDashboardActivity[]>> => {
    const res = await api.get("/api/admin/dashboard/activity", {
      params: { limit },
    });
    return res.data;
  },
};
