# Design Document: Dashboard Welcome & Export Snapshot

## Overview

This feature adds a personalized "Welcome back, [firstname]" greeting and an "Export Snapshot" button to the Manager and Employee dashboards, matching the existing Admin dashboard pattern. The implementation is a minimal UI addition — no new services, APIs, or data models are required. Both pieces of data (user name and dashboard stats) are already available in each dashboard component.

## Architecture

The change is purely at the component/page level. No new hooks, services, or backend endpoints are needed.

```
useAuth() ──► firstName extraction ──► greeting <p>
                                                    ├── wrapped in flex container
stats (existing) ──► downloadTextFile() ──► ActionButton
```

The pattern mirrors the Admin dashboard exactly:
1. Call `useAuth()` to get `name`
2. Derive `firstName` with `(name ?? "Fallback").split(" ")[0]`
3. Render a flex row containing the greeting `<p>` and an `<ActionButton>` with `Download` icon
4. Place this row as the first child inside the existing `p-6 space-y-*` container

## Components and Interfaces

### Existing components used (no changes needed)

- `ActionButton` from `@/components/common/NexusUI` — accepts `icon`, `className`, `onClick`, `children`
- `AppTopBar` from `@/components/common/AppTopBar` — unchanged
- `useAuth` from `@/hooks/useAuth` — provides `{ name, profilePhoto, role }`
- `downloadTextFile` from `@/lib/download` — signature: `downloadTextFile(filename: string, content: string): void`

### Pages modified

**`/manager/page.tsx`**
- Add imports: `useAuth`, `downloadTextFile`, `ActionButton`, `Download`
- Add `const { name } = useAuth()` and `const firstName = (name ?? "Manager").split(" ")[0]`
- Insert greeting+export row as first child of `<div className="p-6 space-y-6">`

**`/employee/page.tsx`**
- Add imports: `useAuth`, `downloadTextFile`, `ActionButton`, `Download`
- Add `const { name } = useAuth()` and `const firstName = (name ?? "Employee").split(" ")[0]`
- Insert greeting+export row as first child of `<div className="p-6 space-y-5">`

## Data Models

No new data models. The export content is built inline from existing state:

**Manager export (`manager-dashboard-summary.txt`)**
```
Active Projects: {stats.activeProjects}
Pending Tasks: {stats.pendingTasks}
Completed This Week: {stats.completedThisWeek}
Team Members: {stats.teamMembers}
```

**Employee export (`employee-dashboard-summary.txt`)**
```
Total Tasks: {stats.total}
In Progress: {stats.inProgress}
Completed: {stats.done}
On Discuss: {stats.todo}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: First-name extraction from full name

*For any* non-empty full name string, the greeting displayed on the Manager or Employee dashboard SHALL show "Welcome back, " followed by exactly the first space-delimited token of that name.

**Validates: Requirements 1.2, 3.2**

### Property 2: Manager export content completeness

*For any* manager stats object (with `activeProjects`, `pendingTasks`, `completedThisWeek`, `teamMembers`), the content string passed to `downloadTextFile` SHALL contain a line for each of the four stats, labeled exactly as specified, with the correct numeric value.

**Validates: Requirements 2.3**

### Property 3: Employee export content completeness

*For any* employee stats object (with `total`, `inProgress`, `done`, `todo`), the content string passed to `downloadTextFile` SHALL contain a line for each of the four stats, labeled exactly as specified, with the correct numeric value.

**Validates: Requirements 4.3**

## Error Handling

- If `useAuth()` returns `null` or `undefined` for `name`, the fallback `"Manager"` / `"Employee"` is used via the nullish coalescing operator. No error state needed.
- If stats are still loading (`isLoading === true`), the export button remains visible and functional. Stats will be `0` or `undefined` — the `?? 0` guards already present in the manager page handle this. The employee page uses local state initialized to `0`.
- `downloadTextFile` is a synchronous browser utility (creates a blob URL and clicks it); no async error handling is needed.

## Testing Strategy

### Unit / Example-based tests

These cover specific behaviors and structural requirements:

- Render with `name = null` → greeting shows fallback ("Welcome back, Manager" / "Welcome back, Employee")
- Render with `name = "Jane Doe"` → greeting shows "Welcome back, Jane"
- Export button is present with `Download` icon and correct `className`
- Clicking export button calls `downloadTextFile` with the correct filename
- Greeting+export container has className `flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between`
- Greeting+export row appears before the stats grid in the DOM

### Property-based tests

Using a PBT library (e.g., `fast-check` for TypeScript/Jest):

**Property 1 — First-name extraction** (min 100 iterations)
- Generator: random non-empty strings, optionally containing spaces
- Assertion: rendered greeting text equals `"Welcome back, " + input.split(" ")[0]`
- Tag: `Feature: dashboard-welcome-export, Property 1: first-name extraction from full name`

**Property 2 — Manager export content** (min 100 iterations)
- Generator: random objects `{ activeProjects: number, pendingTasks: number, completedThisWeek: number, teamMembers: number }`
- Assertion: generated content string contains all four labeled lines with correct values
- Tag: `Feature: dashboard-welcome-export, Property 2: manager export content completeness`

**Property 3 — Employee export content** (min 100 iterations)
- Generator: random objects `{ total: number, inProgress: number, done: number, todo: number }`
- Assertion: generated content string contains all four labeled lines with correct values
- Tag: `Feature: dashboard-welcome-export, Property 3: employee export content completeness`

Note: Properties 2 and 3 test the content-building logic, which is a pure inline expression. To make these testable in isolation, extract the content-building logic into a small pure function (e.g., `buildManagerExportContent(stats)` and `buildEmployeeExportContent(stats)`) that can be unit/property tested without rendering the full component.
