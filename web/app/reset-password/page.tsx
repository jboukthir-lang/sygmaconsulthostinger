'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
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
        setError('No account found with this email address');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Failed to send reset email. Please try again.');
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
                src="/logo.png"
                alt="Sygma Consult"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sygma Consult</h1>
              <p className="text-sm text-blue-200">Paris • Tunis</p>
            </div>
          </Link>

          <div className="space-y-6 text-white">
            <h2 className="text-4xl font-bold leading-tight">
              Reset Your Password
            </h2>
            <p className="text-lg text-blue-200">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">✓</div>
            <span>Secure password reset process</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">✓</div>
            <span>Email verification</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">✓</div>
            <span>24/7 support available</span>
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
              Back to Sign In
            </Link>

            {!success ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#001F3F] mb-2">Forgot Password?</h2>
                  <p className="text-gray-600">
                    No worries! Enter your email and we'll send you reset instructions.
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
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 focus:border-[#001F3F]"
                        placeholder="Enter your email"
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
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5" />
                        Send Reset Link
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
                <h2 className="text-2xl font-bold text-[#001F3F] mb-2">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent password reset instructions to:
                </p>
                <p className="font-semibold text-[#001F3F] mb-6">{email}</p>
                <p className="text-sm text-gray-500 mb-8">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="text-sm text-[#001F3F] hover:underline font-semibold"
                >
                  Try another email
                </button>
              </div>
            )}

            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Remember your password?{' '}
                <Link href="/login" className="text-[#001F3F] hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Need help?{' '}
              <Link href="/contact" className="text-[#001F3F] hover:underline font-semibold">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
