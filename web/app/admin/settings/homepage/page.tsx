'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Save, Loader2, Home, Upload, X, Image as ImageIcon } from 'lucide-react';

export default function HomepageSettingsPage() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'stats' | 'why'>('hero');

  const [config, setConfig] = useState({
    // Hero
    badge_en: '', badge_fr: '', badge_ar: '',
    title_en: '', title_fr: '', title_ar: '',
    subtitle_en: '', subtitle_fr: '', subtitle_ar: '',
    cta_text_en: '', cta_text_fr: '', cta_text_ar: '',
    cta_url: '/book',
    cta_secondary_text_en: '', cta_secondary_text_fr: '', cta_secondary_text_ar: '',
    cta_secondary_url: '/services',
    hero_type: 'globe',
    hero_media_url: '',

    // About
    about_title_en: '', about_title_fr: '', about_title_ar: '',
    about_description_en: '', about_description_fr: '', about_description_ar: '',
    about_highlight1_en: '', about_highlight1_fr: '', about_highlight1_ar: '',
    about_highlight2_en: '', about_highlight2_fr: '', about_highlight2_ar: '',
    about_location1_en: '', about_location1_fr: '', about_location1_ar: '',
    about_location2_en: '', about_location2_fr: '', about_location2_ar: '',
    about_point1_en: '', about_point1_fr: '', about_point1_ar: '',
    about_point2_en: '', about_point2_fr: '', about_point2_ar: '',
    about_point3_en: '', about_point3_fr: '', about_point3_ar: '',
    about_point4_en: '', about_point4_fr: '', about_point4_ar: '',
    about_cta_text_en: '', about_cta_text_fr: '', about_cta_text_ar: '',
    about_cta_url: '/about',

    // Stats
    stat1_value: '10+', stat1_label_en: '', stat1_label_fr: '', stat1_label_ar: '',
    stat2_value: '50+', stat2_label_en: '', stat2_label_fr: '', stat2_label_ar: '',
    stat3_value: '98%', stat3_label_en: '', stat3_label_fr: '', stat3_label_ar: '',
    stat4_value: '2k+', stat4_label_en: '', stat4_label_fr: '', stat4_label_ar: '',

    // Why Choose Us
    why_title_en: '', why_title_fr: '', why_title_ar: '',
    why_subtitle_en: '', why_subtitle_fr: '', why_subtitle_ar: '',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('app_config').select('*').eq('key', 'main').single();
      if (error) throw error;
      if (data) setConfig(prev => ({ ...prev, ...data }));
    } catch (error: any) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(file: File) {
    try {
      setUploading(true);
      const fileName = `hero-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName);

      setConfig(prev => ({ ...prev, hero_media_url: publicUrl, hero_type: 'image' }));
      setMessage({ type: 'success', text: '✅ Image uploadée!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);
      const { error } = await supabase.from('app_config').update(config).eq('key', 'main');
      if (error) throw error;
      setMessage({ type: 'success', text: '✅ Enregistré avec succès!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Home },
    { id: 'about', label: 'À Propos', icon: Home },
    { id: 'stats', label: 'Statistiques', icon: Home },
    { id: 'why', label: 'Pourquoi Nous', icon: Home },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres Page d'Accueil</h1>
              <p className="text-gray-600">Gérez le contenu de votre page principale</p>
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

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                      ? 'bg-[#D4AF37] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Section Hero</h2>

                  {/* Hero Type & Media */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Type de Hero</label>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[
                        { value: 'globe', label: 'Globe 3D' },
                        { value: 'image', label: 'Image' },
                        { value: 'video', label: 'Vidéo' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setConfig(prev => ({ ...prev, hero_type: type.value }))}
                          className={`p-4 rounded-xl border-2 transition-all ${config.hero_type === type.value
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <p className={`text-sm font-semibold ${config.hero_type === type.value ? 'text-[#D4AF37]' : 'text-gray-700'}`}>{type.label}</p>
                        </button>
                      ))}
                    </div>

                    {config.hero_type === 'image' && (
                      <div className="space-y-4">
                        {/* Upload Button */}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                            className="hidden"
                            id="hero-image-upload"
                          />
                          <label
                            htmlFor="hero-image-upload"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-all"
                          >
                            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                            {uploading ? 'Upload...' : 'Uploader une image'}
                          </label>
                        </div>

                        {/* Current Image Preview */}
                        {config.hero_media_url && (
                          <div className="relative">
                            <img
                              src={config.hero_media_url}
                              alt="Hero"
                              className="w-full h-48 object-cover rounded-xl border border-gray-200"
                            />
                            <button
                              onClick={() => setConfig(prev => ({ ...prev, hero_media_url: '' }))}
                              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {config.hero_type === 'video' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">URL de la vidéo</label>
                        <input
                          type="url"
                          value={config.hero_media_url}
                          onChange={(e) => setConfig(prev => ({ ...prev, hero_media_url: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>
                    )}
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Badge</label>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={config.badge_en}
                        onChange={(e) => setConfig(prev => ({ ...prev, badge_en: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇬🇧 Your Strategic Partner"
                      />
                      <input
                        type="text"
                        value={config.badge_fr}
                        onChange={(e) => setConfig(prev => ({ ...prev, badge_fr: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇫🇷 Votre Partenaire"
                      />
                      <input
                        type="text"
                        value={config.badge_ar}
                        onChange={(e) => setConfig(prev => ({ ...prev, badge_ar: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇹🇳 شريكك"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Titre Principal</label>
                    <div className="grid grid-cols-3 gap-4">
                      <textarea
                        value={config.title_en}
                        onChange={(e) => setConfig(prev => ({ ...prev, title_en: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇬🇧 Title"
                      />
                      <textarea
                        value={config.title_fr}
                        onChange={(e) => setConfig(prev => ({ ...prev, title_fr: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇫🇷 Titre"
                      />
                      <textarea
                        value={config.title_ar}
                        onChange={(e) => setConfig(prev => ({ ...prev, title_ar: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇹🇳 العنوان"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Description</label>
                    <div className="grid grid-cols-3 gap-4">
                      <textarea
                        value={config.subtitle_en}
                        onChange={(e) => setConfig(prev => ({ ...prev, subtitle_en: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                      />
                      <textarea
                        value={config.subtitle_fr}
                        onChange={(e) => setConfig(prev => ({ ...prev, subtitle_fr: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                      />
                      <textarea
                        value={config.subtitle_ar}
                        onChange={(e) => setConfig(prev => ({ ...prev, subtitle_ar: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Bouton Principal</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.cta_text_en}
                          onChange={(e) => setConfig(prev => ({ ...prev, cta_text_en: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇬🇧 Book Consultation"
                        />
                        <input
                          type="text"
                          value={config.cta_text_fr}
                          onChange={(e) => setConfig(prev => ({ ...prev, cta_text_fr: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇫🇷 Réserver"
                        />
                        <input
                          type="text"
                          value={config.cta_text_ar}
                          onChange={(e) => setConfig(prev => ({ ...prev, cta_text_ar: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇹🇳 احجز"
                          dir="rtl"
                        />
                        <input
                          type="text"
                          value={config.cta_url}
                          onChange={(e) => setConfig(prev => ({ ...prev, cta_url: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="URL: /book"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Bouton Secondaire</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.cta_secondary_text_en}
                          onChange={(e) => setConfig(prev => ({ ...prev, cta_secondary_text_en: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇬🇧 Our Services"
                        />
                        <input
                          type="text"
                          value={config.cta_secondary_text_fr}
                          onChange={(e) => setConfig(prev => ({ ...prev, cta_secondary_text_fr: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇫🇷 Nos Services"
                        />
                        <input
                          type="text"
                          value={config.cta_secondary_text_ar}
                          onChange={(e) => setConfig(prev => ({ ...prev, cta_secondary_text_ar: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇹🇳 خدماتنا"
                          dir="rtl"
                        />
                        <input
                          type="text"
                          value={config.cta_secondary_url}
                          onChange={(e) => setConfig(prev => ({ ...prev, cta_secondary_url: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="URL: /services"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Section À Propos</h2>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Titre</label>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={config.about_title_en}
                        onChange={(e) => setConfig(prev => ({ ...prev, about_title_en: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇬🇧 Connecting Success between"
                      />
                      <input
                        type="text"
                        value={config.about_title_fr}
                        onChange={(e) => setConfig(prev => ({ ...prev, about_title_fr: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇫🇷 Connecter le Succès entre"
                      />
                      <input
                        type="text"
                        value={config.about_title_ar}
                        onChange={(e) => setConfig(prev => ({ ...prev, about_title_ar: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇹🇳 ربط النجاح بين"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Highlights (Europe & Africa) */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Highlight 1 (Europe)</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.about_highlight1_en}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_highlight1_en: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇬🇧 Europe"
                        />
                        <input
                          type="text"
                          value={config.about_highlight1_fr}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_highlight1_fr: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇫🇷 Europe"
                        />
                        <input
                          type="text"
                          value={config.about_highlight1_ar}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_highlight1_ar: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇹🇳 أوروبا"
                          dir="rtl"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Highlight 2 (Africa)</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.about_highlight2_en}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_highlight2_en: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇬🇧 Africa"
                        />
                        <input
                          type="text"
                          value={config.about_highlight2_fr}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_highlight2_fr: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇫🇷 Afrique"
                        />
                        <input
                          type="text"
                          value={config.about_highlight2_ar}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_highlight2_ar: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇹🇳 أفريقيا"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Description</label>
                    <div className="grid grid-cols-3 gap-4">
                      <textarea
                        value={config.about_description_en}
                        onChange={(e) => setConfig(prev => ({ ...prev, about_description_en: e.target.value }))}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                      />
                      <textarea
                        value={config.about_description_fr}
                        onChange={(e) => setConfig(prev => ({ ...prev, about_description_fr: e.target.value }))}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                      />
                      <textarea
                        value={config.about_description_ar}
                        onChange={(e) => setConfig(prev => ({ ...prev, about_description_ar: e.target.value }))}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Points (Bullet List) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Points Clés (4 points)</label>
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="text-xs font-medium text-gray-600 mb-3">Point {num}</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={config[`about_point${num}_en` as keyof typeof config]}
                            onChange={(e) => setConfig(prev => ({ ...prev, [`about_point${num}_en`]: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                            placeholder="🇬🇧 Point"
                          />
                          <input
                            type="text"
                            value={config[`about_point${num}_fr` as keyof typeof config]}
                            onChange={(e) => setConfig(prev => ({ ...prev, [`about_point${num}_fr`]: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                            placeholder="🇫🇷 Point"
                          />
                          <input
                            type="text"
                            value={config[`about_point${num}_ar` as keyof typeof config]}
                            onChange={(e) => setConfig(prev => ({ ...prev, [`about_point${num}_ar`]: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                            placeholder="🇹🇳 النقطة"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Locations (Paris & Tunis) */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Location 1 (Paris)</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.about_location1_en}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_location1_en: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇬🇧 Paris"
                        />
                        <input
                          type="text"
                          value={config.about_location1_fr}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_location1_fr: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇫🇷 Paris"
                        />
                        <input
                          type="text"
                          value={config.about_location1_ar}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_location1_ar: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇹🇳 باريس"
                          dir="rtl"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Location 2 (Tunis)</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={config.about_location2_en}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_location2_en: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇬🇧 Tunis"
                        />
                        <input
                          type="text"
                          value={config.about_location2_fr}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_location2_fr: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇫🇷 Tunis"
                        />
                        <input
                          type="text"
                          value={config.about_location2_ar}
                          onChange={(e) => setConfig(prev => ({ ...prev, about_location2_ar: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                          placeholder="🇹🇳 تونس"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Bouton CTA</h3>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <input
                        type="text"
                        value={config.about_cta_text_en}
                        onChange={(e) => setConfig(prev => ({ ...prev, about_cta_text_en: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                        placeholder="🇬🇧 Learn More"
                      />
                      <input
                        type="text"
                        value={config.about_cta_text_fr}
                        onChange={(e) => setConfig(prev => ({ ...prev, about_cta_text_fr: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                        placeholder="🇫🇷 En Savoir Plus"
                      />
                      <input
                        type="text"
                        value={config.about_cta_text_ar}
                        onChange={(e) => setConfig(prev => ({ ...prev, about_cta_text_ar: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                        placeholder="🇹🇳 اعرف المزيد"
                        dir="rtl"
                      />
                    </div>
                    <input
                      type="text"
                      value={config.about_cta_url}
                      onChange={(e) => setConfig(prev => ({ ...prev, about_cta_url: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                      placeholder="URL: /about"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistiques</h2>

                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Statistique {num}</h3>
                      <div className="grid grid-cols-4 gap-4">
                        <input
                          type="text"
                          value={config[`stat${num}_value` as keyof typeof config]}
                          onChange={(e) => setConfig(prev => ({ ...prev, [`stat${num}_value`]: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900 font-bold text-center"
                          placeholder="10+"
                        />
                        <input
                          type="text"
                          value={config[`stat${num}_label_en` as keyof typeof config]}
                          onChange={(e) => setConfig(prev => ({ ...prev, [`stat${num}_label_en`]: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                          placeholder="🇬🇧 Label"
                        />
                        <input
                          type="text"
                          value={config[`stat${num}_label_fr` as keyof typeof config]}
                          onChange={(e) => setConfig(prev => ({ ...prev, [`stat${num}_label_fr`]: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                          placeholder="🇫🇷 Libellé"
                        />
                        <input
                          type="text"
                          value={config[`stat${num}_label_ar` as keyof typeof config]}
                          onChange={(e) => setConfig(prev => ({ ...prev, [`stat${num}_label_ar`]: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                          placeholder="🇹🇳 التسمية"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'why' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Pourquoi Nous Choisir</h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Titre</label>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={config.why_title_en}
                        onChange={(e) => setConfig(prev => ({ ...prev, why_title_en: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇬🇧 Why Choose Us?"
                      />
                      <input
                        type="text"
                        value={config.why_title_fr}
                        onChange={(e) => setConfig(prev => ({ ...prev, why_title_fr: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇫🇷 Pourquoi Nous?"
                      />
                      <input
                        type="text"
                        value={config.why_title_ar}
                        onChange={(e) => setConfig(prev => ({ ...prev, why_title_ar: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        placeholder="🇹🇳 لماذا نحن؟"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Sous-titre</label>
                    <div className="grid grid-cols-3 gap-4">
                      <textarea
                        value={config.why_subtitle_en}
                        onChange={(e) => setConfig(prev => ({ ...prev, why_subtitle_en: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                      />
                      <textarea
                        value={config.why_subtitle_fr}
                        onChange={(e) => setConfig(prev => ({ ...prev, why_subtitle_fr: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                      />
                      <textarea
                        value={config.why_subtitle_ar}
                        onChange={(e) => setConfig(prev => ({ ...prev, why_subtitle_ar: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
