'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Phone, LogIn, LogOut, User, X, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './NotificationBell';
import { useState, useEffect } from 'react';

export default function Header() {
    const { t, language, setLanguage, logoUrl } = useLanguage();
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

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

    const services = [
        {
            name: { en: 'Strategic Market Analysis', fr: 'Analyse Stratégique du Marché', ar: 'تحليل استراتيجي للسوق' },
            href: '/services/market-analysis',
            icon: '📊'
        },
        {
            name: { en: 'Digital Transformation', fr: 'Transformation Digitale', ar: 'التحول الرقمي' },
            href: '/services/digital-transformation',
            icon: '💻'
        },
        {
            name: { en: 'Cross-Border Development', fr: 'Développement Transfrontalier', ar: 'التطوير عبر الحدود' },
            href: '/services/cross-border',
            icon: '🌍'
        },
        {
            name: { en: 'Regulatory Compliance', fr: 'Conformité Réglementaire', ar: 'الامتثال التنظيمي' },
            href: '/services/compliance',
            icon: '⚖️'
        },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 md:h-20 items-center justify-between">
                    {/* Logo */}
                    <Link className="flex items-center gap-2 flex-shrink-0" href="/">
                        <Image
                            src={imgSrc || "/logo.png"}
                            alt="Sygma Consult"
                            width={120}
                            height={120}
                            className="h-8 md:h-12 w-auto"
                            priority
                            onError={() => setImgSrc("/logo.png")}
                        />
                        <span className="hidden sm:inline-block font-serif text-base md:text-xl font-bold text-[#001F3F]">
                            SYGMA<span className="text-[#D4AF37]">CONSULT</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex gap-6 xl:gap-8 text-sm font-medium text-[#4A4A4A]">
                        <Link className="hover:text-[#D4AF37] transition-colors" href="/">{t.nav.home}</Link>

                        {/* Services Mega Menu */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsServicesOpen(true)}
                            onMouseLeave={() => setIsServicesOpen(false)}
                        >
                            <button className="flex items-center gap-1 py-4 hover:text-[#D4AF37] transition-colors group">
                                {t.nav.services}
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180 text-[#D4AF37]' : 'text-gray-400 group-hover:text-[#D4AF37]'}`} />
                            </button>

                            {/* Mega Menu Container */}
                            <div className={`
                                fixed top-[64px] md:top-[80px] left-0 w-full bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out z-40
                                ${isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                            `}>
                                <div className="container mx-auto">
                                    <div className="flex">
                                        {/* Main Content Area */}
                                        <div className="flex-1 p-8 grid grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
                                                    {language === 'ar' ? 'الخدمات الاستراتيجية' : language === 'fr' ? 'Services Stratégiques' : 'Strategic Services'}
                                                </h3>
                                                <div className="space-y-4">
                                                    {services.slice(0, 2).map((service, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={service.href}
                                                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group"
                                                        >
                                                            <span className="text-2xl mt-1">{service.icon}</span>
                                                            <div>
                                                                <h4 className="font-bold text-[#001F3F] group-hover:text-[#D4AF37] transition-colors">
                                                                    {service.name[language as keyof typeof service.name]}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                                    {language === 'ar'
                                                                        ? 'حلول مخصصة لتنمية أعمالك وتحقيق أهدافك'
                                                                        : language === 'fr'
                                                                            ? 'Solutions sur mesure pour développer votre entreprise.'
                                                                            : 'Tailored solutions to grow your business.'}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
                                                    {language === 'ar' ? 'التطوير و الامتثال' : language === 'fr' ? 'Développement & Conformité' : 'Development & Compliance'}
                                                </h3>
                                                <div className="space-y-4">
                                                    {services.slice(2, 4).map((service, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={service.href}
                                                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group"
                                                        >
                                                            <span className="text-2xl mt-1">{service.icon}</span>
                                                            <div>
                                                                <h4 className="font-bold text-[#001F3F] group-hover:text-[#D4AF37] transition-colors">
                                                                    {service.name[language as keyof typeof service.name]}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                                    {language === 'ar'
                                                                        ? 'خبرة دولية لضمان نجاحك في جميع الأسواق'
                                                                        : language === 'fr'
                                                                            ? 'Expertise internationale pour assurer votre succès.'
                                                                            : 'International expertise to ensure your success.'}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Featured Side Panel */}
                                        <div className="w-80 bg-gray-50 p-8 border-l border-gray-100 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-4">
                                                    {language === 'ar' ? 'مميز' : language === 'fr' ? 'En Vedette' : 'Featured'}
                                                </h3>
                                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                                    <div className="w-10 h-10 bg-[#001F3F]/10 rounded-lg flex items-center justify-center text-[#001F3F] mb-4">
                                                        <Globe className="h-5 w-5" />
                                                    </div>
                                                    <h4 className="font-bold text-[#001F3F] mb-2">
                                                        {language === 'ar' ? 'ابدأ عالمياً' : language === 'fr' ? 'Lancez-vous à l\'International' : 'Go Global'}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mb-4">
                                                        {language === 'ar' ? 'استشارة مجانية لمدة 30 دقيقة' : language === 'fr' ? 'Consultation gratuite de 30 minutes.' : 'Free 30-minute consultation.'}
                                                    </p>
                                                    <Link
                                                        href="/booking"
                                                        className="text-sm font-semibold text-[#D4AF37] hover:text-[#C5A028] flex items-center gap-1"
                                                    >
                                                        {t.nav.book} <span className="text-lg">→</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            <Link
                                                href="/services"
                                                className="block w-full py-3 text-center text-sm font-semibold text-[#001F3F] border border-[#001F3F]/20 rounded-xl hover:bg-[#001F3F] hover:text-white transition-all"
                                            >
                                                {language === 'en' ? 'View All Services' : language === 'fr' ? 'Voir Tous les Services' : 'عرض جميع الخدمات'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link className="hover:text-[#D4AF37] transition-colors" href="/about">{t.nav.about}</Link>
                        <Link className="hover:text-[#D4AF37] transition-colors" href="/insights">{t.nav.insights}</Link>
                        <Link className="hover:text-[#D4AF37] transition-colors" href="/contact">{t.nav.contact}</Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Language Switcher */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <button onClick={() => setLanguage('en')} className={`text-xs font-semibold ${language === 'en' ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'} transition-colors`}>EN</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setLanguage('fr')} className={`text-xs font-semibold ${language === 'fr' ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'} transition-colors`}>FR</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setLanguage('ar')} className={`text-xs font-semibold ${language === 'ar' ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'} transition-colors`}>AR</button>
                        </div>

                        {/* Auth */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <NotificationBell />
                                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="h-7 w-7 rounded-full" />
                                    ) : (
                                        <User className="h-4 w-4 text-[#001F3F]" />
                                    )}
                                    <span className="text-sm font-medium text-[#001F3F] max-w-[100px] truncate">{user.displayName || user.email}</span>
                                </Link>
                                <button onClick={handleSignOut} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#001F3F] text-sm font-medium text-[#001F3F] hover:bg-[#F8F9FA] transition-colors">
                                <LogIn className="h-4 w-4" />
                                {t.nav.signIn}
                            </Link>
                        )}

                        {/* Book Button */}
                        <Link href="/booking" className="inline-flex items-center justify-center rounded-lg bg-[#D4AF37] px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#C5A028] transition-all hover:shadow-lg">
                            {t.nav.book}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6 text-[#001F3F]" /> : <Menu className="h-6 w-6 text-[#001F3F]" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - FIXED VERSION */}
            {isMenuOpen && (
                <div className="lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="fixed top-16 md:top-20 left-0 right-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-white z-50 overflow-y-auto">
                        <div className="container mx-auto px-4 py-6 space-y-6">
                            {/* Navigation Links */}
                            <nav className="space-y-1">
                                <Link
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                    href="/"
                                >
                                    <span className="font-semibold text-gray-900 group-hover:text-[#D4AF37]">{t.nav.home}</span>
                                    <span className="text-gray-400 group-hover:text-[#D4AF37]">→</span>
                                </Link>

                                {/* Services Expandable */}
                                <div>
                                    <button
                                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-900">{t.nav.services}</span>
                                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isServicesOpen && (
                                        <div className="ml-4 mt-2 space-y-2">
                                            {services.map((service, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={service.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50"
                                                >
                                                    <span className="text-xl">{service.icon}</span>
                                                    <span className="text-sm text-gray-700">{service.name[language as keyof typeof service.name]}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Link
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                    href="/about"
                                >
                                    <span className="font-semibold text-gray-900 group-hover:text-[#D4AF37]">{t.nav.about}</span>
                                    <span className="text-gray-400 group-hover:text-[#D4AF37]">→</span>
                                </Link>
                                <Link
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                    href="/insights"
                                >
                                    <span className="font-semibold text-gray-900 group-hover:text-[#D4AF37]">{t.nav.insights}</span>
                                    <span className="text-gray-400 group-hover:text-[#D4AF37]">→</span>
                                </Link>
                                <Link
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                    href="/contact"
                                >
                                    <span className="font-semibold text-gray-900 group-hover:text-[#D4AF37]">{t.nav.contact}</span>
                                    <span className="text-gray-400 group-hover:text-[#D4AF37]">→</span>
                                </Link>
                            </nav>

                            {/* Language Switcher */}
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Globe className="h-5 w-5 text-[#D4AF37]" />
                                    <span className="text-sm font-semibold text-gray-700">Language</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => { setLanguage('en'); setIsMenuOpen(false); }}
                                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${language === 'en' ? 'bg-[#D4AF37] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        🇬🇧 EN
                                    </button>
                                    <button
                                        onClick={() => { setLanguage('fr'); setIsMenuOpen(false); }}
                                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${language === 'fr' ? 'bg-[#D4AF37] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        🇫🇷 FR
                                    </button>
                                    <button
                                        onClick={() => { setLanguage('ar'); setIsMenuOpen(false); }}
                                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${language === 'ar' ? 'bg-[#D4AF37] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        🇹🇳 AR
                                    </button>
                                </div>
                            </div>

                            {/* User Section */}
                            {user ? (
                                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Profile" className="h-10 w-10 rounded-full" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{user.displayName || 'User'}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                                        className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        {t.nav.signOut}
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 p-4 bg-[#001F3F] text-white rounded-2xl font-bold shadow-lg hover:bg-[#003366] transition-all"
                                >
                                    <LogIn className="h-5 w-5" />
                                    {t.nav.signIn}
                                </Link>
                            )}

                            {/* CTA Button */}
                            <Link
                                href="/booking"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                <Phone className="h-5 w-5" />
                                {t.nav.book}
                            </Link>

                            {/* Contact Info */}
                            <div className="pt-4 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-500 mb-2">Need help?</p>
                                <a href="tel:+33752034786" className="text-[#D4AF37] font-semibold text-lg">
                                    +33 7 52 03 47 86
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
