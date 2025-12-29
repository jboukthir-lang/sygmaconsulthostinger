'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";

interface Service {
    id: string;
    title_en: string;
    title_fr: string;
    title_ar: string;
    description_en: string;
    description_fr: string;
    description_ar: string;
    subtitle_en?: string;
    subtitle_fr?: string;
    subtitle_ar?: string;
    features_en?: string[];
    features_fr?: string[];
    features_ar?: string[];
    icon: string;
    href: string;
    image_url?: string;
    price?: number;
}

interface ServicePreview {
    id: string;
    title_en: string;
    title_fr: string;
    title_ar: string;
    href: string;
}

export default function ServiceDetailView({ slug }: { slug: string }) {
    const { t, language } = useLanguage();
    const [service, setService] = useState<Service | null>(null);
    const [otherServices, setOtherServices] = useState<ServicePreview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadService();
        loadOtherServices();
    }, [slug, language]);

    async function loadService() {
        try {
            console.log(`🔍 Loading service: ${slug}`);
            const response = await fetch(`/api/services/${slug}`);

            if (!response.ok) {
                if (response.status === 404) console.warn('Service not found');
                throw new Error('Failed to fetch service');
            }

            const data = await response.json();

            if (data.service) {
                console.log('✅ Service loaded:', data.service.title_en);
                setService(data.service);
            }
            if (data.otherServices) {
                setOtherServices(data.otherServices);
            }
        } catch (error) {
            console.error('❌ Error loading service:', error);
        } finally {
            setLoading(false);
        }
    }

    async function loadOtherServices() {
        // Combined into loadService via single API call
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F8F9FA]">
                <Header />
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-[#001F3F]" />
                </div>
            </main>
        );
    }

    if (!service) {
        return (
            <main className="min-h-screen bg-[#F8F9FA] flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#001F3F]">
                            {language === 'ar' ? 'الخدمة غير موجودة' : language === 'fr' ? 'Service non trouvé' : 'Service Not Found'}
                        </h1>
                        <Link href="/services" className="text-[#D4AF37] hover:underline mt-4 block">
                            {language === 'ar' ? 'العودة للخدمات' : language === 'fr' ? 'Retour aux services' : 'Return to Services'}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const title = language === 'ar' ? service.title_ar : language === 'fr' ? service.title_fr : service.title_en;
    const description = language === 'ar' ? service.description_ar : language === 'fr' ? service.description_fr : service.description_en;
    const subtitle = language === 'ar' ? service.subtitle_ar : language === 'fr' ? service.subtitle_fr : service.subtitle_en;
    const features = language === 'ar' ? service.features_ar : language === 'fr' ? service.features_fr : service.features_en;


    return (
        <main className="min-h-screen bg-[#F8F9FA]">
            <Header />

            {/* Hero Header with optional image */}
            {service.image_url ? (
                <div className="relative h-[400px] bg-[#001F3F]">
                    <img
                        src={service.image_url}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F] to-transparent" />
                    <div className="relative container mx-auto px-4 md:px-6 h-full flex flex-col justify-end pb-20">
                        <Link href="/services" className="inline-flex items-center text-blue-300 hover:text-[#D4AF37] mb-6 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {language === 'ar' ? 'الخدمات' : language === 'fr' ? 'Services' : 'Services'}
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{title}</h1>
                        {subtitle && (
                            <p className="text-xl text-blue-100 max-w-2xl">{subtitle}</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-[#001F3F] text-white py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <Link href="/services" className="inline-flex items-center text-blue-300 hover:text-[#D4AF37] mb-6 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {language === 'ar' ? 'الخدمات' : language === 'fr' ? 'Services' : 'Services'}
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{title}</h1>
                        {subtitle && (
                            <p className="text-xl text-blue-100 max-w-2xl">{subtitle}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#001F3F] mb-4">
                                {language === 'ar' ? 'نظرة عامة' : language === 'fr' ? 'Aperçu' : 'Overview'}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                {description}
                            </p>
                        </div>

                        {features && features.length > 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-[#001F3F] mb-6">
                                    {language === 'ar' ? 'الإمكانيات الرئيسية' : language === 'fr' ? 'Capacités clés' : 'Key Capabilities'}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {features.map((feature: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                                            <span className="font-medium text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {service.price && service.price > 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-[#001F3F] mb-4">
                                    {language === 'ar' ? 'التسعير' : language === 'fr' ? 'Tarification' : 'Pricing'}
                                </h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-[#D4AF37]">€{service.price}</span>
                                    <span className="text-gray-500">
                                        {language === 'ar' ? 'ابتداءً من' : language === 'fr' ? 'à partir de' : 'starting from'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar CTA */}
                    <div className="space-y-6">
                        <div className="bg-[#001F3F] text-white p-8 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold mb-4">
                                {language === 'ar' ? 'هل أنت مستعد للبدء؟' : language === 'fr' ? 'Prêt à commencer?' : 'Ready to Get Started?'}
                            </h3>
                            <p className="text-blue-200 mb-6 text-sm">
                                {language === 'ar'
                                    ? 'احجز استشارة مع خبرائنا اليوم'
                                    : language === 'fr'
                                        ? 'Réservez une consultation avec nos experts dès aujourd\'hui'
                                        : 'Book a consultation with our experts today'}
                            </p>
                            <Link
                                href="/booking"
                                className="block w-full text-center bg-[#D4AF37] hover:bg-[#C5A028] text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                {language === 'ar' ? 'احجز استشارة' : language === 'fr' ? 'Réserver une consultation' : 'Book a Consultation'}
                            </Link>
                        </div>

                        {otherServices.length > 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-[#001F3F] mb-4">
                                    {language === 'ar' ? 'خدمات أخرى' : language === 'fr' ? 'Autres services' : 'Other Services'}
                                </h3>
                                <div className="flex flex-col space-y-3">
                                    {otherServices.map((s) => {
                                        const otherSlug = s.href.replace('/services/', '').replace(/\/$/, '');
                                        const otherTitle = language === 'ar' ? s.title_ar : language === 'fr' ? s.title_fr : s.title_en;
                                        return (
                                            <Link
                                                key={s.id}
                                                href={`/services/${otherSlug}`}
                                                className="text-gray-600 hover:text-[#001F3F] hover:underline transition-colors"
                                            >
                                                {otherTitle}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
