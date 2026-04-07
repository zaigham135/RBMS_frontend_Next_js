import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/user";

const API_BASE_URL = "http://localhost:8080";

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const res = await api.post("/api/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.post("/api/auth/signup", data);
    return res.data;
  },

  uploadProfilePhoto: async (file: File): Promise<ApiResponse<{ profilePhoto: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/api/auth/upload-photo", formData);
    return res.data;
  },

  getGoogleAuthUrl: (): string => `${API_BASE_URL}/oauth2/authorization/google`,
};
