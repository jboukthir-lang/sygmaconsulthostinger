'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
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
  const [heroImage, setHeroImage] = useState<HeroImageData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchHeroImage();
  }, []);

  async function fetchHeroImage() {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setHeroImage(data);
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
      setMessage({ type: 'error', text: 'Veuillez sélectionner une image valide' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 5 MB' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `hero_${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      // Deactivate old hero image
      if (heroImage) {
        await supabase
          .from('hero_images')
          .update({ is_active: false })
          .eq('id', heroImage.id);
      }

      // Insert new hero image
      const { data: newHeroImage, error: insertError } = await supabase
        .from('hero_images')
        .insert({
          image_url: publicUrl,
          uploaded_by: user.uid,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setHeroImage(newHeroImage);
      setMessage({ type: 'success', text: 'Image téléchargée avec succès!' });
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors du téléchargement' });
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage() {
    if (!heroImage || !confirm('Êtes-vous sûr de vouloir supprimer cette image?')) return;

    try {
      // Extract file path from URL
      const urlParts = heroImage.image_url.split('/');
      const filePath = `hero/${urlParts[urlParts.length - 1]}`;

      // Delete from storage
      await supabase.storage
        .from('public')
        .remove([filePath]);

      // Delete from database
      await supabase
        .from('hero_images')
        .delete()
        .eq('id', heroImage.id);

      setHeroImage(null);
      setMessage({ type: 'success', text: 'Image supprimée avec succès' });
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
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
          <h1 className="text-2xl font-bold text-[#001F3F]">Image de la page d'accueil</h1>
          <p className="text-gray-600 mt-1">Gérer l'image principale affichée sur la page d'accueil</p>
        </div>
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

      {/* Current Image */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#001F3F] mb-4 flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image actuelle
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
                <p>Téléchargé le: {new Date(heroImage.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              <button
                onClick={handleDeleteImage}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>Aucune image actuellement définie</p>
            <p className="text-sm mt-1">L'image temporaire SVG sera utilisée par défaut</p>
          </div>
        )}
      </div>

      {/* Upload New Image */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#001F3F] mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Télécharger une nouvelle image
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner une image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              Format recommandé: 1200x800px (ratio 3:2) • Max 5 MB • JPG, PNG, WebP
            </p>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-[#001F3F]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Téléchargement en cours...</span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-semibold text-[#001F3F] mb-3">Instructions</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] mt-0.5">•</span>
            <span>L'image doit être de haute qualité pour un affichage professionnel</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] mt-0.5">•</span>
            <span>Le ratio recommandé est 3:2 (par exemple: 1200x800px ou 1800x1200px)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] mt-0.5">•</span>
            <span>L'ancienne image sera automatiquement remplacée lors du téléchargement d'une nouvelle</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4AF37] mt-0.5">•</span>
            <span>Si aucune image n'est définie, l'image temporaire SVG sera utilisée par défaut</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
