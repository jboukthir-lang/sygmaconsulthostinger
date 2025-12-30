'use client';

import { useAuth } from '@/context/AuthContext';
import { Wallet, FileText, ArrowUpRight, DollarSign } from 'lucide-react';

export default function UserDashboardPage() {
    const { user } = useAuth();
    const stats = [
        { label: 'Factures Payées', value: '0.00 €', icon: Wallet, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Devis en cours', value: '2', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Dépenses ce mois', value: '0.00 €', icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Bonjour, {user?.displayName || 'Utilisateur'} 👋
                </h1>
                <p className="text-gray-600 mt-1">
                    Bienvenue sur votre espace personnel.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Invoices */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Factures récentes</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            Voir tout <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="p-8 text-center text-gray-500">
                        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p>Aucune facture récente</p>
                    </div>
                </div>

                {/* Notifications / News */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Actualités</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-semibold text-blue-900 mb-1">Bienvenue sur Sygma !</h3>
                                <p className="text-sm text-blue-700">
                                    Votre espace est prêt. Vous pouvez désormais gérer vos demandes et documents en toute simplicité.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
