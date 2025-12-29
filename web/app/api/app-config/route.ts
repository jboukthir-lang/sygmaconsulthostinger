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

        return NextResponse.json({
            logo_url: config.logo_url,
            favicon_url: config.favicon_url,
            site_name: config.site_name,
            site_description: config.site_description,
            contact_email: config.contact_email,
            contact_phone: config.contact_phone,
            address: config.address
        });
    } catch (error: any) {
        console.error('Error fetching app config:', error);
        return NextResponse.json(
            { error: 'Failed to fetch app config', details: error.message },
            { status: 500 }
        );
    }
}
