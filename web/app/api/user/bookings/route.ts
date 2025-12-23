import { NextResponse } from 'next/server';
import { getBookings } from '@/lib/local-storage';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const userId = searchParams.get('user_id');

        if (!email && !userId) {
            return NextResponse.json({ error: 'Email or User ID required' }, { status: 400 });
        }

        const allBookings = await getBookings();

        // Filter by email or user_id
        const userBookings = allBookings.filter(booking => {
            if (email && booking.email === email) return true;
            if (userId && booking.user_id === userId) return true;
            return false;
        });

        // Sort by date desc
        userBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json(userBookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
