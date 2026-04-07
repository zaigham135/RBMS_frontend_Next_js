"use client";

import { useState, useCallback, useMemo } from "react";
import { userService } from "@/services/userService";
import type { User, Role, UserStatus } from "@/types/user";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await userService.getAllEmployees();
      const payload = res.data || res;
      const arr = Array.isArray(payload) ? payload : (payload.content || payload.users || payload.data || []);
      setUsers(arr);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchManagerEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await userService.getManagerEmployees();
      const payload = res.data || res;
      const arr = Array.isArray(payload) ? payload : (payload.content || payload.users || payload.data || []);
      setUsers(arr);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId: number, role: Role) => {
    try {
      await userService.updateUserRole(userId, role);
      toast.success("User role updated");
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: number, status: UserStatus) => {
    try {
      await userService.updateUserStatus(userId, status);
      toast.success(`User ${status === "ACTIVE" ? "activated" : "deactivated"}`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }, []);

  const activeEmployees = useMemo(
    () => users.filter((u) => u.role === "EMPLOYEE" && u.status === "ACTIVE"),
    [users]
  );

  const managers = useMemo(
    () => users.filter((u) => u.role === "MANAGER"),
    [users]
  );

  return {
    users,
    isLoading,
    error,
    activeEmployees,
    managers,
    fetchAllUsers,
    fetchManagerEmployees,
    updateUserRole,
    updateUserStatus,
  };
}
