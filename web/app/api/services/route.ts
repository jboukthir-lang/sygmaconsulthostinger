import { NextResponse } from 'next/server';
import { queryAll } from '@/lib/mysql';

export async function GET() {
    try {
        // Fetch all active, bookable services, ordered by display_order
        // Note: We're mapping MySQL columns to match the frontend 'Service' interface expectations
        const services = await queryAll(`
            SELECT 
                id,
                title_en, title_fr, title_ar,
                description_en, description_fr, description_ar,
                subtitle_en, subtitle_fr, subtitle_ar,
                features_en, features_fr, features_ar,
                icon, href, color,
                is_active, display_order,
                image_url,
                price,
                duration_minutes,
                is_bookable
            FROM services
            WHERE is_active = 1
            ORDER BY display_order ASC
        `);

        // Handle JSON parsing for features (stored as JSON/Text in MySQL)
        const parsedServices = services.map((service: any) => ({
            ...service,
            features_en: typeof service.features_en === 'string' ? JSON.parse(service.features_en || '[]') : service.features_en,
            features_fr: typeof service.features_fr === 'string' ? JSON.parse(service.features_fr || '[]') : service.features_fr,
            features_ar: typeof service.features_ar === 'string' ? JSON.parse(service.features_ar || '[]') : service.features_ar,
            // Ensure booleans are actual booleans (MySQL returns 1/0)
            is_active: Boolean(service.is_active),
            is_bookable: Boolean(service.is_bookable),
            price: Number(service.price),
            duration_minutes: Number(service.duration_minutes)
        }));

        return NextResponse.json(parsedServices);
    } catch (error: any) {
        console.error('Error fetching services from MySQL:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
