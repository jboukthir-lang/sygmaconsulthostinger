'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Upload, Image as ImageIcon, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface HeroImageData {
  id: string;
  image_url: string;
  uploaded_by: string;
  created_at: string;
  is_active: boolean;
}

export default function HeroImageManagement() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [heroImage, setHeroImage] = useState<HeroImageData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchHeroImage();
  }, []);

  async function fetchHeroImage() {
    try {
      const response = await fetch('/api/admin/hero-image');
      const result = await response.json();

      if (result.data) {
        setHeroImage(result.data);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement de l\'image:', error?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: t.settings.heroImageBuilder.invalidImage });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: t.settings.heroImageBuilder.sizeLimit });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Upload via API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.uid);

      const response = await fetch('/api/admin/hero-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setHeroImage(result.data);
      setMessage({ type: 'success', text: t.settings.heroImageBuilder.uploadSuccess });
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      setMessage({ type: 'error', text: error.message || t.settings.heroImageBuilder.uploadError });
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage() {
    if (!heroImage || !confirm(t.settings.heroImageBuilder.deleteConfirm)) return;

    try {
      const response = await fetch(`/api/admin/hero-image?id=${heroImage.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      setHeroImage(null);
      setMessage({ type: 'success', text: t.settings.heroImageBuilder.deleteSuccess });
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setMessage({ type: 'error', text: t.settings.heroImageBuilder.deleteError });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#001F3F]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#001F3F]">{t.settings.heroImageBuilder.title}</h1>
          <p className="text-gray-600 mt-1">{t.settings.heroImageBuilder.subtitle}</p>
        </div>
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

      {/* Current Image */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#001F3F] mb-4 flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {t.settings.heroImageBuilder.currentImage}
        </h2>

        {heroImage ? (
          <div className="space-y-4">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={heroImage.image_url}
                alt="Hero Image"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>{t.settings.heroImageBuilder.uploadedAt}: {new Date(heroImage.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-TN' : 'en-US')}</p>
              </div>
              <button
                onClick={handleDeleteImage}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t.settings.heroImageBuilder.delete}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>{t.settings.heroImageBuilder.noImage}</p>
            <p className="text-sm mt-1">{t.settings.heroImageBuilder.defaultImageNote}</p>
          </div>
        )}
      </div>

      {/* Upload New Image */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#001F3F] mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t.settings.heroImageBuilder.uploadNew}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.settings.heroImageBuilder.selectImage}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              {t.settings.heroImageBuilder.recommendation}
            </p>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-[#001F3F]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t.settings.heroImageBuilder.uploading}</span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-semibold text-[#001F3F] mb-3">{t.settings.heroImageBuilder.instructionsTitle}</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] mt-0.5">•</span>
            <span>{t.settings.heroImageBuilder.instruction1}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] mt-0.5">•</span>
            <span>{t.settings.heroImageBuilder.instruction2}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] mt-0.5">•</span>
            <span>{t.settings.heroImageBuilder.instruction3}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] mt-0.5">•</span>
            <span>{t.settings.heroImageBuilder.instruction4}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
