'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Building2, Save, Loader2, Link as LinkIcon, Mail, Phone, MapPin, Search } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [siretLoading, setSiretLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        legal_form: '',
        siret: '',
        tva_number: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'France',
        email: '',
        phone: '',
        website: ''
    });

    const { showToast } = useToast();

    useEffect(() => {
        if (user) {
            fetchCompanyData();
        }
    }, [user]);

    const fetchCompanyData = async () => {
        try {
            const res = await fetch('/api/settings', {
                headers: { 'x-user-id': user!.uid }
            });
            if (res.ok) {
                const data = await res.json();
                if (Object.keys(data).length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.name || '',
                        legal_form: data.legal_form || '',
                        siret: data.siret || '',
                        tva_number: data.tva_number || '',
                        address: data.address || '',
                        city: data.city || '',
                        postal_code: data.postal_code || '',
                        country: data.country || 'France',
                        email: data.email || '',
                        phone: data.phone || '',
                        website: data.website || ''
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            showToast('Erreur lors du chargement des paramètres', 'error');
        }
    };

    const handleSiretLookup = async () => {
        if (!formData.siret || formData.siret.length < 9) return;

        setSiretLoading(true);
        try {
            const res = await fetch(`/api/siret?siret=${formData.siret}`);
            const data = await res.json();

            if (res.ok && data) {
                setFormData(prev => ({
                    ...prev,
                    name: data.name,
                    legal_form: data.legalForm,
                    address: data.address,
                    city: data.city,
                    postal_code: data.postalCode,
                    tva_number: data.tvaNumber || prev.tva_number
                }));
                showToast('Données trouvées et remplies', 'success');
            } else {
                showToast('Entreprise non trouvée', 'info');
            }
        } catch (error) {
            console.error(error);
            showToast('Erreur lors de la recherche SIRET', 'error');
        } finally {
            setSiretLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user!.uid
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showToast('Paramètres sauvegardés avec succès', 'success');
            } else {
                showToast('Erreur lors de la sauvegarde', 'error');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            showToast('Erreur lors de la sauvegarde', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres de l'entreprise</h1>
                <p className="text-gray-600">Gérez les informations légales et coordonnées de votre entreprise</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identity Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Identité & Légal</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Recherche par SIRET..."
                                value={formData.siret}
                                onChange={e => setFormData({ ...formData, siret: e.target.value })}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-48"
                            />
                            <button
                                type="button"
                                onClick={handleSiretLookup}
                                disabled={siretLoading}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                            >
                                {siretLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                Auto-fill
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dénomination Sociale</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Forme Juridique</label>
                                <input
                                    type="text"
                                    value={formData.legal_form}
                                    onChange={e => setFormData({ ...formData, legal_form: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro TVA Intracommunautaire</label>
                                <input
                                    type="text"
                                    value={formData.tva_number}
                                    onChange={e => setFormData({ ...formData, tva_number: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Address */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <MapPin className="h-5 w-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Coordonnées</h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Siège</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Code Postal</label>
                                    <input
                                        type="text"
                                        value={formData.postal_code}
                                        onChange={e => setFormData({ ...formData, postal_code: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Web</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 font-medium"
                    >
                        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                        Enregistrer les modifications
                    </button>
                </div>
            </form>
        </div>
    );
}
