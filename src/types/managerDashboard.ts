export interface ManagerDashboardStats {
  activeProjects: number;
  pendingTasks: number;
  completedThisWeek: number;
  teamMembers: number;
  activeProjectsTrend: string;
  teamMembersTrend: string;
  completedThisWeekTrend: string;
}

export interface ManagerActivityEntry {
  id: number;
  userName: string;
  userPhoto?: string;
  action: string;
  entityType?: string;
  entityId?: number;
  entityName?: string;
  projectId?: number;
  projectName?: string;
  createdAt: string;
}

export interface TaskCompletionTrendPoint {
  date: string;
  count: number;
}
