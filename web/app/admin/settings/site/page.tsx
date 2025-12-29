'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Save, Loader2, CheckCircle, AlertCircle, Globe, Phone, Mail, MapPin, Clock, Palette, X } from 'lucide-react';

interface SiteSettings {
  key: string;
  company_name: string;
  company_tagline_en: string;
  company_tagline_fr: string;
  company_tagline_ar: string;
  company_description_en: string;
  company_description_fr: string;
  company_description_ar: string;
  phone_primary: string;
  phone_secondary?: string;
  whatsapp_number: string;
  email_primary: string;
  email_secondary?: string;
  address_paris_en: string;
  address_paris_fr: string;
  address_paris_ar: string;
  address_tunis_en: string;
  address_tunis_fr: string;
  address_tunis_ar: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  business_hours_en: string;
  business_hours_fr: string;
  business_hours_ar: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  favicon_url: string;
}

export default function SiteSettingsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'company' | 'contact' | 'social' | 'branding'>('company');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_config')
        .select('*')
        .eq('key', 'main')
        .single();

      if (error) throw error;

      // Apply defaults if data is null or fields are null
      setSettings({
        key: data.key || 'main',
        company_name: data.company_name || '',
        company_tagline_en: data.company_tagline_en || '',
        company_tagline_fr: data.company_tagline_fr || '',
        company_tagline_ar: data.company_tagline_ar || '',
        company_description_en: data.company_description_en || '',
        company_description_fr: data.company_description_fr || '',
        company_description_ar: data.company_description_ar || '',
        phone_primary: data.phone_primary || '',
        phone_secondary: data.phone_secondary || undefined,
        whatsapp_number: data.whatsapp_number || '',
        email_primary: data.email_primary || '',
        email_secondary: data.email_secondary || undefined,
        address_paris_en: data.address_paris_en || '',
        address_paris_fr: data.address_paris_fr || '',
        address_paris_ar: data.address_paris_ar || '',
        address_tunis_en: data.address_tunis_en || '',
        address_tunis_fr: data.address_tunis_fr || '',
        address_tunis_ar: data.address_tunis_ar || '',
        linkedin_url: data.linkedin_url || undefined,
        twitter_url: data.twitter_url || undefined,
        facebook_url: data.facebook_url || undefined,
        instagram_url: data.instagram_url || undefined,
        youtube_url: data.youtube_url || undefined,
        business_hours_en: data.business_hours_en || '',
        business_hours_fr: data.business_hours_fr || '',
        business_hours_ar: data.business_hours_ar || '',
        primary_color: data.primary_color || '#001F3F',
        secondary_color: data.secondary_color || '#D4AF37',
        logo_url: data.logo_url || '',
        favicon_url: data.favicon_url || '',
      });
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: t.settings.error || 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!settings) return;

    try {
      setSaving(true);
      setMessage(null);

      // Reverting to Client-Side Save (Relies on 'Option A' SQL Script)
      // This is more reliable if Server Actions are failing due to env vars.

      console.log('Attempting client-side save...');

      const { error } = await supabase
        .from('app_config')
        .upsert(settings, { onConflict: 'key' }); // Using explicit Upsert

      if (error) {
        console.error('Client-side save error:', error);
        // Check for RLS error code
        if (error.code === '42501') {
          throw new Error('Permission Denied (RLS). You MUST run the "Option A" SQL script in Supabase.');
        }
        throw error;
      }

      setMessage({ type: 'success', text: t.settings.success });

      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving settings details:', JSON.stringify(error, null, 2));
      console.error('Original error:', error);
      setMessage({ type: 'error', text: t.settings.error + ': ' + (error.message || 'Unknown error') });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#001F3F]" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{t.settings.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">{t.settings.title}</h1>
          <p className="text-gray-600 mt-1">{t.settings.subtitle}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t.settings.saving}
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              {t.settings.save}
            </>
          )}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4 overflow-x-auto pb-1">
          {[
            { id: 'company', label: t.settings.tabs.company, icon: Globe },
            { id: 'contact', label: t.settings.tabs.contact, icon: Phone },
            { id: 'social', label: t.settings.tabs.social, icon: Mail },
            { id: 'branding', label: t.settings.tabs.branding, icon: Palette }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? 'border-[#001F3F] text-[#001F3F] font-semibold'
                  : 'border-transparent text-gray-600 hover:text-[#001F3F]'
                  }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Company Info Tab */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#001F3F] mb-4">{t.settings.tabs.company}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.companyName}</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.tagline} (English)</label>
                <input
                  type="text"
                  value={settings.company_tagline_en}
                  onChange={(e) => setSettings({ ...settings, company_tagline_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Your Strategic Partner..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.tagline} (Français)</label>
                <input
                  type="text"
                  value={settings.company_tagline_fr}
                  onChange={(e) => setSettings({ ...settings, company_tagline_fr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Votre Partenaire Stratégique..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.tagline} (العربية)</label>
                <input
                  type="text"
                  value={settings.company_tagline_ar}
                  onChange={(e) => setSettings({ ...settings, company_tagline_ar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="شريكك الاستراتيجي..."
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.description} (English)</label>
              <textarea
                value={settings.company_description_en}
                onChange={(e) => setSettings({ ...settings, company_description_en: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.description} (Français)</label>
              <textarea
                value={settings.company_description_fr}
                onChange={(e) => setSettings({ ...settings, company_description_fr: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.description} (العربية)</label>
              <textarea
                value={settings.company_description_ar}
                onChange={(e) => setSettings({ ...settings, company_description_ar: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                dir="rtl"
              />
            </div>
          </div>
        )}

        {/* Contact Info Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#001F3F] mb-4 flex items-center gap-2">
              <Phone className="h-6 w-6" />
              {t.settings.tabs.contact}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.primaryPhone}</label>
                <input
                  type="tel"
                  value={settings.phone_primary}
                  onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="+33 7 52 03 47 86"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.secondaryPhone}</label>
                <input
                  type="tel"
                  value={settings.phone_secondary || ''}
                  onChange={(e) => setSettings({ ...settings, phone_secondary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.whatsapp}</label>
              <input
                type="tel"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                placeholder="+33 7 52 03 47 86"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.primaryEmail}</label>
                <input
                  type="email"
                  value={settings.email_primary}
                  onChange={(e) => setSettings({ ...settings, email_primary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="contact@sygma-consult.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.secondaryEmail}</label>
                <input
                  type="email"
                  value={settings.email_secondary || ''}
                  onChange={(e) => setSettings({ ...settings, email_secondary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold text-[#001F3F] mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t.settings.address}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.address} Paris (EN/FR)</label>
                  <input
                    type="text"
                    value={settings.address_paris_en}
                    onChange={(e) => setSettings({
                      ...settings,
                      address_paris_en: e.target.value,
                      address_paris_fr: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    placeholder="6 rue Paul Verlaine, 93130 Noisy-le-Sec"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.address} Paris (AR)</label>
                  <input
                    type="text"
                    value={settings.address_paris_ar}
                    onChange={(e) => setSettings({ ...settings, address_paris_ar: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.address} Tunis (EN/FR)</label>
                  <input
                    type="text"
                    value={settings.address_tunis_en}
                    onChange={(e) => setSettings({
                      ...settings,
                      address_tunis_en: e.target.value,
                      address_tunis_fr: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    placeholder="Les Berges du Lac II, 1053 Tunis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.address} Tunis (AR)</label>
                  <input
                    type="text"
                    value={settings.address_tunis_ar}
                    onChange={(e) => setSettings({ ...settings, address_tunis_ar: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold text-[#001F3F] mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t.settings.businessHours}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                  <input
                    type="text"
                    value={settings.business_hours_en}
                    onChange={(e) => setSettings({ ...settings, business_hours_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Français</label>
                  <input
                    type="text"
                    value={settings.business_hours_fr}
                    onChange={(e) => setSettings({ ...settings, business_hours_fr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العربية</label>
                  <input
                    type="text"
                    value={settings.business_hours_ar}
                    onChange={(e) => setSettings({ ...settings, business_hours_ar: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#001F3F] mb-4">{t.settings.socialLinks}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={settings.linkedin_url || ''}
                  onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="https://www.linkedin.com/company/sygma-consult"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter / X</label>
                <input
                  type="url"
                  value={settings.twitter_url || ''}
                  onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="https://twitter.com/sygmaconsult"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={settings.facebook_url || ''}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="https://www.facebook.com/sygmaconsult"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={settings.instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="https://www.instagram.com/sygmaconsult"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                <input
                  type="url"
                  value={settings.youtube_url || ''}
                  onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="https://www.youtube.com/@sygmaconsult"
                />
              </div>
            </div>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#001F3F] mb-4 flex items-center gap-2">
              <Palette className="h-6 w-6" />
              {t.settings.tabs.branding}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.primaryColor}</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    placeholder="#001F3F"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Navy Blue</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.settings.secondaryColor}</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    placeholder="#D4AF37"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Gold</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-[#001F3F] mb-3">{t.settings.preview}</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div
                    className="h-24 rounded-lg mb-2"
                    style={{ backgroundColor: settings.primary_color }}
                  ></div>
                  <p className="text-sm text-center text-gray-600">{t.settings.primaryColor}</p>
                </div>
                <div className="flex-1">
                  <div
                    className="h-24 rounded-lg mb-2"
                    style={{ backgroundColor: settings.secondary_color }}
                  ></div>
                  <p className="text-sm text-center text-gray-600">{t.settings.secondaryColor}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ {t.settings.warning}
              </p>
            </div>

            <div className="pt-6 border-t mt-6">
              <h2 className="text-xl font-bold text-[#001F3F] mb-6">{t.settings.logo} & Branding</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">{t.settings.logo}</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    {settings.logo_url ? (
                      <div className="relative w-full aspect-[3/1] mb-4 group">
                        <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain" />
                        <button
                          onClick={() => setSettings({ ...settings, logo_url: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <Globe className="h-12 w-12 text-gray-300 mb-2" />
                    )}
                    <label className="cursor-pointer bg-[#001F3F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#003366] transition-colors">
                      {settings.logo_url ? t.settings.change : t.settings.upload}
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
                            const fileName = `logo_${Date.now()}.${fileExt}`;
                            const filePath = `branding/${fileName}`;

                            const { error: uploadError } = await supabase.storage
                              .from('public')
                              .upload(filePath, file);

                            if (uploadError) throw uploadError;

                            const { data: { publicUrl } } = supabase.storage
                              .from('public')
                              .getPublicUrl(filePath);

                            setSettings({ ...settings, logo_url: publicUrl });
                          } catch (err) {
                            console.error('Logo upload error:', err);
                            setMessage({ type: 'error', text: 'Error uploading logo' });
                          } finally {
                            setSaving(false);
                          }
                        }}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PNG, SVG or JPG (transparent preferred)</p>
                  </div>
                </div>

                {/* Favicon Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">{t.settings.favicon}</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    {settings.favicon_url ? (
                      <div className="relative w-16 h-16 mb-4 group">
                        <img src={settings.favicon_url} alt="Favicon" className="w-full h-full object-contain" />
                        <button
                          onClick={() => setSettings({ ...settings, favicon_url: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <Palette className="h-12 w-12 text-gray-300 mb-2" />
                    )}
                    <label className="cursor-pointer bg-[#001F3F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#003366] transition-colors">
                      {settings.favicon_url ? t.settings.change : t.settings.upload}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/x-icon,image/png,image/svg+xml"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setSaving(true);
                          try {
                            const fileExt = file.name.split('.').pop();
                            const fileName = `favicon_${Date.now()}.${fileExt}`;
                            const filePath = `branding/${fileName}`;

                            const { error: uploadError } = await supabase.storage
                              .from('public')
                              .upload(filePath, file);

                            if (uploadError) throw uploadError;

                            const { data: { publicUrl } } = supabase.storage
                              .from('public')
                              .getPublicUrl(filePath);

                            setSettings({ ...settings, favicon_url: publicUrl });
                          } catch (err) {
                            console.error('Favicon upload error:', err);
                            setMessage({ type: 'error', text: 'Error uploading favicon' });
                          } finally {
                            setSaving(false);
                          }
                        }}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">ICO or PNG (32x32 preferred)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors disabled:opacity-50 font-semibold"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t.settings.saving}
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              {t.settings.save}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
