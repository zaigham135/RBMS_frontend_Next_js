import api from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Project, CreateProjectRequest, UpdateProjectRequest } from "@/types/project";

export const projectService = {
  // Admin
  getAllProjects: async (): Promise<ApiResponse<Project[]>> => {
    const res = await api.get("/api/admin/projects");
    return res.data;
  },

  getPaginatedProjects: async (
    page: number,
    size: number,
    managerId?: number | string
  ): Promise<ApiResponse<PaginatedResponse<Project>>> => {
    const params: Record<string, unknown> = { page, size };
    if (managerId && managerId !== "") params.managerId = managerId;
    const res = await api.get("/api/admin/projects/paginated", { params });
    return res.data;
  },

  getProjectsByManager: async (managerId: number): Promise<ApiResponse<Project[]>> => {
    const res = await api.get(`/api/admin/projects/manager/${managerId}`);
    return res.data;
  },

  // Manager
  getMyProjects: async (): Promise<ApiResponse<Project[]>> => {
    const res = await api.get("/api/manager/my-projects");
    return res.data;
  },

  createProject: async (data: CreateProjectRequest): Promise<ApiResponse<Project>> => {
    const res = await api.post("/api/manager/projects", data);
    return res.data;
  },

  updateProject: async (
    projectId: number,
    data: UpdateProjectRequest
  ): Promise<ApiResponse<Project>> => {
    const res = await api.put(`/api/manager/projects/${projectId}`, data);
    return res.data;
  },

  deleteProject: async (projectId: number): Promise<ApiResponse<null>> => {
    const res = await api.delete(`/api/manager/projects/${projectId}`);
    return res.data;
  },
};
