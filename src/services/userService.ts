import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { User, Role, UserStatus } from "@/types/user";

export const userService = {
  getAllEmployees: async (): Promise<ApiResponse<User[]>> => {
    const res = await api.get("/api/admin/employees");
    return res.data;
  },

  getManagerEmployees: async (): Promise<ApiResponse<User[]>> => {
    const res = await api.get("/api/manager/employees");
    return res.data;
  },

  updateUserRole: async (
    userId: number,
    role: Role
  ): Promise<ApiResponse<User>> => {
    const res = await api.put(`/api/admin/users/${userId}/role`, { role });
    return res.data;
  },

  updateUserStatus: async (
    userId: number,
    status: UserStatus
  ): Promise<ApiResponse<User>> => {
    const res = await api.put(`/api/admin/users/${userId}/status`, { status });
    return res.data;
  },
};
