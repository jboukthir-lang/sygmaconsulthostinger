import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase credentials');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: settings, error } = await supabase
            .from('calendar_settings')
            .select('*')
            .limit(1)
            .single();

        if (error || !settings) { // Added !settings check here as well, in case single() returns null data without an explicit error object for "not found"
            console.error('Supabase error:', error);
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
