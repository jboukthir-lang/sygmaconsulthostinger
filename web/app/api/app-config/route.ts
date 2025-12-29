import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const config = await queryOne('SELECT * FROM app_config LIMIT 1');

        if (!config) {
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
