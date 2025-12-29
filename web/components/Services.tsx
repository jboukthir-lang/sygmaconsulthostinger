'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Briefcase,
    Scale,
    Globe2,
    TrendingUp,
    Users2,
    ShieldCheck,
    Building2,
    ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

// Icon mapping for dynamic icons from database
const iconMap: { [key: string]: any } = {
    'Briefcase': Briefcase,
    'Globe2': Globe2,
    'Building2': Building2,
    'Scale': Scale,
    'TrendingUp': TrendingUp,
    'Users2': Users2,
    'ShieldCheck': ShieldCheck,
};

interface ServiceFromDB {
    id: string;
    title_en: string;
    title_fr: string;
    title_ar: string;
    description_en: string;
    description_fr: string;
    description_ar: string;
    icon: string;
    href: string;
    is_active: boolean;
    display_order: number;
    image_url?: string;
    price?: number;
}

export default function Services() {
    const { t, language } = useLanguage();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadServices();
    }, [language]);

    async function loadServices() {
        try {
            console.log('🔍 Loading services from database...');

            const response = await fetch('/api/services');
            if (!response.ok) throw new Error('Failed to fetch services');

            const data = await response.json();

            if (data && data.length > 0) {
                console.log(`✅ Loaded ${data.length} services from database`);

                // Map database services to component format
                const mappedServices = data.map((service: ServiceFromDB) => ({
                    title: language === 'ar' ? service.title_ar : language === 'fr' ? service.title_fr : service.title_en,
                    description: language === 'ar' ? service.description_ar : language === 'fr' ? service.description_fr : service.description_en,
                    icon: iconMap[service.icon] || Briefcase,
                    href: service.href,
                    image_url: service.image_url,
                    price: service.price,
                }));

                setServices(mappedServices);
            } else {
                console.warn('⚠️  No services found in database, using fallback');
                useFallbackServices();
            }
        } catch (error) {
            console.error('💥 Failed to load services, using fallback:', error);
            useFallbackServices();
        } finally {
            setLoading(false);
        }
    }

    function useFallbackServices() {
        // Fallback to translation-based services if database is empty
        setServices([
            {
                title: t.services.items.visa.title,
                description: t.services.items.visa.desc,
                icon: Globe2,
                href: "/services/visa",
            },
            {
                title: t.services.items.corporate.title,
                description: t.services.items.corporate.desc,
                icon: Briefcase,
                href: "/services/corporate",
            },
            {
                title: t.services.items.realestate.title,
                description: t.services.items.realestate.desc,
                icon: Building2,
                href: "/services/real-estate",
            },
            {
                title: t.services.items.financial.title,
                description: t.services.items.financial.desc,
                icon: Scale,
                href: "/services/financial-legal",
            },
            {
                title: t.services.items.strategic.title,
                description: t.services.items.strategic.desc,
                icon: TrendingUp,
                href: "/services/strategic",
            },
            {
                title: t.services.items.hr.title,
                description: t.services.items.hr.desc,
                icon: Users2,
                href: "/services/hr-training",
            },
            {
                title: t.services.items.compliance.title,
                description: t.services.items.compliance.desc,
                icon: ShieldCheck,
                href: "/services/compliance",
            },
            {
                title: t.services.items.digital.title,
                description: t.services.items.digital.desc,
                icon: Briefcase,
                href: "/services/digital",
            }
        ]);
    }

    return (
        <section className="py-24 bg-white" id="services">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <div className="inline-block rounded-full bg-[#F8F9FA] px-3 py-1 text-sm font-semibold text-[#D4AF37] border border-[#D4AF37]/20 mb-2">
                        {language === 'ar' ? 'خدماتنا' : language === 'fr' ? 'Nos Services' : 'Our Services'}
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-[#001F3F] font-serif">
                        {t.services.title}
                    </h2>
                    <p className="max-w-[800px] text-gray-600 md:text-lg leading-relaxed">
                        {t.services.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Link
                            key={index}
                            href={service.href}
                            className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100"
                        >
                            {/* Image Header */}
                            <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                                {service.image_url ? (
                                    <img
                                        src={service.image_url}
                                        alt={service.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#001F3F]/5">
                                        <service.icon className="h-16 w-16 text-[#001F3F]/20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F] via-transparent to-transparent opacity-60"></div>

                                {/* Floating Icon */}
                                <div className="absolute bottom-4 left-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 backdrop-blur text-[#001F3F] shadow-lg">
                                    <service.icon className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col justify-between p-8">
                                <div>
                                    <h3 className="mb-3 text-2xl font-bold text-[#001F3F] group-hover:text-[#D4AF37] transition-colors font-serif">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
                                    <span className="text-sm font-semibold text-[#D4AF37] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        {language === 'ar' ? 'تفاصيل أكثر' : language === 'fr' ? 'Voir détails' : 'Learn more'}
                                        <ArrowRight className="h-4 w-4" />
                                    </span>

                                    {service.price && service.price > 0 && (
                                        <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                            €{service.price}+
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
