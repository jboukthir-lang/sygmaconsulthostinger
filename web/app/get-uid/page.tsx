'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Copy, Check, ExternalLink } from 'lucide-react';

export default function GetUIDPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const copyToClipboard = (text: string, setCopyState: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopyState(true);
    setTimeout(() => setCopyState(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-[#001F3F] mb-4">
            يجب تسجيل الدخول أولاً
          </h1>
          <p className="text-gray-600 mb-6">
            سجل دخول لرؤية Firebase User ID الخاص بك
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  const sqlCommand = `INSERT INTO admin_users (user_id, email, role, permissions)
VALUES (
  '${user.uid}',
  '${user.email}',
  'super_admin',
  '{"all": true}'::jsonb
)
ON CONFLICT (user_id)
DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions;`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#001F3F] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
            🔑
          </div>
          <h1 className="text-4xl font-bold text-[#001F3F] mb-2">
            Firebase User ID
          </h1>
          <p className="text-gray-600">
            استخدم هذه المعلومات لإضافة حسابك كـ Admin
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-[#001F3F] mb-6">
            معلومات حسابك
          </h2>

          {/* UID */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Firebase User ID (UID)
            </label>
            <div className="flex gap-2">
              <div className="flex-1 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg font-mono text-sm break-all">
                {user.uid}
              </div>
              <button
                onClick={() => copyToClipboard(user.uid, setCopied)}
                className="px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    نسخ
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
              {user.email}
            </div>
          </div>

          {/* Display Name */}
          {user.displayName && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الاسم
              </label>
              <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                {user.displayName}
              </div>
            </div>
          )}
        </div>

        {/* SQL Command Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#001F3F]">
              أمر SQL الجاهز
            </h2>
            <button
              onClick={() => copyToClipboard(sqlCommand, setSqlCopied)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              {sqlCopied ? (
                <>
                  <Check className="h-5 w-5" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  نسخ SQL
                </>
              )}
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            الصق هذا الأمر في Supabase SQL Editor
          </p>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {sqlCommand}
            </pre>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-gradient-to-br from-[#001F3F] to-[#003366] rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">
            📋 الخطوات التالية
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">انسخ أمر SQL</h3>
                <p className="text-blue-200 text-sm">
                  اضغط على زر "نسخ SQL" أعلاه
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">افتح Supabase</h3>
                <a
                  href="https://ldbsacdpkinbpcguvgai.supabase.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#D4AF37] hover:underline text-sm"
                >
                  https://ldbsacdpkinbpcguvgai.supabase.co
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">نفذ SQL</h3>
                <p className="text-blue-200 text-sm">
                  اذهب إلى SQL Editor والصق الأمر واضغط Run
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">سجل خروج ودخول</h3>
                <p className="text-blue-200 text-sm">
                  ارجع للموقع، سجل خروج ثم سجل دخول مرة أخرى
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[#001F3F]">
                ✓
              </div>
              <div>
                <h3 className="font-semibold mb-1">تم! ادخل إلى Admin</h3>
                <p className="text-blue-200 text-sm">
                  الآن يمكنك الوصول إلى /admin
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            الصفحة الرئيسية
          </a>
          <a
            href="/admin"
            className="px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors"
          >
            جرب الدخول للـ Admin
          </a>
        </div>
      </div>
    </div>
  );
}
