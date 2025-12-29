import { NextResponse } from 'next/server';
import { queryOne, queryAll } from '@/lib/mysql';

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
