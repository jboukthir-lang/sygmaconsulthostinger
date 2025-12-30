import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        // Use shared client
        const slug = params.slug;

        const { data: service, error } = await supabase
            .from('services')
            .select('*')
            .eq('href', `/services/${slug}`)
            .eq('is_active', true)
            .single();

        if (error || !service) {
            return NextResponse.json(
                { message: 'Service not found' },
                { status: 404 }
            );
        }

        // Fetch other services for sidebar
        const { data: otherServices } = await supabase
            .from('services')
            .select('id, title_en, title_fr, title_ar, href')
            .eq('is_active', true)
            .neq('id', service.id)
            .order('display_order', { ascending: true })
            .limit(5);

        return NextResponse.json({
            service,
            otherServices: otherServices || []
        });

    } catch (error: any) {
        console.error('Error fetching service:', error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
