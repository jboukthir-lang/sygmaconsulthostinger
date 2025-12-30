'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Users, Package, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function EntrepriseDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalClients: 0,
        totalInvoices: 0,
        totalProducts: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/dashboard/stats', {
                headers: {
                    'x-user-id': user!.uid
                }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité</p>
                </div>
                <Link
                    href="/dashboard/entreprise/invoices/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors shadow-lg shadow-blue-900/20"
                >
                    <Plus className="h-5 w-5" />
                    Nouvelle Facture
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Clients</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '-' : stats.totalClients}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-100">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Factures</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '-' : stats.totalInvoices}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 transition-colors group-hover:bg-green-100">
                            <FileText className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Produits</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '-' : stats.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 transition-colors group-hover:bg-purple-100">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Chiffre d'affaires</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2 text-[#001F3F]">{loading ? '-' : stats.revenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 transition-colors group-hover:bg-yellow-100">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href="/dashboard/entreprise/clients/new"
                        className="group p-6 border border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center bg-gray-50/50 hover:bg-white"
                    >
                        <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Ajouter un client</h3>
                        <p className="text-sm text-gray-500">Enregistrez un nouveau client</p>
                    </Link>

                    <Link
                        href="/dashboard/entreprise/invoices/new"
                        className="group p-6 border border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center bg-gray-50/50 hover:bg-white"
                    >
                        <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Créer une facture</h3>
                        <p className="text-sm text-gray-500">Éditez une nouvelle facture</p>
                    </Link>

                    <Link
                        href="/dashboard/entreprise/products/new"
                        className="group p-6 border border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center bg-gray-50/50 hover:bg-white"
                    >
                        <div className="w-14 h-14 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Package className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Ajouter un produit</h3>
                        <p className="text-sm text-gray-500">Gérez votre catalogue</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
