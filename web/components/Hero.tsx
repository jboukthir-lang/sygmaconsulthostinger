'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Globe from './Globe';

interface HeroSection {
    badge_en: string;
    badge_fr: string;
    badge_ar: string;
    title_en: string;
    title_fr: string;
    title_ar: string;
    subtitle_en: string;
    subtitle_fr: string;
    subtitle_ar: string;
    cta_text_en: string;
    cta_text_fr: string;
    cta_text_ar: string;
    cta_url?: string;
    cta_secondary_text_en: string;
    cta_secondary_text_fr: string;
    cta_secondary_text_ar: string;
    cta_secondary_url?: string;
    hero_type?: string;
    hero_media_url?: string;
    [key: string]: any; // Allow loose typing for now to fix build
}

export default function Hero() {
    const { t, language } = useLanguage();
    const [heroContent, setHeroContent] = useState<HeroSection | null>(null);

    const fetchHeroContent = async () => {
        try {
            const { data, error } = await supabase
                .from('app_config')
                .select('*')
                .eq('key', 'main')
                .single();

            if (data) {
                setHeroContent(data);
                // Pre-load image if active
                if (data.hero_type === 'image' && data.hero_media_url) {
                    const img = new window.Image();
                    img.src = data.hero_media_url;
                }
            }
            if (error) console.error('Error loading hero config:', error);
        } catch (error) {
            console.error('Error fetching hero content:', error);
        }
    };

    useEffect(() => {
        fetchHeroContent();

        // Real-time subscription for instant updates
        const subscription = supabase
            .channel('app_config_changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_config', filter: 'key=eq.main' },
                (payload) => {
                    setHeroContent(payload.new as HeroSection);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Get content based on language
    const getBadge = () => heroContent?.[`badge_${language}` as keyof HeroSection] || t.hero.badge;
    const getTitle = () => heroContent?.[`title_${language}` as keyof HeroSection] || t.hero.title_start;
    const getSubtitle = () => heroContent?.[`subtitle_${language}` as keyof HeroSection] || t.hero.subtitle;
    const getCTA = () => heroContent?.[`cta_text_${language}` as keyof HeroSection] || t.hero.cta_book;
    const getCTASecondary = () => heroContent?.[`cta_secondary_text_${language}` as keyof HeroSection] || t.hero.cta_services;
    const getHighlight1 = () => heroContent?.[`content_${language}` as keyof HeroSection]?.highlight1 || (language === 'ar' ? 'باريس' : 'Paris');
    const getHighlight2 = () => heroContent?.[`content_${language}` as keyof HeroSection]?.highlight2 || (language === 'ar' ? 'تونس' : 'Tunis');

    return (
        <section className="relative w-full overflow-hidden bg-[#F8F9FA]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#001F3F 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 items-center min-h-[calc(100vh-80px)] py-12 lg:py-0">

                    {/* Content Column */}
                    <div className="flex flex-col justify-center space-y-8 order-2 lg:order-1 relative z-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#D4AF37] shadow-sm border border-[#D4AF37]/20 w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                                </span>
                                {getBadge()}
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl xl:text-7xl text-[#001F3F] font-serif leading-[1.1]">
                                {getTitle()} <br />
                                <span className="relative whitespace-nowrap">
                                    <span className="relative z-10 text-[#D4AF37]">{getHighlight1()}</span>
                                    <span className="absolute bottom-2 left-0 w-full h-3 bg-[#D4AF37]/10 -skew-x-6 z-0"></span>
                                </span>
                                <span className="text-[#001F3F] mx-2">&</span>
                                <span className="relative whitespace-nowrap">
                                    <span className="relative z-10 text-[#D4AF37]">{getHighlight2()}</span>
                                    <span className="absolute bottom-2 left-0 w-full h-3 bg-[#D4AF37]/10 -skew-x-6 z-0"></span>
                                </span>
                            </h1>
                            <p className="max-w-[600px] text-gray-600 text-lg md:text-xl leading-relaxed border-l-4 border-[#D4AF37]/30 pl-6">
                                {getSubtitle()}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row pt-4">
                            <Link
                                className="inline-flex h-14 items-center justify-center rounded-xl bg-[#001F3F] px-8 text-base font-medium text-white shadow-lg shadow-[#001F3F]/20 transition-all hover:bg-[#002a52] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001F3F]"
                                href={heroContent?.cta_url || "/booking"}
                            >
                                {getCTA()}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-[#001F3F]/10 bg-white px-8 text-base font-medium text-[#001F3F] shadow-sm transition-all hover:bg-[#F8F9FA] hover:border-[#001F3F] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001F3F]"
                                href={heroContent?.cta_secondary_url || "/services"}
                            >
                                {getCTASecondary()}
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="pt-8 flex items-center gap-6 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                                <span className="text-[#D4AF37]">★ ★ ★ ★ ★</span>
                                <span>Premium Service</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div>LiknkedIn Verified</div>
                        </div>
                    </div>

                    {/* Image/Globe Column */}
                    <div className="order-1 lg:order-2 relative h-[400px] lg:h-[85vh] w-full flex items-center justify-center">
                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 rounded-full blur-3xl z-0"></div>

                        {/* Dynamic Hero Content */}
                        <div className="relative z-10 w-full h-full max-h-[800px] flex items-center justify-center">
                            {(!heroContent?.hero_type || heroContent.hero_type === 'globe') && (
                                <div className="scale-110 lg:scale-125">
                                    <Globe />
                                </div>
                            )}

                            {heroContent?.hero_type === 'image' && (
                                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F]/40 via-transparent to-transparent z-10"></div>
                                    {heroContent.hero_media_url ? (
                                        <img
                                            src={heroContent.hero_media_url}
                                            alt="Sygma Consult Hero"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <span>No Image Uploaded</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Floating Card - Only show on Globe or if configured */}
                        <div className="absolute bottom-12 left-8 right-8 z-20 hidden md:block">
                            <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/50 max-w-sm ml-auto">
                                <p className="text-[#001F3F] font-serif italic text-lg mb-2">
                                    "{language === 'ar' ? 'نربطك بالعالم' : 'Bridging you to the world.'}"
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Live Global Network
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
