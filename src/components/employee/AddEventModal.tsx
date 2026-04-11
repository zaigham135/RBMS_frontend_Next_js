"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { calendarService } from "@/services/calendarService";
import { DatePicker } from "@/components/common/DatePicker";
import type { CreateCalendarEventRequest, CalendarEvent } from "@/types/calendar";
import { toast } from "sonner";

const COLOR_OPTIONS = [
  { value: "blue",   label: "Blue",   cls: "bg-blue-500" },
  { value: "green",  label: "Green",  cls: "bg-green-500" },
  { value: "purple", label: "Purple", cls: "bg-purple-500" },
  { value: "amber",  label: "Amber",  cls: "bg-amber-500" },
  { value: "red",    label: "Red",    cls: "bg-red-500" },
];

interface AddEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string; // "YYYY-MM-DD"
  onCreated: (event: CalendarEvent) => void;
  availableUsers?: { id: number; name: string; email: string }[];
}

function todayStr() { return new Date().toISOString().slice(0, 10); }
function nowTimeStr() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function AddEventModal({ open, onOpenChange, defaultDate, onCreated, availableUsers = [] }: AddEventModalProps) {
  const getInitialForm = () => {
    const date = defaultDate ?? todayStr();
    const start = nowTimeStr();
    const [h, m] = start.split(":").map(Number);
    const endH = h + 1 > 23 ? 23 : h + 1;
    const end = `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    return { 
      title: "", 
      description: "", 
      date, 
      startHour: start, 
      endHour: end, 
      location: "", 
      meetingLink: "", 
      autoGenerateGoogleMeet: false,
      color: "blue", 
      attendeeIds: [] as number[] 
    };
  };

  const [form, setForm] = useState(getInitialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState("");

  // Reset form when modal opens with a new defaultDate
  useEffect(() => {
    if (open) setForm(getInitialForm());
  }, [open, defaultDate]);

  const validateDateTime = (date: string, time: string): boolean => {
    const selected = new Date(`${date}T${time}:00`);
    const now = new Date();
    if (selected <= now) {
      setDateError("Event cannot be scheduled in the past.");
      return false;
    }
    setDateError("");
    return true;
  };

  const toggleAttendee = (id: number) => {
    setForm(f => ({
      ...f,
      attendeeIds: f.attendeeIds.includes(id)
        ? f.attendeeIds.filter(a => a !== id)
        : [...f.attendeeIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!validateDateTime(form.date, form.startHour)) { return; }

    const startDt = `${form.date}T${form.startHour}:00`;
    const endDt = `${form.date}T${form.endHour}:00`;
    if (new Date(endDt) <= new Date(startDt)) {
      toast.error("End time must be after start time");
      return;
    }

    const payload: CreateCalendarEventRequest = {
      title: form.title,
      description: form.description || undefined,
      startTime: startDt,
      endTime: endDt,
      location: form.location || undefined,
      meetingLink: form.meetingLink || undefined,
      autoGenerateGoogleMeet: form.autoGenerateGoogleMeet,
      color: form.color,
      attendeeIds: form.attendeeIds,
    };

    setIsSubmitting(true);
    try {
      const res = await calendarService.createEvent(payload);
      if (res.data) {
        onCreated(res.data);
        toast.success("Event created! Email invitations sent to attendees.");
        onOpenChange(false);
      }
    } catch {
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = todayStr();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto dark:bg-[#1e293b] dark:border-[#334155]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold dark:text-[#f1f5f9]">Add New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="ev-title">Title *</Label>
            <Input
              id="ev-title"
              required
              placeholder="Event title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="ev-desc">Description</Label>
            <Textarea
              id="ev-desc"
              placeholder="Optional description"
              rows={2}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ev-date">Date *</Label>
              <DatePicker
                value={form.date}
                onChange={(v) => { setForm(f => ({ ...f, date: v })); setDateError(""); }}
                placeholder="Pick a date"
                minDate={minDate}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-start">Start *</Label>
              <Input
                id="ev-start"
                type="time"
                value={form.startHour}
                onChange={e => {
                  setForm(f => ({ ...f, startHour: e.target.value }));
                  setDateError("");
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-end">End *</Label>
              <Input
                id="ev-end"
                type="time"
                value={form.endHour}
                onChange={e => setForm(f => ({ ...f, endHour: e.target.value }))}
              />
            </div>
          </div>
          {dateError && (
            <p className="text-xs text-red-500 -mt-2">{dateError}</p>
          )}

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="ev-loc">Location</Label>
            <Input
              id="ev-loc"
              placeholder="e.g. Conference Room A"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            />
          </div>

          {/* Meeting Link */}
          <div className="space-y-1.5">
            <Label htmlFor="ev-meeting">Meeting Link</Label>
            <Input
              id="ev-meeting"
              type="url"
              placeholder="e.g. https://meet.google.com/abc-defg-hij or https://zoom.us/j/123456789"
              value={form.meetingLink}
              onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))}
              disabled={form.autoGenerateGoogleMeet}
            />
            <p className="text-xs text-gray-500 dark:text-[#64748b]">
              {form.autoGenerateGoogleMeet 
                ? "Google Meet link auto-generation requires Google Workspace" 
                : "Paste your Google Meet, Zoom, or Teams meeting link here"}
            </p>
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color: c.value }))}
                  className={`h-7 w-7 rounded-full ${c.cls} transition-all ${
                    form.color === c.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "opacity-60 hover:opacity-100"
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Attendees */}
          {availableUsers.length > 0 && (
            <div className="space-y-1.5">
              <Label>Invite Teammates</Label>
              <p className="text-xs text-gray-400 dark:text-[#64748b]">
                Selected users will receive an email with the meeting link directly.
              </p>
              <div className="max-h-36 overflow-y-auto space-y-1 rounded-lg border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0f172a] p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {availableUsers.map(u => (
                  <label key={u.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-[#1e293b] cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={form.attendeeIds.includes(u.id)}
                      onChange={() => toggleAttendee(u.id)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-[#475569] accent-blue-600 dark:accent-blue-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-[#f1f5f9]">{u.name}</div>
                      <div className="text-xs text-gray-400 dark:text-[#64748b]">{u.email}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Info note */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-3">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">📧 Email Invitations</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Invited teammates will receive an email with the meeting link prominently displayed at the top, plus a link to add this event to their Google Calendar.
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !form.title}>
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
