"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Clock, MapPin, User, ExternalLink, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

const COLOR_MAP: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-700 border-blue-200",
  green:  "bg-green-100 text-green-700 border-green-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  amber:  "bg-amber-100 text-amber-700 border-amber-200",
  red:    "bg-red-100 text-red-700 border-red-200",
};

function colorClass(color: string) {
  return COLOR_MAP[color] ?? COLOR_MAP.blue;
}

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  } catch { return iso; }
}

function buildGoogleCalLink(event: CalendarEvent) {
  const start = event.startTime.replace(/[-:]/g, "").replace("T", "T").slice(0, 15);
  const end = event.endTime.replace(/[-:]/g, "").replace("T", "T").slice(0, 15);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description ?? "")}&location=${encodeURIComponent(event.location ?? "")}`;
}

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: number) => void;
}

export function EventDetailsModal({ event, open, onOpenChange, onDelete }: EventDetailsModalProps) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md dark:bg-[#1e293b] dark:border-[#334155]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold pr-8 dark:text-[#f1f5f9]">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Color badge */}
          <div className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", colorClass(event.color))}>
            {event.color.charAt(0).toUpperCase() + event.color.slice(1)} event
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xs text-gray-400 dark:text-[#64748b] font-medium uppercase tracking-wide">Time</div>
              <div className="text-sm font-medium text-gray-900 dark:text-[#f1f5f9]">{fmt(event.startTime)}</div>
              <div className="text-xs text-gray-500 dark:text-[#94a3b8]">to {fmt(event.endTime)}</div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-[#64748b] font-medium uppercase tracking-wide">Location</div>
                <div className="text-sm font-medium text-gray-900 dark:text-[#f1f5f9]">{event.location}</div>
              </div>
            </div>
          )}

          {/* Meeting Link */}
          {event.meetingLink && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 dark:text-[#64748b] font-medium uppercase tracking-wide">Meeting Link</div>
                <a
                  href={event.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {event.meetingLink}
                </a>
              </div>
            </div>
          )}

          {/* Organizer */}
          {event.createdByName && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950">
                <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-[#64748b] font-medium uppercase tracking-wide">Organizer</div>
                <div className="text-sm font-medium text-gray-900 dark:text-[#f1f5f9]">{event.createdByName}</div>
                {event.createdByEmail && <div className="text-xs text-gray-400 dark:text-[#64748b]">{event.createdByEmail}</div>}
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="rounded-xl bg-gray-50 dark:bg-[#0f172a] p-3">
              <div className="text-xs text-gray-400 dark:text-[#64748b] font-medium uppercase tracking-wide mb-1">Description</div>
              <p className="text-sm text-gray-700 dark:text-[#94a3b8] leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Attendees */}
          {event.attendees.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 dark:text-[#64748b] font-medium uppercase tracking-wide mb-2">
                Attendees ({event.attendees.length})
              </div>
              <div className="space-y-2">
                {event.attendees.map(a => (
                  <div key={a.id} className="flex items-center gap-2.5">
                    <UserAvatar name={a.name} src={a.profilePhoto} className="h-7 w-7" />
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-[#f1f5f9]">{a.name}</div>
                      <div className="text-xs text-gray-400 dark:text-[#64748b]">{a.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-[#334155]">
            <a
              href={buildGoogleCalLink(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Add to Google Calendar
            </a>
            {onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(event.id); onOpenChange(false); }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                title="Delete event"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
