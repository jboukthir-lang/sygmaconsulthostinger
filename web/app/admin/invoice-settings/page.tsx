'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, Building2, Mail, Phone, MapPin, FileText, CreditCard } from 'lucide-react';

export default function InvoiceSettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [settings, setSettings] = useState({
        company_name: '',
        company_legal_form: 'SASU',
        company_capital: '1000',
        company_siret: '',
        company_tva: '',
        company_rcs: '',
        address_paris_fr: '',
        email_primary: '',
        phone_primary: '',
        invoice_footer: '',
        invoice_payment_terms: '30 jours',
        invoice_bank_details: ''
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/admin/invoice-settings');
        } else if (user) {
            fetchSettings();
        }
    }, [user, authLoading, router]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching settings:', error);
            }

            if (data) {
                setSettings({
                    company_name: data.company_name || '',
                    company_legal_form: data.company_legal_form || 'SASU',
                    company_capital: data.company_capital || '1000',
                    company_siret: data.company_siret || '',
                    company_tva: data.company_tva || '',
                    company_rcs: data.company_rcs || '',
                    address_paris_fr: data.address_paris_fr || '',
                    email_primary: data.email_primary || '',
                    phone_primary: data.phone_primary || '',
                    invoice_footer: data.invoice_footer || '',
                    invoice_payment_terms: data.invoice_payment_terms || '30 jours',
                    invoice_bank_details: data.invoice_bank_details || ''
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Try to get existing row
            const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();

            if (existing) {
                // Update existing
                const { error } = await supabase.from('site_settings').update(settings).eq('id', existing.id);
                if (error) throw error;
            } else {
                // Insert new
                const { error } = await supabase.from('site_settings').insert([settings]);
                if (error) throw error;
            }

            setMessage({ type: 'success', text: '✅ Paramètres enregistrés!' });
            setTimeout(() => setMessage(null), 3000);
            fetchSettings(); // Refresh
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 text-[#D4AF37] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres de Facturation</h1>
                            <p className="text-gray-600">Configuration des informations légales et bancaires</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-xl hover:bg-[#C5A028] transition-all font-semibold shadow-sm disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            Enregistrer
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Company Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-[#D4AF37]" />
                            Informations de l'Entreprise
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Nom de l'entreprise</label>
                                <input
                                    type="text"
                                    value={settings.company_name}
                                    onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    placeholder="SYGMA CONSULT"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Forme juridique</label>
                                <select
                                    value={settings.company_legal_form}
                                    onChange={(e) => setSettings(prev => ({ ...prev, company_legal_form: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                >
                                    <option value="SASU">SASU</option>
                                    <option value="SARL">SARL</option>
                                    <option value="SAS">SAS</option>
                                    <option value="EURL">EURL</option>
                                    <option value="SA">SA</option>
                                    <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Capital social (€)</label>
                                <input
                                    type="text"
                                    value={settings.company_capital}
                                    onChange={(e) => setSettings(prev => ({ ...prev, company_capital: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    placeholder="1000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">SIRET</label>
                                <input
                                    type="text"
                                    value={settings.company_siret}
                                    onChange={(e) => setSettings(prev => ({ ...prev, company_siret: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    placeholder="XXX XXX XXX XXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Numéro TVA</label>
                                <input
                                    type="text"
                                    value={settings.company_tva}
                                    onChange={(e) => setSettings(prev => ({ ...prev, company_tva: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    placeholder="FRXX XXX XXX XXX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">RCS</label>
                                <input
                                    type="text"
                                    value={settings.company_rcs}
                                    onChange={(e) => setSettings(prev => ({ ...prev, company_rcs: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    placeholder="Paris B XXX XXX XXX"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[#D4AF37]" />
                            Coordonnées
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Adresse complète</label>
                                <textarea
                                    value={settings.address_paris_fr}
                                    onChange={(e) => setSettings(prev => ({ ...prev, address_paris_fr: e.target.value }))}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    placeholder="6 rue Paul Verlaine, 93130 Noisy-le-Sec, France"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={settings.email_primary}
                                        onChange={(e) => setSettings(prev => ({ ...prev, email_primary: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                        placeholder="contact@sygma-consult.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={settings.phone_primary}
                                        onChange={(e) => setSettings(prev => ({ ...prev, phone_primary: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                        placeholder="+33 7 52 03 47 86"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[#D4AF37]" />
                            Paramètres de Facturation
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Délai de paiement</label>
                                <input
                                    type="text"
                                    value={settings.invoice_payment_terms}
                                    onChange={(e) => setSettings(prev => ({ ...prev, invoice_payment_terms: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    placeholder="30 jours"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Coordonnées bancaires</label>
                                <textarea
                                    value={settings.invoice_bank_details}
                                    onChange={(e) => setSettings(prev => ({ ...prev, invoice_bank_details: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    placeholder="IBAN: FR76 XXXX XXXX XXXX XXXX XXXX XXX&#10;BIC: XXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Pied de page personnalisé</label>
                                <textarea
                                    value={settings.invoice_footer}
                                    onChange={(e) => setSettings(prev => ({ ...prev, invoice_footer: e.target.value }))}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    placeholder="Texte additionnel..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
