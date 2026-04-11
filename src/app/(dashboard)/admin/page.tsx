"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Download,
  FolderPlus,
  Search,
  Settings2,
  TriangleAlert,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { AppTopBar } from "@/components/common/AppTopBar";
import { dashboardService } from "@/services/dashboardService";
import { ActionButton, Panel } from "@/components/common/NexusUI";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { downloadTextFile } from "@/lib/download";
import type { AdminDashboardActivity, AdminDashboardStats } from "@/types/dashboard";
import { formatDate } from "@/lib/utils";

const fallbackStats: AdminDashboardStats = {
  totalProjects: 9,
  openTasks: 14,
  doneTasks: 3,
  activeUsers: 10,
  totalManagers: 2,
  totalEmployees: 7,
};

const fallbackActivity: AdminDashboardActivity[] = [
  {
    id: 1,
    userName: "Sarah Jenkins",
    userPhoto: null,
    action: "created a new project",
    entityType: "PROJECT",
    entityId: 41,
    entityName: "Q4 Marketing Campaign",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    userName: "Task Bot",
    userPhoto: null,
    action: "flagged task as overdue",
    entityType: "TASK",
    entityId: 13,
    entityName: "Database Migration",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    userName: "Mike Ross",
    userPhoto: null,
    action: "completed 3 tasks in",
    entityType: "PROJECT",
    entityId: 12,
    entityName: "Frontend Revamp",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    userName: "Jessica Alba",
    userPhoto: null,
    action: "added a new user to",
    entityType: "USER",
    entityId: 5,
    entityName: "the system",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const trendData = [
  { day: "Mon", completed: 12, overdue: 5 },
  { day: "Tue", completed: 19, overdue: 3 },
  { day: "Wed", completed: 15, overdue: 7 },
  { day: "Thu", completed: 25, overdue: 2 },
  { day: "Fri", completed: 21, overdue: 4 },
  { day: "Sat", completed: 10, overdue: 1 },
  { day: "Sun", completed: 14, overdue: 1 },
];

const buildPolylinePoints = (values: number[], maxValue: number) => values
  .map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 100 - (value / maxValue) * 100;
    return `${x},${y}`;
  })
  .join(" ");

const buildAreaPath = (values: number[], maxValue: number) => {
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 100 - (value / maxValue) * 100;
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });

  return `${points.join(" ")} L 100 100 L 0 100 Z`;
};

const formatRelativeTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatDate(value);

  const diffInMinutes = Math.round((date.getTime() - Date.now()) / (1000 * 60));
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffInMinutes) < 60) return rtf.format(diffInMinutes, "minute");

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) return rtf.format(diffInHours, "hour");

  const diffInDays = Math.round(diffInHours / 24);
  return rtf.format(diffInDays, "day");
};

const prettifyAction = (value: string) => value
  .replace(/_/g, " ")
  .replace(/\b\w/g, (char) => char.toUpperCase());

const getActivityAccent = (item: AdminDashboardActivity) => {
  const action = item.action.toLowerCase();
  const entityType = item.entityType.toUpperCase();

  if (action.includes("overdue") || action.includes("risk")) {
    return { tone: "bg-[#fff4e8] text-[#f97316]", icon: TriangleAlert };
  }

  if (entityType === "USER") {
    return { tone: "bg-[#f5f1ff] text-[#7c3aed]", icon: UserPlus };
  }

  if (entityType === "PROJECT") {
    return { tone: "bg-[#eef4ff] text-[#1557d6]", icon: BriefcaseBusiness };
  }

  return { tone: "bg-[#eef9f1] text-[#16a34a]", icon: CheckCircle2 };
};

const getActivityMessage = (item: AdminDashboardActivity): string => {
  const action = item.action?.trim() ?? "";
  const entity = item.entityName ?? "";
  const project = item.projectName ?? "";
  const type = item.entityType?.toUpperCase() ?? "";

  // Task activities — show task name + project
  if (type === "TASK") {
    if (action.startsWith("created task")) {
      return project ? `Created task "${entity}" in ${project}` : `Created task "${entity}"`;
    }
    if (action.startsWith("updated task status to")) {
      const status = action.replace("updated task status to", "").trim();
      return project
        ? `Marked "${entity}" as ${status} in ${project}`
        : `Marked "${entity}" as ${status}`;
    }
    if (action.startsWith("deleted task")) {
      return project ? `Deleted task "${entity}" from ${project}` : `Deleted task "${entity}"`;
    }
  }

  // Project activities
  if (type === "PROJECT") {
    if (action.startsWith("created project")) return `Created project "${entity}"`;
    if (action.startsWith("updated project")) return `Updated project "${entity}"`;
    if (action.startsWith("deleted project")) return `Deleted project "${entity}"`;
  }

  // Fallback — capitalize and append entity/project
  const base = action.charAt(0).toUpperCase() + action.slice(1);
  const suffix = entity ? ` "${entity}"` : "";
  const projectSuffix = project && type === "TASK" ? ` in ${project}` : "";
  return `${base}${suffix}${projectSuffix}`.trim();
};

export default function AdminDashboard() {
  const { name, profilePhoto } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats>(fallbackStats);
  const [activities, setActivities] = useState<AdminDashboardActivity[]>(fallbackActivity);
  const [isLoading, setIsLoading] = useState(true);
  const firstName = (name ?? "Admin").split(" ")[0];

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [statsRes, activityRes] = await Promise.all([
          dashboardService.getAdminStats(),
          dashboardService.getAdminActivity(10),
        ]);
        setStats(statsRes.data);
        setActivities(activityRes.data);
      } catch {
        setStats(fallbackStats);
        setActivities(fallbackActivity);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const completedValues = trendData.map((item) => item.completed);
  const overdueValues = trendData.map((item) => item.overdue);
  const chartMax = Math.max(...completedValues, ...overdueValues) + 5;

  return (
    <div className="min-h-full bg-[#f7fbff] dark:bg-[#0f172a]">
      <AppTopBar title="Dashboard" searchPlaceholder="Search anything..." />

      <div className="space-y-5 px-5 py-5 lg:px-7 lg:py-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[14px] font-medium text-[#607089] dark:text-[#94a3b8]">Welcome back, {firstName}</p>
          </div>

          <ActionButton
            icon={Download}
            className="px-4 py-2.5 text-[13px]"
            onClick={() => downloadTextFile(
              "admin-dashboard-summary.txt",
              [
                `Total Projects: ${stats.totalProjects}`,
                `Open Tasks: ${stats.openTasks}`,
                `Done Tasks: ${stats.doneTasks}`,
                `Active Users: ${stats.activeUsers}`,
                `Managers: ${stats.totalManagers}`,
                `Employees: ${stats.totalEmployees}`,
                "",
                "Recent Activity:",
                ...activities.map((item) => `- ${item.userName}: ${getActivityMessage(item)} (${formatRelativeTime(item.createdAt)})`),
              ].join("\n")
            )}
          >
            Export Snapshot
          </ActionButton>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_300px]">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                label: "Total Projects",
                value: stats.totalProjects,
                note: `${stats.totalManagers} managers leading delivery`,
                icon: BriefcaseBusiness,
                tone: "bg-[#eef4ff] text-[#1557d6]",
              },
              {
                label: "Open Tasks",
                value: stats.openTasks,
                note: `${stats.doneTasks} tasks completed`,
                icon: ClipboardList,
                tone: "bg-[#fff3e8] text-[#f97316]",
              },
              {
                label: "Active Users",
                value: stats.activeUsers,
                note: `${stats.totalEmployees} employees online`,
                icon: UsersRound,
                tone: "bg-[#f5f1ff] text-[#7c3aed]",
              },
            ].map((card) => (
              <Panel key={card.label} className="p-4">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-9 w-9 rounded-[12px] bg-[#edf2f7]" />
                    <div className="h-3.5 w-24 rounded-full bg-[#edf2f7]" />
                    <div className="h-7 w-16 rounded-full bg-[#edf2f7]" />
                    <div className="h-3.5 w-28 rounded-full bg-[#edf2f7]" />
                  </div>
                ) : (() => {
                  const Icon = card.icon;
                  return (
                    <>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-[12px] ${card.tone}`}>
                        <Icon className="h-[18px] w-[18px]" />
                      </div>
                      <div className="mt-4 text-[12px] font-medium text-[#607089] dark:text-[#94a3b8]">{card.label}</div>
                      <div className="mt-1.5 text-[28px] font-bold tracking-[-0.05em] text-[#1f2937] dark:text-[#f1f5f9]">{card.value}</div>
                      <div className="mt-1.5 text-[12px] text-[#6b7280] dark:text-[#64748b]">{card.note}</div>
                    </>
                  );
                })()}
              </Panel>
            ))}
          </div>

          <Panel className="p-4">
            <div className="text-[14px] font-semibold text-[#1f2937] dark:text-[#f1f5f9]">Quick Actions</div>
            <div className="mt-3 space-y-2.5">
              {[
                { label: "Create Project", href: "/admin/projects", icon: FolderPlus, tone: "bg-[#eef4ff] text-[#1557d6]" },
                { label: "Assign Task",    href: "/admin/tasks",    icon: ClipboardList, tone: "bg-[#fff3e8] text-[#f97316]" },
                { label: "Add User",       href: "/admin/users",    icon: UserPlus,      tone: "bg-[#f5f1ff] text-[#7c3aed]" },
              ].map((item) => (
                (() => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between rounded-[16px] border border-[#edf2f7] bg-[#fbfdff] px-3.5 py-3 transition-colors hover:border-[#dbe7fb] hover:bg-white dark:border-[#334155] dark:bg-[#1e293b] dark:hover:border-blue-700 dark:hover:bg-[#1e3a5f]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${item.tone}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[13px] font-medium text-[#334155] dark:text-[#cbd5e1]">{item.label}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#94a3b8]" />
                    </Link>
                  );
                })()
              ))}
            </div>

            <div className="mt-4 rounded-[16px] bg-[#f7faff] dark:bg-[#0f172a] px-3.5 py-3.5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b7280] dark:text-[#64748b]">Workforce Split</div>
              <div className="mt-2.5 flex items-center justify-between text-[13px] text-[#475467] dark:text-[#94a3b8]">
                <span>Managers</span>
                <span className="font-semibold text-[#111827] dark:text-[#f1f5f9]">{stats.totalManagers}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[13px] text-[#475467] dark:text-[#94a3b8]">
                <span>Employees</span>
                <span className="font-semibold text-[#111827] dark:text-[#f1f5f9]">{stats.totalEmployees}</span>
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_300px]">
          <Panel className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[#1f2937] dark:text-[#f1f5f9]">Task Completion Trends</h3>
                <p className="mt-1 text-[12px] text-[#667085] dark:text-[#94a3b8]">Last 7 days performance</p>
              </div>
              <div className="flex items-center gap-4 text-[12px] font-medium text-[#667085] dark:text-[#94a3b8]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
                  Completed
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                  Overdue
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-[18px] bg-[#fbfdff] dark:bg-[#0f172a] p-3.5">
              <div className="h-[220px] w-full">
                <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" preserveAspectRatio="none">
                  {[20, 40, 60, 80].map((line) => (
                    <line key={line} x1="0" y1={line} x2="100" y2={line} stroke="#334155" strokeWidth="0.6" />
                  ))}
                  <path d={buildAreaPath(completedValues, chartMax)} fill="rgba(37,99,235,0.10)" />
                  <polyline fill="none" stroke="#2563eb" strokeWidth="1.1" points={buildPolylinePoints(completedValues, chartMax)} vectorEffect="non-scaling-stroke" />
                  <polyline fill="none" stroke="#f97316" strokeWidth="0.9" points={buildPolylinePoints(overdueValues, chartMax)} vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              <div className="mt-3 grid grid-cols-7 text-center text-[12px] font-medium text-[#7b8794] dark:text-[#64748b]">
                {trendData.map((item) => (
                  <span key={item.day}>{item.day}</span>
                ))}
              </div>
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[16px] font-semibold text-[#1f2937] dark:text-[#f1f5f9]">System Activity</h3>
              <Link href="/admin/tasks" className="text-[12px] font-semibold text-[#1557d6] hover:underline">
                View All
              </Link>
            </div>

            <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-[16px] border border-[#edf2f7] bg-[#fbfdff] p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#edf2f7]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-32 rounded-full bg-[#edf2f7]" />
                        <div className="h-3.5 w-full rounded-full bg-[#edf2f7]" />
                        <div className="h-3 w-20 rounded-full bg-[#edf2f7]" />
                      </div>
                    </div>
                  </div>
                ))
              ) : activities.length ? (
                activities.map((item) => {
                  const accent = getActivityAccent(item);
                  const AccentIcon = accent.icon;

                  return (
                    <div key={item.id} className="rounded-[16px] border border-[#edf2f7] bg-[#fbfdff] dark:border-[#334155] dark:bg-[#0f172a] p-3.5">
                      <div className="flex items-start gap-3">
                        <UserAvatar name={item.userName} src={item.userPhoto} className="h-9 w-9 ring-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-[13px] font-semibold text-[#1f2937] dark:text-[#f1f5f9]">{item.userName}</div>
                            <div className={`flex h-[26px] w-[26px] items-center justify-center rounded-full ${accent.tone}`}>
                              <AccentIcon className="h-3.5 w-3.5" />
                            </div>
                          </div>
                          <p className="mt-1 text-[12px] leading-5 text-[#556274] dark:text-[#94a3b8]">{getActivityMessage(item)}</p>
                          <div className="mt-2 text-[12px] text-[#7b8794] dark:text-[#64748b]">{formatRelativeTime(item.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[16px] border border-dashed border-[#d7e4f7] px-4 py-8 text-[13px] text-[#667085]">
                  No recent system activity found.
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
          <Panel className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[#1f2937] dark:text-[#f1f5f9]">Team Distribution</h3>
                <p className="mt-1 text-[12px] text-[#667085] dark:text-[#94a3b8]">Live composition of your active workspace</p>
              </div>
              <span className="rounded-full bg-[#ecfdf3] dark:bg-[#052e16] px-3 py-1 text-[12px] font-semibold text-[#15803d] dark:text-[#4ade80]">
                {stats.activeUsers} active
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Managers", value: stats.totalManagers, tone: "bg-[#eef4ff] text-[#1557d6]" },
                { label: "Employees", value: stats.totalEmployees, tone: "bg-[#f5f1ff] text-[#7c3aed]" },
                { label: "Done Tasks", value: stats.doneTasks, tone: "bg-[#eef9f1] text-[#16a34a]" },
              ].map((item) => (
                <div key={item.label} className="rounded-[16px] bg-[#fbfdff] dark:bg-[#0f172a] p-3.5">
                  <div className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${item.tone}`}>{item.label}</div>
                  <div className="mt-3 text-[26px] font-bold tracking-[-0.05em] text-[#1f2937] dark:text-[#f1f5f9]">{item.value}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="bg-[linear-gradient(135deg,#ffffff_0%,#eef5ff_100%)] dark:bg-none dark:bg-[#1e293b] p-4">
            <div className="flex items-center gap-4">
              <UserAvatar name={name} src={profilePhoto} className="h-12 w-12 ring-0" />
              <div>
                <div className="text-[15px] font-semibold text-[#1f2937] dark:text-[#f1f5f9]">{name ?? "System Admin"}</div>
                <div className="text-[12px] text-[#667085] dark:text-[#94a3b8]">Open your profile details and workspace access.</div>
              </div>
            </div>
            <div className="mt-4 rounded-[16px] bg-white/80 dark:bg-[#0f172a] px-3.5 py-3.5">
              <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#6b7280] dark:text-[#64748b]">Profile</div>
              <div className="mt-2.5 text-[12px] leading-6 text-[#556274] dark:text-[#94a3b8]">
                Review account role, status, email, member date, and update your profile photo from one place.
              </div>
            </div>

            <ActionButton href="/admin/account" variant="primary" className="mt-4 w-full justify-between px-4 py-2.5 text-[13px]">
              Open Profile Details
              <ArrowRight className="h-4 w-4" />
            </ActionButton>
          </Panel>
        </div>
      </div>
    </div>
  );
}
