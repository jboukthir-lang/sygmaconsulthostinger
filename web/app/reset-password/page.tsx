'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const { t, language, logoUrl } = useLanguage();
  const { resetPassword } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      console.error('Password reset failed:', error);
      if (error.code === 'auth/user-not-found') {
        setError(t.login.errorUserNotFound);
      } else if (error.code === 'auth/invalid-email') {
        setError(language === 'fr' ? 'Adresse email invalide' : language === 'ar' ? 'عنوان بريد إلكتروني غير صحيح' : 'Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        setError(t.login.errorTooManyRequests);
      } else {
        setError(t.error.desc);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#001F3F] to-[#003366] p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3 text-white mb-12">
            <div className="bg-white p-2 rounded-xl">
              <Image
                src={logoUrl || "/logo.png"}
                alt="Sygma Consult"
                width={60}
                height={60}
                className="h-10 md:h-12 w-auto"
                priority
              /></div>
            <div>
              <h1 className="text-2xl font-bold">Sygma Consult</h1>
              <p className="text-sm text-blue-200">{t.nav.about}</p>
            </div>
          </Link>

          <div className="space-y-6 text-white">
            <h2 className="text-4xl font-bold leading-tight">
              {t.resetPassword.title}
            </h2>
            <p className="text-lg text-blue-200">
              {t.resetPassword.subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">✓</div>
            <span>{language === 'fr' ? 'Processus de réinitialisation sécurisé' : language === 'ar' ? 'عملية إعادة تعيين آمنة' : 'Secure password reset process'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">✓</div>
            <span>{language === 'fr' ? 'Vérification par email' : language === 'ar' ? 'التحقق من البريد الإلكتروني' : 'Email verification'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">✓</div>
            <span>{t.login.needHelp}</span>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo for mobile */}
            <Link href="/" className="lg:hidden flex items-center gap-3 mb-8">
              <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Sygma Consult"
                  width={100}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#001F3F]">Sygma Consult</h1>
                <p className="text-xs text-gray-500">Paris • Tunis</p>
              </div>
            </Link>

            {/* Back Button */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#001F3F] mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.resetPassword.backToLogin}
            </Link>

            {!success ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#001F3F] mb-2">{t.resetPassword.title}</h2>
                  <p className="text-gray-600">
                    {t.resetPassword.subtitle}
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Reset Password Form */}
                <form onSubmit={handleResetPassword} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.login.emailLabel}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 focus:border-[#001F3F]"
                        placeholder={t.login.emailPlaceholder}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#001F3F] text-white rounded-xl hover:bg-[#003366] transition-colors font-semibold disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {language === 'fr' ? 'Envoi...' : language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5" />
                        {t.resetPassword.sendButton}
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success Message */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#001F3F] mb-2">{t.resetPassword.successTitle}</h2>
                <p className="text-gray-600 mb-6">
                  {t.resetPassword.successMessage}
                </p>
                <p className="font-semibold text-[#001F3F] mb-6">{email}</p>
                <p className="text-sm text-gray-500 mb-8">
                  {language === 'fr' ? 'Vous n\'avez pas reçu l\'e-mail ? Vérifiez vos spams ou réessayez.' : language === 'ar' ? 'لم يصلك البريد الإلكتروني؟ تفقد صندوق الرسائل غير المرغوب فيها أو حاول مرة أخرى.' : 'Didn\'t receive the email? Check your spam folder or try again.'}
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="text-sm text-[#001F3F] hover:underline font-semibold"
                >
                  {language === 'fr' ? 'Saisir un autre email' : language === 'ar' ? 'تجربة بريد آخر' : 'Try another email'}
                </button>
              </div>
            )}

            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                {t.signup.alreadyHaveAccount}{' '}
                <Link href="/login" className="text-[#001F3F] hover:underline font-semibold">
                  {t.signup.signInLink}
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              {t.login.needHelp}{' '}
              <Link href="/contact" className="text-[#001F3F] hover:underline font-semibold">
                {t.login.contactSupport}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
