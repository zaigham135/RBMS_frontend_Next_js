import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/user";

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const res = await api.post("/api/auth/login", data);
      return res.data;
    } catch (error: any) {
      // Handle 404 specifically for user not found
      if (error.response?.status === 404) {
        throw new Error("User not found. Please check your credentials.");
      }
      // Handle 400 Bad Request (invalid credentials)
      if (error.response?.status === 400) {
        throw new Error("Invalid email or password. Please try again.");
      }
      // Handle 500 or other server errors
      if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      // Handle network errors
      if (!error.response) {
        throw new Error("Network error. Please check your connection.");
      }
      // Default error
      throw new Error("Login failed. Please try again.");
    }
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<{ message: string }>> => {
    try {
      const res = await api.post("/api/auth/signup", data);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error("Registration failed. Please check your information.");
      }
      throw new Error("Registration failed. Please try again.");
    }
  },

  uploadProfilePhoto: async (file: File): Promise<ApiResponse<{ profilePhoto: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/api/auth/upload-photo", formData);
    return res.data;
  },

  getGoogleAuthUrl: (): string => {
    // Google OAuth MUST go directly to backend (not through proxy)
    // because it requires browser redirect, not an API call
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return `${base}/oauth2/authorization/google`;
  },

  // Forgot password — Step 1: send OTP to email
  sendOtp: async (email: string): Promise<ApiResponse<null>> => {
    try {
      const res = await api.post("/api/auth/forgot-password/send-otp", { email });
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("No account found with this email.");
      }
      throw new Error("Failed to send OTP. Please try again.");
    }
  },

  // Forgot password — Step 2: verify OTP
  verifyOtp: async (email: string, otp: string): Promise<ApiResponse<null>> => {
    try {
      const res = await api.post("/api/auth/forgot-password/verify-otp", { email, otp });
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error("Invalid or expired OTP.");
      }
      throw new Error("Failed to verify OTP. Please try again.");
    }
  },

  // Forgot password — Step 3: reset password
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<ApiResponse<null>> => {
    try {
      const res = await api.post("/api/auth/forgot-password/reset", { email, otp, newPassword });
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error("Invalid OTP or email. Please try again.");
      }
      throw new Error("Failed to reset password. Please try again.");
    }
  },
};
