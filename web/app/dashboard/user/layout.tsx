'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, User, Wallet, FileText, Settings, LogOut } from 'lucide-react';

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    if (!user) return null;

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard/user' },
        { icon: Wallet, label: 'Mes Factures', href: '/dashboard/user/invoices' },
        { icon: FileText, label: 'Mes Devis', href: '/dashboard/user/quotes' },
        { icon: User, label: 'Mon Profil', href: '/dashboard/user/profile' },
        { icon: Settings, label: 'Paramètres', href: '/dashboard/user/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            S
                        </div>
                        <span className="text-xl font-bold text-gray-900">Sygma</span>
                    </div>
                    <div className="mt-4 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium uppercase tracking-wider text-center">
                        Espace Particulier
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
                        >
                            <item.icon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Déconnexion</span>
                    </button>
                    <div className="mt-4 flex items-center gap-3 px-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs overflow-hidden">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                            ) : (
                                (user.displayName || user.email || 'U').charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.displayName || 'Utilisateur'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
