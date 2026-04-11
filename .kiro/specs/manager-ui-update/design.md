# Design Document — Manager UI Update

## Overview

This document describes the technical design for updating the Manager role pages in TaskMan to match the new design system. The update covers four pages (Dashboard, Projects, Tasks, Team), the shared Sidebar, and a new manager-specific TopBar. It also covers new backend endpoints required to support the richer data requirements.

---

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts
- **Backend**: Java Spring Boot, Spring Security (JWT), JPA/Hibernate
- **State**: Zustand (authStore), custom React hooks
- **Charts**: Recharts (LineChart for trend, BarChart for workload distribution)

### High-Level Data Flow

```
Backend API
  └── Spring Boot Controllers (ManagerController, TaskController)
        └── Service Layer (ProjectService, TaskService, UserService, ActivityLogService)
              └── Repository Layer (JPA)

Frontend
  └── Page Component (app/(dashboard)/manager/*)
        └── Custom Hook (useManagerDashboard, useProjects, useTasks, useUsers)
              └── Service (managerDashboardService, projectService, taskService, userService)
                    └── api.ts (Axios instance with JWT interceptor)
```

---

## Backend Design

### New Endpoints

#### 1. `GET /api/manager/dashboard/stats`
Returns aggregated stats for the manager dashboard.

**Response DTO: `ManagerDashboardStatsResponse`**
```java
public class ManagerDashboardStatsResponse {
    private int activeProjects;
    private int pendingTasks;       // status = TODO
    private int completedThisWeek;  // status = DONE, within current ISO week
    private int teamMembers;
    private String activeProjectsTrend;   // e.g. "+2 this month"
    private String teamMembersTrend;      // e.g. "+1 this month"
    private String completedThisWeekTrend; // e.g. "+5%"
}
```

**Implementation**: Computed from existing `ProjectService.getProjectsForManager()`, `TaskService.getTasks()` filtered by status/date, and `UserService.getAllEmployees()`.

---

#### 2. `GET /api/manager/dashboard/activity?limit=10`
Returns the 10 most recent activity log entries scoped to the manager's projects.

**Response**: `List<ActivityLogResponse>` (existing DTO — already has all required fields: `userName`, `userPhoto`, `action`, `entityName`, `projectName`, `createdAt`).

**Implementation**: Query `ActivityLogRepository` filtered by `projectId IN (manager's project IDs)`, ordered by `createdAt DESC`, limited to `limit`.

---

#### 3. `GET /api/manager/tasks/completion-trend?days=30`
Returns daily task completion counts for the last N days.

**Response DTO: `TaskCompletionTrendPoint`**
```java
public class TaskCompletionTrendPoint {
    private String date;   // "yyyy-MM-dd"
    private int count;
}
// Returns: List<TaskCompletionTrendPoint>
```

**Implementation**: Query tasks with `status = DONE` and `updatedAt >= now - days`, group by date. Fill missing days with 0.

---

#### 4. `GET /api/manager/tasks` (new — manager-scoped)
Returns paginated tasks scoped to the manager's projects, with filters.

**Query params**: `page`, `size`, `projectId`, `status`, `priority`, `assignedTo`

**Response**: `PaginationResponse<TaskResponse>` (existing DTO).

**Implementation**: Filter tasks where `project.managerId = currentUser.id`. Apply optional filters.

---

#### 5. `GET /api/manager/team/stats`
Returns team-level stats for the Manager Team page.

**Response DTO: `ManagerTeamStatsResponse`**
```java
public class ManagerTeamStatsResponse {
    private int totalMembers;
    private double avgWorkload;         // average workload % across team
    private int tasksCompletedThisMonth; // DONE tasks this calendar month
    private int overloadedMembers;      // members with workload >= 85%
    private String totalMembersTrend;   // e.g. "+2 this month"
}
```

---

#### 6. Updated `GET /api/manager/employees`
Extend `UserResponse` with workload and department data.

**Extended DTO: `EmployeeWithWorkloadResponse`**
```java
public class EmployeeWithWorkloadResponse extends UserResponse {
    private int workloadPercent;          // active tasks / capacity * 100
    private String department;            // e.g. "Design", "Engineering"
    private List<String> activeProjects;  // project names (up to 3)
}
```

**Implementation**: Compute `workloadPercent` as `(IN_PROGRESS task count / 10) * 100`, clamped to 100. `department` derived from user role/metadata or a new `department` field on the `User` entity.

---

### Entity Change: `User` — Add `department` field

```java
// User.java — add field
@Column(nullable = true)
private String department; // e.g. "Design", "Engineering", "Operations"
```

This enables department-based filtering on the Team page.

---

### Updated `ManagerController`

```java
@GetMapping("/dashboard/stats")
public ApiResponse<ManagerDashboardStatsResponse> getDashboardStats() { ... }

@GetMapping("/dashboard/activity")
public ApiResponse<List<ActivityLogResponse>> getDashboardActivity(
    @RequestParam(defaultValue = "10") int limit) { ... }

@GetMapping("/tasks/completion-trend")
public ApiResponse<List<TaskCompletionTrendPoint>> getCompletionTrend(
    @RequestParam(defaultValue = "30") int days) { ... }

@GetMapping("/tasks")
public ApiResponse<PaginationResponse<TaskResponse>> getManagerTasks(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(required = false) Long projectId,
    @RequestParam(required = false) String status,
    @RequestParam(required = false) String priority,
    @RequestParam(required = false) Long assignedTo) { ... }

@GetMapping("/team/stats")
public ApiResponse<ManagerTeamStatsResponse> getTeamStats() { ... }

@GetMapping("/employees")  // updated to return extended DTO
public ApiResponse<List<EmployeeWithWorkloadResponse>> getAllEmployees() { ... }
```

---

## Frontend Design

### File Structure

```
Nextjs_Frontend/src/
  app/(dashboard)/manager/
    page.tsx                    ← Manager Dashboard (full redesign)
    layout.tsx                  ← Unchanged (uses Sidebar)
    projects/page.tsx           ← Manager Projects (full redesign)
    tasks/page.tsx              ← Manager Tasks (full redesign)
    team/page.tsx               ← Manager Team (full redesign)

  components/
    manager/                    ← NEW: manager-specific components
      ManagerTopBar.tsx         ← Breadcrumb + search + bell + user profile
      StatCard.tsx              ← Reusable stat card with icon/label/value/trend
      QuickActionsPanel.tsx     ← Dashboard quick actions
      AssignedProjectsSection.tsx ← Dashboard project cards
      TaskCompletionTrendChart.tsx ← Recharts LineChart
      TeamWorkloadSection.tsx   ← Dashboard team workload sidebar
      RecentActivityFeed.tsx    ← Dashboard activity feed
      ProjectsTable.tsx         ← New projects table (replaces old)
      ProjectKanbanBoard.tsx    ← Kanban view for projects
      TasksTable.tsx            ← New tasks table (replaces old)
      TaskBoardView.tsx         ← Board view for tasks
      TeamRosterTable.tsx       ← Team roster with tabs
      WorkloadDistributionChart.tsx ← Recharts BarChart
      ViewToggle.tsx            ← List/Kanban or List/Board toggle
    common/
      Sidebar.tsx               ← Updated manager nav (4 items + task badge)
      StatusBadge.tsx           ← Updated color mappings
      PriorityBadge.tsx         ← Updated color mappings
      WorkloadBar.tsx           ← NEW: colored progress bar with workload label

  services/
    managerDashboardService.ts  ← NEW: dashboard stats, activity, trend

  hooks/
    useManagerDashboard.ts      ← NEW: fetches all dashboard data

  types/
    managerDashboard.ts         ← NEW: ManagerDashboardStats, ActivityEntry, TrendPoint
    managerTeam.ts              ← NEW: EmployeeWithWorkload, TeamStats
```

---

## TypeScript Types

### `types/managerDashboard.ts`
```typescript
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
  entityName: string;
  projectName?: string;
  createdAt: string; // ISO datetime
}

export interface TaskCompletionTrendPoint {
  date: string; // "yyyy-MM-dd"
  count: number;
}
```

### `types/managerTeam.ts`
```typescript
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
```

### `types/project.ts` — Extended
```typescript
// Add to existing Project type:
export interface ProjectWithStats extends Project {
  status: 'ACTIVE' | 'IN_REVIEW' | 'PLANNED' | 'ON_HOLD';
  progressPercent: number;
  milestoneLabel: string;   // e.g. "4/8 Milestones"
  teamMembers: { id: number; name: string; profilePhoto?: string }[];
  clientOrType: string;     // e.g. "Client: Bluewave" or "Internal"
}
```

---

## Component Design

### `ManagerTopBar`
```typescript
interface ManagerTopBarProps {
  pageTitle: string;           // e.g. "Overview", "My Projects"
  breadcrumbPage: string;      // e.g. "Dashboard", "Projects"
  searchPlaceholder: string;
}
```
- Renders: `Management > {breadcrumbPage}` breadcrumb, search input, notification bell (with red dot if unread), user avatar + name + role
- Clicking avatar navigates to `/manager/account`
- Breadcrumb hidden on `< 768px`

---

### `StatCard`
```typescript
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;       // e.g. "+2 this month"
  trendColor?: 'green' | 'red' | 'blue';
}
```

---

### `WorkloadBar`
```typescript
interface WorkloadBarProps {
  percent: number;
}
// Color: >= 75% → orange/red, 40-74% → blue, < 40% → green
// Label: >= 75% → "High", 40-74% → "Optimal", < 40% → "Low"
```

---

### `ViewToggle`
```typescript
interface ViewToggleProps {
  options: [string, string];   // e.g. ["List View", "Kanban"]
  value: string;
  onChange: (value: string) => void;
}
```

---

### `StatusBadge` — Updated Color Mapping
| Status value | Display | Color |
|---|---|---|
| `ACTIVE` / `IN_PROGRESS` | In Progress / Active | Blue (`bg-blue-100 text-blue-700`) |
| `IN_REVIEW` | In Review | Amber (`bg-amber-100 text-amber-700`) |
| `TODO` / `PLANNED` | Pending / Planned | Gray (`bg-gray-100 text-gray-600`) |
| `DONE` / `COMPLETED` | Completed | Green (`bg-green-100 text-green-700`) |
| `ON_HOLD` | On Hold | Red (`bg-red-100 text-red-700`) |

---

### `PriorityBadge` — Updated Color Mapping
| Priority | Color |
|---|---|
| `HIGH` | Red (`text-red-600 font-semibold`) |
| `MEDIUM` | Amber (`text-amber-600 font-semibold`) |
| `LOW` | Green (`text-green-600 font-semibold`) |

---

### `TaskCompletionTrendChart`
- Uses `recharts` `LineChart` with `Line`, `XAxis`, `YAxis`, `Tooltip`, `CartesianGrid`
- X-axis: date labels (abbreviated, e.g. "Nov 1")
- Y-axis: task count
- Line color: `#3b82f6` (blue)
- Responsive via `ResponsiveContainer`

---

### `WorkloadDistributionChart`
- Uses `recharts` `BarChart` with `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ReferenceLine`
- One bar per team member, colored by workload: `>= 75%` → `#f97316`, `40-74%` → `#3b82f6`, `< 40%` → `#22c55e`
- Reference line at `y=75` (dashed, red)
- X-axis: member names

---

## Page Designs

### Manager Dashboard (`/manager`)

**Layout**: Two-column on desktop (`lg:grid-cols-[1fr_300px]`), single column on mobile.

**Left column (top to bottom)**:
1. `ManagerTopBar` (breadcrumb: Dashboard, search: "Search projects or tasks...")
2. Page title: "Overview"
3. Stats row: 4 `StatCard` components in `grid-cols-2 lg:grid-cols-4`
4. `AssignedProjectsSection` — project cards grid + "View All" link
5. `TaskCompletionTrendChart` — full width, "Last 30 Days" label

**Right column**:
1. `QuickActionsPanel` — Create Task, Update Status, Message Team
2. `TeamWorkloadSection` — up to 5 members with `WorkloadBar`
3. `RecentActivityFeed` — 10 entries with avatar + text + relative time

**Data fetching**: `useManagerDashboard` hook fetches all data in parallel via `Promise.all`.

---

### Manager Projects (`/manager/projects`)

**Layout**: Full width.

**Structure**:
1. `ManagerTopBar` (breadcrumb: Projects, search: "Search projects...")
2. Page title: "My Projects"
3. Controls row: `ViewToggle` (List View / Kanban) | `Filter` button | `Sort` button | `+ New Project` button
4. **List View**: `ProjectsTable` with columns: PROJECT NAME, STATUS, HEALTH/PROGRESS, TEAM, ACTIONS
5. **Kanban View**: `ProjectKanbanBoard` — columns per status (Active, In Review, Planned, On Hold)

**ProjectsTable row**: project icon + name + client/type label | `StatusBadge` | milestone label + `ProgressBar` + % | up to 4 avatars + overflow count | `...` action menu (Edit, View Details, Archive)

**Data**: `GET /api/manager/my-projects` — frontend computes `progressPercent` from task counts if not returned by backend, or backend extends `ProjectResponse` with `status`, `progressPercent`, `teamMembers`.

---

### Manager Tasks (`/manager/tasks`)

**Layout**: Full width.

**Structure**:
1. `ManagerTopBar` (breadcrumb: Tasks, search: "Search tasks...")
2. Page title: "Active Tasks"
3. Controls row: `ViewToggle` (List View / Board) | `Filter` button | `Sort` button | `+ Add Task` button
4. **List View**: `TasksTable` with columns: TASK NAME, PROJECT, STATUS, PRIORITY, ASSIGNEE, DUE DATE, ACTIONS
5. **Board View**: `TaskBoardView` — 3 columns: TODO, IN_PROGRESS, DONE

**TasksTable row**: checkbox + task name | project name | `StatusBadge` | `PriorityBadge` | assignee avatar + name | due date | `...` action menu (View Details, Edit, Delete)

**Data**: `GET /api/manager/tasks?page=0&size=10` with filter params.

---

### Manager Team (`/manager/team`)

**Layout**: Full width.

**Structure**:
1. `ManagerTopBar` (breadcrumb: Team, search: "Search members...")
2. Page title: "Team Roster"
3. Stats row: 4 `StatCard` components (Total Members, Avg Workload, Tasks Completed, Overloaded Members)
4. `TeamRosterTable`:
   - Tabs: All Members | Design | Engineering
   - Controls: `Filter` button | `+ Assign Task` button
   - Columns: MEMBER (avatar + name + email) | ROLE | ACTIVE PROJECTS (tags) | WORKLOAD (`WorkloadBar`) | ACTIONS (Assign button)
5. `WorkloadDistributionChart` — full width bar chart

**Data**: `GET /api/manager/employees` (extended) + `GET /api/manager/team/stats`

---

## Sidebar Update

**Manager nav items** (replace current messy list):
```typescript
const managerNav: NavItem[] = [
  { label: "Manager Dashboard", href: "/manager", icon: <Grid2x2 /> },
  { label: "Manager Projects", href: "/manager/projects", icon: <FolderKanban /> },
  { label: "Manager Tasks", href: "/manager/tasks", icon: <ClipboardList />, badgeKey: "taskCount" },
  { label: "Manager Team", href: "/manager/team", icon: <Users /> },
];
```

**Task badge**: Fetched from `GET /api/manager/tasks?status=TODO&status=IN_PROGRESS&size=1` — use `totalElements`. Display `99+` if > 99.

---

## `managerDashboardService.ts`

```typescript
export const managerDashboardService = {
  getStats: () => api.get('/api/manager/dashboard/stats'),
  getActivity: (limit = 10) => api.get('/api/manager/dashboard/activity', { params: { limit } }),
  getCompletionTrend: (days = 30) => api.get('/api/manager/tasks/completion-trend', { params: { days } }),
  getTeamStats: () => api.get('/api/manager/team/stats'),
};
```

---

## `useManagerDashboard.ts` Hook

```typescript
export function useManagerDashboard() {
  const [stats, setStats] = useState<ManagerDashboardStats | null>(null);
  const [activity, setActivity] = useState<ManagerActivityEntry[]>([]);
  const [trend, setTrend] = useState<TaskCompletionTrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, activityRes, trendRes] = await Promise.all([
        managerDashboardService.getStats(),
        managerDashboardService.getActivity(),
        managerDashboardService.getCompletionTrend(),
      ]);
      setStats(statsRes.data.data);
      setActivity(activityRes.data.data);
      setTrend(trendRes.data.data);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { stats, activity, trend, isLoading, error, refetch: fetchAll };
}
```

---

## Error Handling & Loading States

- All pages show skeleton loaders (`TableSkeleton`, `CardSkeleton`) while data is loading
- On fetch failure, stat cards show `0` or last known value (no crash)
- Empty states shown when lists are empty (e.g. "No projects assigned", "No recent activity")
- All API calls wrapped in try/catch; errors logged, user shown non-blocking fallback

---

## Responsive Layout

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Sidebar collapses to hamburger; TopBar breadcrumb hidden; stat cards 2-col |
| `768px–1023px` | Sidebar visible; stat cards 2-col; tables horizontally scrollable |
| `>= 1024px` | Full layout; stat cards 4-col; dashboard two-column |

Tables on Projects, Tasks, Team pages use `overflow-x-auto` wrapper on `< 900px`.

---

## Correctness Properties

1. **Stat card values are non-negative integers** — all count values must be `>= 0`; null/undefined API responses default to `0`
2. **Progress bar is clamped 0–100** — `progressPercent = Math.min(100, Math.max(0, value))`
3. **Workload label is deterministic** — given the same `workloadPercent`, `WorkloadBar` always returns the same label and color
4. **Status badge color is deterministic** — given the same status string, `StatusBadge` always returns the same Tailwind classes
5. **Priority badge color is deterministic** — given the same priority string, `PriorityBadge` always returns the same Tailwind classes
6. **Task badge shows 99+ when count > 99** — sidebar badge displays `"99+"` for any count > 99
7. **Trend chart fills missing days with 0** — all 30 days are always present in the chart data array
8. **Department tab filter is exclusive** — selecting "Design" shows only members with `department === "Design"`
9. **Workload distribution chart reference line at 75** — `ReferenceLine y={75}` is always rendered
10. **Manager tasks are scoped to manager's projects** — `/api/manager/tasks` only returns tasks where `project.managerId === currentUser.id`
