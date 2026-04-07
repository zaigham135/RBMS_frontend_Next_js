"use client";

import { useState, useCallback } from "react";
import { taskService } from "@/services/taskService";
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from "@/types/task";
import type { PaginatedResponse } from "@/types/api";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

export function useTasks() {
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Task> | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters: TaskFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await taskService.getTasks(filters);
      const payload = res.data || res;
      // Handle the case where the backend returns a raw array instead of a Paginated response
      if (Array.isArray(payload)) {
        setPaginatedData({
          content: payload,
          totalPages: 1,
          totalElements: payload.length,
          size: payload.length,
          number: 0,
        });
      } else {
        setPaginatedData({
          content: payload.content || payload.data || payload.tasks || [],
          totalPages: payload.totalPages || 1,
          totalElements: payload.totalElements || 0,
          size: payload.size || 10,
          number: payload.number || 0,
        });
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error(`Failed to load tasks: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTaskById = useCallback(async (taskId: number) => {
    setIsDetailLoading(true);
    try {
      const res: any = await taskService.getTaskById(taskId);
      setSelectedTask(res.data || res);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskRequest) => {
    try {
      const res: any = await taskService.createTask(data);
      toast.success("Task created successfully");
      return res.data || res;
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId: number, data: UpdateTaskRequest) => {
    try {
      const res: any = await taskService.updateTask(taskId, data);
      toast.success("Task updated successfully");
      return res.data || res;
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      toast.success("Task deleted successfully");
      setPaginatedData((prev) =>
        prev
          ? { ...prev, content: prev.content.filter((t) => t.id !== taskId) }
          : null
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }, []);

  return {
    paginatedData,
    selectedTask,
    isLoading,
    isDetailLoading,
    error,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    setSelectedTask,
  };
}
