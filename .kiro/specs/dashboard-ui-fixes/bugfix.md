# Bugfix Requirements Document

## Introduction

Two UI inconsistencies exist in the admin/manager dashboard area:

1. **Manager Dashboard - Quick Actions Card Missing Border in Dark Theme**: The manager dashboard's `QuickActionsPanel` component renders with `border-gray-100` which is invisible in dark mode. The admin dashboard's equivalent Quick Actions card uses the `Panel` component which correctly applies `dark:border-[#334155]`, giving it a visible border in dark theme. The manager panel should match this behavior.

2. **Admin Topbar - Missing Theme Icons on Other Pages**: The admin sub-pages (projects, tasks, users) each render a custom inline topbar that omits the theme toggle button (Sun/Moon icons). Only the admin dashboard page uses the shared `AppTopBar` component which includes the theme toggle. The sub-pages need the theme toggle to be consistent with the rest of the application.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user views the manager dashboard in dark theme THEN the Quick Actions card has no visible border, making it visually inconsistent with other cards on the page

1.2 WHEN a user navigates to the admin projects, tasks, or users pages THEN the topbar does not display a theme toggle icon (Sun/Moon), preventing the user from switching themes on those pages

### Expected Behavior (Correct)

2.1 WHEN a user views the manager dashboard in dark theme THEN the Quick Actions card SHALL display a visible border (matching `dark:border-[#334155]`) consistent with other dashboard cards

2.2 WHEN a user navigates to the admin projects, tasks, or users pages THEN the topbar SHALL display a theme toggle icon (Sun/Moon) that allows the user to switch between light and dark themes

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user views the manager dashboard in light theme THEN the Quick Actions card SHALL CONTINUE TO display its existing light-mode border and styling

3.2 WHEN a user views the admin dashboard main page THEN the topbar SHALL CONTINUE TO display the theme toggle icon as it currently does via `AppTopBar`

3.3 WHEN a user views the manager or employee dashboard pages THEN the topbar SHALL CONTINUE TO display the theme toggle icon as it currently does via `AppTopBar`

3.4 WHEN a user interacts with the Quick Actions buttons on the manager dashboard THEN the buttons SHALL CONTINUE TO function correctly (create task, update status, message team navigation)

3.5 WHEN a user interacts with the search, notification bell, and user profile elements in the admin sub-page topbars THEN those elements SHALL CONTINUE TO function as they currently do
