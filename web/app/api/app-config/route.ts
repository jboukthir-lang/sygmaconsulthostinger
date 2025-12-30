import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Use shared client
        const { data: config, error } = await supabase
            .from('app_config')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            // Return default config if none exists
            return NextResponse.json({
                logo_url: '/logo.png',
                favicon_url: '/favicon.ico',
                site_name: 'SYGMA CONSULT',
                site_description: 'Expert consulting services',
                contact_email: 'contact@sygmaconsult.com',
                contact_phone: '+33 1 23 45 67 89'
            });
        }

        return NextResponse.json(config);
    } catch (error: any) {
        console.error('Error fetching app config:', error);
        return NextResponse.json(
            { error: 'Failed to fetch app config', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const json = await request.json();

        // Use shared client
        const { error } = await supabase
            .from('app_config')
            .update(json)
            .eq('key', 'main');

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating app config:', error);
        return NextResponse.json(
            { error: 'Failed to update app config', details: error.message },
            { status: 500 }
        );
    }
}
