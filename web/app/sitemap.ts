import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

// Helper to get all posts for sitemap
async function getBlogPosts() {
    try {
        const { data } = await supabase
            .from('posts')
            .select('slug, updated_at')
            .eq('published', true);
        return data || [];
    } catch (error) {
        console.error('Sitemap error:', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://sygmaconsult.com';
    const posts = await getBlogPosts();

    const blogUrls = posts.map((post) => ({
        url: `${baseUrl}/insights/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/insights`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/book`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.9,
        },
        ...blogUrls,
    ];
}
