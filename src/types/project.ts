export interface Project {
  id: number;
  name: string;
  description: string;
  managerId: number;
  managerName: string;
  managerEmail?: string;
  managerPhoto?: string;
  dueDate: string; // yyyy-MM-dd
  createdAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  managerId: number;
  dueDate: string;
}

export interface UpdateProjectRequest {
  name: string;
  description: string;
  managerId?: number;
  dueDate?: string; // Only admin can update this
}
