"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Plus, Clock, Video, CheckCircle2, Zap, Code2, Layout, ArrowRight, ChevronDown } from "lucide-react";
import { AppTopBar } from "@/components/common/AppTopBar";
import { ActionButton } from "@/components/common/NexusUI";
import { MiniCalendar } from "@/components/employee/MiniCalendar";
import { ProductivityChart } from "@/components/employee/ProductivityChart";
import { ProjectProgressChart } from "@/components/employee/ProjectProgressChart";
import { AddEventModal } from "@/components/employee/AddEventModal";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { taskService } from "@/services/taskService";
import { calendarService, userService2 } from "@/services/calendarService";
import { useAuth } from "@/hooks/useAuth";
import { downloadTextFile } from "@/lib/download";
import type { Task } from "@/types/task";
import type { CalendarEvent, TeammateInfo } from "@/types/calendar";

function TaskIcon({ title }: { title: string }) {
  const t = title.toLowerCase();
  if (t.includes("api") || t.includes("endpoint") || t.includes("backend"))
    return <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50"><Code2 className="h-4 w-4 text-blue-600" /></div>;
  if (t.includes("flow") || t.includes("onboard") || t.includes("ui") || t.includes("dashboard") || t.includes("build"))
    return <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50"><Layout className="h-4 w-4 text-green-600" /></div>;
  if (t.includes("optimize") || t.includes("performance") || t.includes("load"))
    return <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50"><Zap className="h-4 w-4 text-red-500" /></div>;
  return <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50"><CheckCircle2 className="h-4 w-4 text-purple-600" /></div>;
}

function fmtDate(d: string) {
  if (!d) return "";
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return d; }
}

export default function EmployeeDashboard() {
  const { name } = useAuth();
  const firstName = (name ?? "Employee").split(" ")[0];
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teammates, setTeammates] = useState<TeammateInfo[]>([]);
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [showAllTeam, setShowAllTeam] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [totalRes, todoRes, ipRes, doneRes, tasksRes] = await Promise.all([
          taskService.getTasks({ page: 0, size: 1 }),
          taskService.getTasks({ page: 0, size: 1, status: "TODO" }),
          taskService.getTasks({ page: 0, size: 1, status: "IN_PROGRESS" }),
          taskService.getTasks({ page: 0, size: 1, status: "DONE" }),
          taskService.getTasks({ page: 0, size: 5 }),
        ]);

        // All services return ApiResponse<T> directly (res.data from axios).
        // So r = ApiResponse, r.data = the actual payload.
        const getPaged = (r: any) => {
          // Backend PaginationResponse uses { data: T[], totalElements, totalPages, page, size }
          // axios wraps: res.data = ApiResponse, res.data.data = PaginationResponse
          const d = r?.data;
          if (d && typeof d.totalElements === "number") return d;
          // fallback: nested ApiResponse wrapper
          if (d?.data && typeof d.data.totalElements === "number") return d.data;
          return null;
        };

        const totalPag = getPaged(totalRes);
        const todoPag  = getPaged(todoRes);
        const ipPag    = getPaged(ipRes);
        const donePag  = getPaged(doneRes);
        const tasksPag = getPaged(tasksRes);

        setStats({
          total:      totalPag?.totalElements ?? 0,
          todo:       todoPag?.totalElements  ?? 0,
          inProgress: ipPag?.totalElements    ?? 0,
          done:       donePag?.totalElements  ?? 0,
        });
        // Backend field is "data" (not "content") — PaginationResponse<T>.data
        setTasks(tasksPag?.data ?? tasksPag?.content ?? []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setStats({ total: 0, todo: 0, inProgress: 0, done: 0 });
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
    // calendarService returns ApiResponse<CalendarEvent[]>, .data is the array
    calendarService.getMyEvents()
      .then(r => setCalEvents(Array.isArray(r?.data) ? r.data : []))
      .catch(() => {});
    // userService2 returns ApiResponse<TeammateInfo[]>, .data is the array
    userService2.getTeammates()
      .then(r => setTeammates(Array.isArray(r?.data) ? r.data : []))
      .catch(() => {});
  }, []);

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const calendarDots = [
    ...calEvents.map(e => ({
      date: new Date(e.startTime).getDate(),
      month: new Date(e.startTime).getMonth(),
      year: new Date(e.startTime).getFullYear(),
      title: e.title,
    })),
    ...tasks.map(t => ({
      date: new Date(t.dueDate).getDate(),
      month: new Date(t.dueDate).getMonth(),
      year: new Date(t.dueDate).getFullYear(),
      title: t.title,
    })),
  ];

  const nextEvent = [...calEvents]
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .find(e => new Date(e.startTime) >= new Date());

  // Fallback: most recent past event if no upcoming
  const reminderEvent = nextEvent ?? [...calEvents]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0] ?? null;

  const attendeeUsers = teammates.map(t => ({ id: t.id, name: t.name, email: t.email }));
  const visibleTeam = showAllTeam ? teammates : teammates.slice(0, 3);

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      <AppTopBar title="Dashboard" searchPlaceholder="Search task..." />

      <div className="p-6 space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[14px] font-medium text-[#607089] dark:text-[#94a3b8]">Welcome back, {firstName}</p>
          <ActionButton
            icon={Download}
            className="px-4 py-2.5 text-[13px]"
            onClick={() => downloadTextFile(
              "employee-dashboard-summary.txt",
              [
                `Total Tasks: ${stats.total}`,
                `In Progress: ${stats.inProgress}`,
                `Completed: ${stats.done}`,
                `On Discuss: ${stats.todo}`,
              ].join("\n")
            )}
          >
            Export Snapshot
          </ActionButton>
        </div>

        {/* ── Row 1: 4 stat cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Tasks",  value: stats.total,      trend: "+5 from last month", blue: true },
            { label: "In Progress",  value: stats.inProgress, trend: "+6 from last month", blue: false },
            { label: "Completed",    value: stats.done,       trend: "+2 from last month", blue: false },
            { label: "On Discuss",   value: stats.todo,       trend: "Pending review",     blue: false },
          ].map(card => (
            <div key={card.label} className={`rounded-2xl border p-5 shadow-sm ${card.blue ? "bg-blue-600 border-blue-500" : "bg-white border-gray-100 dark:bg-[#1e293b] dark:border-[#334155]"}`}>
              <div className={`text-3xl font-bold tracking-tight ${card.blue ? "text-white" : "text-gray-900 dark:text-[#f1f5f9]"}`}>
                {isLoading ? "—" : card.value}
              </div>
              <div className={`text-xs mt-1 font-medium ${card.blue ? "text-blue-100" : "text-gray-500 dark:text-[#64748b]"}`}>{card.label}</div>
              <div className={`text-[11px] mt-2 ${card.blue ? "text-blue-200" : "text-green-600 dark:text-green-400"}`}>↑ {card.trend}</div>
            </div>
          ))}
        </div>

        {/* ── Row 2: 3-column layout ─────────────────────────────────────── */}
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr_300px]">

          {/* ── Col 1: Productivity chart + Team Collaboration ─────────── */}
          <div className="space-y-5">
            <ProductivityChart />

            {/* Team Collaboration */}
            <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] mb-4">Team Collaboration</h3>
              {teammates.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-[#64748b] text-center py-4">No teammates on shared projects yet.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {visibleTeam.map(member => (
                      <div key={member.id} className="flex items-start gap-3 rounded-xl border border-gray-50 bg-gray-50/50 dark:border-[#334155] dark:bg-[#0f172a] p-3">
                        <UserAvatar name={member.name} src={member.profilePhoto} className="h-9 w-9 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] truncate">{member.name}</div>
                          {member.projectName && <div className="text-[10px] font-medium text-blue-500 truncate">{member.projectName}</div>}
                          {member.latestTaskTitle && <div className="text-xs text-gray-500 dark:text-[#94a3b8] truncate mt-0.5">Working on: {member.latestTaskTitle}</div>}
                          {member.latestTaskDueDate && (
                            <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 dark:text-[#64748b]">
                              <Clock className="h-3 w-3" />
                              Due: {fmtDate(member.latestTaskDueDate)}
                            </div>
                          )}
                        </div>
                        {member.latestTaskStatus && <div className="shrink-0 mt-0.5"><StatusBadge status={member.latestTaskStatus} /></div>}
                      </div>
                    ))}
                  </div>
                  {teammates.length > 3 && (
                    <button type="button" onClick={() => setShowAllTeam(v => !v)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-[#334155] py-2 text-xs font-medium text-gray-600 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllTeam ? "rotate-180" : ""}`} />
                      {showAllTeam ? "Show less" : `See ${teammates.length - 3} more teammates`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Col 2: Reminders + Project Progress ───────────────────── */}
          <div className="space-y-5">
            {/* Reminder */}
            <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">Reminders</h3>
                <button type="button" onClick={() => setAddEventOpen(true)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                {reminderEvent ? (
                  <>
                    <div className="text-base font-bold text-blue-700 leading-snug">{reminderEvent.title}</div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-blue-500">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(reminderEvent.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {" – "}
                      {new Date(reminderEvent.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </div>
                    {reminderEvent.location && (
                      <div className="text-xs text-blue-400 mt-1">{reminderEvent.location}</div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-base font-bold text-blue-700">No upcoming events</div>
                    <div className="text-xs text-blue-500 mt-1">Add an event to see it here</div>
                  </>
                )}
                <Link
                  href="/employee/calendar"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  <Video className="h-4 w-4" /> View Calendar
                </Link>
              </div>
            </div>

            <ProjectProgressChart completed={stats.done} total={stats.total} />
          </div>

          {/* ── Col 3: My Tasks (last 5) + Mini Calendar ──────────────── */}
          <div className="space-y-5">
            {/* My Tasks */}
            <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">My Tasks</h3>
                <Link href="/employee/tasks" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <Plus className="h-3.5 w-3.5" /> New
                </Link>
              </div>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-[#334155] shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-3/4 rounded bg-gray-100 dark:bg-[#334155]" />
                        <div className="h-2.5 w-1/2 rounded bg-gray-100 dark:bg-[#334155]" />
                      </div>
                    </div>
                  ))
                ) : tasks.length > 0 ? (
                  tasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3">
                      <TaskIcon title={task.title} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-[#f1f5f9] truncate">{task.title}</div>
                        <div className="text-xs text-gray-400 dark:text-[#64748b] mt-0.5">Due: {fmtDate(task.dueDate)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 dark:border-[#334155] p-4 text-center">
                    <p className="text-xs text-gray-400 dark:text-[#64748b]">No tasks assigned yet.</p>
                  </div>
                )}
              </div>
              <Link href="/employee/tasks" className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-gray-200 dark:border-[#334155] py-2 text-xs font-medium text-gray-600 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
                View all tasks <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <MiniCalendar events={calendarDots} />
          </div>
        </div>
      </div>

      <AddEventModal
        open={addEventOpen}
        onOpenChange={setAddEventOpen}
        onCreated={ev => setCalEvents(prev => [...prev, ev])}
        availableUsers={attendeeUsers}
      />
    </div>
  );
}
