'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FileText, Users, Package, Settings, LayoutDashboard, LogOut, CreditCard, Briefcase, Users2 } from 'lucide-react';
import MobileBottomNav from '@/components/ui/MobileBottomNav';

export default function EntrepriseLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    if (!user) {
        return null;
    }

    const menuItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard/entreprise' },
        { icon: Users, label: 'Clients', href: '/dashboard/entreprise/clients' },
        { icon: FileText, label: 'Factures', href: '/dashboard/entreprise/invoices' },
        { icon: CreditCard, label: 'Dépenses', href: '/dashboard/entreprise/expenses' },
        { icon: Briefcase, label: 'Projets', href: '/dashboard/entreprise/projects' },
        { icon: Settings, label: 'Paramètres', href: '/dashboard/entreprise/settings' },
        { icon: Users2, label: 'Équipe', href: '/dashboard/entreprise/team' },
        { icon: Package, label: 'Produits', href: '/dashboard/entreprise/products' },
        { icon: Users, label: 'Mon Profil', href: '/dashboard/entreprise/profile' }, // Added
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Hidden on mobile, Flex on desktop */}
            <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed inset-y-0 z-30">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-[#001F3F]">SYGMAINVOICE</h1>
                    <p className="text-sm text-gray-600 mt-1">Espace Entreprise</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#001F3F]"
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-600 w-full"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Déconnexion</span>
                    </button>
                </div>
            </div>

            {/* Mobile Top Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center px-4 justify-between">
                <span className="text-xl font-bold text-[#001F3F]">SYGMAINVOICE</span>
                <div className="w-8 h-8 bg-[#001F3F] rounded-full text-white flex items-center justify-center font-bold">
                    {user?.email?.[0].toUpperCase()}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:pl-64 flex flex-col min-h-screen pt-16 md:pt-0">
                <div className="p-4 md:p-8 pb-24 md:pb-8 flex-1">
                    {children}
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
}
