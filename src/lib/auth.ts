import type { Role } from "@/types/user";

const TOKEN_KEY = "tm_token";
const ROLE_KEY = "tm_role";
const NAME_KEY = "tm_name";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getRole = (): Role | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY) as Role | null;
};

export const getName = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(NAME_KEY);
};

export const setAuth = (token: string, role: Role, name: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(NAME_KEY, name);
};

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getDashboardPath = (role: Role): string => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "MANAGER":
      return "/manager";
    case "EMPLOYEE":
      return "/employee";
    default:
      return "/login";
  }
};
