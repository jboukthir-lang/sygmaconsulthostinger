'use client';

import { useState, useEffect } from 'react';
import {
    Building,
    Users,
    CreditCard,
    TrendingUp,
    Search,
    Filter,
    MoreHorizontal,
    Plus,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Trash2,
    Edit2,
    Save,
    X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CompaniesDashboard() {
    const router = useRouter();
    const [companies, setCompanies] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({
        totalCompanies: 0,
        activeSubscriptions: 0,
        mrr: 0,
        churnRate: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState('ALL');

    // Edit/Modal State
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/companies');
            if (res.ok) {
                const data = await res.json();
                setCompanies(data.companies);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error loading companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer l'entreprise "${name}" ? Cette action est irréversible.`)) return;

        try {
            const res = await fetch(`/api/admin/companies/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCompanies(prev => prev.filter(c => c.id !== id));
                alert('Entreprise supprimée avec succès.');
                fetchData(); // Refresh stats
            } else {
                alert('Erreur lors de la suppression.');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleEditClick = (company: any) => {
        setSelectedCompany({ ...company });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/companies/${selectedCompany.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedCompany)
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                fetchData(); // Refresh data
                alert('Mise à jour réussie.');
            } else {
                alert('Erreur lors de la mise à jour.');
            }
        } catch (error) {
            console.error('Error updating:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toUpperCase();
        if (s === 'ACTIVE') return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Actif</span>;
        if (s === 'PAST_DUE') return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> Impayé</span>;
        if (s === 'CANCELED') return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Annulé</span>;
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium w-fit">{status}</span>;
    };

    const filteredCompanies = companies.filter(c => {
        const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = filterPlan === 'ALL' || c.subscription_plan?.toUpperCase() === filterPlan;
        return matchesSearch && matchesPlan;
    });

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F4F6F9]"><Loader2 className="h-10 w-10 animate-spin text-[#001F3F]" /></div>;
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 bg-[#F4F6F9] min-h-screen font-sans">

            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#001F3F] tracking-tight">SaaS Command Center</h1>
                    <p className="text-gray-500 mt-1">Gérez vos abonnés, suivez le MRR et analysez la croissance.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-[#001F3F] text-white px-5 py-2.5 rounded-xl hover:bg-[#003366] transition-all font-medium shadow-lg shadow-blue-900/20">
                        <Plus className="w-4 h-4" /> Nouvelle Entreprise
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Metric 1: MRR */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CreditCard className="w-24 h-24 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">MRR (Revenu Récurrent)</p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-[#001F3F]">{stats.mrr?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</h3>
                        <span className="text-sm font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
                        </span>
                    </div>
                </div>

                {/* Metric 2: Active Subs */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="w-24 h-24 text-green-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Abonnements Actifs</p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</h3>
                        <span className="text-sm text-gray-400">/ {stats.totalCompanies} total</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(stats.activeSubscriptions / stats.totalCompanies) * 100}%` }}></div>
                    </div>
                </div>

                {/* Metric 3: Total Revenue */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-[#D4AF37]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Revenu Total (LTV)</p>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-[#D4AF37]">{stats.totalRevenue?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</h3>
                    </div>
                </div>

                {/* Metric 4: Churn Rate */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <XCircle className="w-24 h-24 text-red-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Taux d'Attrition (Churn)</p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.churnRate?.toFixed(1)}%</h3>
                        <span className="text-sm font-medium text-red-600 flex items-center bg-red-50 px-2 py-0.5 rounded-full">
                            <ArrowDownRight className="w-3 h-3 mr-1" /> +2%
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

                {/* Table Header / Filters */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher une entreprise..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F] w-64 md:w-80 shadow-sm bg-white"
                            />
                        </div>
                        <select
                            value={filterPlan}
                            onChange={(e) => setFilterPlan(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-700 font-medium"
                        >
                            <option value="ALL">Tous les plans</option>
                            <option value="FREE">Gratuit</option>
                            <option value="PRO">Pro</option>
                            <option value="ENTERPRISE">Enterprise</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Affichage de <strong>{filteredCompanies.length}</strong> entreprises</span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-8 py-5">Entreprise</th>
                                <th className="px-6 py-5">Plan Actuel</th>
                                <th className="px-6 py-5">État</th>
                                <th className="px-6 py-5">Valeur (LTV)</th>
                                <th className="px-6 py-5">Dernière activité</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCompanies.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-gray-500">
                                        Aucune entreprise ne correspond à votre recherche.
                                    </td>
                                </tr>
                            ) : (
                                filteredCompanies.map((company) => (
                                    <tr key={company.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#001F3F] to-[#003366] text-white flex items-center justify-center font-bold text-sm shadow-md">
                                                    {company.name?.substring(0, 2).toUpperCase() || 'NA'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#001F3F] text-sm">{company.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{company.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${company.subscription_plan?.toUpperCase() === 'ENTERPRISE' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    company.subscription_plan?.toUpperCase() === 'PRO' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-gray-50 text-gray-700 border-gray-200'
                                                }`}>
                                                {company.subscription_plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(company.subscription_status)}
                                        </td>
                                        <td className="px-6 py-5 font-bold text-[#001F3F]">
                                            {company.real_revenue?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-500">
                                            {new Date(company.updated_at || company.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(company)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(company.id, company.name)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-center">
                    <button className="text-sm font-medium text-[#001F3F] hover:underline">
                        Charger plus de résultats
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedCompany && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900">Modifier l'entreprise</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
                                <input
                                    type="text"
                                    value={selectedCompany.name || ''}
                                    onChange={(e) => setSelectedCompany({ ...selectedCompany, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={selectedCompany.email || ''}
                                    onChange={(e) => setSelectedCompany({ ...selectedCompany, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                                    <select
                                        value={selectedCompany.subscription_plan || 'FREE'}
                                        onChange={(e) => setSelectedCompany({ ...selectedCompany, subscription_plan: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                    >
                                        <option value="FREE">Gratuit</option>
                                        <option value="STARTER">Starter</option>
                                        <option value="PRO">Pro</option>
                                        <option value="ENTERPRISE">Enterprise</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                    <select
                                        value={selectedCompany.subscription_status || 'ACTIVE'}
                                        onChange={(e) => setSelectedCompany({ ...selectedCompany, subscription_status: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                    >
                                        <option value="ACTIVE">Actif</option>
                                        <option value="PAST_DUE">Impayé</option>
                                        <option value="CANCELED">Annulé</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input
                                    type="text"
                                    value={selectedCompany.phone || ''}
                                    onChange={(e) => setSelectedCompany({ ...selectedCompany, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] font-medium flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
