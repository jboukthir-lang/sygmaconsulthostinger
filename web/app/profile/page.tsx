'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { User, Mail, Phone, Building, MapPin, Edit2, Save, X, Camera, Upload } from 'lucide-react';
import { t } from '@/lib/translations';

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  city: string;
  address: string;
  language: string;
  photo_url: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    city: '',
    address: '',
    language: 'en',
    photo_url: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBookingsCount();

      // Real-time subscription for profile updates
      const channel = supabase
        .channel('profile_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_profiles',
            filter: `user_id=eq.${user.uid}`,
          },
          () => {
            fetchProfile();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  async function fetchProfile() {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.uid)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          company: data.company || '',
          country: data.country || '',
          city: data.city || '',
          address: data.address || '',
          language: data.language || 'en',
          photo_url: data.photo_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookingsCount() {
    try {
      if (!user?.email) return;

      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('email', user.email);

      if (!error && count !== null) {
        setTotalBookings(count);
      }
    } catch (error) {
      console.error('Error fetching bookings count:', error);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: t('profile.invalidImageType', language) });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: t('profile.imageTooLarge', language) });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      // Update profile with new photo URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.uid,
          photo_url: publicUrl,
          email: profile.email || user.email,
        });

      if (updateError) throw updateError;

      setProfile({ ...profile, photo_url: publicUrl });
      setMessage({ type: 'success', text: t('profile.photoUpdated', language) });
    } catch (error) {
      console.error('Error uploading photo:', error);
      setMessage({ type: 'error', text: t('profile.photoUploadError', language) });
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile() {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.uid,
          ...profile,
          email: profile.email || user.email,
        });

      if (error) throw error;

      setIsEditing(false);
      setMessage({ type: 'success', text: t('profile.profileUpdated', language) });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: t('profile.saveError', language) });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.loadingProfile', language)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">{t('profile.myProfile', language)}</h1>
          <p className="text-gray-600 mt-1">{t('profile.manageInfo', language)}</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            {t('profile.editProfile', language)}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setMessage(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
              {t('common.cancel', language)}
            </button>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? t('common.saving', language) : t('common.save', language)}
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Avatar Section */}
        <div className="bg-gradient-to-r from-[#001F3F] to-[#003366] px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {profile.photo_url || user?.photoURL ? (
                  <img src={profile.photo_url || user?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-[#001F3F]" />
                )}
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-100 transition-colors"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="h-4 w-4 text-[#001F3F]" />
                )}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{profile.full_name || user?.displayName || t('profile.userName', language)}</h2>
              <p className="text-blue-200">{profile.email || user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-[#001F3F] mb-6">{t('profile.personalInfo', language)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                {t('admin.name', language)}
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 disabled:bg-gray-50 disabled:text-gray-600"
                placeholder={t('profile.enterName', language)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4" />
                {t('admin.email', language)}
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 disabled:bg-gray-50 disabled:text-gray-600"
                placeholder={t('profile.enterEmail', language)}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4" />
                {t('profile.phone', language)}
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 disabled:bg-gray-50 disabled:text-gray-600"
                placeholder={t('profile.enterPhone', language)}
              />
            </div>

            {/* Company */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4" />
                {t('profile.company', language)}
              </label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 disabled:bg-gray-50 disabled:text-gray-600"
                placeholder={t('profile.enterCompany', language)}
              />
            </div>

            {/* Country */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4" />
                {t('profile.country', language)}
              </label>
              <select
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 disabled:bg-gray-50 disabled:text-gray-600"
              >
                <option value="">{t('profile.selectCountry', language)}</option>
                <option value="france">France</option>
                <option value="tunisia">Tunisia</option>
                <option value="morocco">Morocco</option>
                <option value="algeria">Algeria</option>
                <option value="other">{t('profile.other', language)}</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4" />
                {t('profile.city', language)}
              </label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 disabled:bg-gray-50 disabled:text-gray-600"
                placeholder={t('profile.enterCity', language)}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4" />
                {t('profile.address', language)}
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 disabled:bg-gray-50 disabled:text-gray-600"
                placeholder={t('profile.enterAddress', language)}
              />
            </div>

            {/* Language */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {t('profile.preferredLanguage', language)}
              </label>
              <select
                value={profile.language}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 disabled:bg-gray-50 disabled:text-gray-600"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">{t('profile.totalBookings', language)}</p>
          <p className="text-3xl font-bold text-[#001F3F]">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">{t('profile.accountStatus', language)}</p>
          <p className="text-xl font-bold text-green-600">{t('profile.active', language)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">{t('profile.memberSince', language)}</p>
          <p className="text-xl font-bold text-[#001F3F]">
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString(language, { month: 'short', year: 'numeric' })
              : 'Jan 2025'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
