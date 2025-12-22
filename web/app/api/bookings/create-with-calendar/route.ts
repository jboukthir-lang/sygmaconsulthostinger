import { NextRequest, NextResponse } from 'next/server';
import { createMeetingWithLink } from '@/lib/google-meet';
import { cookies } from 'next/headers';
import { GoogleTokens } from '@/lib/google-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, service, date, time, duration = 60, notes } = body;

    // Validate required fields
    if (!clientName || !clientEmail || !service || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get Google tokens from cookie
    const cookieStore = await cookies();
    const tokensStr = cookieStore.get('google_tokens')?.value;

    if (!tokensStr) {
      return NextResponse.json(
        { error: 'Google account not connected. Please connect your Google account in settings.' },
        { status: 401 }
      );
    }

    const tokens: GoogleTokens = JSON.parse(tokensStr);

    // Parse date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    const startTime = new Date(year, month - 1, day, hours, minutes);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Create meeting title and description
    const title = `${service} - ${clientName}`;
    const description = `
Consultation: ${service}
Client: ${clientName}
Email: ${clientEmail}
${notes ? `Notes: ${notes}` : ''}

---
Rendez-vous organisé par Sygma Consult
https://sygmaconsult.vercel.app
    `.trim();

    // Create Google Calendar event with Meet link
    const result = await createMeetingWithLink(tokens, {
      title,
      description,
      startTime,
      endTime,
      attendees: [clientEmail],
    });

    return NextResponse.json({
      success: true,
      eventId: result.eventId,
      meetLink: result.meetLink,
      calendarLink: result.htmlLink,
      message: 'Booking created successfully with Google Calendar and Meet link',
    });
  } catch (error: any) {
    console.error('Error creating booking with calendar:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking with calendar' },
      { status: 500 }
    );
  }
}
