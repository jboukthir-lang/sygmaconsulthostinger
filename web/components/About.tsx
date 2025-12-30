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
        <section className="py-24 bg-white relative overflow-hidden" id="about">
            {/* Background Decoration */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
                <svg width="600" height="600" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" stroke="#001F3F" strokeWidth="1" fill="none" />
                    <circle cx="100" cy="100" r="60" stroke="#D4AF37" strokeWidth="1" fill="none" />
                    <path d="M100 20 L100 180 M20 100 L180 100" stroke="#001F3F" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid gap-16 lg:grid-cols-2 items-center">

                    {/* Text Column */}
                    <div className="space-y-8">
                        <div className="inline-block rounded-full bg-[#f0f9ff] px-3 py-1 text-sm font-semibold text-[#001F3F] border border-[#001F3F]/10">
                            {language === 'ar' ? 'نظام متكامل' : 'Système Tout-en-un'}
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#001F3F] font-serif leading-[1.2]">
                            Bien plus que des factures : <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B4941F]">
                                Un Levier de Croissance
                            </span>
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            Notre système ne se contente pas de gérer votre comptabilité. Il transforme chaque interaction client en une opportunité marketing.
                            Factures design, emails personnalisés, et outils de promotion intégrés.
                        </p>

                        <div className="space-y-5 pt-2">
                            {[
                                { title: "Facturation Intelligente", desc: "Créez des factures, devis et avoirs en 1 clic." },
                                { title: "Marketing Intégré", desc: "Vos documents deviennent des supports de communication." },
                                { title: "Gestion Commerciale", desc: "Suivi des paiements et relances automatiques." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-[#D4AF37] group-hover:scale-150 transition-transform shadow-[0_0_10px_#D4AF37]"></div>
                                    <div>
                                        <h4 className="font-bold text-[#001F3F] text-lg">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <Link
                                href="/dashboard/entreprise/invoices/new"
                                className="inline-flex h-14 items-center justify-center rounded-xl bg-[#001F3F] px-8 text-base font-medium text-white shadow-lg shadow-[#001F3F]/20 transition-all hover:bg-[#003366] hover:-translate-y-1 active:scale-95"
                            >
                                {language === 'ar' ? 'جرب النظام الآن' : 'Essayer le Système'}
                            </Link>
                        </div>
                    </div>

                    {/* Visual Column - The System Card */}
                    <div className="relative">
                        <div className="relative rounded-[2rem] bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] border border-white shadow-2xl p-8 md:p-12 overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,31,63,0.15)] transition-shadow duration-500">

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-bl-[100px]"></div>

                            {/* Central Visual */}
                            <div className="relative z-10 flex flex-col items-center gap-8">

                                {/* Top Card: The Invoice */}
                                <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="flex justify-between items-center mb-4 border-b pb-2 border-dashed">
                                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                        <div className="h-6 w-16 bg-[#001F3F]/10 rounded-full text-[10px] text-[#001F3F] flex items-center justify-center font-bold">PAYÉ</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                                        <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                                    </div>
                                </div>

                                {/* Flow Arrow */}
                                <div className="flex flex-col items-center text-[#D4AF37]">
                                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37]"></div>
                                    <div className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>
                                </div>

                                {/* Bottom Card: The Marketing Impact */}
                                <div className="w-full bg-[#001F3F] rounded-xl shadow-lg p-5 text-white transform transition-transform duration-500 group-hover:translate-y-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-8 w-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-[#001F3F]">$</div>
                                        <div>
                                            <div className="h-2 w-24 bg-white/20 rounded mb-1"></div>
                                            <div className="h-2 w-16 bg-white/10 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-white/60 bg-white/5 p-2 rounded">
                                        "Votre facture devient votre meilleure publicité."
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block animate-bounce duration-[3000ms]">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <p className="text-[#001F3F] font-bold text-sm">Automatisé & Design</p>
                                    <p className="text-xs text-gray-400">Gain de temps garanti</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
