import { NextResponse } from 'next/server';
import { queryOne, queryAll } from '@/lib/mysql';

export async function GET() {
    try {
        // Fetch general calendar settings (start time, end time, slot duration, etc.)
        // We'll fetch the first row from calendar_settings. 
        // If your table is designed differently (e.g. per user), adapt this query.
        const settings = await queryOne(`
            SELECT * FROM calendar_settings LIMIT 1
        `);

        // Fetch blocked dates
        const blockedDates = await queryAll(`
            SELECT date, reason 
            FROM blocked_dates 
            WHERE date >= CURRENT_DATE
        `);

        return NextResponse.json({
            settings: settings || {
                // Default fallback if no settings found
                slot_duration: 30,
                start_time: '09:00',
                end_time: '17:00',
                working_days: '["1","2","3","4","5"]', // Mon-Fri
                buffer_time: 0
            },
            blockedDates: blockedDates
        });
    } catch (error: any) {
        console.error('Error fetching calendar settings from MySQL:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
