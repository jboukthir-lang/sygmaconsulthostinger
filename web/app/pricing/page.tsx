'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ChevronRight, Sparkles } from 'lucide-react';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const plans = [
        {
            name: 'Gratuit',
            price: 0,
            yearlyPrice: 0,
            description: 'Parfait pour les freelances qui débutent',
            features: [
                { text: 'Jusqu\'à 3 clients', included: true },
                { text: 'Factures illimitées', included: true },
                { text: 'Modèles PDF basiques', included: true },
                { text: 'Logo personnalisé', included: false },
                { text: 'Export comptable', included: false },
            ],
            cta: 'Commencer Gratuitement',
            popular: false
        },
        {
            name: 'Start',
            price: 19,
            yearlyPrice: 228,
            description: 'Pour les petites entreprises en croissance',
            features: [
                { text: 'Clients illimités', included: true },
                { text: 'Logo personnalisé', included: true },
                { text: 'Export comptable', included: true },
                { text: 'Recherche SIRET auto', included: true },
                { text: 'Support prioritaire', included: true },
            ],
            cta: 'Essayer Start',
            popular: true
        },
        {
            name: 'Pro',
            price: 49,
            yearlyPrice: 588,
            description: 'Fonctionnalités avancées pour les agences',
            features: [
                { text: 'Tout du plan Start', included: true },
                { text: 'Jusqu\'à 5 utilisateurs', included: true },
                { text: 'Accès API complet', included: true },
                { text: 'Marque blanche', included: true },
                { text: 'Rapports avancés', included: true },
            ],
            cta: 'Essayer Pro',
            popular: false
        },
        {
            name: 'Enterprise',
            price: 0,
            yearlyPrice: 0,
            description: 'Solution sur mesure',
            features: [
                { text: 'Tout du plan Pro', included: true },
                { text: 'Utilisateurs illimités', included: true },
                { text: 'SLA garanti 99.9%', included: true },
                { text: 'Infrastructure dédiée', included: true },
                { text: 'Support 24/7', included: true },
            ],
            cta: 'Nous Contacter',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-[#001F3F]">
                        SYGMAINVOICE
                    </Link>
                    <div className="flex gap-4">
                        <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-[#001F3F]">
                            Connexion
                        </Link>
                        <Link href="/signup" className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366]">
                            Commencer
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                    <Sparkles className="h-4 w-4" />
                    Facturation simplifiée pour entrepreneurs
                </div>

                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Choisissez votre plan
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Des tarifs transparents adaptés à votre activité. Sans engagement, résiliable à tout moment.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                        Mensuel
                    </span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="relative w-14 h-7 bg-gray-200 rounded-full"
                    >
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`} />
                    </button>
                    <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                        Annuel
                    </span>
                    {billingCycle === 'yearly' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            -20% de réduction
                        </span>
                    )}
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => {
                        const displayPrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.price;
                        const monthlyEquivalent = billingCycle === 'yearly' && plan.yearlyPrice > 0
                            ? (plan.yearlyPrice / 12).toFixed(0)
                            : null;

                        return (
                            <div
                                key={plan.name}
                                className={`relative bg-white rounded-2xl shadow-lg ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''} hover:shadow-xl transition-all p-6`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                        POPULAIRE
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

                                <div className="mb-6">
                                    {plan.price === 0 && plan.yearlyPrice === 0 && plan.name === 'Enterprise' ? (
                                        <span className="text-4xl font-bold text-gray-900">Sur devis</span>
                                    ) : (
                                        <div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-bold text-gray-900">{displayPrice}€</span>
                                                <span className="text-gray-600">
                                                    /{billingCycle === 'yearly' ? 'an' : 'mois'}
                                                </span>
                                            </div>
                                            {monthlyEquivalent && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Soit {monthlyEquivalent}€/mois
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={`/signup?plan=${plan.name.toLowerCase()}`}
                                    className={`block w-full py-3 px-4 rounded-xl font-semibold text-center transition-colors mb-6 ${plan.popular
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {plan.cta}
                                    <ChevronRight className="inline-block h-4 w-4 ml-1" />
                                </Link>

                                <div className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            {feature.included ? (
                                                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                            )}
                                            <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
