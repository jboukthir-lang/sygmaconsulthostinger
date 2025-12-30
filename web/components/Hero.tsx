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
    const getSubtitle = () => heroContent?.[`subtitle_${language}` as keyof HeroSection] || (language === 'fr' ? "Accompagnement expert pour la croissance de votre entreprise entre la France et la Tunisie. Nous transformons les défis en opportunités avec des stratégies sur mesure." : t.hero.subtitle);
    const getCTA = () => heroContent?.[`cta_text_${language}` as keyof HeroSection] || t.hero.cta_book;
    const getCTASecondary = () => heroContent?.[`cta_secondary_text_${language}` as keyof HeroSection] || t.hero.cta_services;
    const getHighlight1 = () => heroContent?.[`content_${language}` as keyof HeroSection]?.highlight1 || (language === 'ar' ? 'باريس' : 'Paris');
    const getHighlight2 = () => heroContent?.[`content_${language}` as keyof HeroSection]?.highlight2 || (language === 'ar' ? 'تونس' : 'Tunis');

    return (
        <section className="relative w-full overflow-hidden bg-white text-[#001F3F] py-12 md:py-20 lg:py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#001F3F 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid gap-12 lg:grid-cols-2 items-center">

                    {/* Content Column */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#001F3F]/5 px-4 py-1.5 text-sm font-semibold text-[#D4AF37] border border-[#001F3F]/10 w-fit backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                                </span>
                                {getBadge()}
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-serif leading-[1.1] text-[#001F3F]">
                                {getTitle()} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B4941F]">
                                    {getHighlight1()} & {getHighlight2()}
                                </span>
                            </h1>
                            <p className="max-w-[500px] text-gray-600 text-lg leading-relaxed border-l-2 border-[#D4AF37] pl-4">
                                {getSubtitle()}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row pt-2">
                            <Link
                                className="inline-flex h-12 items-center justify-center rounded-lg bg-[#D4AF37] px-8 text-sm font-bold text-white shadow-lg shadow-[#D4AF37]/20 transition-all hover:bg-[#B4941F] hover:-translate-y-0.5"
                                href={heroContent?.cta_url || "/booking"}
                            >
                                {getCTA()}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                className="inline-flex h-12 items-center justify-center rounded-lg border border-[#001F3F]/10 bg-gray-50 px-8 text-sm font-bold text-[#001F3F] hover:bg-gray-100 transition-all"
                                href={heroContent?.cta_secondary_url || "/services"}
                            >
                                {getCTASecondary()}
                            </Link>
                        </div>
                    </div>

                    {/* Visual Column / Compact Globe */}
                    <div className="relative h-[400px] w-full flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-[500px] aspect-square">
                            <Globe />
                            {/* Floating Card */}
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl p-4 rounded-xl max-w-[200px] hidden md:block animate-fade-in-up">
                                <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">Live Status</div>
                                <div className="text-sm font-medium text-[#001F3F]">Réseau actif</div>
                                <div className="text-xs text-gray-500">Paris • Tunis • Dubaï</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
