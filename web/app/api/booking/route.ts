import { NextResponse } from 'next/server';
import { saveBooking, updateBooking, getBookingById } from '@/lib/local-storage';
import { sendBookingConfirmation, sendBookingNotification } from '@/lib/smtp-email';
import { createCalendarEvent } from '@/lib/google-calendar';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const booking = await getBookingById(id);

    if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
        }

        // In a real app, verify user owns this booking

        const updated = await updateBooking(id, { status });

        if (!updated) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            email,
            topic,
            date,
            time,
            user_id,
            duration = 30,
            appointment_type = 'consultation',
            appointment_type_id,
            specialization,
            is_online = true,
            notes,
            price = 0,
            payment_status = 'pending'
        } = body;

        // Validation
        if (!name || !email || !date || !time) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Format date to YYYY-MM-DD if not already
        let formattedDate = date;
        if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Parse "Tue 16" format to proper date
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = date.match(/\d+/)?.[0]?.padStart(2, '0') || '01';
            formattedDate = `${year}-${month}-${day}`;
        }

        // Save to Local File
        const bookingData = {
            name,
            email,
            topic,
            date: formattedDate,
            time,
            user_id: user_id || null,
            status: 'pending' as const,
            duration,
            appointment_type,
            appointment_type_id: appointment_type_id || null,
            specialization: specialization || topic,
            is_online,
            notes: notes || '',
            price: price || 0,
            payment_status: (payment_status || (price > 0 ? 'pending' : 'free')) as any
        };

        const data = await saveBooking(bookingData);
        console.log('Booking saved locally:', data);

        // Create Google Calendar event
        let calendarData: any = null;
        try {
            calendarData = await createCalendarEvent(data as any);
            if (calendarData) {
                // Update booking with calendar event ID and meet link
                await updateBooking(data.id, {
                    calendar_event_id: calendarData.eventId,
                    meet_link: calendarData.meetLink
                });

                console.log('Calendar event created:', calendarData.eventId);

                // Update data object for email
                data.meet_link = calendarData.meetLink;
            }
        } catch (calendarError) {
            console.error('Failed to create calendar event:', calendarError);
            // Don't fail the booking if calendar fails
        }

        // Send confirmation email to client
        try {
            await sendBookingConfirmation(data as any);
            console.log('Confirmation email sent to client');
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the booking if email fails
        }

        // Send notification email to admin
        try {
            await sendBookingNotification(data as any);
            console.log('Notification email sent to admin');
        } catch (emailError) {
            console.error('Failed to send notification email:', emailError);
            // Don't fail the booking if email fails
        }

        return NextResponse.json({
            success: true,
            message: 'Booking confirmed successfully',
            booking: {
                ...data,
                meet_link: calendarData?.meetLink || null
            }
        });

    } catch (error) {
        console.error('Booking Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

