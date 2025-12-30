'use client';

import Link from 'next/link';
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';


interface SiteSettings {
    company_name: string;
    company_description_en: string;
    company_description_fr: string;
    company_description_ar: string;
    phone_primary: string;
    email_primary: string;
    address_paris_en: string;
    address_paris_fr: string;
    address_paris_ar: string;
    address_tunis_en: string;
    address_tunis_fr: string;
    address_tunis_ar: string;
    linkedin_url?: string;
    twitter_url?: string;
    facebook_url?: string;
    instagram_url?: string;
}

import settingsData from '@/data/settings.json';

export default function Footer() {
    const { t, language, logoUrl } = useLanguage();
    const [settings, setSettings] = useState<SiteSettings | null>(settingsData);

    // No effect needed as we load from JSON


    // Get description based on language
    const getDescription = () => {
        if (!settings) return t.footer.desc;
        if (language === 'fr') return settings.company_description_fr || t.footer.desc;
        if (language === 'ar') return settings.company_description_ar || t.footer.desc;
        return settings.company_description_en || t.footer.desc;
    };

    // Get address based on language
    const getAddress = (city: 'paris' | 'tunis') => {
        if (!settings) {
            return city === 'paris'
                ? '6 rue Paul Verlaine, 93130 Noisy-le-Sec'
                : 'Les Berges du Lac II, 1053 Tunis';
        }
        if (city === 'paris') {
            if (language === 'fr') return settings.address_paris_fr;
            if (language === 'ar') return settings.address_paris_ar;
            return settings.address_paris_en;
        } else {
            if (language === 'fr') return settings.address_tunis_fr;
            if (language === 'ar') return settings.address_tunis_ar;
            return settings.address_tunis_en;
        }
    };

    const [imgSrc, setImgSrc] = useState<string | null>(null);

    useEffect(() => {
        if (logoUrl) setImgSrc(logoUrl);
    }, [logoUrl]);

    return (
        <footer className="bg-[#001F3F] text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">

                    {/* Brand Column - Always Visible */}
                    <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
                        <Link className="flex items-center gap-2 font-serif text-2xl font-bold text-white" href="/">
                            {imgSrc ? (
                                <Image
                                    src={imgSrc}
                                    alt="Sygma Consult"
                                    width={40}
                                    height={40}
                                    className="h-10 w-auto brightness-0 invert"
                                    onError={() => setImgSrc(null)}
                                />
                            ) : null}
                            SYGMA<span className="text-[#D4AF37]">CONSULT</span>
                        </Link>
                        <p className="text-white text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                            {getDescription()}
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            {settings?.linkedin_url && (
                                <Link href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                                    <Linkedin className="h-5 w-5" />
                                </Link>
                            )}
                            {settings?.twitter_url && (
                                <Link href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </Link>
                            )}
                            {settings?.facebook_url && (
                                <Link href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Quick Links - Hidden on Mobile */}
                    <div className="space-y-4 hidden md:block">
                        <h3 className="text-lg font-bold text-[#D4AF37]">{t.footer.quick_links}</h3>
                        <ul className="space-y-2 text-sm text-gray-200">
                            <li><Link href="/about" className="hover:text-white transition-colors">{t.nav.about}</Link></li>
                            <li><Link href="/services" className="hover:text-white transition-colors">{t.nav.services}</Link></li>
                            <li><Link href="/insights" className="hover:text-white transition-colors">{t.nav.insights}</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">{t.footer.careers}</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link></li>
                        </ul>
                    </div>

                    {/* Services - Hidden on Mobile */}
                    <div className="space-y-4 hidden md:block">
                        <h3 className="text-lg font-bold text-[#D4AF37]">{t.footer.expertise}</h3>
                        <ul className="space-y-2 text-sm text-gray-200">
                            <li><Link href="/services/strategic" className="hover:text-white transition-colors">{t.services.items.strategic.title}</Link></li>
                            <li><Link href="/services/financial-legal" className="hover:text-white transition-colors">{t.services.items.financial.title}</Link></li>
                            <li><Link href="/services/visa" className="hover:text-white transition-colors">{t.services.items.visa.title}</Link></li>
                            <li><Link href="/services/corporate" className="hover:text-white transition-colors">{t.services.items.corporate.title}</Link></li>
                            <li><Link href="/services/real-estate" className="hover:text-white transition-colors">{t.services.items.realestate.title}</Link></li>
                        </ul>
                    </div>

                    {/* Contact - Always Visible but Compact */}
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-lg font-bold text-[#D4AF37] md:block hidden">{t.footer.contact}</h3>
                        <ul className="space-y-4 text-sm text-gray-200 inline-block text-left md:block">
                            <li className="flex items-start gap-3 justify-center md:justify-start">
                                <MapPin className="h-5 w-5 text-[#D4AF37] shrink-0" />
                                <span>
                                    <strong>{t.footer.address_paris}:</strong> {getAddress('paris')}<br />
                                    <strong>{t.footer.address_tunis}:</strong> {getAddress('tunis')}
                                </span>
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <Phone className="h-5 w-5 text-[#D4AF37] shrink-0" />
                                <span>{settings?.phone_primary || '+33 7 52 03 47 86'}</span>
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <Mail className="h-5 w-5 text-[#D4AF37] shrink-0" />
                                <span>{settings?.email_primary || 'contact@sygma-consult.com'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Sygma Consult. {t.footer.rights}
                    </p>
                    <div className="flex gap-8 text-sm text-gray-400">
                        <Link href="/terms" className="hover:text-white py-2">{t.footer.terms}</Link>
                        <Link href="/legal" className="hover:text-white py-2">{t.footer.legal}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
