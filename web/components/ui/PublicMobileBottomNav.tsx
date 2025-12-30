'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Phone, User, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PublicMobileBottomNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    // Hide on dashboard routes (handled by Dashboard Layout)
    if (pathname?.startsWith('/dashboard')) return null;

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { icon: Home, label: t.nav.home, href: '/' },
        { icon: Briefcase, label: t.nav.services, href: '/services' },
        { icon: Calendar, label: t.nav.book, href: '/booking', highlight: true },
        { icon: Phone, label: t.nav.contact, href: '/contact' },
        { icon: User, label: t.nav.signIn, href: '/login' },
    ];

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pb-[env(safe-area-inset-bottom)] md:hidden z-50 h-[65px] flex items-center justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors relative ${active ? 'text-[#001F3F]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {item.highlight ? (
                                <div className="absolute -top-5 bg-[#D4AF37] p-3 rounded-full shadow-lg border-4 border-white mb-1">
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                            ) : (
                                <item.icon className={`h-6 w-6 ${active ? 'fill-[#001F3F]/10' : ''}`} strokeWidth={active ? 2.5 : 2} />
                            )}
                            <span className={`text-[10px] font-medium ${item.highlight ? 'mt-6' : ''}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
            {/* Spacer to prevent footer overlap */}
            <div className="md:hidden h-[80px] w-full flex-none" />
        </>
    );
}
