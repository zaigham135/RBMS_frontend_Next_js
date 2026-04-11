import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { CalendarEvent, CreateCalendarEventRequest, TeammateInfo } from "@/types/calendar";

export const calendarService = {
  getMyEvents: async (): Promise<ApiResponse<CalendarEvent[]>> => {
    const res = await api.get("/api/calendar/events");
    return res.data;
  },

  getEventsInRange: async (from: string, to: string): Promise<ApiResponse<CalendarEvent[]>> => {
    const res = await api.get("/api/calendar/events/range", { params: { from, to } });
    return res.data;
  },

  createEvent: async (data: CreateCalendarEventRequest): Promise<ApiResponse<CalendarEvent>> => {
    const res = await api.post("/api/calendar/events", data);
    return res.data;
  },

  deleteEvent: async (id: number): Promise<ApiResponse<null>> => {
    const res = await api.delete(`/api/calendar/events/${id}`);
    return res.data;
  },
};

export const userService2 = {
  getTeammates: async (): Promise<ApiResponse<TeammateInfo[]>> => {
    const res = await api.get("/api/user/teammates");
    return res.data;
  },
};
