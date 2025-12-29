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

        // Fetch calendar settings
        const { data: settings, error: settingsError } = await supabase
            .from('calendar_settings')
            .select('*')
            .limit(1)
            .single();

        // Fetch blocked dates
        const { data: blockedDates, error: blockedError } = await supabase
            .from('blocked_dates')
            .select('*')
            .order('date', { ascending: true });

        if (settingsError && settingsError.code !== 'PGRST116') { // Ignore "Row not found" error
            console.error('Supabase settings error:', settingsError);
        }

        if (blockedError) {
            console.error('Supabase blocked dates error:', blockedError);
        }

        // Define defaults
        const defaultSettings = {
            id: 'default',
            slot_duration: 30,
            max_advance_booking_days: 30,
            min_advance_booking_hours: 24,
            lunch_break_enabled: false,
            lunch_break_start: null,
            lunch_break_end: null,
            monday_enabled: true,
            tuesday_enabled: true,
            wednesday_enabled: true,
            thursday_enabled: true,
            friday_enabled: true,
            saturday_enabled: false,
            sunday_enabled: false,
            monday_start: '09:00',
            monday_end: '17:00',
            tuesday_start: '09:00',
            tuesday_end: '17:00',
            wednesday_start: '09:00',
            wednesday_end: '17:00',
            thursday_start: '09:00',
            thursday_end: '17:00',
            friday_start: '09:00',
            friday_end: '17:00',
            saturday_start: '10:00',
            saturday_end: '15:00',
            sunday_start: '10:00',
            sunday_end: '15:00',
        };

        // Convert old format to new format if needed
        let convertedSettings: any = { ...defaultSettings };

        if (settings) {
            if (settings.working_hours_start && !settings.monday_start) {
                // Old format detected - convert to new format
                console.log('Converting old calendar settings format to new format');

                const workingDays = settings.working_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                const workingDaysSet = new Set(workingDays);

                convertedSettings = {
                    ...defaultSettings,
                    id: settings.id || 'default',
                    slot_duration: settings.slot_duration || 30,
                    max_advance_booking_days: settings.max_advance_booking_days || 30,
                    min_advance_booking_hours: settings.min_advance_booking_hours || 24,
                    lunch_break_enabled: !!(settings.break_start && settings.break_end),
                    lunch_break_start: settings.break_start || null,
                    lunch_break_end: settings.break_end || null,
                    // Convert working days to per-day settings
                    monday_enabled: workingDaysSet.has('monday'),
                    tuesday_enabled: workingDaysSet.has('tuesday'),
                    wednesday_enabled: workingDaysSet.has('wednesday'),
                    thursday_enabled: workingDaysSet.has('thursday'),
                    friday_enabled: workingDaysSet.has('friday'),
                    saturday_enabled: workingDaysSet.has('saturday'),
                    sunday_enabled: workingDaysSet.has('sunday'),
                    // Use global working hours for all days
                    monday_start: settings.working_hours_start || '09:00',
                    monday_end: settings.working_hours_end || '17:00',
                    tuesday_start: settings.working_hours_start || '09:00',
                    tuesday_end: settings.working_hours_end || '17:00',
                    wednesday_start: settings.working_hours_start || '09:00',
                    wednesday_end: settings.working_hours_end || '17:00',
                    thursday_start: settings.working_hours_start || '09:00',
                    thursday_end: settings.working_hours_end || '17:00',
                    friday_start: settings.working_hours_start || '09:00',
                    friday_end: settings.working_hours_end || '17:00',
                    saturday_start: settings.working_hours_start || '09:00',
                    saturday_end: settings.working_hours_end || '17:00',
                    sunday_start: settings.working_hours_start || '09:00',
                    sunday_end: settings.working_hours_end || '17:00',
                };
            } else {
                // New format - merge with defaults to handle any missing fields
                // We iterate over the settings and only apply non-null, non-empty values
                Object.keys(settings).forEach(key => {
                    if (settings[key] !== null && settings[key] !== undefined && settings[key] !== '') {
                        convertedSettings[key] = settings[key];
                    }
                });
            }
        }

        // Return settings with blocked dates
        return NextResponse.json({
            settings: convertedSettings,
            blockedDates: blockedDates || []
        });
    } catch (error: any) {
        console.error('Error fetching calendar settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch calendar settings', details: error.message },
            { status: 500 }
        );
    }
}
