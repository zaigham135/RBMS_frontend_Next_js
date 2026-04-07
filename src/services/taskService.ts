import api from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from "@/types/task";

export const taskService = {
  getTasks: async (filters: TaskFilters): Promise<ApiResponse<PaginatedResponse<Task>>> => {
    const params: Record<string, unknown> = {
      page: filters.page,
      size: filters.size,
    };
    if (filters.projectId && filters.projectId !== "") params.projectId = filters.projectId;
    if (filters.status && filters.status !== "") params.status = filters.status;
    const res = await api.get("/api/tasks", { params });
    return res.data;
  },

  getTaskById: async (taskId: number): Promise<ApiResponse<Task>> => {
    const res = await api.get(`/api/tasks/${taskId}`);
    return res.data;
  },

  createTask: async (data: CreateTaskRequest): Promise<ApiResponse<Task>> => {
    const res = await api.post("/api/tasks", data);
    return res.data;
  },

  updateTask: async (
    taskId: number,
    data: UpdateTaskRequest
  ): Promise<ApiResponse<Task>> => {
    const res = await api.put(`/api/tasks/${taskId}`, data);
    return res.data;
  },

  deleteTask: async (taskId: number): Promise<ApiResponse<null>> => {
    const res = await api.delete(`/api/tasks/${taskId}`);
    return res.data;
  },
};
