'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2, Mail, Lock, User, Eye, EyeOff, Building, User as UserIcon, Check, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignUpPage() {
  const { user, loading, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [accountType, setAccountType] = useState<'personal' | 'company'>('company'); // Default to company for SaaS focus
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      if (accountType === 'company') {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard/user');
      }
    }
  }, [user, loading, router, accountType]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Veuillez saisir votre nom complet');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!acceptTerms) {
      setError('Veuillez accepter les conditions générales');
      return;
    }

    setIsLoading(true);

    try {
      // We pass accountType as metadata if supported, or we handle it in the onboarding flow logic
      // For now, we sign up. The onboarding page will handle the actual company creation.
      await signUpWithEmail(email, password, name);
      // The redirect logic above in useEffect will handle the routing based on state
    } catch (error: any) {
      console.error('Sign up failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Cet e-mail est déjà enregistré');
      } else if (error.code === 'auth/invalid-email') {
        setError('Adresse e-mail invalide');
      } else {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-up failed:', error);
      setError('L\'inscription avec Google a échoué');
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

  // If already logged in, the useEffect will redirect. 
  // We can show a loading state here too to prevent flash.
  if (user) return null;

  return (
    <div className="min-h-screen flex font-sans bg-[#F4F6F9]">
      {/* Left Side - Branding & Value Prop */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#001F3F] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
              <span className="text-2xl font-bold">SC</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Sygma Consult</span>
          </Link>

          <h1 className="text-4xl font-bold leading-tight mb-6">
            Gérez votre entreprise <br />
            <span className="text-blue-400">simplement et efficacement</span>
          </h1>
          <p className="text-lg text-blue-100/80 leading-relaxed max-w-md">
            Rejoignez des milliers d'entrepreneurs qui font confiance à Sygma Consult pour leur facturation, leur comptabilité et leur croissance.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Facturation Illimitée</h3>
              <p className="text-sm text-blue-200/70">Créez des devis et factures en quelques clics.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Gestion Clients CRM</h3>
              <p className="text-sm text-blue-200/70">Suivez vos clients et leur historique.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-300/50">
          © 2025 Sygma Consult. Paris • Tunis.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
            <p className="text-gray-500 mt-2">Commencez votre essai gratuit de 14 jours, sans carte bancaire.</p>
          </div>

          {/* Account Type Selector */}
          <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setAccountType('company')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${accountType === 'company'
                ? 'bg-white text-[#001F3F] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Building className="w-4 h-4" />
              Entreprise
            </button>
            <button
              type="button"
              onClick={() => setAccountType('personal')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${accountType === 'personal'
                ? 'bg-white text-[#001F3F] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <UserIcon className="w-4 h-4" />
              Particulier
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent transition-all"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent transition-all"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001F3F] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#001F3F] border border-gray-300 rounded focus:ring-[#001F3F]"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
              </div>
              <div className="text-sm">
                <label className="font-medium text-gray-700">J'accepte les <Link href="/terms" className="text-[#001F3F] hover:underline">conditions d'utilisation</Link></label>
                <p className="text-gray-500">et la <Link href="/privacy" className="text-[#001F3F] hover:underline">politique de confidentialité</Link>.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#001F3F] text-white rounded-xl hover:bg-[#003366] transition-all font-semibold shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#F4F6F9] text-gray-500 font-medium">Ou continuer avec</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignUp}
            type="button"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700 shadow-sm"
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

          <p className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-[#001F3F] font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
