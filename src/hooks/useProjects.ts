"use client";

import { useState, useCallback, useMemo } from "react";
import { projectService } from "@/services/projectService";
import type { Project, CreateProjectRequest, UpdateProjectRequest } from "@/types/project";
import type { PaginatedResponse } from "@/types/api";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Project> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await projectService.getAllProjects();
      const payload = res.data || res;
      const arr = Array.isArray(payload) ? payload : (payload.content || payload.projects || payload.data || []);
      // Deduplicate by id — backend joins may return duplicate rows
      const unique = Array.from(new Map(arr.map((p: any) => [p.id, p])).values());
      setProjects(unique);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPaginatedProjects = useCallback(async (page: number, size: number, managerId?: number | string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await projectService.getPaginatedProjects(page, size, managerId);
      const payload = res.data || res;
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
          content: payload.content || payload.projects || payload.data || [],
          totalPages: payload.totalPages || 1,
          totalElements: payload.totalElements || 0,
          size: payload.size || 10,
          number: payload.number || 0,
        });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMyProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await projectService.getMyProjects();
      const payload = res.data || res;
      const arr = Array.isArray(payload) ? payload : (payload.content || payload.projects || payload.data || []);
      setProjects(arr);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data: CreateProjectRequest) => {
    try {
      const res: any = await projectService.createProject(data);
      toast.success("Project created successfully");
      return res.data || res;
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (projectId: number, data: UpdateProjectRequest) => {
    try {
      const res: any = await projectService.updateProject(projectId, data);
      toast.success("Project updated successfully");
      return res.data || res;
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (projectId: number) => {
    try {
      await projectService.deleteProject(projectId);
      toast.success("Project deleted successfully");
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }, []);

  const managers = useMemo(
    () => projects.filter((p) => p.managerId),
    [projects]
  );

  return {
    projects,
    paginatedData,
    isLoading,
    error,
    managers,
    fetchAllProjects,
    fetchPaginatedProjects,
    fetchMyProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
