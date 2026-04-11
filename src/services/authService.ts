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

  // Forgot password — Step 1: send OTP to email
  sendOtp: async (email: string): Promise<ApiResponse<null>> => {
    const res = await api.post("/api/auth/forgot-password/send-otp", { email });
    return res.data;
  },

  // Forgot password — Step 2: verify OTP
  verifyOtp: async (email: string, otp: string): Promise<ApiResponse<null>> => {
    const res = await api.post("/api/auth/forgot-password/verify-otp", { email, otp });
    return res.data;
  },

  // Forgot password — Step 3: reset password
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<ApiResponse<null>> => {
    const res = await api.post("/api/auth/forgot-password/reset", { email, otp, newPassword });
    return res.data;
  },
};
