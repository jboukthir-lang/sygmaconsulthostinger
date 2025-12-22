import { NextResponse } from 'next/server';
import { supabase, type Booking } from '@/lib/supabase';
import { sendBookingConfirmation, sendBookingNotification } from '@/lib/smtp-email';
import { createCalendarEvent } from '@/lib/google-calendar';

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

        // Save to Supabase with enhanced fields
        const bookingData: any = {
            name,
            email,
            topic,
            date: formattedDate,
            time,
            user_id: user_id || null,
            status: 'pending',
            duration,
            appointment_type,
            appointment_type_id: appointment_type_id || null,
            specialization: specialization || topic,
            is_online,
            notes: notes || '',
            price: price || 0,
            payment_status: payment_status || (price > 0 ? 'pending' : 'free')
        };

        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json(
                { error: 'Failed to save booking', details: error.message },
                { status: 500 }
            );
        }

        console.log('Booking saved successfully:', data);

        // Create Google Calendar event
        let calendarData = null;
        try {
            calendarData = await createCalendarEvent(data);
            if (calendarData) {
                // Update booking with calendar event ID and meet link
                await supabase
                    .from('bookings')
                    .update({
                        calendar_event_id: calendarData.eventId,
                        meet_link: calendarData.meetLink
                    })
                    .eq('id', data.id);

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
            await sendBookingConfirmation(data);
            console.log('Confirmation email sent to client');
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't fail the booking if email fails
        }

        // Send notification email to admin
        try {
            await sendBookingNotification(data);
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
