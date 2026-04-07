export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Comment {
  id: number;
  commentText: string;
  userName: string;
  userPhoto?: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  assignedTo: number;
  assignedToId?: number;
  assignedToName: string;
  assignedToEmail?: string;
  assignedToPhoto?: string;
  managerId?: number;
  managerName?: string;
  managerEmail?: string;
  managerPhoto?: string;
  createdById?: number;
  dueDate: string; // yyyy-MM-dd
  priority: Priority;
  status: TaskStatus;
  comments?: Comment[];
  createdByName: string;
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: number;
  assignedTo: number;
  dueDate: string;
  priority: Priority;
}

export interface UpdateTaskRequest {
  status?: TaskStatus;
  description?: string;
  comment?: string;
  dueDate?: string;
  priority?: Priority;
}

export interface TaskFilters {
  page: number;
  size: number;
  projectId?: number | string;
  status?: TaskStatus | string;
}
