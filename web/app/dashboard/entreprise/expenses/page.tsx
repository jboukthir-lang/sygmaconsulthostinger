'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, CreditCard, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ExpensesPage() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchExpenses();
        }
    }, [user]);

    const fetchExpenses = async () => {
        try {
            const res = await fetch('/api/expenses', {
                headers: {
                    'x-user-id': user!.uid
                }
            });
            if (res.ok) {
                const data = await res.json();
                setExpenses(data);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredExpenses = expenses.filter(expense =>
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#001F3F]">Dépenses</h1>
                    <p className="text-gray-500 mt-1">Suivez et gérez les dépenses de votre entreprise.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4" />
                        Exporter
                    </button>
                    <Link
                        href="/dashboard/entreprise/expenses/new"
                        className="flex items-center gap-2 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus className="h-4 w-4" />
                        Nouvelle Dépense
                    </Link>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign className="w-12 h-12 text-red-600" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Dépenses</span>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900">{totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une dépense..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <>
                {/* Desktop View: Table */}
                <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900">Aucune dépense trouvée</h3>
                            <p>Commencez par ajouter votre première dépense.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Catégorie</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Montant</th>
                                    <th className="px-6 py-4 text-center">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{expense.description}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                {expense.category || 'Général'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(expense.date).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            {Number(expense.amount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${expense.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {expense.status === 'paid' ? 'Payé' : 'En attente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Mobile View: Cards */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-200">
                            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900">Aucune dépense</h3>
                        </div>
                    ) : (
                        filteredExpenses.map((expense) => (
                            <div key={expense.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                                            {expense.category || 'Général'}
                                        </span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${expense.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {expense.status === 'paid' ? 'Payé' : 'Attente'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                    <span className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString('fr-FR')}</span>
                                    <span className="text-lg font-bold text-[#001F3F]">
                                        {Number(expense.amount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </>
        </div>
    );
}
