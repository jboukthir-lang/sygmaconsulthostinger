'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function InvoicesPage() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchInvoices();
        }
    }, [user]);

    const fetchInvoices = async () => {
        try {
            const response = await fetch('/api/invoices', {
                headers: {
                    'x-user-id': user?.uid || ''
                }
            });
            if (response.ok) {
                const data = await response.json();
                setInvoices(data);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Chargement des factures...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
                    <p className="text-gray-600 mt-1">Gérez vos factures</p>
                </div>
                <Link
                    href="/dashboard/entreprise/invoices/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Nouvelle Facture
                </Link>
            </div>

            {invoices.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune facture</h3>
                        <p className="text-gray-600 mb-6">Créez votre première facture</p>
                        <Link
                            href="/dashboard/entreprise/invoices/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus className="h-5 w-5" />
                            Créer une facture
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.number}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="font-medium text-gray-900">{invoice.client_name}</div>
                                        <div className="text-xs text-gray-500">{invoice.client_email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(invoice.issue_date).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{invoice.total?.toFixed(2)} €</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/entreprise/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                                            <Eye className="h-5 w-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
