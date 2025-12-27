'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
    cta_url: string;
    cta_secondary_text_en: string;
    cta_secondary_text_fr: string;
    cta_secondary_text_ar: string;
    cta_secondary_url: string;
    content_en: any;
    content_fr: any;
    content_ar: any;
}

export default function Hero() {
    const { t, language } = useLanguage();
    const [heroImageUrl, setHeroImageUrl] = useState<string>('/hero.svg');
    const [heroContent, setHeroContent] = useState<HeroSection | null>(null);

    const fetchHeroImage = async () => {
        try {
            const { data, error } = await supabase
                .from('hero_images')
                .select('image_url')
                .eq('is_active', true)
                .single();

            if (data && data.image_url) {
                setHeroImageUrl(data.image_url);
                console.log('✅ Hero image loaded from database');
            } else {
                console.log('ℹ️ Using default hero image');
            }
        } catch (error) {
            console.error('Error fetching hero image:', error);
        }
    };

    const fetchHeroContent = async () => {
        // Using translation-based content for now
        console.log('Using translation-based hero content');
    };

    useEffect(() => {
        fetchHeroImage();
        fetchHeroContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <section className="relative w-full overflow-hidden bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center min-h-[calc(100vh-80px)] py-12 lg:py-0">

                    {/* Content Column */}
                    <div className="flex flex-col justify-center space-y-8 order-2 lg:order-1">
                        <div className="space-y-4">
                            <div className="inline-block rounded-full bg-[#F8F9FA] px-3 py-1 text-sm font-semibold text-[#D4AF37] border border-[#D4AF37]/20">
                                {getBadge()}
                            </div>
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none text-[#001F3F] font-serif">
                                {getTitle()} <span className="text-[#D4AF37]">{getHighlight1()}</span> & <span className="text-[#D4AF37]">{getHighlight2()}</span>
                            </h1>
                            <p className="max-w-[600px] text-[#4A4A4A] text-base md:text-xl leading-relaxed">
                                {getSubtitle()}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                className="inline-flex h-12 items-center justify-center rounded-lg bg-[#D4AF37] px-6 sm:px-8 text-sm font-medium text-white shadow transition-all hover:bg-[#C5A028] hover:shadow-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
                                href={heroContent?.cta_url || "/book"}
                            >
                                {getCTA()}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                className="inline-flex h-12 items-center justify-center rounded-lg border border-[#001F3F] bg-transparent px-6 sm:px-8 text-sm font-medium text-[#001F3F] shadow-sm transition-colors hover:bg-[#F8F9FA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#001F3F]"
                                href={heroContent?.cta_secondary_url || "/services"}
                            >
                                {getCTASecondary()}
                            </Link>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="order-1 lg:order-2 relative h-[300px] lg:h-full min-h-[400px] w-full lg:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[#001F3F]/10 z-10"></div> {/* Overlay */}
                        <Image
                            src={heroImageUrl}
                            alt="Sygma Consult Corporate Meeting"
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            priority
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
