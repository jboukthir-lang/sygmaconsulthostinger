'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FileText, Users, Package, Settings, LayoutDashboard, LogOut, CreditCard, Briefcase, Users2 } from 'lucide-react';

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
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-[#001F3F]">SYGMAINVOICE</h1>
                    <p className="text-sm text-gray-600 mt-1">Espace Entreprise</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
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

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
