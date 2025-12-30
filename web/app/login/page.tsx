'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Loader2, Mail, Lock, Eye, EyeOff, Check, AlertCircle, Building2, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail } = useAuth();
  const { logoUrl } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // "role" can be 'entreprise' or 'particulier'
  const [role, setRole] = useState<'entreprise' | 'particulier'>('entreprise');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      // Redirect based on role
      if (role === 'entreprise') {
        router.replace('/dashboard/entreprise');
      } else {
        router.replace('/dashboard/user');
      }
    }
  }, [user, loading, router, role]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      // AuthContext useEffect handles redirect, but we can double check logic here if needed
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Email ou mot de passe incorrect.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Trop de tentatives. Veuillez réessayer plus tard.');
      } else {
        setError('Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setError('La connexion avec Google a échoué.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#001F3F] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Side - Branding & Value Prop - Changes based on Role */}
      <div className={`hidden lg:flex lg:w-5/12 ${role === 'entreprise' ? 'bg-[#F0F4F8]' : 'bg-[#ECFDF5]'} relative overflow-hidden flex-col justify-between p-12 transition-colors duration-500`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[url('/grid-pattern.svg')]"></div>
        <div className={`absolute top-0 right-0 w-96 h-96 ${role === 'entreprise' ? 'bg-blue-200' : 'bg-emerald-200'} rounded-full blur-3xl opacity-50 -mr-20 -mt-20`}></div>
        <div className={`absolute bottom-0 left-0 w-64 h-64 ${role === 'entreprise' ? 'bg-indigo-200' : 'bg-green-200'} rounded-full blur-3xl opacity-50 -ml-10 -mb-10`}></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <span className="text-2xl font-bold text-[#001F3F]">SC</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#001F3F]">Sygma Consult</span>
          </Link>

          <h1 className="text-4xl font-bold leading-tight mb-6 text-[#001F3F]">
            Bienvenue sur votre <br />
            <span className={role === 'entreprise' ? 'text-[#D4AF37]' : 'text-emerald-600'}>
              {role === 'entreprise' ? 'Espace Entreprise' : 'Espace Particulier'}
            </span>
          </h1>
          <p className={`text-lg leading-relaxed max-w-md ${role === 'entreprise' ? 'text-gray-600' : 'text-emerald-800'}`}>
            {role === 'entreprise'
              ? "Gérez votre activité, vos factures et vos projets en toute simplicité."
              : "Suivez vos dossiers, consultez vos documents et échangez avec nous."}
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === 'entreprise' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-[#001F3F]">Accès Sécurisé</h3>
              <p className={`text-sm ${role === 'entreprise' ? 'text-gray-500' : 'text-emerald-600/70'}`}>Vos données sont protégées.</p>
            </div>
          </div>
        </div>

        <div className={`relative z-10 text-xs ${role === 'entreprise' ? 'text-gray-400' : 'text-emerald-600/50'}`}>
          © 2025 Sygma Consult.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto bg-white">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
            <p className="text-gray-500 mt-2">Choisissez votre type de compte pour continuer.</p>
          </div>

          {/* Role Selection Toggles */}
          <div className="grid grid-cols-2 gap-4 p-1 bg-gray-50 rounded-xl border border-gray-100">
            <button
              onClick={() => setRole('entreprise')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'entreprise'
                ? 'bg-white text-[#001F3F] shadow-md border border-gray-100'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Building2 className="w-4 h-4" />
              Entreprise
            </button>
            <button
              onClick={() => setRole('particulier')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'particulier'
                ? 'bg-white text-emerald-700 shadow-md border border-gray-100'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <User className="w-4 h-4" />
              Particulier
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 focus:border-[#001F3F] transition-all"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <Link
                  href="/reset-password"
                  className={`text-sm hover:underline font-medium ${role === 'entreprise' ? 'text-[#001F3F]' : 'text-emerald-700'}`}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20 focus:border-[#001F3F] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white rounded-xl transition-all font-bold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] ${role === 'entreprise'
                ? 'bg-[#001F3F] hover:bg-[#003366] shadow-[#001F3F]/20'
                : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-900/20'
                }`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Ou continuer avec</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-700 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Google
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Pas encore de compte ?{' '}
              <Link href="/signup" className={`font-bold hover:underline ${role === 'entreprise' ? 'text-[#001F3F]' : 'text-emerald-700'}`}>
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
