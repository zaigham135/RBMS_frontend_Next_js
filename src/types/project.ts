export interface ProjectMember {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
  role?: string;
}

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
  status?: string; // ACTIVE | ON_HOLD
  members?: ProjectMember[];
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
  dueDate?: string;   // Admin only
  status?: string;    // Admin only: ACTIVE | ON_HOLD
}

export interface ProjectWithStats extends Project {
  status: 'ACTIVE' | 'IN_REVIEW' | 'PLANNED' | 'ON_HOLD';
  progressPercent: number;
  milestoneLabel: string;
  teamMembers: { id: number; name: string; profilePhoto?: string }[];
  clientOrType: string;
}
