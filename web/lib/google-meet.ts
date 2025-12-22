import { google } from 'googleapis';
import { setCredentials, GoogleTokens } from './google-auth';
import { createCalendarEvent } from './google-calendar';

/**
 * Create a Google Meet link with calendar event
 */
export async function createMeetingWithLink(
  tokens: GoogleTokens,
  meeting: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    attendees?: string[];
  }
) {
  // Create calendar event with Google Meet conference
  const event = await createCalendarEvent(tokens, {
    summary: meeting.title,
    description: meeting.description,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    attendees: meeting.attendees,
    conferenceData: true, // This creates the Google Meet link
  });

  // Extract the Google Meet link
  const meetLink = event.hangoutLink || event.conferenceData?.entryPoints?.find(
    ep => ep.entryPointType === 'video'
  )?.uri;

  return {
    eventId: event.id,
    meetLink,
    htmlLink: event.htmlLink,
    event,
  };
}

/**
 * Get Google Meet link from existing calendar event
 */
export async function getMeetLinkFromEvent(
  tokens: GoogleTokens,
  eventId: string
) {
  const oauth2Client = setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = await calendar.events.get({
    calendarId: 'primary',
    eventId,
  });

  const meetLink = event.data.hangoutLink || event.data.conferenceData?.entryPoints?.find(
    ep => ep.entryPointType === 'video'
  )?.uri;

  return meetLink;
}

/**
 * Create instant Google Meet (without calendar event)
 * Note: This requires Google Meet API which may need additional setup
 */
export async function createInstantMeet(
  tokens: GoogleTokens,
  meetingTitle: string
) {
  // For instant meets, we still create a calendar event with very short duration
  const now = new Date();
  const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

  const result = await createMeetingWithLink(tokens, {
    title: meetingTitle,
    startTime: now,
    endTime,
    attendees: [],
  });

  return result;
}

/**
 * Add Google Meet to existing calendar event
 */
export async function addMeetToExistingEvent(
  tokens: GoogleTokens,
  eventId: string
) {
  const oauth2Client = setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    conferenceDataVersion: 1,
    requestBody: {
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
    sendUpdates: 'all',
  });

  const meetLink = response.data.hangoutLink || response.data.conferenceData?.entryPoints?.find(
    ep => ep.entryPointType === 'video'
  )?.uri;

  return {
    eventId: response.data.id,
    meetLink,
    event: response.data,
  };
}
