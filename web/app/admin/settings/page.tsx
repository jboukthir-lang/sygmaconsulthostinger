'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Settings, Layout, Image as ImageIcon, Calendar, Video, FileText, Database, Shield } from 'lucide-react';

export default function AdminSettings() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if Google is connected by checking cookie
    fetch('/api/auth/google/status')
      .then(res => res.json())
      .then(data => {
        setIsGoogleConnected(data.connected);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Check for success/error messages from OAuth redirect
    const googleConnected = searchParams.get('google_connected');
    const error = searchParams.get('error');

    if (googleConnected === 'true') {
      setMessage(t.settings.googleConnected);
      setIsGoogleConnected(true);
    } else if (error) {
      setMessage(`${t.settings.error}: ${error}`);
    }
  }, [searchParams, t]);

  const handleConnectGoogle = async () => {
    // Get auth URL from API endpoint
    try {
      const res = await fetch('/api/auth/google/auth-url');
      const data = await res.json();
      window.location.href = data.authUrl;
    } catch (error) {
      setMessage(t.settings.error);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      const res = await fetch('/api/auth/google/disconnect', {
        method: 'POST',
      });

      if (res.ok) {
        setIsGoogleConnected(false);
        setMessage(t.settings.googleNotConnected);
      }
    } catch (error) {
      setMessage(t.settings.error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#001F3F]">{t.settings.title}</h1>
        <p className="text-gray-600 mt-1">{t.settings.subtitle}</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${message.includes(t.settings.error) || message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          <Shield className="h-5 w-5" />
          {message}
        </div>
      )}

      {/* Quick Links to Settings Pages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/admin/settings/site"
          className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-[#001F3F]/30"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-[#001F3F]/10 rounded-lg group-hover:bg-[#001F3F]/20 transition-colors">
              <Settings className="w-6 h-6 text-[#001F3F]" />
            </div>
            <h3 className="text-lg font-bold text-[#001F3F]">{t.settings.title}</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{t.settings.siteSettingsDesc}</p>
        </a>

        <a
          href="/admin/settings/homepage"
          className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-[#D4AF37]/30"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-[#D4AF37]/10 rounded-lg group-hover:bg-[#D4AF37]/20 transition-colors">
              <Layout className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-bold text-[#001F3F]">{t.settings.homepageContent}</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{t.settings.homepageContentDesc}</p>
        </a>

        <a
          href="/admin/hero-image"
          className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-green-500/30"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <ImageIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-[#001F3F]">{t.settings.heroImage}</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{t.settings.heroImageDesc}</p>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Google Integration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#001F3F]">{t.settings.googleIntegration}</h2>
            {isGoogleConnected && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Connected
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {t.settings.googleDesc}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-500 gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#001F3F] rounded-full animate-spin" />
              {t.common.loading}
            </div>
          ) : isGoogleConnected ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2 text-green-800 font-semibold">
                  <Shield className="h-5 w-5" />
                  {t.settings.googleConnected}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#001F3F] mb-3 text-sm uppercase tracking-wide">{t.settings.enabledFeatures}</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    {t.settings.featureCalendar}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Video className="h-4 w-4 text-green-500" />
                    {t.settings.featureMeet}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Database className="h-4 w-4 text-yellow-500" />
                    {t.settings.featureDrive}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <FileText className="h-4 w-4 text-blue-400" />
                    {t.settings.featureDocs}
                  </li>
                </ul>
              </div>

              <button
                onClick={handleDisconnectGoogle}
                className="w-full py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
              >
                {t.settings.disconnectGoogle}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
                <p className="text-sm text-yellow-800 font-medium">
                  {t.settings.googleNotConnected}
                </p>
              </div>

              <button
                onClick={handleConnectGoogle}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow text-gray-700 font-medium group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t.settings.connectGoogle}
              </button>
            </div>
          )}
        </div>

        {/* System Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
          <h2 className="text-xl font-bold text-[#001F3F] mb-6">{t.settings.systemInfo}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">{t.settings.version}</span>
              <span className="font-mono font-medium text-[#001F3F] bg-white px-2 py-1 rounded border border-gray-200 text-sm">1.2.0-final</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">{t.settings.environment}</span>
              <span className="font-mono font-medium text-green-600 bg-white px-2 py-1 rounded border border-gray-200 text-sm">{process.env.NODE_ENV}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
