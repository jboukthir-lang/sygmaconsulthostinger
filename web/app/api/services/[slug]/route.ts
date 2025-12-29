import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase credentials');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const slug = params.slug;

        // Extract service name from slug (e.g., "visa" from "/services/visa")
        const serviceName = slug.split('/').pop();

        const { data: service, error } = await supabase
            .from('services')
            .select('*')
            .eq('href', `/services/${serviceName}`)
            .eq('is_active', true)
            .single();

        if (error || !service) {
            return NextResponse.json(
                { error: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(service);
    } catch (error: any) {
        console.error('Error fetching service:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const slug = params.slug;
        const href = `/services/${slug}`;

        // Fetch service by href (slug)
        // Note: we check for both exact match and trailing slash if needed, mostly exact match on href
        const service = await queryOne(
            `SELECT * FROM services WHERE href = ? OR href = ? LIMIT 1`,
            [href, `/services/${slug}/`]
        );

        if (!service) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        // Parse JSON fields
        if (typeof service.features_en === 'string') service.features_en = JSON.parse(service.features_en);
        if (typeof service.features_fr === 'string') service.features_fr = JSON.parse(service.features_fr);
        if (typeof service.features_ar === 'string') service.features_ar = JSON.parse(service.features_ar);

        // Fetch other services for "Other Services" sidebar
        const otherServices = await queryAll(
            `SELECT id, title_en, title_fr, title_ar, href FROM services 
             WHERE is_active = 1 AND id != ? 
             ORDER BY display_order LIMIT 5`,
            [service.id]
        );

        return NextResponse.json({
            service,
            otherServices
        });

    } catch (error: any) {
        console.error('Error fetching service:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
