import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await queryOne('SELECT * FROM calendar_settings LIMIT 1');

        if (!settings) {
            // Return default settings if none exist
            return NextResponse.json({
                slot_duration: 30,
                start_time: '09:00',
                end_time: '17:00',
                working_days: ["1", "2", "3", "4", "5"],
                buffer_time: 0
            });
        }

        // Parse JSON working_days if it's a string
        const workingDays = typeof settings.working_days === 'string'
            ? JSON.parse(settings.working_days)
            : settings.working_days;

        return NextResponse.json({
            slot_duration: settings.slot_duration,
            start_time: settings.start_time,
            end_time: settings.end_time,
            working_days: workingDays,
            buffer_time: settings.buffer_time
        });
    } catch (error: any) {
        console.error('Error fetching calendar settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch calendar settings', details: error.message },
            { status: 500 }
        );
    }
}
