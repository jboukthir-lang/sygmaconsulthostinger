'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Phone, LogIn, LogOut, User, X, Globe, ChevronDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './NotificationBell';
import { useState, useEffect } from 'react';

export default function Header() {
    const { t, language, setLanguage, logoUrl } = useLanguage();
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);

    // Restore missing state
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [servicesLoading, setServicesLoading] = useState(true);

    useEffect(() => {
        setImgSrc(logoUrl || "/logo.png");
    }, [logoUrl]);

    useEffect(() => {
        // Close menu on escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMenuOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    useEffect(() => {
        // Prevent body scroll when menu is open
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    // Fetch services from MySQL API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/services');
                if (response.ok) {
                    const data = await response.json();
                    // Take only first 4 services for header dropdown
                    setServices(data.slice(0, 4));
                }
            } catch (error) {
                console.error('Failed to fetch services for header:', error);
            } finally {
                setServicesLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <header className="hidden md:block sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-12">
                        <Link className="flex items-center gap-2 group" href="/">
                            <Image
                                src={imgSrc || "/logo.png"}
                                alt="Sygma Consult"
                                width={120}
                                height={120}
                                className="h-10 w-auto transition-transform group-hover:scale-105"
                                priority
                                onError={() => setImgSrc("/logo.png")}
                            />
                            <div className="hidden sm:block">
                                <span className="font-serif text-xl font-bold text-[#001F3F] tracking-tight">SYGMA</span>
                                <span className="font-serif text-xl font-bold text-[#D4AF37] tracking-tight">CONSULT</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            <Link
                                href="/"
                                className="text-sm font-medium text-gray-700 hover:text-[#001F3F] relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-0.5 after:bg-[#D4AF37] after:transition-all hover:after:w-full"
                            >
                                {t.nav.home}
                            </Link>

                            {/* Services Dropdown */}
                            <div
                                className="relative group h-20 flex items-center"
                                onMouseEnter={() => setIsServicesOpen(true)}
                                onMouseLeave={() => setIsServicesOpen(false)}
                            >
                                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 group-hover:text-[#001F3F]">
                                    {t.nav.services}
                                    <ChevronDown className={`h-3 w-3 transition-transform ${isServicesOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                                </button>

                                {/* Mega Menu */}
                                <div className={`absolute top-full left-0 w-[600px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden transition-all duration-200 ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                    <div className="p-6 grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Expertise</h4>
                                            {services.slice(0, 3).map((service, idx) => (
                                                <Link key={idx} href={service.href || '#'} className="block group/item">
                                                    <div className="font-semibold text-[#001F3F] group-hover/item:text-[#D4AF37] transition-colors text-sm">
                                                        {language === 'ar' ? service.title_ar : language === 'fr' ? service.title_fr : service.title_en}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                                        {language === 'ar' ? service.description_ar : language === 'fr' ? service.description_fr : service.description_en}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-xs font-bold text-[#001F3F] uppercase tracking-wider mb-2">À la une</h4>
                                            <p className="text-xs text-gray-600 mb-3">Découvrez nos solutions digitales pour optimiser votre trésorerie.</p>
                                            <Link href="/services/digital" className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 hover:gap-2 transition-all">
                                                En savoir plus <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Company Dropdown */}
                            <div
                                className="relative group h-20 flex items-center"
                                onMouseEnter={() => setIsCompanyOpen(true)}
                                onMouseLeave={() => setIsCompanyOpen(false)}
                            >
                                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 group-hover:text-[#001F3F]">
                                    {language === 'ar' ? 'الشركة' : language === 'fr' ? 'Entreprise' : 'Company'}
                                    <ChevronDown className={`h-3 w-3 transition-transform ${isCompanyOpen ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                                </button>

                                <div className={`absolute top-full left-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 transition-all duration-200 ${isCompanyOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                    <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]">
                                        {t.nav.about}
                                    </Link>
                                    <Link href="/team" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]">
                                        {language === 'ar' ? 'فريقنا' : language === 'fr' ? 'Notre Équipe' : 'Our Team'}
                                    </Link>
                                    <Link href="/partners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37]">
                                        {language === 'ar' ? 'الشركاء' : language === 'fr' ? 'Partenaires' : 'Partners'}
                                    </Link>
                                </div>
                            </div>

                            <Link
                                href="/contact"
                                className="text-sm font-medium text-gray-700 hover:text-[#001F3F] relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-0.5 after:bg-[#D4AF37] after:transition-all hover:after:w-full"
                            >
                                {t.nav.contact}
                            </Link>

                        </nav>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex items-center gap-4">

                        {/* Language - Compact */}
                        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-1 py-1">
                            {['en', 'fr', 'ar'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang as any)}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === lang ? 'bg-white text-[#001F3F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Client Portal Button */}
                        <Link
                            href="/login"
                            className="hidden md:inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#B4941F] hover:-translate-y-0.5 shadow-lg shadow-[#D4AF37]/20"
                        >
                            <User className="h-4 w-4" />
                            <span className="hidden lg:inline">{language === 'ar' ? 'منطقة العملاء' : language === 'fr' ? 'Espace Client' : 'Client Portal'}</span>
                        </Link>

                        {/* CTA */}
                        <Link
                            href="/booking"
                            className="hidden md:inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#D4AF37]/20 hover:bg-[#B4941F] hover:-translate-y-0.5 transition-all"
                        >
                            {t.nav.book}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 text-[#001F3F]"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-20 bg-white z-40 overflow-y-auto lg:hidden">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-[#001F3F]">{t.nav.home}</Link>
                            <Link href="/services" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-[#001F3F]">{t.nav.services}</Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-[#001F3F]">{t.nav.about}</Link>
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-[#001F3F]">{t.nav.contact}</Link>
                        </div>

                        {/* Mobile Language Switcher */}
                        <div className="flex justify-center gap-4 bg-gray-50 p-2 rounded-xl">
                            {['en', 'fr', 'ar'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang as any)}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${language === lang ? 'bg-white text-[#001F3F] shadow-sm' : 'text-gray-500'}`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-100 space-y-4">
                            <Link href="/login" className="flex w-full items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#001F3F] text-[#001F3F] font-bold">
                                {t.nav.signIn}
                            </Link>
                            <Link href="/booking" className="flex w-full items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-white font-bold">
                                {t.nav.book}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
