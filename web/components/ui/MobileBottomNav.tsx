'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, CreditCard, Menu, X, Settings, LogOut, Package, Briefcase, Users2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { signOut } = useAuth();

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    const navItems = [
        { icon: LayoutDashboard, label: 'Accueil', href: '/dashboard/entreprise', exact: true },
        { icon: FileText, label: 'Factures', href: '/dashboard/entreprise/invoices' },
        { icon: CreditCard, label: 'Dépenses', href: '/dashboard/entreprise/expenses' },
        { icon: Users, label: 'Clients', href: '/dashboard/entreprise/clients' },
    ];

    const menuItems = [
        { icon: Briefcase, label: 'Projets', href: '/dashboard/entreprise/projects' },
        { icon: Package, label: 'Produits', href: '/dashboard/entreprise/products' },
        { icon: Users2, label: 'Équipe', href: '/dashboard/entreprise/team' },
        { icon: Settings, label: 'Paramètres', href: '/dashboard/entreprise/settings' },
        { icon: Users, label: 'Mon Profil', href: '/dashboard/entreprise/profile' },
    ];

    return (
        <>
            {/* Expanded Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMenuOpen(false)}>
                    <div className="absolute bottom-[calc(60px+env(safe-area-inset-bottom))] left-0 right-0 bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-[#001F3F]">Menu Complet</h3>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex flex-col items-center gap-2 p-2 rounded-xl active:bg-gray-50"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#001F3F]">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-[10px] font-medium text-center text-gray-600 leading-tight">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center justify-center gap-2 p-3 text-red-600 font-medium bg-red-50 rounded-xl"
                            >
                                <LogOut className="h-5 w-5" />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pb-[env(safe-area-inset-bottom)] md:hidden z-50 h-[60px] flex items-center justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => {
                    const active = item.exact ? pathname === item.href : isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${active ? 'text-[#001F3F]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <item.icon className={`h-6 w-6 ${active ? 'fill-[#001F3F]/10' : ''}`} strokeWidth={active ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isMenuOpen ? 'text-[#001F3F]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Menu className="h-6 w-6" strokeWidth={isMenuOpen ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
            </div>
        </>
    );
}
