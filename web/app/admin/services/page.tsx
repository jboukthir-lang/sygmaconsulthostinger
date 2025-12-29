'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
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
    Briefcase,
    Globe2,
    Building2,
    Scale,
    TrendingUp,
    Users2,
    ShieldCheck,
    Save
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
    subtitle_en?: string;
    subtitle_fr?: string;
    subtitle_ar?: string;
    features_en?: string[];
    features_fr?: string[];
    features_ar?: string[];
    icon: string;
    href: string;
    color: string;
    is_active: boolean;
    display_order: number;
    image_url?: string;
    price?: number;
    duration_minutes?: number;
    is_bookable?: boolean;
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
    const { language, t } = useLanguage();
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
        subtitle_en: '',
        subtitle_fr: '',
        subtitle_ar: '',
        features_en: [],
        features_fr: [],
        features_ar: [],
        icon: 'Briefcase',
        href: '/services/',
        color: '#001F3F',
        is_active: true,
        display_order: 0,
        image_url: '',
        price: 0,
        duration_minutes: 60,
        is_bookable: true,
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
                const sanitizedData = data.map((service: any) => ({
                    ...service,
                    title_en: service.title_en || '',
                    title_fr: service.title_fr || '',
                    title_ar: service.title_ar || '',
                    description_en: service.description_en || '',
                    description_fr: service.description_fr || '',
                    description_ar: service.description_ar || '',
                    subtitle_en: service.subtitle_en || '',
                    subtitle_fr: service.subtitle_fr || '',
                    subtitle_ar: service.subtitle_ar || '',
                    features_en: service.features_en || [],
                    features_fr: service.features_fr || [],
                    features_ar: service.features_ar || [],
                    icon: service.icon || 'Briefcase',
                    href: service.href || '/services/',
                    display_order: service.display_order || 0,
                    image_url: service.image_url || '',
                    price: service.price || 0,
                    duration_minutes: service.duration_minutes || 60,
                    is_bookable: service.is_bookable ?? true,
                }));
                setServices(sanitizedData);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            alert(t.common.error);
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
            subtitle_en: '',
            subtitle_fr: '',
            subtitle_ar: '',
            features_en: [],
            features_fr: [],
            features_ar: [],
            icon: 'Briefcase',
            href: '/services/',
            color: '#001F3F',
            is_active: true,
            display_order: services.length + 1,
            price: 0,
            duration_minutes: 60,
            is_bookable: true,
        });
        setShowModal(true);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            ...service,
            image_url: service.image_url || '',
            price: service.price || 0,
            duration_minutes: service.duration_minutes || 60,
            is_bookable: service.is_bookable ?? true,
        });
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

            alert(t.admin.servicesView.saveSuccess);
            setShowModal(false);
            fetchServices();
        } catch (error: any) {
            console.error('Error saving service:', error);
            alert(`Error saving service: ${error.message || error.code || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t.admin.servicesView.deleteConfirm)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            alert(t.admin.servicesView.deleteSuccess);
            fetchServices();
        } catch (error: any) {
            console.error('Error deleting service:', error);
            alert(t.admin.servicesView.deleteError);
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
            alert(t.common.error);
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
            alert(t.common.error);
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
                            <h1 className="text-3xl font-bold text-[#001F3F]">{t.admin.servicesView.title}</h1>
                            <p className="text-gray-600 mt-1">{t.admin.servicesView.subtitle}</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors font-semibold"
                        >
                            <Plus className="h-5 w-5" />
                            {t.admin.servicesView.newService}
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{t.admin.servicesView.totalServices}</p>
                                    <p className="text-3xl font-bold text-[#001F3F] mt-1">{stats.total}</p>
                                </div>
                                <Briefcase className="h-10 w-10 text-blue-500 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{t.admin.servicesView.active}</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
                                </div>
                                <Eye className="h-10 w-10 text-green-500 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{t.admin.servicesView.inactive}</p>
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
                                placeholder={t.admin.servicesView.searchPlaceholder}
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
                                {t.common.all}
                            </button>
                            <button
                                onClick={() => setFilterStatus('active')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'active'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t.admin.servicesView.active}
                            </button>
                            <button
                                onClick={() => setFilterStatus('inactive')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'inactive'
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t.admin.servicesView.inactive}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Services Grid (Glassmorphism) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => {
                        const IconComponent = iconMap[service.icon] || Briefcase;
                        return (
                            <div
                                key={service.id}
                                className="group relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                {/* Image Header */}
                                <div className="relative h-48 w-full overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F] to-transparent opacity-60 z-10 transition-opacity group-hover:opacity-40"></div>
                                    <img
                                        src={service.image_url || '/placeholder-service.jpg'}
                                        alt={service.title_en}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md ${service.is_active ? 'bg-green-500/20 text-green-100 border border-green-500/30' : 'bg-orange-500/20 text-orange-200 border border-orange-500/30'}`}>
                                            {service.is_active ? t.admin.servicesView.active : t.admin.servicesView.inactive}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="p-6 relative z-20 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#001F3F]/5 flex items-center justify-center text-[#D4AF37]">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#001F3F] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                                            {language === 'ar' ? service.title_ar : language === 'fr' ? service.title_fr : service.title_en}
                                        </h3>
                                    </div>

                                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">
                                        {language === 'ar' ? service.description_ar : language === 'fr' ? service.description_fr : service.description_en}
                                    </p>

                                    {/* Actions Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => moveService(service, 'up')}
                                                className="p-1 px-2 text-gray-400 hover:text-[#001F3F] hover:bg-gray-100 rounded transition-colors"
                                                title="Move Up"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => moveService(service, 'down')}
                                                className="p-1 px-2 text-gray-400 hover:text-[#001F3F] hover:bg-gray-100 rounded transition-colors"
                                                title="Move Down"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleActive(service)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title={service.is_active ? "Deactivate" : "Activate"}
                                            >
                                                {service.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Empty State */}
                    {filteredServices.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white/50 border border-dashed border-gray-300 rounded-3xl">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{t.admin.servicesView.noServices}</h3>
                            <p className="text-gray-500">Get started by creating your first service.</p>
                        </div>
                    )}
                </div>

                {/* Back to Dashboard */}
                <div className="mt-8 text-center">
                    <Link
                        href="/admin"
                        className="text-[#001F3F] hover:text-[#D4AF37] font-medium"
                    >
                        ← {t.admin.postsView.backToDashboard}
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
                                    {editingService ? t.admin.servicesView.editService : t.admin.servicesView.newService}
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
                                    {t.common.title} ({activeTab.toUpperCase()})
                                </label>
                                <input
                                    type="text"
                                    value={formData[`title_${activeTab}` as keyof Service] as string || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [`title_${activeTab}`]: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                    placeholder={`${t.common.title} (${activeTab.toUpperCase()})`}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.common.description} ({activeTab.toUpperCase()})
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData[`description_${activeTab}` as keyof Service] as string || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [`description_${activeTab}`]: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                    placeholder={`${t.common.description} (${activeTab.toUpperCase()})`}
                                />
                            </div>

                            {/* Subtitle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.admin.servicesView.subtitle} ({activeTab.toUpperCase()})
                                </label>
                                <input
                                    type="text"
                                    value={formData[`subtitle_${activeTab}` as keyof Service] as string || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, [`subtitle_${activeTab}`]: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                    placeholder={`${t.admin.servicesView.subtitle} (${activeTab.toUpperCase()})`}
                                />
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.admin.servicesView.features} ({activeTab.toUpperCase()})
                                </label>
                                <div className="space-y-2">
                                    {(formData[`features_${activeTab}` as keyof Service] as string[] || []).map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => {
                                                    const newFeatures = [...(formData[`features_${activeTab}` as keyof Service] as string[] || [])];
                                                    newFeatures[index] = e.target.value;
                                                    setFormData(prev => ({ ...prev, [`features_${activeTab}`]: newFeatures }));
                                                }}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newFeatures = [...(formData[`features_${activeTab}` as keyof Service] as string[] || [])];
                                                    newFeatures.splice(index, 1);
                                                    setFormData(prev => ({ ...prev, [`features_${activeTab}`]: newFeatures }));
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const newFeatures = [...(formData[`features_${activeTab}` as keyof Service] as string[] || [])];
                                            newFeatures.push('');
                                            setFormData(prev => ({ ...prev, [`features_${activeTab}`]: newFeatures }));
                                        }}
                                        className="text-sm text-[#001F3F] hover:text-[#D4AF37] font-medium flex items-center gap-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {t.admin.servicesView.addFeature}
                                    </button>
                                </div>
                            </div>

                            {/* Icon & URL (Only show on EN tab) */}
                            {activeTab === 'en' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.admin.servicesView.icon}</label>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.admin.servicesView.order}</label>
                                            <input
                                                type="number"
                                                value={formData.display_order}
                                                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.admin.servicesView.url}</label>
                                        <input
                                            type="text"
                                            value={formData.href}
                                            onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                            placeholder="/services/service-name"
                                        />
                                    </div>

                                    {/* Booking Details */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{(t.admin.servicesView as any).price || 'Price'}</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                                <input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{(t.admin.servicesView as any).duration || 'Duration (min)'}</label>
                                            <input
                                                type="number"
                                                value={formData.duration_minutes}
                                                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                                                min="0"
                                                step="15"
                                            />
                                        </div>
                                        <div className="flex items-end pb-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_bookable}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, is_bookable: e.target.checked }))}
                                                    className="w-4 h-4 text-[#001F3F] border-gray-300 rounded focus:ring-[#001F3F]"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{(t.admin.servicesView as any).bookable || 'Bookable'}</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Service Image */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.admin.servicesView.image} {t.admin.servicesView.optional}
                                        </label>
                                        <div className="space-y-4">
                                            {formData.image_url ? (
                                                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img
                                                        src={formData.image_url}
                                                        alt="Service"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, image_url: '' })}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50">
                                                    <Briefcase className="h-10 w-10 text-gray-300 mb-2" />
                                                    <p className="text-xs text-gray-500">{t.admin.servicesView.noImage}</p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4">
                                                <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                                                    <Plus className="h-4 w-4" />
                                                    {formData.image_url ? t.admin.servicesView.changeImage : t.admin.servicesView.uploadImage}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;

                                                            setSaving(true);
                                                            try {
                                                                const fileExt = file.name.split('.').pop();
                                                                const fileName = `services/${Date.now()}.${fileExt}`;

                                                                const { error: uploadError } = await supabase.storage
                                                                    .from('public')
                                                                    .upload(fileName, file);

                                                                if (uploadError) throw uploadError;

                                                                const { data: { publicUrl } } = supabase.storage
                                                                    .from('public')
                                                                    .getPublicUrl(fileName);

                                                                setFormData(prev => ({ ...prev, image_url: publicUrl }));
                                                            } catch (err: any) {
                                                                console.error('Error uploading image:', err);
                                                                alert('Error uploading image: ' + err.message);
                                                            } finally {
                                                                setSaving(false);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl bg-gray-50">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                            >
                                {t.common.cancel}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50 font-medium"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {t.common.saving}
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        {t.admin.servicesView.saveService}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
