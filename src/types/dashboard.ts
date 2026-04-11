export interface AdminDashboardStats {
  totalProjects: number;
  openTasks: number;
  doneTasks: number;
  activeUsers: number;
  totalManagers: number;
  totalEmployees: number;
}

export interface AdminDashboardActivity {
  id: number;
  userName: string;
  userPhoto?: string | null;
  action: string;
  entityType: string;
  entityId: number;
  entityName: string;
  projectId?: number | null;
  projectName?: string | null;
  createdAt: string;
}
