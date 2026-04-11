export interface CalendarEventAttendee {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startTime: string;  // ISO datetime
  endTime: string;
  location?: string;
  meetingLink?: string;
  color: string;
  googleEventId?: string;
  createdByName?: string;
  createdByEmail?: string;
  attendees: CalendarEventAttendee[];
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  autoGenerateGoogleMeet?: boolean;
  color?: string;
  attendeeIds?: number[];
  syncToGoogle?: boolean;
}

export interface TeammateInfo {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
  projectName: string;
  latestTaskTitle: string;
  latestTaskStatus: string;
  latestTaskDueDate?: string;
}
