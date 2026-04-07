import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types/user";

interface AuthState {
  token: string | null;
  role: Role | null;
  name: string | null;
  email: string | null;
  userId: string | null;
  profilePhoto: string | null;
  setAuth: (token: string, role: Role, name: string, email?: string, userId?: string, profilePhoto?: string) => void;
  setProfilePhoto: (profilePhoto: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      name: null,
      email: null,
      userId: null,
      profilePhoto: null,
      setAuth: (token, role, name, email, userId, profilePhoto) => {
        // Also sync to localStorage for axios interceptor
        localStorage.setItem("tm_token", token);
        localStorage.setItem("tm_role", role);
        localStorage.setItem("tm_name", name);
        if (email) localStorage.setItem("tm_email", email);
        if (userId) localStorage.setItem("tm_user_id", userId);
        if (profilePhoto) localStorage.setItem("tm_profile_photo", profilePhoto);
        set({ token, role, name, email: email ?? null, userId: userId ?? null, profilePhoto: profilePhoto ?? null });
      },
      setProfilePhoto: (profilePhoto) => {
        localStorage.setItem("tm_profile_photo", profilePhoto);
        set({ profilePhoto });
      },
      clearAuth: () => {
        localStorage.removeItem("tm_token");
        localStorage.removeItem("tm_role");
        localStorage.removeItem("tm_name");
        localStorage.removeItem("tm_email");
        localStorage.removeItem("tm_user_id");
        localStorage.removeItem("tm_profile_photo");
        set({ token: null, role: null, name: null, email: null, userId: null, profilePhoto: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "tm-auth-storage",
    }
  )
);
