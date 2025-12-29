'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Search,
    Loader2,
    ExternalLink,
    CheckCircle,
    XCircle,
    Image as ImageIcon,
    Save,
    X
} from 'lucide-react';
import Image from 'next/image';

interface Partner {
    id: string;
    name: string;
    logo_url: string;
    website_url?: string;
    is_active: boolean;
    created_at: string;
}

export default function AdminPartnersPage() {
    const { language, t } = useLanguage();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        website_url: '',
        logo_url: '',
        is_active: true
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPartners();

        const channel = supabase
            .channel('partners_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'partners' },
                () => fetchPartners()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchPartners() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('partners')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPartners(data || []);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `partners/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('public')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('public')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, logo_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert(t.common.error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.logo_url) {
            alert(t.common.error);
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: formData.name,
                website_url: formData.website_url || null,
                logo_url: formData.logo_url,
                is_active: formData.is_active
            };

            if (editingPartner) {
                const { error } = await supabase
                    .from('partners')
                    .update(payload)
                    .eq('id', editingPartner.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('partners')
                    .insert([payload]);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchPartners();
            // alert(t.partners.saveSuccess); // Optional: show success message
        } catch (error) {
            console.error('Error saving partner:', error);
            alert(t.common.error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t.partners.deleteConfirm)) return;

        try {
            const { error } = await supabase
                .from('partners')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPartners();
        } catch (error) {
            console.error('Error deleting partner:', error);
            alert(t.common.error);
        }
    };

    const resetForm = () => {
        setEditingPartner(null);
        setFormData({
            name: '',
            website_url: '',
            logo_url: '',
            is_active: true
        });
    };

    const filteredPartners = partners.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#001F3F]">{t.partners.title}</h1>
                    <p className="text-gray-600 mt-1">{t.partners.subtitle}</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors shadow-lg shadow-[#D4AF37]/20 font-semibold"
                >
                    <Plus className="h-5 w-5" />
                    {t.partners.new}
                </button>
            </div>

            {/* Search & Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t.partners.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                        />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        {t.partners.total} {partners.length}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 text-[#001F3F] animate-spin" />
                    </div>
                ) : filteredPartners.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{t.partners.noPartners}</h3>
                        <p className="text-gray-500 mt-1">{t.partners.new}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                        {filteredPartners.map((partner) => (
                            <div
                                key={partner.id}
                                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                            >
                                {/* Image Area */}
                                <div className="relative h-48 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={partner.logo_url}
                                            alt={partner.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    {!partner.is_active && (
                                        <div className="absolute top-2 right-2 bg-gray-900/10 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-600">
                                            {t.partners.inactive}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 truncate" title={partner.name}>
                                            {partner.name}
                                        </h3>
                                    </div>

                                    {partner.website_url ? (
                                        <a
                                            href={partner.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4 truncate"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            {partner.website_url.replace(/^https?:\/\//, '')}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-400 mb-4 block">{t.partners.website}</span>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => {
                                                setEditingPartner(partner);
                                                setFormData({
                                                    name: partner.name,
                                                    website_url: partner.website_url || '',
                                                    logo_url: partner.logo_url,
                                                    is_active: partner.is_active
                                                });
                                                setShowModal(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                            {t.common.edit}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(partner.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title={t.common.delete}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-[#001F3F]">
                                {editingPartner ? t.common.edit + ' ' + t.partners.new.replace('New', '') : t.partners.new}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Logo Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">{t.partners.logo}</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                        {formData.logo_url ? (
                                            <img
                                                src={formData.logo_url}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <ImageIcon className="h-8 w-8 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#001F3F]/5 file:text-[#001F3F]
                        hover:file:bg-[#001F3F]/10
                      "
                                            disabled={uploading}
                                        />
                                        {uploading && <p className="text-xs text-blue-600 mt-1">{t.common.saving}</p>}
                                        <p className="text-xs text-gray-400 mt-1">{t.partners.recommended}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.partners.name}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                    placeholder={language === 'ar' ? 'شركة ...' : "e.g. Acme Corp"}
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.partners.website}</label>
                                <input
                                    type="url"
                                    value={formData.website_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                    placeholder="https://example.com"
                                />
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                    className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:ring-offset-2
                    ${formData.is_active ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                                >
                                    <span
                                        className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${formData.is_active ? 'translate-x-5' : 'translate-x-0'}
                    `}
                                    />
                                </button>
                                <span className="text-sm font-medium text-gray-700">
                                    {formData.is_active ? t.partners.active : t.partners.inactive}
                                </span>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 md:col-span-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                                >
                                    {t.common.cancel}
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || uploading}
                                    className="flex items-center gap-2 px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50 shadow-lg shadow-[#001F3F]/20 font-medium"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            {t.common.saving}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            {t.common.save}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
