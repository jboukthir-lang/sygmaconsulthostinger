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
    Building2
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
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) {
                console.error('Error loading services:', error);
                // Fallback to hardcoded services if database fails
                useFallbackServices();
                return;
            }

            if (data && data.length > 0) {
                // Map database services to component format
                const mappedServices = data.map((service: ServiceFromDB) => ({
                    title: language === 'ar' ? service.title_ar : language === 'fr' ? service.title_fr : service.title_en,
                    description: language === 'ar' ? service.description_ar : language === 'fr' ? service.description_fr : service.description_en,
                    icon: iconMap[service.icon] || Briefcase,
                    href: service.href,
                }));
                setServices(mappedServices);
            } else {
                // No services in database, use fallback
                useFallbackServices();
            }
        } catch (error) {
            console.error('Error loading services:', error);
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
        <section className="py-20 bg-[#F8F9FA]" id="services">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#001F3F] font-serif">
                        {t.services.title}
                    </h2>
                    <p className="max-w-[700px] text-[#4A4A4A] md:text-lg">
                        {t.services.subtitle}
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <Link
                            key={index}
                            href={service.href}
                            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md border border-gray-100 hover:border-[#D4AF37]/30"
                        >
                            <div className="flex flex-col space-y-4">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#001F3F]/5 text-[#001F3F] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300">
                                    <service.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#001F3F] group-hover:text-[#D4AF37] transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-[#4A4A4A] leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
