# Requirements Document

## Introduction

This feature adds a personalized "Welcome back, [firstname]" greeting and an "Export Snapshot" button to the Manager and Employee dashboards, matching the existing implementation in the Admin dashboard. The greeting uses the authenticated user's first name from the `useAuth` hook, and the export button downloads a plain-text summary of the dashboard's current stats.

## Glossary

- **Manager_Dashboard**: The dashboard page rendered at `/manager`, used by users with the Manager role.
- **Employee_Dashboard**: The dashboard page rendered at `/employee`, used by users with the Employee role.
- **Admin_Dashboard**: The existing reference dashboard at `/admin` that already implements the greeting and export.
- **Greeting**: A short personalized text line reading "Welcome back, [firstname]".
- **Export_Button**: An `ActionButton` labeled "Export Snapshot" that triggers a file download.
- **Snapshot_File**: A plain-text `.txt` file containing a summary of the dashboard's current stats.
- **Auth_Hook**: The `useAuth` hook from `@/hooks/useAuth`, which provides `name`, `profilePhoto`, and `role`.
- **Download_Utility**: The `downloadTextFile` function from `@/lib/download`, which creates and triggers a browser file download.

## Requirements

### Requirement 1: Manager Dashboard Greeting

**User Story:** As a Manager, I want to see a personalized greeting on my dashboard, so that the experience feels tailored to me.

#### Acceptance Criteria

1. THE Manager_Dashboard SHALL retrieve the authenticated user's full name via the Auth_Hook.
2. WHEN the authenticated user's name is available, THE Manager_Dashboard SHALL display "Welcome back, [firstname]" where `[firstname]` is the first word of the full name.
3. IF the authenticated user's name is not available, THEN THE Manager_Dashboard SHALL display "Welcome back, Manager" as the fallback greeting.
4. THE Manager_Dashboard SHALL render the greeting text with the same styling as the Admin_Dashboard: `text-[14px] font-medium text-[#607089]`.

### Requirement 2: Manager Dashboard Export Snapshot

**User Story:** As a Manager, I want to export a snapshot of my dashboard stats, so that I can share or archive the current state of my team's work.

#### Acceptance Criteria

1. THE Manager_Dashboard SHALL display an "Export Snapshot" button using the `ActionButton` component with the `Download` icon.
2. WHEN the Export Snapshot button is clicked, THE Manager_Dashboard SHALL invoke the Download_Utility with filename `manager-dashboard-summary.txt`.
3. THE Snapshot_File SHALL contain the following stats on separate lines: Active Projects, Pending Tasks, Completed This Week, and Team Members.
4. THE Manager_Dashboard SHALL place the greeting and the Export Snapshot button inside a flex row container matching the Admin_Dashboard layout: `flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between`.

### Requirement 3: Employee Dashboard Greeting

**User Story:** As an Employee, I want to see a personalized greeting on my dashboard, so that the experience feels tailored to me.

#### Acceptance Criteria

1. THE Employee_Dashboard SHALL retrieve the authenticated user's full name via the Auth_Hook.
2. WHEN the authenticated user's name is available, THE Employee_Dashboard SHALL display "Welcome back, [firstname]" where `[firstname]` is the first word of the full name.
3. IF the authenticated user's name is not available, THEN THE Employee_Dashboard SHALL display "Welcome back, Employee" as the fallback greeting.
4. THE Employee_Dashboard SHALL render the greeting text with the same styling as the Admin_Dashboard: `text-[14px] font-medium text-[#607089]`.

### Requirement 4: Employee Dashboard Export Snapshot

**User Story:** As an Employee, I want to export a snapshot of my dashboard stats, so that I can keep a record of my current task progress.

#### Acceptance Criteria

1. THE Employee_Dashboard SHALL display an "Export Snapshot" button using the `ActionButton` component with the `Download` icon.
2. WHEN the Export Snapshot button is clicked, THE Employee_Dashboard SHALL invoke the Download_Utility with filename `employee-dashboard-summary.txt`.
3. THE Snapshot_File SHALL contain the following stats on separate lines: Total Tasks, In Progress, Completed, and On Discuss (todo).
4. THE Employee_Dashboard SHALL place the greeting and the Export Snapshot button inside a flex row container matching the Admin_Dashboard layout: `flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between`.

### Requirement 5: Visual and Structural Consistency

**User Story:** As a product owner, I want the Manager and Employee dashboards to match the Admin dashboard's header pattern, so that the UI is consistent across all roles.

#### Acceptance Criteria

1. THE Manager_Dashboard SHALL use the same `ActionButton` props (`icon`, `className`, `onClick`) as the Admin_Dashboard Export Snapshot button.
2. THE Employee_Dashboard SHALL use the same `ActionButton` props (`icon`, `className`, `onClick`) as the Admin_Dashboard Export Snapshot button.
3. THE Manager_Dashboard greeting and export button SHALL appear directly below the `AppTopBar` and above the stats grid.
4. THE Employee_Dashboard greeting and export button SHALL appear directly below the `AppTopBar` and above the stats grid.
