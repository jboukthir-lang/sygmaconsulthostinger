import { google, calendar_v3 } from 'googleapis';
import { setCredentials, GoogleTokens } from './google-auth';

/**
 * Create a Google Calendar event
 */
export async function createCalendarEvent(
  tokens: GoogleTokens,
  event: {
    summary: string;
    description?: string;
    location?: string;
    startTime: Date;
    endTime: Date;
    attendees?: string[];
    conferenceData?: boolean;
  }
) {
  const oauth2Client = setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const eventData: calendar_v3.Schema$Event = {
    summary: event.summary,
    description: event.description,
    location: event.location,
    start: {
      dateTime: event.startTime.toISOString(),
      timeZone: 'Europe/Paris',
    },
    end: {
      dateTime: event.endTime.toISOString(),
      timeZone: 'Europe/Paris',
    },
    attendees: event.attendees?.map(email => ({ email })),
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 30 }, // 30 minutes before
      ],
    },
  };

  // Add Google Meet conference if requested
  if (event.conferenceData) {
    eventData.conferenceData = {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: eventData,
    conferenceDataVersion: event.conferenceData ? 1 : 0,
    sendUpdates: 'all',
  });

  return response.data;
}

/**
 * Update a Google Calendar event
 */
export async function updateCalendarEvent(
  tokens: GoogleTokens,
  eventId: string,
  updates: {
    summary?: string;
    description?: string;
    location?: string;
    startTime?: Date;
    endTime?: Date;
    attendees?: string[];
  }
) {
  const oauth2Client = setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const eventData: calendar_v3.Schema$Event = {};

  if (updates.summary) eventData.summary = updates.summary;
  if (updates.description) eventData.description = updates.description;
  if (updates.location) eventData.location = updates.location;
  if (updates.startTime) {
    eventData.start = {
      dateTime: updates.startTime.toISOString(),
      timeZone: 'Europe/Paris',
    };
  }
  if (updates.endTime) {
    eventData.end = {
      dateTime: updates.endTime.toISOString(),
      timeZone: 'Europe/Paris',
    };
  }
  if (updates.attendees) {
    eventData.attendees = updates.attendees.map(email => ({ email }));
  }

  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: eventData,
    sendUpdates: 'all',
  });

  return response.data;
}

/**
 * Delete a Google Calendar event
 */
export async function deleteCalendarEvent(
  tokens: GoogleTokens,
  eventId: string
) {
  const oauth2Client = setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
    sendUpdates: 'all',
  });

  return true;
}

/**
 * List calendar events
 */
export async function listCalendarEvents(
  tokens: GoogleTokens,
  options?: {
    timeMin?: Date;
    timeMax?: Date;
    maxResults?: number;
  }
) {
  const oauth2Client = setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: options?.timeMin?.toISOString() || new Date().toISOString(),
    timeMax: options?.timeMax?.toISOString(),
    maxResults: options?.maxResults || 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items || [];
}

/**
 * Get available time slots from calendar
 */
export async function getAvailableTimeSlots(
  tokens: GoogleTokens,
  date: Date,
  duration: number = 60 // in minutes
) {
  const oauth2Client = setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const startOfDay = new Date(date);
  startOfDay.setHours(9, 0, 0, 0); // 9 AM

  const endOfDay = new Date(date);
  endOfDay.setHours(18, 0, 0, 0); // 6 PM

  // Get busy times
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      items: [{ id: 'primary' }],
    },
  });

  const busySlots = response.data.calendars?.primary?.busy || [];

  // Generate available slots
  const availableSlots: { start: Date; end: Date }[] = [];
  let currentTime = new Date(startOfDay);

  while (currentTime < endOfDay) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    // Check if this slot overlaps with any busy period
    const isAvailable = !busySlots.some(busy => {
      const busyStart = new Date(busy.start!);
      const busyEnd = new Date(busy.end!);
      return currentTime < busyEnd && slotEnd > busyStart;
    });

    if (isAvailable && slotEnd <= endOfDay) {
      availableSlots.push({
        start: new Date(currentTime),
        end: new Date(slotEnd),
      });
    }

    // Move to next slot
    currentTime = new Date(currentTime.getTime() + duration * 60000);
  }

  return availableSlots;
}
