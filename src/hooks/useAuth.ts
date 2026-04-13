"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { getDashboardPath } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Role } from "@/types/user";

type AuthPayload = {
  token: string;
  role: Role;
  name: string;
  email?: string;
  userId?: string;
  profilePhoto?: string;
};

const normalizeRole = (value: unknown): Role => {
  const rawRole = typeof value === "string" ? value : String(value ?? "");
  const role = rawRole.toUpperCase().replace("ROLE_", "");

  if (role === "ADMIN" || role === "MANAGER") {
    return role;
  }

  return "EMPLOYEE";
};

const extractAuthPayload = (input: any): AuthPayload | null => {
  const payload = input?.data || input;
  const actualData = (payload?.token || payload?.jwt || payload?.accessToken || payload?.role)
    ? payload
    : input;

  const token = actualData?.token || actualData?.jwt || actualData?.accessToken;
  if (!token) return null;

  const role = normalizeRole(actualData?.role || actualData?.user?.role);
  const name = actualData?.name || actualData?.user?.name || actualData?.userName || "User";
  const email = actualData?.email || actualData?.user?.email || undefined;
  const userId = actualData?.userId?.toString?.() || actualData?.user?.id?.toString?.() || undefined;
  const profilePhoto = actualData?.profilePhoto || actualData?.user?.profilePhoto || undefined;

  return { token, role, name, email, userId, profilePhoto };
};

export function useAuth() {
  const {
    token,
    role,
    name,
    email,
    userId,
    profilePhoto,
    setAuth,
    setProfilePhoto,
    clearAuth,
    isAuthenticated,
  } = useAuthStore();
  const router = useRouter();

  const finalizeAuth = useCallback((payload: AuthPayload) => {
    // Clear all previous auth data first to prevent stale data
    localStorage.clear();
    // Set new auth data
    localStorage.setItem("token", payload.token);
    localStorage.setItem("role", payload.role);
    localStorage.setItem("name", payload.name);
    if (payload.email) localStorage.setItem("email", payload.email);
    if (payload.userId) localStorage.setItem("userId", payload.userId);
    if (payload.profilePhoto) localStorage.setItem("profilePhoto", payload.profilePhoto);
    setAuth(payload.token, payload.role, payload.name, payload.email, payload.userId, payload.profilePhoto);
    document.cookie = `tm_token=${payload.token}; path=/`;
    document.cookie = `tm_role=${payload.role}; path=/`;
    toast.success(`Welcome back, ${payload.name}!`);
    window.location.href = getDashboardPath(payload.role);
  }, [setAuth]);

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login({ email, password });
      const authPayload = extractAuthPayload(res);

      if (authPayload && (res.status === "success" || authPayload.token)) {
        finalizeAuth(authPayload);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await authService.register({ name, email, password });
      if (res.status === "success") {
        toast.success("Registration successful! Please login.");
        router.push("/login");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("profilePhoto");
    document.cookie = "tm_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "tm_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
    toast.success("Logged out successfully");
  };

  const loginWithGoogle = useCallback(() => {
    window.location.href = authService.getGoogleAuthUrl();
  }, []);

  const completeOAuthLogin = useCallback((params: URLSearchParams) => {
    const authPayload = extractAuthPayload({
      token: params.get("token"),
      jwt: params.get("jwt"),
      accessToken: params.get("accessToken"),
      role: params.get("role"),
      name: params.get("name"),
      email: params.get("email"),
      userId: params.get("userId"),
      profilePhoto: params.get("profilePhoto"),
      userName: params.get("userName"),
      user: {
        role: params.get("role"),
        name: params.get("name") || params.get("userName"),
        email: params.get("email"),
        id: params.get("userId"),
        profilePhoto: params.get("profilePhoto"),
      },
    });

    if (!authPayload) {
      throw new Error("Google login did not return a token.");
    }

    finalizeAuth(authPayload);
  }, [finalizeAuth]);

  const uploadProfilePhoto = useCallback(async (file: File) => {
    try {
      const res: any = await authService.uploadProfilePhoto(file);
      const payload = res?.data || res;
      const nextPhoto = payload?.profilePhoto || payload?.data?.profilePhoto;

      if (!nextPhoto) {
        throw new Error("Profile photo URL not returned.");
      }

      localStorage.setItem("profilePhoto", nextPhoto);
      setProfilePhoto(nextPhoto);
      toast.success("Profile photo updated");
      return nextPhoto;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }, [setProfilePhoto]);

  return {
    token,
    role,
    name,
    email,
    userId,
    profilePhoto,
    isAuthenticated,
    login,
    register,
    logout,
    loginWithGoogle,
    completeOAuthLogin,
    uploadProfilePhoto,
  };
}
