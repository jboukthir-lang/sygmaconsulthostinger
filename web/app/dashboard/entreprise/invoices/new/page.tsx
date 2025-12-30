'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';

export default function NewInvoicePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<any[]>([]);

    // Form State
    const [clientId, setClientId] = useState('');
    const [dates, setDates] = useState({
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    const [items, setItems] = useState<any[]>([
        { description: '', quantity: 1, price: 0 }
    ]);
    const [status, setStatus] = useState('draft');

    useEffect(() => {
        if (user) {
            // Fetch clients for the dropdown
            fetch('/api/clients', {
                headers: {
                    'x-user-id': user.uid
                }
            })
                .then(res => res.json())
                .then(data => setClients(Array.isArray(data) ? data : []))
                .catch(err => console.error('Error fetching clients:', err));
        }
    }, [user]);

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const tax = subtotal * 0.20; // 20%
        return { subtotal, tax, total: subtotal + tax };
    };

    const totals = calculateTotals();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId) {
            alert('Veuillez sélectionner un client');
            return;
        }

        if (!user || !user.uid) {
            alert("Erreur: Utilisateur non connecté.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                client_id: clientId,
                ...dates,
                items,
                status,
                type: 'invoice' // Required by DB
            };

            console.log("Submitting Invoice Payload:", payload);

            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.uid
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Invoice created:", data);
                router.push('/dashboard/entreprise/invoices');
                router.refresh();
            } else {
                const errData = await res.json();
                console.error("API Error Invoice:", errData);
                alert(`Erreur lors de la création de la facture: ${errData.error || res.statusText}`);
            }
        } catch (error: any) {
            console.error("Fetch Error:", error);
            alert(`Une erreur est survenue: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/entreprise/invoices"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nouvelle Facture</h1>
                    <p className="text-gray-600">Créer une nouvelle facture pour un client</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                            <select
                                required
                                value={clientId}
                                onChange={e => setClientId(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                                <option value="">Sélectionner un client...</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                            {clients.length === 0 && (
                                <Link href="/dashboard/entreprise/clients/new" className="text-xs text-blue-600 mt-1 hover:underline block">
                                    + Créer un nouveau client
                                </Link>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'émission</label>
                            <input
                                type="date"
                                required
                                value={dates.issue_date}
                                onChange={e => setDates({ ...dates, issue_date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                            <input
                                type="date"
                                required
                                value={dates.due_date}
                                onChange={e => setDates({ ...dates, due_date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase px-2">
                            <div className="col-span-6">Description</div>
                            <div className="col-span-2 text-right">Qté</div>
                            <div className="col-span-2 text-right">Prix Unit.</div>
                            <div className="col-span-1 text-right">Total</div>
                            <div className="col-span-1"></div>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="col-span-6">
                                    <input
                                        type="text"
                                        placeholder="Description du produit ou service"
                                        required
                                        value={item.description}
                                        onChange={e => updateItem(index, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={item.quantity}
                                        onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={item.price}
                                        onChange={e => updateItem(index, 'price', parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white"
                                    />
                                </div>
                                <div className="col-span-1 text-right font-medium text-gray-900">
                                    {(item.quantity * item.price).toFixed(2)}€
                                </div>
                                <div className="col-span-1 text-center">
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mt-2"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter une ligne
                        </button>
                    </div>

                    <div className="border-t border-gray-100 mt-6 pt-6 flex justify-end">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Sous-total</span>
                                <span>{totals.subtotal.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>TVA (20%)</span>
                                <span>{totals.tax.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                                <span>Total TTC</span>
                                <span>{totals.total.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10 md:pl-64">
                    <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    checked={status === 'draft'}
                                    onChange={() => setStatus('draft')}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Brouillon</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="sent"
                                    checked={status === 'sent'}
                                    onChange={() => setStatus('sent')}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Envoyée</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="paid"
                                    checked={status === 'paid'}
                                    onChange={() => setStatus('paid')}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Payée</span>
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/dashboard/entreprise/invoices"
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Enregistrer la facture
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
