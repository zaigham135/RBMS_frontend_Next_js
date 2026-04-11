import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Designation } from "@/types/user";

export const designationService = {
  getAll: async (): Promise<ApiResponse<Designation[]>> => {
    const res = await api.get("/api/admin/designations");
    return res.data;
  },

  create: async (name: string, applicableRole?: string): Promise<ApiResponse<Designation>> => {
    const res = await api.post("/api/admin/designations", { name, applicableRole: applicableRole ?? null });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/designations/${id}`);
  },

  assignToUser: async (userId: number, designation: string | null): Promise<void> => {
    await api.put(`/api/admin/users/${userId}/designation`, { designation: designation ?? "" });
  },
};
