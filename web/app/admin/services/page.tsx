'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Loader2,
    ArrowUp,
    ArrowDown,
    Eye,
    EyeOff,
    X,
    Save,
    Briefcase,
    Globe2,
    Building2,
    Scale,
    TrendingUp,
    Users2,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

interface Service {
    id: string;
    title_en: string;
    title_fr: string;
    title_ar: string;
    description_en: string;
    description_fr: string;
    description_ar: string;
    icon: string;
    href: string;
    color: string;
    is_active: boolean;
    display_order: number;
    created_at?: string;
    updated_at?: string;
}

const iconMap: { [key: string]: any } = {
    'Briefcase': Briefcase,
    'Globe2': Globe2,
    'Building2': Building2,
    'Scale': Scale,
    'TrendingUp': TrendingUp,
    'Users2': Users2,
    'ShieldCheck': ShieldCheck,
};

const availableIcons = [
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Globe2', icon: Globe2 },
    { name: 'Building2', icon: Building2 },
    { name: 'Scale', icon: Scale },
    { name: 'TrendingUp', icon: TrendingUp },
    { name: 'Users2', icon: Users2 },
    { name: 'ShieldCheck', icon: ShieldCheck },
];

export default function AdminServicesPage() {
    const { language } = useLanguage();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [activeTab, setActiveTab] = useState<'en' | 'fr' | 'ar'>('en');
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<Service>>({
        title_en: '',
        title_fr: '',
        title_ar: '',
        description_en: '',
        description_fr: '',
        description_ar: '',
        icon: 'Briefcase',
        href: '/services/',
        color: '#001F3F',
        is_active: true,
        display_order: 0,
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login?redirect=/admin/services');
            } else {
                fetchServices();
            }
        }
    }, [user, authLoading, router]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;

            if (data) {
                setServices(data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            alert(t('common.error', language));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingService(null);
        setFormData({
            title_en: '',
            title_fr: '',
            title_ar: '',
            description_en: '',
            description_fr: '',
            description_ar: '',
            icon: 'Briefcase',
            href: '/services/',
            color: '#001F3F',
            is_active: true,
            display_order: services.length + 1,
        });
        setShowModal(true);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData(service);
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editingService) {
                const { error } = await supabase
                    .from('services')
                    .update(formData)
                    .eq('id', editingService.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('services')
                    .insert([formData]);

                if (error) throw error;
            }

            alert(t('common.success' as any, language) || 'Success!');
            setShowModal(false);
            fetchServices();
        } catch (error: any) {
            console.error('Error saving service:', error);
            alert(t('common.error', language));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.services.deleteConfirm', language))) {
            return;
        }

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            alert(t('common.success' as any, language) || 'Deleted!');
            fetchServices();
        } catch (error: any) {
            console.error('Error deleting service:', error);
            alert(t('admin.services.deleteError', language));
        }
    };

    const toggleActive = async (service: Service) => {
        try {
            const newStatus = !service.is_active;
            const { error } = await supabase
                .from('services')
                .update({ is_active: newStatus })
                .eq('id', service.id);

            if (error) throw error;
            fetchServices();
        } catch (error: any) {
            console.error('Error toggling status:', error);
            alert(t('common.error', language));
        }
    };

    const moveService = async (service: Service, direction: 'up' | 'down') => {
        const currentIndex = services.findIndex(s => s.id === service.id);
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === services.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const otherService = services[newIndex];

        try {
            await supabase
                .from('services')
                .update({ display_order: otherService.display_order })
                .eq('id', service.id);

            await supabase
                .from('services')
                .update({ display_order: service.display_order })
                .eq('id', otherService.id);

            fetchServices();
        } catch (error) {
            console.error('Error reordering services:', error);
            alert(t('common.error', language));
        }
    };

    const filteredServices = services.filter(service => {
        const titleEn = service.title_en?.toLowerCase() || '';
        const titleFr = service.title_fr?.toLowerCase() || '';
        const titleAr = service.title_ar?.toLowerCase() || '';
        const searchLowed = searchTerm.toLowerCase();

        const matchesSearch =
            titleEn.includes(searchLowed) ||
            titleFr.includes(searchLowed) ||
            titleAr.includes(searchLowed);

        const matchesFilter =
            filterStatus === 'all' ? true :
                filterStatus === 'active' ? service.is_active :
                    !service.is_active;

        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: services.length,
        active: services.filter(s => s.is_active).length,
        inactive: services.filter(s => !s.is_active).length,
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-[#001F3F] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#001F3F]">{t('admin.services.title', language)}</h1>
                            <p className="text-gray-600 mt-1">{t('admin.services.subtitle', language)}</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors font-semibold"
                        >
                            <Plus className="h-5 w-5" />
                            {t('admin.services.newService', language)}
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{t('admin.services.totalServices', language)}</p>
                                    <p className="text-3xl font-bold text-[#001F3F] mt-1">{stats.total}</p>
                                </div>
                                <Briefcase className="h-10 w-10 text-blue-500 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{t('admin.services.active', language)}</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
                                </div>
                                <Eye className="h-10 w-10 text-green-500 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{t('admin.services.inactive', language)}</p>
                                    <p className="text-3xl font-bold text-orange-600 mt-1">{stats.inactive}</p>
                                </div>
                                <EyeOff className="h-10 w-10 text-orange-500 opacity-20" />
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('admin.services.searchPlaceholder', language)}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
                                        ? 'bg-[#001F3F] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t('common.all', language)}
                            </button>
                            <button
                                onClick={() => setFilterStatus('active')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'active'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t('admin.services.active', language)}
                            </button>
                            <button
                                onClick={() => setFilterStatus('inactive')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'inactive'
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t('admin.services.inactive', language)}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Services Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-700">{t('admin.services.icon' as any, language) || 'Icon'}</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">{t('common.title' as any, language) || 'Title'}</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">{t('common.status', language)}</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">{t('admin.services.order' as any, language) || 'Order'}</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">{t('common.actions', language)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-gray-500">
                                            {t('admin.services.noServices', language)}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredServices.map((service, index) => {
                                        const IconComponent = iconMap[service.icon] || Briefcase;
                                        return (
                                            <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-4">
                                                    <div className="w-10 h-10 rounded-lg bg-[#001F3F]/10 flex items-center justify-center">
                                                        <IconComponent className="h-5 w-5 text-[#001F3F]" />
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900">
                                                        {language === 'ar' ? service.title_ar : language === 'fr' ? service.title_fr : service.title_en}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{service.href}</div>
                                                </td>
                                                <td className="p-4">
                                                    {service.is_active ? (
                                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
                                                            <Eye className="h-3 w-3" />
                                                            {t('admin.services.active', language)}
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
                                                            <EyeOff className="h-3 w-3" />
                                                            {t('admin.services.inactive', language)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => moveService(service, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                            title={t('admin.services.moveUp' as any, language) || 'Move up'}
                                                        >
                                                            <ArrowUp className="h-4 w-4" />
                                                        </button>
                                                        <span className="text-gray-600 font-medium">{service.display_order}</span>
                                                        <button
                                                            onClick={() => moveService(service, 'down')}
                                                            disabled={index === filteredServices.length - 1}
                                                            className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                            title={t('admin.services.moveDown' as any, language) || 'Move down'}
                                                        >
                                                            <ArrowDown className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(service)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title={t('common.edit', language)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => toggleActive(service)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title={service.is_active ? t('admin.services.inactive', language) : t('admin.services.active', language)}
                                                        >
                                                            {service.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(service.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title={t('common.delete', language)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Back to Dashboard */}
                <div className="mt-8 text-center">
                    <Link
                        href="/admin"
                        className="text-[#001F3F] hover:text-[#D4AF37] font-medium"
                    >
                        ← {t('admin.posts.backToDashboard', language)}
                    </Link>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[#001F3F]">
                                    {editingService ? t('admin.services.editService' as any, language) || 'Edit Service' : t('admin.services.newService' as any, language) || 'New Service'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Language Tabs */}
                            <div className="flex gap-2 border-b">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('en')}
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'en'
                                            ? 'text-[#001F3F] border-b-2 border-[#D4AF37]'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    English
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('fr')}
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'fr'
                                            ? 'text-[#001F3F] border-b-2 border-[#D4AF37]'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Français
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('ar')}
                                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'ar'
                                            ? 'text-[#001F3F] border-b-2 border-[#D4AF37]'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    العربية
                                </button>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('common.title' as any, language) || 'Title'} ({activeTab.toUpperCase()})
                                </label>
                                <input
                                    type="text"
                                    value={formData[`title_${activeTab}` as keyof Service] as string || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [`title_${activeTab}`]: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                    placeholder={`${t('common.title' as any, language) || 'Title'} (${activeTab.toUpperCase()})`}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('common.description' as any, language) || 'Description'} ({activeTab.toUpperCase()})
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData[`description_${activeTab}` as keyof Service] as string || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [`description_${activeTab}`]: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                    placeholder={`${t('common.description' as any, language) || 'Description'} (${activeTab.toUpperCase()})`}
                                />
                            </div>

                            {/* Icon & URL (Only show on EN tab) */}
                            {activeTab === 'en' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.services.icon' as any, language) || 'Icon'}</label>
                                            <select
                                                value={formData.icon}
                                                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                            >
                                                {availableIcons.map(({ name, icon: Icon }) => (
                                                    <option key={name} value={name}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.services.order' as any, language) || 'Order'}</label>
                                            <input
                                                type="number"
                                                value={formData.display_order}
                                                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.services.url' as any, language) || 'Service URL'}</label>
                                        <input
                                            type="text"
                                            value={formData.href}
                                            onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                            placeholder="/services/service-name"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                            className="w-4 h-4 text-[#001F3F] border-gray-300 rounded focus:ring-[#001F3F]"
                                        />
                                        <label className="text-sm font-medium text-gray-700">{t('admin.services.active', language)}</label>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={saving}
                            >
                                {t('common.cancel', language)}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {saving ? t('common.saving', language) : (t('admin.services.saveService' as any, language) || 'Save Service')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
