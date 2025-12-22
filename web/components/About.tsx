'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AboutSection {
    title_en: string;
    title_fr: string;
    title_ar: string;
    subtitle_en: string;
    subtitle_fr: string;
    subtitle_ar: string;
    description_en: string;
    description_fr: string;
    description_ar: string;
    cta_text_en: string;
    cta_text_fr: string;
    cta_text_ar: string;
    cta_url: string;
    content_en: any;
    content_fr: any;
    content_ar: any;
}

export default function About() {
    const { t, language } = useLanguage();
    const [aboutContent, setAboutContent] = useState<AboutSection | null>(null);

    const fetchAboutContent = async () => {
        try {
            const { data, error } = await supabase
                .from('homepage_sections')
                .select('*')
                .eq('section_name', 'about')
                .single();

            if (error) throw error;
            setAboutContent(data);
        } catch (error) {
            console.error('Error fetching about content:', error);
        }
    };

    useEffect(() => {
        fetchAboutContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get content based on language
    const getTitle = () => aboutContent?.[`title_${language}` as keyof AboutSection] || t.about.title_start;
    const getDescription = () => aboutContent?.[`description_${language}` as keyof AboutSection] || t.about.description;
    const getCTA = () => aboutContent?.[`cta_text_${language}` as keyof AboutSection] || t.about.cta_more;
    const getHighlight1 = () => aboutContent?.[`content_${language}` as keyof AboutSection]?.highlight1 || (language === 'ar' ? 'أوروبا' : language === 'fr' ? 'Europe' : 'Europe');
    const getHighlight2 = () => aboutContent?.[`content_${language}` as keyof AboutSection]?.highlight2 || (language === 'ar' ? 'أفريقيا' : language === 'fr' ? 'Afrique' : 'Africa');
    const getPoints = () => aboutContent?.[`content_${language}` as keyof AboutSection]?.points || t.about.points;
    const getLocation1 = () => aboutContent?.[`content_${language}` as keyof AboutSection]?.location1 || t.about.paris;
    const getLocation2 = () => aboutContent?.[`content_${language}` as keyof AboutSection]?.location2 || t.about.tunis;
    const getMapCaption = () => aboutContent?.[`content_${language}` as keyof AboutSection]?.map_caption || t.about.map_caption;

    return (
        <section className="py-20 bg-white" id="about">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#001F3F] font-serif">
                            {getTitle()} <span className="text-[#D4AF37]">{getHighlight1()}</span> & <span className="text-[#D4AF37]">{getHighlight2()}</span>
                        </h2>
                        <p className="text-lg text-[#4A4A4A] leading-relaxed">
                            {getDescription()}
                        </p>
                        <ul className="space-y-4">
                            {getPoints().map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                                    <span className="text-[#001F3F] font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4">
                            <Link
                                href={aboutContent?.cta_url || "/about"}
                                className="inline-flex h-12 items-center justify-center rounded-lg border border-[#001F3F] bg-transparent px-8 text-sm font-medium text-[#001F3F] shadow-sm transition-colors hover:bg-[#001F3F] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#001F3F]"
                            >
                                {getCTA()}
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-[#F8F9FA] border border-gray-100 shadow-xl p-8 flex items-center justify-center">
                        {/* Placeholder for map or office image */}
                        <div className="text-center space-y-4">
                            <div className="text-6xl font-serif text-[#001F3F]/20 font-bold">{getLocation1()}</div>
                            <div className="w-px h-20 bg-[#D4AF37] mx-auto"></div>
                            <div className="text-6xl font-serif text-[#001F3F]/20 font-bold">{getLocation2()}</div>
                            <p className="text-sm text-[#4A4A4A] mt-4 max-w-xs mx-auto">
                                {getMapCaption()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
