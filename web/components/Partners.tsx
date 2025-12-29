'use client';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Partner {
    id: string;
    name: string;
    logo_url: string;
}

export default function Partners() {
    const { language } = useLanguage();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [showPartners, setShowPartners] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // Check visibility setting first
            const { data: config } = await supabase.from('app_config').select('show_partners').eq('key', 'main').single();
            if (config && config.show_partners === false) {
                setShowPartners(false);
                return;
            }

            // Fetch partners
            const { data } = await supabase.from('partners').select('*').eq('is_active', true).order('created_at', { ascending: false });
            if (data) setPartners(data);
        }
        fetchData();
    }, []);

    if (!showPartners || partners.length === 0) return null;

    return (
        <section className="py-12 bg-white overflow-hidden border-b border-gray-100">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                    {language === 'ar' ? 'شركاؤنا الموثوقون' : language === 'fr' ? 'Nos Partenaires de Confiance' : 'Trusted by Global Leaders'}
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-8">
                    {partners.map((partner, idx) => (
                        <div key={idx} className="flex items-center justify-center h-16 w-32 relative grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
                            <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                        </div>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {partners.map((partner, idx) => (
                        <div key={`dup-${idx}`} className="flex items-center justify-center h-16 w-32 relative grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
                            <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 px-8">
                    {partners.map((partner, idx) => (
                        <div key={`mk2-${idx}`} className="flex items-center justify-center h-16 w-32 relative grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
                            <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                        </div>
                    ))}
                    {partners.map((partner, idx) => (
                        <div key={`dup2-${idx}`} className="flex items-center justify-center h-16 w-32 relative grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer">
                            <img src={partner.logo_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
