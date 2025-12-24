import { supabase } from '@/lib/supabase';
import ServiceDetailView from "./ServiceDetailView";

// Generate static paths from database services
export async function generateStaticParams() {
    try {
        console.log('📋 Generating static params for service pages...');
        const { data: services, error } = await supabase
            .from('services')
            .select('href')
            .eq('is_active', true);

        if (error) throw error;
        if (!services) return [];

        // Extract slug from href (e.g., '/services/corporate' → 'corporate')
        const params = services.map((service) => {
            const slug = service.href.replace('/services/', '').replace(/\/$/, '');
            return { slug };
        }).filter(s => s.slug); // Filter out empty slugs

        console.log(`✅ Generated ${params.length} service pages`);
        return params;
    } catch (error) {
        console.error('❌ Error generating static params:', error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        // Fetch service from database by slug
        const { data: service, error } = await supabase
            .from('services')
            .select('*')
            .or(`href.eq./services/${slug},href.eq./services/${slug}/`)
            .eq('is_active', true)
            .single();

        if (error) throw error;
        if (!service) {
            return {
                title: 'Service Not Found | Sygma Consult',
            };
        }

        return {
            title: `${service.title_en} | Sygma Consult`,
            description: service.description_en,
        };
    } catch (error) {
        console.error('❌ Error generating metadata for service:', error);
        return {
            title: 'Service | Sygma Consult',
        };
    }
}

export default async function ServicePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    // Pass the slug to the Client Component which will fetch from database
    return <ServiceDetailView slug={slug} />;
}
