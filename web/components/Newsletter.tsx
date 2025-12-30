
'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Newsletter() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simulating API call since we don't have a newsletter endpoint yet
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <section className="py-20 bg-[#F8F9FA]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-[#001F3F] rounded-3xl p-8 md:p-16 relative overflow-hidden text-center md:text-left">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#D4AF37] rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
                                Restez informé de nos actualités
                            </h2>
                            <p className="text-blue-100 text-lg">
                                Recevez nos dernières analyses, conseils juridiques et opportunités d'investissement directement dans votre boîte mail.
                            </p>
                            <div className="flex items-center gap-6 text-sm text-blue-200">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                                    Analyses mensuelles
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                                    Pas de spam
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                            {status === 'success' ? (
                                <div className="text-center space-y-4 py-8">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Inscription confirmée !</h3>
                                    <p className="text-blue-100">Merci de rejoindre notre communauté.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="text-[#D4AF37] hover:text-white underline"
                                    >
                                        Inscrire une autre adresse
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-100 mb-2">Votre adresse email professionnel</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="nom@entreprise.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Inscription...
                                            </>
                                        ) : (
                                            <>
                                                S'inscrire à la newsletter
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-blue-200 text-center">
                                        En vous inscrivant, vous acceptez notre politique de confidentialité.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
