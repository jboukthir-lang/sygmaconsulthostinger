import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Use the shared client which has fallback logic
        const { data: services, error } = await supabase
            .from('services')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        return NextResponse.json(services || []);
    } catch (error: any) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
