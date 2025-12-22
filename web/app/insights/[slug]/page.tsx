'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from "@/components/Header";
import { useLanguage } from "@/context/LanguageContext";
import { supabase, Post } from "@/lib/supabase";
import { Calendar, Clock, Tag, ArrowLeft, Share2, Loader2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Head from 'next/head';

export default function PostDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { t, language } = useLanguage();
    const [post, setPost] = useState<Post | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchPost();
        }
    }, [slug, language]);

    const fetchPost = async () => {
        try {
            setLoading(true);

            // Fetch the post by slug
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .eq('published', true)
                .single();

            if (postError) throw postError;

            if (postData) {
                setPost(postData);

                // Increment views
                await supabase
                    .from('posts')
                    .update({ views: (postData.views || 0) + 1 })
                    .eq('id', postData.id);

                // Fetch related posts (same category, excluding current post)
                const { data: relatedData } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('category', postData.category)
                    .eq('published', true)
                    .neq('id', postData.id)
                    .limit(3);

                setRelatedPosts(relatedData || []);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            router.push('/insights');
        } finally {
            setLoading(false);
        }
    };

    const getTitle = (p: Post) => {
        if (language === 'fr') return p.title_fr;
        if (language === 'ar') return p.title_ar;
        return p.title_en;
    };

    const getExcerpt = (p: Post) => {
        if (language === 'fr') return p.excerpt_fr;
        if (language === 'ar') return p.excerpt_ar;
        return p.excerpt_en;
    };

    const getContent = (p: Post) => {
        if (language === 'fr') return p.content_fr;
        if (language === 'ar') return p.content_ar;
        return p.content_en;
    };

    const getSeoTitle = (p: Post) => {
        if (language === 'fr') return p.seo_title_fr || p.title_fr;
        if (language === 'ar') return p.seo_title_ar || p.title_ar;
        return p.seo_title_en || p.title_en;
    };

    const getSeoDescription = (p: Post) => {
        if (language === 'fr') return p.seo_description_fr || p.excerpt_fr;
        if (language === 'ar') return p.seo_description_ar || p.excerpt_ar;
        return p.seo_description_en || p.excerpt_en;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-TN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleShare = async () => {
        if (navigator.share && post) {
            try {
                await navigator.share({
                    title: getTitle(post),
                    text: getExcerpt(post),
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 text-[#001F3F] animate-spin" />
                </div>
            </main>
        );
    }

    if (!post) {
        return (
            <main className="min-h-screen bg-white">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-[#001F3F] mb-4">Post Not Found</h1>
                    <Link href="/insights" className="text-[#D4AF37] hover:underline">
                        Back to Insights
                    </Link>
                </div>
            </main>
        );
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": getTitle(post),
        "description": getExcerpt(post),
        "image": post.featured_image || "https://sygmaconsult.com/logo.png",
        "author": {
            "@type": "Person",
            "name": post.author_name
        },
        "publisher": {
            "@type": "Organization",
            "name": "Sygma Consult",
            "logo": {
                "@type": "ImageObject",
                "url": "https://sygmaconsult.com/logo.png"
            }
        },
        "datePublished": post.published_at,
        "dateModified": post.updated_at,
        "keywords": post.seo_keywords?.join(', ') || post.tags?.join(', ')
    };

    return (
        <>
            <Head>
                <title>{getSeoTitle(post)}</title>
                <meta name="description" content={getSeoDescription(post)} />
                <meta name="keywords" content={post.seo_keywords?.join(', ') || post.tags?.join(', ')} />
                <meta property="og:title" content={getSeoTitle(post)} />
                <meta property="og:description" content={getSeoDescription(post)} />
                <meta property="og:image" content={post.featured_image || '/logo.png'} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={post.published_at || ''} />
                <meta property="article:author" content={post.author_name} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={getSeoTitle(post)} />
                <meta name="twitter:description" content={getSeoDescription(post)} />
                <meta name="twitter:image" content={post.featured_image || '/logo.png'} />
                <link rel="canonical" href={`https://sygmaconsult.com/insights/${post.slug}`} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            <main className="min-h-screen bg-white">
                <Header />

                {/* Breadcrumb */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link href="/" className="hover:text-[#001F3F]">Home</Link>
                            <span>/</span>
                            <Link href="/insights" className="hover:text-[#001F3F]">Insights</Link>
                            <span>/</span>
                            <span className="text-[#001F3F] font-medium line-clamp-1">{getTitle(post)}</span>
                        </div>
                    </div>
                </div>

                {/* Article Header */}
                <article className="container mx-auto px-4 py-12 max-w-4xl">
                    {/* Back Button */}
                    <Link
                        href="/insights"
                        className="inline-flex items-center gap-2 text-[#001F3F] hover:text-[#D4AF37] mb-8 font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t.insights.read_more}
                    </Link>

                    {/* Category & Meta */}
                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                        <span className="px-4 py-2 bg-[#001F3F] text-white text-sm font-bold rounded-full">
                            {post.category}
                        </span>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {post.reading_time} {t.insights.min_read}
                            </span>
                            <span className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {post.author_name}
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-[#001F3F] mb-6 leading-tight">
                        {getTitle(post)}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {getExcerpt(post)}
                    </p>

                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mb-8"
                    >
                        <Share2 className="h-4 w-4" />
                        Share
                    </button>

                    {/* Featured Image */}
                    {post.featured_image && (
                        <div className="relative w-full h-96 mb-12 rounded-2xl overflow-hidden">
                            <Image
                                src={post.featured_image}
                                alt={getTitle(post)}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-[#001F3F] prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-strong:text-[#001F3F]"
                        dangerouslySetInnerHTML={{ __html: getContent(post) }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Tag className="h-5 w-5 text-gray-400" />
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="bg-gray-50 py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-[#001F3F] mb-8 text-center">
                                Related Articles
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={`/insights/${relatedPost.slug}`}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                                    >
                                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                                            {relatedPost.featured_image ? (
                                                <Image
                                                    src={relatedPost.featured_image}
                                                    alt={getTitle(relatedPost)}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-4xl font-serif text-gray-300">
                                                    SYGMA
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-[#001F3F] mb-2 group-hover:text-[#D4AF37] line-clamp-2">
                                                {getTitle(relatedPost)}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3">
                                                {getExcerpt(relatedPost)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}
