export interface EmployeeWithWorkload {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  profilePhoto?: string;
  workloadPercent: number;
  department: string;
  activeProjects: string[];
}

export interface ManagerTeamStats {
  totalMembers: number;
  avgWorkload: number;
  tasksCompletedThisMonth: number;
  overloadedMembers: number;
  totalMembersTrend: string;
}
