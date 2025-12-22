'use client';

import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { supabase, Post } from "@/lib/supabase";
import { Calendar, Clock, Tag, Loader2 } from "lucide-react";
import Image from "next/image";

export default function InsightsPage() {
    const { t, language } = useLanguage();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('published', true)
                .order('published_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTitle = (post: Post) => {
        if (language === 'fr') return post.title_fr;
        if (language === 'ar') return post.title_ar;
        return post.title_en;
    };

    const getExcerpt = (post: Post) => {
        if (language === 'fr') return post.excerpt_fr;
        if (language === 'ar') return post.excerpt_ar;
        return post.excerpt_en;
    };

    const getArticleColor = (index: number) => {
        const colors = [
            "bg-blue-100 text-blue-800",
            "bg-green-100 text-green-800",
            "bg-purple-100 text-purple-800",
            "bg-orange-100 text-orange-800",
            "bg-pink-100 text-pink-800",
            "bg-indigo-100 text-indigo-800"
        ];
        return colors[index % colors.length];
    };

    const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];

    const filteredPosts = selectedCategory === 'all'
        ? posts
        : posts.filter(p => p.category === selectedCategory);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-TN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <main className="min-h-screen bg-[#F8F9FA]">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#001F3F] to-[#003366] text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute transform rotate-45 bg-white w-96 h-96 -top-48 -right-48"></div>
                    <div className="absolute transform -rotate-45 bg-white w-96 h-96 -bottom-48 -left-48"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{t.insights.title}</h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                        {t.insights.subtitle}
                    </p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-[#001F3F] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category === 'all' ? t.insights.all_posts : category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 text-[#001F3F] animate-spin" />
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">{t.insights.no_posts}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, i) => (
                            <Link
                                href={`/insights/${post.slug}`}
                                key={post.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group transform hover:-translate-y-1 duration-300"
                            >
                                {/* Featured Image */}
                                <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 w-full relative overflow-hidden">
                                    {post.featured_image ? (
                                        <Image
                                            src={post.featured_image}
                                            alt={getTitle(post)}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-6xl font-serif text-gray-300 mb-2">SYGMA</div>
                                                <div className="text-sm text-gray-400 font-medium">{post.category}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta Information */}
                                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getArticleColor(i)}`}>
                                            {post.category}
                                        </span>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {post.reading_time} {t.insights.min_read}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-[#001F3F] mb-3 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                                        {getTitle(post)}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {getExcerpt(post)}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDate(post.published_at)}</span>
                                        </div>
                                        <span className="text-[#001F3F] font-bold text-sm group-hover:text-[#D4AF37]">
                                            {t.insights.read_more} {language === 'ar' ? '←' : '→'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
