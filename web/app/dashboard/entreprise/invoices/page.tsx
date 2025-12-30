'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, Eye } from 'lucide-react';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'sent': return 'bg-blue-100 text-blue-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
                    <p className="text-gray-600 mt-1">Gérez vos factures</p>
                </div>
                <Link
                    href="/dashboard/entreprise/invoices/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Nouvelle Facture
                </Link>
            </div>

            {invoices.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune facture</h3>
                        <p className="text-gray-600 mb-6">Créez votre première facture</p>
                        <Link
                            href="/dashboard/entreprise/invoices/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Créer une facture
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.number}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.client_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.issue_date}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.total}€</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/entreprise/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-700">
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
