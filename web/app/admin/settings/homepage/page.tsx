'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, CheckCircle, AlertCircle, Home, Info } from 'lucide-react';

interface HomepageSection {
  id: string;
  section_name: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_fr: string;
  subtitle_ar: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
  badge_en: string;
  badge_fr: string;
  badge_ar: string;
  cta_text_en: string;
  cta_text_fr: string;
  cta_text_ar: string;
  cta_url: string;
  cta_secondary_text_en: string;
  cta_secondary_text_fr: string;
  cta_secondary_text_ar: string;
  cta_secondary_url: string;
  content_en: any;
  content_fr: any;
  content_ar: any;
}

export default function HomepageContentPage() {
  const [heroSection, setHeroSection] = useState<HomepageSection | null>(null);
  const [aboutSection, setAboutSection] = useState<HomepageSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'hero' | 'about'>('hero');

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    try {
      setLoading(true);

      // Fetch Hero section
      const { data: heroData, error: heroError } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_name', 'hero')
        .single();

      if (heroError) throw heroError;
      setHeroSection(heroData);

      // Fetch About section
      const { data: aboutData, error: aboutError } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_name', 'about')
        .single();

      if (aboutError) throw aboutError;
      setAboutSection(aboutData);
    } catch (error: any) {
      console.error('Error fetching sections:', error);
      setMessage({ type: 'error', text: 'فشل تحميل محتوى الصفحة' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);

      // Save Hero section
      if (heroSection) {
        const { error: heroError } = await supabase
          .from('homepage_sections')
          .update(heroSection)
          .eq('section_name', 'hero');

        if (heroError) throw heroError;
      }

      // Save About section
      if (aboutSection) {
        const { error: aboutError } = await supabase
          .from('homepage_sections')
          .update(aboutSection)
          .eq('section_name', 'about');

        if (aboutError) throw aboutError;
      }

      setMessage({ type: 'success', text: 'تم حفظ محتوى الصفحة الرئيسية بنجاح! ✅' });

      // Auto-hide success message
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving sections:', error);
      setMessage({ type: 'error', text: 'فشل حفظ المحتوى: ' + error.message });
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

  if (!heroSection || !aboutSection) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">لا يوجد محتوى</p>
      </div>
    );
  }

  const currentSection = activeSection === 'hero' ? heroSection : aboutSection;
  const setCurrentSection = activeSection === 'hero' ? setHeroSection : setAboutSection;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">محتوى الصفحة الرئيسية</h1>
          <p className="text-gray-600 mt-1">تحرير نصوص وعناوين الصفحة الرئيسية</p>
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

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSection('hero')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeSection === 'hero'
                ? 'border-[#001F3F] text-[#001F3F] font-semibold'
                : 'border-transparent text-gray-600 hover:text-[#001F3F]'
            }`}
          >
            <Home className="h-5 w-5" />
            قسم Hero (الصفحة الرئيسية)
          </button>
          <button
            onClick={() => setActiveSection('about')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeSection === 'about'
                ? 'border-[#001F3F] text-[#001F3F] font-semibold'
                : 'border-transparent text-gray-600 hover:text-[#001F3F]'
            }`}
          >
            <Info className="h-5 w-5" />
            قسم About (من نحن)
          </button>
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Badge (Hero only) */}
        {activeSection === 'hero' && (
          <div>
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">الشارة (Badge)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                <input
                  type="text"
                  value={heroSection.badge_en}
                  onChange={(e) => setHeroSection({ ...heroSection, badge_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Premium Consulting Services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Français</label>
                <input
                  type="text"
                  value={heroSection.badge_fr}
                  onChange={(e) => setHeroSection({ ...heroSection, badge_fr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="Services de Conseil Premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العربية</label>
                <input
                  type="text"
                  value={heroSection.badge_ar}
                  onChange={(e) => setHeroSection({ ...heroSection, badge_ar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  placeholder="خدمات استشارية متميزة"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-[#001F3F] mb-4">العنوان الرئيسي</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
              <input
                type="text"
                value={currentSection.title_en}
                onChange={(e) => setCurrentSection({ ...currentSection, title_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Français</label>
              <input
                type="text"
                value={currentSection.title_fr}
                onChange={(e) => setCurrentSection({ ...currentSection, title_fr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العربية</label>
              <input
                type="text"
                value={currentSection.title_ar}
                onChange={(e) => setCurrentSection({ ...currentSection, title_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <h3 className="text-lg font-semibold text-[#001F3F] mb-4">العنوان الفرعي</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
              <textarea
                value={currentSection.subtitle_en}
                onChange={(e) => setCurrentSection({ ...currentSection, subtitle_en: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Français</label>
              <textarea
                value={currentSection.subtitle_fr}
                onChange={(e) => setCurrentSection({ ...currentSection, subtitle_fr: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العربية</label>
              <textarea
                value={currentSection.subtitle_ar}
                onChange={(e) => setCurrentSection({ ...currentSection, subtitle_ar: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Description (About section only) */}
        {activeSection === 'about' && (
          <div>
            <h3 className="text-lg font-semibold text-[#001F3F] mb-4">الوصف</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                <textarea
                  value={aboutSection.description_en}
                  onChange={(e) => setAboutSection({ ...aboutSection, description_en: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Français</label>
                <textarea
                  value={aboutSection.description_fr}
                  onChange={(e) => setAboutSection({ ...aboutSection, description_fr: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العربية</label>
                <textarea
                  value={aboutSection.description_ar}
                  onChange={(e) => setAboutSection({ ...aboutSection, description_ar: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div>
          <h3 className="text-lg font-semibold text-[#001F3F] mb-4">أزرار الإجراء (CTA)</h3>

          {/* Primary CTA */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">الزر الأساسي</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نص الزر (EN)</label>
                <input
                  type="text"
                  value={currentSection.cta_text_en}
                  onChange={(e) => setCurrentSection({ ...currentSection, cta_text_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نص الزر (FR)</label>
                <input
                  type="text"
                  value={currentSection.cta_text_fr}
                  onChange={(e) => setCurrentSection({ ...currentSection, cta_text_fr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نص الزر (AR)</label>
                <input
                  type="text"
                  value={currentSection.cta_text_ar}
                  onChange={(e) => setCurrentSection({ ...currentSection, cta_text_ar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  dir="rtl"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رابط الزر</label>
              <input
                type="text"
                value={currentSection.cta_url}
                onChange={(e) => setCurrentSection({ ...currentSection, cta_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                placeholder="/book"
              />
            </div>
          </div>

          {/* Secondary CTA */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">الزر الثانوي</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نص الزر (EN)</label>
                <input
                  type="text"
                  value={currentSection.cta_secondary_text_en}
                  onChange={(e) => setCurrentSection({ ...currentSection, cta_secondary_text_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نص الزر (FR)</label>
                <input
                  type="text"
                  value={currentSection.cta_secondary_text_fr}
                  onChange={(e) => setCurrentSection({ ...currentSection, cta_secondary_text_fr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نص الزر (AR)</label>
                <input
                  type="text"
                  value={currentSection.cta_secondary_text_ar}
                  onChange={(e) => setCurrentSection({ ...currentSection, cta_secondary_text_ar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                  dir="rtl"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رابط الزر</label>
              <input
                type="text"
                value={currentSection.cta_secondary_url}
                onChange={(e) => setCurrentSection({ ...currentSection, cta_secondary_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001F3F] focus:border-transparent"
                placeholder="/services"
              />
            </div>
          </div>
        </div>
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
