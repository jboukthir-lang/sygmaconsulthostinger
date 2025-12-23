import { NextResponse } from 'next/server';
import { getBookings, updateBooking, deleteBooking } from '@/lib/local-storage';

export async function GET() {
    try {
        const bookings = await getBookings();

        // Sort by created_at desc
        bookings.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings locally:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }

        const updatedBooking = await updateBooking(id, updates);

        if (!updatedBooking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking locally:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }

        const success = await deleteBooking(id);

        if (!success) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting booking locally:', error);
        return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
    }
}
