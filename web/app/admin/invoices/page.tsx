'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Invoice, InvoiceItem } from '@/lib/types';
import { Plus, Search, Loader2, X, Trash2, Edit, FileText, Download, Mail, Calendar, User, Building2, Euro } from 'lucide-react';

export default function AdminInvoicesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'quote' | 'invoice' | 'credit_note'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'sent' | 'accepted' | 'paid'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [saving, setSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Invoice>>({
        type: 'quote',
        status: 'draft',
        client_name: '',
        client_email: '',
        client_address: '',
        client_siret: '',
        currency: 'EUR',
        items: [],
        total_excl_tax: 0,
        total_tax: 0,
        total_incl_tax: 0,
        issue_date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/admin/invoices');
        } else if (user) {
            fetchInvoices();
        }
    }, [user, authLoading, router]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setInvoices(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = (items: InvoiceItem[]) => {
        const total_excl_tax = items.reduce((sum, item) => sum + item.total, 0);
        const total_tax = items.reduce((sum, item) => sum + (item.total * item.tax_rate / 100), 0);
        return { total_excl_tax, total_tax, total_incl_tax: total_excl_tax + total_tax };
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let invoiceNumber = formData.number;
            if (!editingInvoice) {
                const { data: numberData } = await supabase.rpc('generate_invoice_number', { doc_type: formData.type });
                invoiceNumber = numberData;
            }
            const totals = calculateTotals(formData.items || []);
            const invoiceData = { ...formData, number: invoiceNumber, ...totals };

            if (editingInvoice) {
                const { error } = await supabase.from('invoices').update(invoiceData).eq('id', editingInvoice.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('invoices').insert([invoiceData]);
                if (error) throw error;
            }
            alert('✅ Enregistré avec succès!');
            setShowModal(false);
            fetchInvoices();
            resetForm();
        } catch (error: any) {
            alert(`Erreur: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr?')) return;
        try {
            const { error } = await supabase.from('invoices').delete().eq('id', id);
            if (error) throw error;
            fetchInvoices();
        } catch (error: any) {
            alert(`Erreur: ${error.message}`);
        }
    };

    const handleDownload = async (id: string) => {
        setActionLoading(`download-${id}`);
        try {
            const response = await fetch('/api/invoices/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceId: id, action: 'download' })
            });
            if (!response.ok) throw new Error('Erreur');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${id}.pdf`;
            a.click();
        } catch (error) {
            alert('Erreur lors du téléchargement');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSendEmail = async (id: string) => {
        setActionLoading(`email-${id}`);
        try {
            const response = await fetch('/api/invoices/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceId: id, action: 'email' })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            alert('✅ Email envoyé!');
            fetchInvoices();
        } catch (error: any) {
            alert(`Erreur: ${error.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const openModal = (invoice?: Invoice) => {
        if (invoice) {
            setEditingInvoice(invoice);
            setFormData(invoice);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingInvoice(null);
        setFormData({
            type: 'quote',
            status: 'draft',
            client_name: '',
            client_email: '',
            client_address: '',
            client_siret: '',
            currency: 'EUR',
            items: [],
            total_excl_tax: 0,
            total_tax: 0,
            total_incl_tax: 0,
            issue_date: new Date().toISOString().split('T')[0],
            notes: ''
        });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...(prev.items || []), { description: '', quantity: 1, unit_price: 0, tax_rate: 20, total: 0 }]
        }));
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const items = [...(formData.items || [])];
        items[index] = { ...items[index], [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
            items[index].total = items[index].quantity * items[index].unit_price;
        }
        setFormData(prev => ({ ...prev, items }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: (prev.items || []).filter((_, i) => i !== index)
        }));
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.number?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || inv.type === filterType;
        const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getTypeLabel = (type: string) => {
        const labels = { quote: 'Devis', invoice: 'Facture', credit_note: 'Avoir' };
        return labels[type as keyof typeof labels] || type;
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-800 border-gray-300',
            sent: 'bg-blue-100 text-blue-800 border-blue-300',
            accepted: 'bg-green-100 text-green-800 border-green-300',
            paid: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
        const labels = { draft: 'Brouillon', sent: 'Envoyé', accepted: 'Accepté', paid: 'Payé' };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 text-[#D4AF37] animate-spin" />
            </div>
        );
    }

    const stats = [
        { label: 'Total Documents', value: invoices.length, icon: FileText, color: 'text-blue-600' },
        { label: 'Devis', value: invoices.filter(i => i.type === 'quote').length, icon: FileText, color: 'text-purple-600' },
        { label: 'Factures', value: invoices.filter(i => i.type === 'invoice').length, icon: FileText, color: 'text-green-600' },
        { label: 'Payés', value: invoices.filter(i => i.status === 'paid').length, icon: Euro, color: 'text-emerald-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturation</h1>
                            <p className="text-gray-600">Gérez vos devis, factures et avoirs</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-xl hover:bg-[#C5A028] transition-all font-semibold shadow-sm"
                        >
                            <Plus className="h-5 w-5" />
                            Nouveau Document
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <stat.icon className={`h-10 w-10 ${stat.color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        >
                            <option value="all">Tous les types</option>
                            <option value="quote">Devis</option>
                            <option value="invoice">Factures</option>
                            <option value="credit_note">Avoirs</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="draft">Brouillon</option>
                            <option value="sent">Envoyé</option>
                            <option value="accepted">Accepté</option>
                            <option value="paid">Payé</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Numéro</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Montant TTC</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Statut</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm font-semibold text-gray-900">{invoice.number}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{invoice.client_name}</p>
                                            <p className="text-sm text-gray-500">{invoice.client_email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-700">{getTypeLabel(invoice.type)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{new Date(invoice.issue_date).toLocaleDateString('fr-FR')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-gray-900">{invoice.total_incl_tax.toFixed(2)} €</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getStatusBadge(invoice.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDownload(invoice.id)}
                                                disabled={actionLoading === `download-${invoice.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Télécharger PDF"
                                            >
                                                {actionLoading === `download-${invoice.id}` ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Download className="h-4 w-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleSendEmail(invoice.id)}
                                                disabled={actionLoading === `email-${invoice.id}`}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Envoyer par email"
                                            >
                                                {actionLoading === `email-${invoice.id}` ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Mail className="h-4 w-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => openModal(invoice)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(invoice.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredInvoices.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun document trouvé</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - Will continue in next part */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingInvoice ? 'Modifier' : 'Nouveau'} Document
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Type & Status */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                                    >
                                        <option value="quote">📋 Devis</option>
                                        <option value="invoice">📄 Facture</option>
                                        <option value="credit_note">💳 Avoir</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Statut</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                                    >
                                        <option value="draft">✏️ Brouillon</option>
                                        <option value="sent">📧 Envoyé</option>
                                        <option value="accepted">✅ Accepté</option>
                                        <option value="paid">💰 Payé</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={formData.issue_date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Client Info */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5 text-[#D4AF37]" />
                                    Informations Client
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nom du client *"
                                        value={formData.client_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.client_email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Adresse"
                                        value={formData.client_address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, client_address: e.target.value }))}
                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                                    />
                                    <input
                                        type="text"
                                        placeholder="SIRET"
                                        value={formData.client_siret}
                                        onChange={(e) => setFormData(prev => ({ ...prev, client_siret: e.target.value }))}
                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Items */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-[#D4AF37]" />
                                        Lignes de Facturation
                                    </h3>
                                    <button
                                        onClick={addItem}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-xl hover:bg-[#C5A028] transition-all text-sm font-semibold"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Ajouter
                                    </button>
                                </div>

                                {(formData.items || []).length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                                        <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">Aucune ligne</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {/* Header */}
                                        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-white rounded-lg text-xs font-semibold text-gray-700 uppercase">
                                            <div className="col-span-4">Description</div>
                                            <div className="col-span-2 text-center">Quantité</div>
                                            <div className="col-span-2 text-right">Prix HT</div>
                                            <div className="col-span-1 text-center">TVA</div>
                                            <div className="col-span-2 text-right">Total HT</div>
                                            <div className="col-span-1"></div>
                                        </div>

                                        {/* Items */}
                                        {(formData.items || []).map((item, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#D4AF37] transition-all group">
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Consultation"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                />
                                                <select
                                                    value={item.tax_rate}
                                                    onChange={(e) => updateItem(index, 'tax_rate', parseFloat(e.target.value))}
                                                    className="col-span-1 px-2 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                >
                                                    <option value="0">0%</option>
                                                    <option value="5.5">5.5%</option>
                                                    <option value="10">10%</option>
                                                    <option value="20">20%</option>
                                                </select>
                                                <div className="col-span-2 px-3 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] text-sm text-right font-bold flex items-center justify-end">
                                                    {item.total.toFixed(2)} €
                                                </div>
                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="col-span-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Totals */}
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="flex justify-end">
                                                <div className="w-80 space-y-3">
                                                    <div className="flex justify-between items-center text-gray-700">
                                                        <span className="font-medium">Total HT</span>
                                                        <span className="font-semibold">{calculateTotals(formData.items || []).total_excl_tax.toFixed(2)} €</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-gray-700">
                                                        <span className="font-medium">TVA (20%)</span>
                                                        <span className="font-semibold">{calculateTotals(formData.items || []).total_tax.toFixed(2)} €</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-3 border-t border-[#D4AF37]/30">
                                                        <span className="text-[#D4AF37] font-bold text-lg">Total TTC</span>
                                                        <span className="text-[#D4AF37] font-bold text-2xl">{calculateTotals(formData.items || []).total_incl_tax.toFixed(2)} €</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                                    placeholder="Notes additionnelles..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-xl hover:bg-[#C5A028] transition-all font-semibold disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
