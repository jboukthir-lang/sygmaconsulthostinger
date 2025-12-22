'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Phone, LogIn, LogOut, User, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './NotificationBell';
import { useState } from 'react';

export default function Header() {
    const { t, language, setLanguage } = useLanguage();
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">
                    <Link className="flex items-center gap-3" href="/">
                        <Image
                            src="/logo.png"
                            alt="Sygma Consult"
                            width={150}
                            height={150}
                            className="h-12 w-auto"
                            priority
                        />
                    </Link>

                    <nav className="hidden md:flex gap-8 text-sm font-medium text-[#4A4A4A]">
                        <Link className="hover:text-[#001F3F] transition-colors" href="/">{t.nav.home}</Link>
                        <Link className="hover:text-[#001F3F] transition-colors" href="/services">{t.nav.services}</Link>
                        <Link className="hover:text-[#001F3F] transition-colors" href="/about">{t.nav.about}</Link>
                        <Link className="hover:text-[#001F3F] transition-colors" href="/insights">{t.nav.insights}</Link>
                        <Link className="hover:text-[#001F3F] transition-colors" href="/contact">{t.nav.contact}</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            className="hidden md:inline-flex items-center justify-center rounded-lg border border-[#001F3F] bg-transparent px-6 py-2 text-sm font-medium text-[#001F3F] shadow-sm transition-colors hover:bg-[#F8F9FA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#001F3F]"
                            href="/contact"
                        >
                            <Phone className="mr-2 h-4 w-4" />
                            {t.nav.contact}
                        </Link>

                        {/* Language Switcher */}
                        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-[#001F3F] border-r border-gray-200 pr-4 mr-2">
                            <button onClick={() => setLanguage('en')} className={`${language === 'en' ? 'text-[#D4AF37] font-bold' : 'hover:text-[#D4AF37]'} transition-colors`}>EN</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setLanguage('fr')} className={`${language === 'fr' ? 'text-[#D4AF37] font-bold' : 'hover:text-[#D4AF37] opacity-60'} transition-colors`}>FR</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setLanguage('ar')} className={`${language === 'ar' ? 'text-[#D4AF37] font-bold' : 'hover:text-[#D4AF37] opacity-60'} transition-colors`}>AR</button>
                        </div>

                        {/* Auth Button */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-3">
                                <NotificationBell />
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded-full" />
                                    ) : (
                                        <User className="h-4 w-4 text-[#001F3F]" />
                                    )}
                                    <span className="text-sm font-medium text-[#001F3F] max-w-[100px] truncate">
                                        {user.displayName || user.email}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#001F3F] hover:text-[#D4AF37] transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    {t.nav.signOut}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#001F3F] text-sm font-medium text-[#001F3F] hover:bg-[#F8F9FA] transition-colors"
                            >
                                <LogIn className="h-4 w-4" />
                                {t.nav.signIn}
                            </Link>
                        )}

                        <Link
                            className="inline-flex items-center justify-center rounded-lg bg-[#D4AF37] px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#C5A028] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
                            href="/book"
                        >
                            {t.nav.book}
                        </Link>
                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6 text-[#001F3F]" /> : <Menu className="h-6 w-6 text-[#001F3F]" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 absolute top-20 left-0 w-full shadow-lg z-50">
                    <nav className="flex flex-col gap-4">
                        <Link onClick={() => setIsMenuOpen(false)} className="hover:text-[#001F3F] transition-colors font-medium" href="/">{t.nav.home}</Link>
                        <Link onClick={() => setIsMenuOpen(false)} className="hover:text-[#001F3F] transition-colors font-medium" href="/services">{t.nav.services}</Link>
                        <Link onClick={() => setIsMenuOpen(false)} className="hover:text-[#001F3F] transition-colors font-medium" href="/about">{t.nav.about}</Link>
                        <Link onClick={() => setIsMenuOpen(false)} className="hover:text-[#001F3F] transition-colors font-medium" href="/insights">{t.nav.insights}</Link>
                        <Link onClick={() => setIsMenuOpen(false)} className="hover:text-[#001F3F] transition-colors font-medium" href="/contact">{t.nav.contact}</Link>
                    </nav>
                    <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                        <div className="flex gap-4">
                            <button onClick={() => { setLanguage('en'); setIsMenuOpen(false); }} className={`${language === 'en' ? 'text-[#D4AF37] font-bold' : 'text-gray-500'}`}>EN</button>
                            <button onClick={() => { setLanguage('fr'); setIsMenuOpen(false); }} className={`${language === 'fr' ? 'text-[#D4AF37] font-bold' : 'text-gray-500'}`}>FR</button>
                            <button onClick={() => { setLanguage('ar'); setIsMenuOpen(false); }} className={`${language === 'ar' ? 'text-[#D4AF37] font-bold' : 'text-gray-500'}`}>AR</button>
                        </div>
                        {user ? (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                                >
                                    <User className="h-4 w-4 text-[#001F3F]" />
                                    <span>{user.displayName || user.email}</span>
                                </Link>
                                <button
                                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                                    className="flex items-center gap-2 p-2 text-red-600"
                                >
                                    <LogOut className="h-4 w-4" />
                                    {t.nav.signOut}
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2 p-3 bg-[#001F3F] text-white rounded-lg justify-center font-bold"
                            >
                                <LogIn className="h-4 w-4" />
                                {t.nav.signIn}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
