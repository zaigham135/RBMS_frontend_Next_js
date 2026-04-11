"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, ExternalLink } from "lucide-react";
import { AppTopBar } from "@/components/common/AppTopBar";
import { AddEventModal } from "@/components/employee/AddEventModal";
import { EventDetailsModal } from "@/components/employee/EventDetailsModal";
import { UserAvatar } from "@/components/common/UserAvatar";
import { calendarService, userService2 } from "@/services/calendarService";
import type { CalendarEvent, TeammateInfo } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DAYS_HEADER = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const COLOR_MAP: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-700 border-blue-200",
  green:  "bg-green-100 text-green-700 border-green-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  amber:  "bg-amber-100 text-amber-700 border-amber-200",
  red:    "bg-red-100 text-red-700 border-red-200",
};
function colorClass(c: string) { return COLOR_MAP[c] ?? COLOR_MAP.blue; }

function fmtTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }); }
  catch { return iso; }
}
function toDateKey(iso: string) { return iso.slice(0, 10); }

export default function EmployeeCalendarPage() {
  const today = new Date();
  const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() });
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [teammates, setTeammates] = useState<TeammateInfo[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [addDefaultDate, setAddDefaultDate] = useState("");
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await calendarService.getMyEvents();
      setEvents(res.data ?? []);
    } catch { setEvents([]); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    loadEvents();
    userService2.getTeammates().then(r => setTeammates(r.data ?? [])).catch(() => {});
  }, [loadEvents]);

  const prev = () => setCurrent(c => c.month === 0 ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year });
  const next = () => setCurrent(c => c.month === 11 ? { month: 0, year: c.year + 1 } : { month: c.month + 1, year: c.year });

  const eventsForDay = (day: number) => {
    const key = `${current.year}-${String(current.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => toDateKey(e.startTime) === key);
  };

  const selectedEvents = eventsForDay(selectedDay);
  const isToday = (day: number) =>
    day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDelete = async (id: number) => {
    try {
      await calendarService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      toast.success("Event deleted");
    } catch { toast.error("Failed to delete event"); }
  };

  const isPastDay = (day: number) => {
    const d = new Date(current.year, current.month, day);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const openAddForDay = (day: number) => {
    if (isPastDay(day)) return; // block past dates
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setAddDefaultDate(dateStr);
    setAddOpen(true);
  };

  const connectGoogle = () => {
    toast.info("To enable Google Calendar sync, add your Google service account credentials in the backend settings.");
  };

  const attendeeUsers = teammates.map(t => ({ id: t.id, name: t.name, email: t.email }));

  return (
    <div className="min-h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      <AppTopBar title="Calendar" searchPlaceholder="Search events..." />

      <div className="p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

          {/* ── Calendar grid ─────────────────────────────────────────── */}
          <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#334155]">
              <h2 className="text-base font-bold text-gray-900 dark:text-[#f1f5f9]">{MONTHS[current.month]} {current.year}</h2>
              <div className="flex items-center gap-2">
                <button type="button" onClick={prev} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b] text-gray-500 dark:text-[#94a3b8]">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrent({ month: today.getMonth(), year: today.getFullYear() }); setSelectedDay(today.getDate()); }}
                  className="rounded-lg border border-gray-200 dark:border-[#334155] px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#1e293b]"
                >
                  Today
                </button>
                <button type="button" onClick={next} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1e293b] text-gray-500 dark:text-[#94a3b8]">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={connectGoogle}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-[#334155] px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#1e293b]"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Google Cal
                </button>
                <button
                  type="button"
                  onClick={() => { setAddDefaultDate(""); setAddOpen(true); }}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Event
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-[#334155]">
              {DAYS_HEADER.map(d => (
                <div key={d} className="py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#64748b]">
                  {d.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-50 dark:divide-[#334155]">
              {cells.map((day, i) => {
                const dayEvents = day ? eventsForDay(day) : [];
                const past = day ? isPastDay(day) : false;
                return (
                  <div
                    key={i}
                    onClick={() => day && setSelectedDay(day)}
                    onDoubleClick={() => day && !past && openAddForDay(day)}
                    title={day ? (past ? "Past date" : "Click to view, double-click to add event") : undefined}
                    className={cn(
                      "min-h-[90px] p-2 transition-colors",
                      day && !past ? "cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-950/20" : "",
                      day && past ? "cursor-default bg-gray-50/60 dark:bg-[#0f172a]/60" : "",
                      !day ? "bg-gray-50/50 dark:bg-[#0f172a]/50" : "",
                      day && selectedDay === day && "bg-blue-50/50 dark:bg-blue-950/30"
                    )}
                  >
                    {day && (
                      <>
                        <div className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium mb-1",
                          isToday(day) ? "bg-blue-600 text-white" :
                          past ? "text-gray-300 dark:text-[#475569]" : "text-gray-700 dark:text-[#f1f5f9]"
                        )}>
                          {day}
                        </div>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map(ev => (
                            <button
                              key={ev.id}
                              type="button"
                              onClick={e => { e.stopPropagation(); setDetailEvent(ev); }}
                              className={cn("w-full text-left rounded px-1.5 py-0.5 text-[10px] font-medium truncate border hover:opacity-80 transition-opacity", colorClass(ev.color))}
                            >
                              {ev.title}
                            </button>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] text-gray-400 pl-1">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right panel ───────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Selected day */}
            <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9]">
                  {MONTHS[current.month]} {selectedDay}, {current.year}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    isToday(selectedDay) ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                  )}>
                    {isToday(selectedDay) ? "Today" : DAYS_HEADER[new Date(current.year, current.month, selectedDay).getDay()]}
                  </span>
                  <button
                    type="button"
                    onClick={() => openAddForDay(selectedDay)}
                    disabled={isPastDay(selectedDay)}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-2 animate-pulse">
                  {[1,2].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-[#334155]" />)}
                </div>
              ) : selectedEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 dark:border-[#334155] p-6 text-center">
                  <p className="text-sm text-gray-400 dark:text-[#64748b]">No events scheduled.</p>
                  <button type="button" onClick={() => openAddForDay(selectedDay)} className="mt-2 text-xs text-blue-600 hover:underline">
                    + Add event
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map(ev => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setDetailEvent(ev)}
                      className={cn("w-full text-left rounded-xl border p-3 hover:opacity-90 transition-opacity", colorClass(ev.color))}
                    >
                      <div className="font-semibold text-sm">{ev.title}</div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs opacity-80">
                        <Clock className="h-3.5 w-3.5" />
                        {fmtTime(ev.startTime)} – {fmtTime(ev.endTime)}
                      </div>
                      {ev.location && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs opacity-80">
                          <MapPin className="h-3.5 w-3.5" />
                          {ev.location}
                        </div>
                      )}
                      {ev.attendees.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          {ev.attendees.slice(0, 3).map(a => (
                            <UserAvatar key={a.id} name={a.name} src={a.profilePhoto} className="h-5 w-5 ring-1 ring-white" />
                          ))}
                          {ev.attendees.length > 3 && <span className="text-[10px] opacity-70">+{ev.attendees.length - 3}</span>}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming events */}
            <div className="rounded-2xl border border-gray-100 bg-white dark:border-[#334155] dark:bg-[#1e293b] p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] mb-3">Upcoming Events</h3>
              {events.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-[#64748b]">No upcoming events.</p>
              ) : (
                <div className="space-y-3">
                  {[...events]
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .filter(e => new Date(e.startTime) >= new Date())
                    .slice(0, 5)
                    .map(ev => (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => setDetailEvent(ev)}
                        className="flex w-full items-start gap-3 text-left hover:bg-gray-50 dark:hover:bg-[#334155] rounded-lg p-1 -mx-1 transition-colors"
                      >
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold", colorClass(ev.color))}>
                          {new Date(ev.startTime).getDate()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-[#f1f5f9] truncate">{ev.title}</div>
                          <div className="text-xs text-gray-400 dark:text-[#64748b] mt-0.5">{fmtTime(ev.startTime)}</div>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        open={addOpen}
        onOpenChange={setAddOpen}
        defaultDate={addDefaultDate}
        onCreated={ev => setEvents(prev => [...prev, ev])}
        availableUsers={attendeeUsers}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={detailEvent}
        open={!!detailEvent}
        onOpenChange={o => !o && setDetailEvent(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}
