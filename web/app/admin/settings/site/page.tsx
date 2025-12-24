'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, CheckCircle, AlertCircle, Globe, Phone, Mail, MapPin, Clock, Palette } from 'lucide-react';

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
}

export default function SiteSettingsPage() {
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
      setSettings(data);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'فشل تحميل الإعدادات' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!settings) return;

    try {
      setSaving(true);
      setMessage(null);

      const { error } = await supabase
        .from('app_config')
        .update(settings)
        .eq('key', 'main');

      if (error) throw error;

      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح! ✅' });

      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'فشل حفظ الإعدادات: ' + error.message });
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
        <p className="text-gray-600">لا توجد إعدادات</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">إعدادات الموقع</h1>
          <p className="text-gray-600 mt-1">إدارة معلومات الشركة والتواصل والعلامة التجارية</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              حفظ التغييرات
            </>
          )}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
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
        <div className="flex gap-4">
          {[
            { id: 'company', label: 'معلومات الشركة', icon: Globe },
            { id: 'contact', label: 'معلومات التواصل', icon: Phone },
            { id: 'social', label: 'وسائل التواصل الاجتماعي', icon: Mail },
            { id: 'branding', label: 'العلامة التجارية', icon: Palette }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
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
            <h2 className="text-xl font-bold text-[#001F3F] mb-4">معلومات الشركة</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشركة</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الشعار (English)</label>
                <input
                  type="text"
                  value={settings.company_tagline_en}
                  onChange={(e) => setSettings({ ...settings, company_tagline_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Your Strategic Partner..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الشعار (Français)</label>
                <input
                  type="text"
                  value={settings.company_tagline_fr}
                  onChange={(e) => setSettings({ ...settings, company_tagline_fr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Votre Partenaire Stratégique..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الشعار (العربية)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (English)</label>
              <textarea
                value={settings.company_description_en}
                onChange={(e) => setSettings({ ...settings, company_description_en: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (Français)</label>
              <textarea
                value={settings.company_description_fr}
                onChange={(e) => setSettings({ ...settings, company_description_fr: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (العربية)</label>
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
              معلومات التواصل
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف الرئيسي</label>
                <input
                  type="tel"
                  value={settings.phone_primary}
                  onChange={(e) => setSettings({ ...settings, phone_primary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="+33 7 52 03 47 86"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم هاتف ثانوي (اختياري)</label>
                <input
                  type="tel"
                  value={settings.phone_secondary || ''}
                  onChange={(e) => setSettings({ ...settings, phone_secondary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم WhatsApp</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني الرئيسي</label>
                <input
                  type="email"
                  value={settings.email_primary}
                  onChange={(e) => setSettings({ ...settings, email_primary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="contact@sygma-consult.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">بريد إلكتروني ثانوي (اختياري)</label>
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
                العناوين
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان باريس (EN/FR)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان باريس (AR)</label>
                  <input
                    type="text"
                    value={settings.address_paris_ar}
                    onChange={(e) => setSettings({ ...settings, address_paris_ar: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان تونس (EN/FR)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان تونس (AR)</label>
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
                ساعات العمل
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
            <h2 className="text-xl font-bold text-[#001F3F] mb-4">روابط وسائل التواصل الاجتماعي</h2>

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
              العلامة التجارية والألوان
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللون الأساسي</label>
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
                <p className="text-sm text-gray-500 mt-1">اللون الأساسي للموقع (Navy Blue)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللون الثانوي</label>
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
                <p className="text-sm text-gray-500 mt-1">اللون الثانوي/الذهبي (Gold)</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-[#001F3F] mb-3">معاينة الألوان</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div
                    className="h-24 rounded-lg mb-2"
                    style={{ backgroundColor: settings.primary_color }}
                  ></div>
                  <p className="text-sm text-center text-gray-600">اللون الأساسي</p>
                </div>
                <div className="flex-1">
                  <div
                    className="h-24 rounded-lg mb-2"
                    style={{ backgroundColor: settings.secondary_color }}
                  ></div>
                  <p className="text-sm text-center text-gray-600">اللون الثانوي</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>ملاحظة:</strong> تغيير الألوان سيؤثر على مظهر الموقع بالكامل. تأكد من اختيار ألوان متناسقة.
              </p>
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
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              حفظ جميع التغييرات
            </>
          )}
        </button>
      </div>
    </div>
  );
}
