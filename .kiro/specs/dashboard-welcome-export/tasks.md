# Implementation Plan: Dashboard Welcome & Export Snapshot

## Overview

Add a personalized greeting and export button to the Manager and Employee dashboards, mirroring the existing Admin dashboard pattern. Both pages already have the required hooks and utilities available.

## Tasks

- [x] 1. Update Manager Dashboard (`/manager/page.tsx`)
  - [x] 1.1 Add imports: `useAuth`, `downloadTextFile`, `ActionButton`, `Download`
    - Import `useAuth` from `@/hooks/useAuth`
    - Import `downloadTextFile` from `@/lib/download`
    - Import `ActionButton` from `@/components/common/NexusUI`
    - Import `Download` from `lucide-react`
    - _Requirements: 1.1, 2.1_

  - [x] 1.2 Derive `firstName` from auth hook
    - Add `const { name } = useAuth()`
    - Add `const firstName = (name ?? "Manager").split(" ")[0]`
    - _Requirements: 1.2, 1.3_

  - [x] 1.3 Insert greeting and export row as first child of content div
    - Render `<p>Welcome back, {firstName}</p>` with class `text-[14px] font-medium text-[#607089]`
    - Render `<ActionButton icon={Download} className="px-4 py-2.5 text-[13px]">Export Snapshot</ActionButton>`
    - Wrap both in `<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">`
    - Place row before the stats grid
    - _Requirements: 1.4, 2.1, 2.4, 5.1, 5.3_

  - [x] 1.4 Wire export button to `downloadTextFile`
    - On click: call `downloadTextFile("manager-dashboard-summary.txt", content)`
    - Content lines: `Active Projects`, `Pending Tasks`, `Completed This Week`, `Team Members`
    - Use `stats?.activeProjects ?? 0` guards for each value
    - _Requirements: 2.2, 2.3_

  - [x]* 1.5 Write property test for first-name extraction (Manager)
    - **Property 1: First-name extraction from full name**
    - **Validates: Requirements 1.2**

  - [x]* 1.6 Write property test for manager export content completeness
    - **Property 2: Manager export content completeness**
    - **Validates: Requirements 2.3**

- [x] 2. Update Employee Dashboard (`/employee/page.tsx`)
  - [x] 2.1 Add imports: `useAuth`, `downloadTextFile`, `ActionButton`, `Download`
    - Same imports as Manager page
    - _Requirements: 3.1, 4.1_

  - [x] 2.2 Derive `firstName` from auth hook
    - Add `const { name } = useAuth()`
    - Add `const firstName = (name ?? "Employee").split(" ")[0]`
    - _Requirements: 3.2, 3.3_

  - [x] 2.3 Insert greeting and export row as first child of content div
    - Same structure as Manager page with `"Employee"` fallback
    - Place row before the stats grid inside `<div className="p-6 space-y-5">`
    - _Requirements: 3.4, 4.1, 4.4, 5.2, 5.4_

  - [x] 2.4 Wire export button to `downloadTextFile`
    - On click: call `downloadTextFile("employee-dashboard-summary.txt", content)`
    - Content lines: `Total Tasks`, `In Progress`, `Completed`, `On Discuss`
    - Use `stats.total`, `stats.inProgress`, `stats.done`, `stats.todo`
    - _Requirements: 4.2, 4.3_

  - [x]* 2.5 Write property test for first-name extraction (Employee)
    - **Property 1: First-name extraction from full name**
    - **Validates: Requirements 3.2**

  - [x]* 2.6 Write property test for employee export content completeness
    - **Property 3: Employee export content completeness**
    - **Validates: Requirements 4.3**

- [x] 3. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All implementation tasks are complete — both pages have been updated
- Property tests (1.5, 1.6, 2.5, 2.6) are optional and use `fast-check` for PBT
- Extract `buildManagerExportContent(stats)` and `buildEmployeeExportContent(stats)` as pure functions if property tests are implemented
