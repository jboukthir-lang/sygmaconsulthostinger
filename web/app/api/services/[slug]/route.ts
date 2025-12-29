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

        // Fetch service by href
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
