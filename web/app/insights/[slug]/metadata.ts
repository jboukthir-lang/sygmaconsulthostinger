import { Metadata } from 'next';
import { supabase, Post } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        const { data: post } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', params.slug)
            .eq('published', true)
            .single();

        if (!post) {
            return {
                title: 'Post Not Found | Sygma Consult',
                description: 'The requested post could not be found.'
            };
        }

        const seoTitle = post.seo_title_en || post.title_en;
        const seoDescription = post.seo_description_en || post.excerpt_en;
        const keywords = post.seo_keywords || post.tags || [];

        return {
            title: `${seoTitle} | Sygma Consult`,
            description: seoDescription,
            keywords: keywords.join(', '),
            authors: [{ name: post.author_name }],
            openGraph: {
                title: seoTitle,
                description: seoDescription,
                type: 'article',
                publishedTime: post.published_at || undefined,
                modifiedTime: post.updated_at || undefined,
                authors: [post.author_name],
                images: [
                    {
                        url: post.featured_image || 'https://sygmaconsult.com/logo.png',
                        width: 1200,
                        height: 630,
                        alt: seoTitle,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: seoTitle,
                description: seoDescription,
                images: [post.featured_image || 'https://sygmaconsult.com/logo.png'],
            },
            alternates: {
                canonical: `https://sygmaconsult.com/insights/${post.slug}`,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Sygma Consult | Insights',
            description: 'Expert insights on business, law, and strategy.'
        };
    }
}
