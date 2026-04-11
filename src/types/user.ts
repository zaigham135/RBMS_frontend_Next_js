export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  profilePhoto?: string;
  createdAt: string;
  designation?: string | null;
}

export interface Designation {
  id: number;
  name: string;
  applicableRole?: string | null; // "MANAGER" | "EMPLOYEE" | null
}

export interface AuthResponse {
  token: string;
  role: Role;
  name: string;
  email?: string;
  userId?: string;
  profilePhoto?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
