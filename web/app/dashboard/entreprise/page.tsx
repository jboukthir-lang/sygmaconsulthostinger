'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Users, Package, TrendingUp, Plus } from 'lucide-react';

export default function EntrepriseDashboard() {
    const [stats, setStats] = useState({
        totalClients: 0,
        totalInvoices: 0,
        totalProducts: 0,
        revenue: 0,
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité</p>
                </div>
                <Link
                    href="/dashboard/entreprise/invoices/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Nouvelle Facture
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Clients</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalClients}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Factures</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalInvoices}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Produits</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.revenue}€</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/dashboard/entreprise/clients/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="font-medium text-gray-700">Ajouter un client</p>
                    </Link>

                    <Link
                        href="/dashboard/entreprise/invoices/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="font-medium text-gray-700">Créer une facture</p>
                    </Link>

                    <Link
                        href="/dashboard/entreprise/products/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="font-medium text-gray-700">Ajouter un produit</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
