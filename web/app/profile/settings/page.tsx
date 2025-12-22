'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { t } from '@/lib/translations';
import { Lock, Bell, Globe, Shield, Trash2, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { updatePassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SettingsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();

  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Language setting
  const [currentLang, setCurrentLang] = useState(language);
  const [savingLanguage, setSavingLanguage] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  async function loadSettings() {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('language, preferences')
        .eq('user_id', user.uid)
        .single();

      if (data) {
        setCurrentLang(data.language || 'en');
        const prefs = data.preferences || {};
        setEmailNotifications(prefs.emailNotifications ?? true);
        setBookingReminders(prefs.bookingReminders ?? true);
        setMarketingEmails(prefs.marketingEmails ?? false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError(t('auth.passwordTooShort', language));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('auth.passwordsDoNotMatch', language));
      return;
    }

    setSavingPassword(true);

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPasswordSuccess(t('profile.photoUpdated', language)); // Reusing success pattern
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Password update failed:', error);
      if (error.code === 'auth/requires-recent-login') {
        setPasswordError(t('auth.requiresRecentLogin', language));
      } else {
        setPasswordError(t('auth.error', language));
      }
    } finally {
      setSavingPassword(false);
    }
  }

  async function saveNotificationSettings() {
    if (!user) return;

    setSavingNotifications(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          preferences: {
            emailNotifications,
            bookingReminders,
            marketingEmails,
          },
        })
        .eq('user_id', user.uid);

      if (error) throw error;
      alert(t('profile.profileUpdated', language));
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert(t('common.error', language));
    } finally {
      setSavingNotifications(false);
    }
  }

  async function saveLanguage() {
    if (!user) return;

    setSavingLanguage(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ language: currentLang })
        .eq('user_id', user.uid);

      if (error) throw error;
      alert(t('profile.profileUpdated', language));
      // Force reload to apply language change globally if needed
      window.location.reload();
    } catch (error) {
      console.error('Error saving language:', error);
      alert(t('common.error', language));
    } finally {
      setSavingLanguage(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#001F3F]">{t('profile.settings', language)}</h1>
        <p className="text-gray-600 mt-1">{t('profile.accountSettings', language)}</p>
      </div>

      {/* Password Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-[#001F3F]" />
            <h2 className="text-lg font-bold text-[#001F3F]">{t('profile.changePassword', language)}</h2>
          </div>
        </div>
        <div className="p-6">
          {user?.providerData[0]?.providerId === 'google.com' ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                {t('auth.googleSignInNote', language) || "You're signed in with Google. To change your password, please update it in your Google account settings."}
              </p>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}
              {passwordSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{passwordSuccess}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('profile.newPassword', language)}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                    placeholder={t('profile.newPassword', language)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.confirmPassword', language)}
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                  placeholder={t('auth.confirmPassword', language)}
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50"
              >
                {savingPassword ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {savingPassword ? t('common.saving', language) : t('common.save', language)}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-[#001F3F]" />
            <h2 className="text-lg font-bold text-[#001F3F]">{t('profile.preferences', language)}</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">{t('profile.notifications', language)} (Email)</h3>
              <p className="text-sm text-gray-600">{t('profile.manageInfo', language)}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#001F3F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001F3F]"></div>
            </label>
          </div>

          <button
            onClick={saveNotificationSettings}
            disabled={savingNotifications}
            className="flex items-center gap-2 px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50"
          >
            {savingNotifications ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {savingNotifications ? t('common.saving', language) : t('common.save', language)}
          </button>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-[#001F3F]" />
            <h2 className="text-lg font-bold text-[#001F3F]">{t('profile.language', language)}</h2>
          </div>
        </div>
        <div className="p-6">
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value as any)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 mb-4"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
          <button
            onClick={saveLanguage}
            disabled={savingLanguage}
            className="flex items-center gap-2 px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50"
          >
            {savingLanguage ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {savingLanguage ? t('common.saving', language) : t('common.save', language)}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b border-red-200">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-bold text-red-600">{t('profile.security', language)}</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('common.delete', language)}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'ar' ? 'بمجرد حذف حسابك، لن تتمكن من التراجع. سيتم حذف جميع بياناتك نهائيًا.' : 'Once you delete your account, there is no going back. All your data will be permanently deleted.'}
              </p>
              <button
                onClick={() => alert('Feature coming soon')}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                {t('common.delete', language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
