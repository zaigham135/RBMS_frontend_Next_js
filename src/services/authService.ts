import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/user";

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const res = await api.post("/api/auth/login", data);
      return res.data;
    } catch (error: any) {
      const msg = error.response?.data?.message;
      if (error.response?.status === 429) {
        throw new Error(msg || "Too many login attempts. Please try again after 1 minute.");
      }
      if (error.response?.status === 404) {
        throw new Error(msg || "No account found with this email.");
      }
      if (error.response?.status === 400) {
        throw new Error(msg || "Invalid email or password.");
      }
      if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      if (!error.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(msg || "Login failed. Please try again.");
    }
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<{ message: string }>> => {
    try {
      const res = await api.post("/api/auth/signup", data);
      return res.data;
    } catch (error: any) {
      const msg = error.response?.data?.message;
      if (error.response?.status === 400) {
        throw new Error(msg || "Registration failed. Please check your information.");
      }
      throw new Error(msg || "Registration failed. Please try again.");
    }
  },

  uploadProfilePhoto: async (file: File): Promise<ApiResponse<{ profilePhoto: string }>> => {
    // File uploads must bypass the Vercel proxy (413/502 errors)
    // Send directly to backend with the JWT token.
    // Auto-upgrade to https when the page is served over HTTPS to avoid mixed content.
    const { getToken } = await import("@/lib/auth");
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    if (typeof window !== "undefined" && window.location.protocol === "https:" && backendUrl.startsWith("http://")) {
      backendUrl = backendUrl.replace("http://", "https://");
    }
    const formData = new FormData();
    formData.append("file", file);
    const token = getToken();
    const res = await fetch(`${backendUrl}/api/auth/upload-photo`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to upload photo.");
    }
    return res.json();
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
