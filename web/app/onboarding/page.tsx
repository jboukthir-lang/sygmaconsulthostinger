'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    Building,
    MapPin,
    CreditCard,
    Check,
    ArrowRight,
    Loader2,
    Briefcase,
    FileText
} from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Identité', icon: Building },
    { id: 2, title: 'Coordonnées', icon: MapPin },
    { id: 3, title: 'Abonnement', icon: CreditCard },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        companyName: '',
        siret: '',
        tva: '',
        legalForm: 'SAS',
        address: '',
        city: '',
        zipCode: '',
        country: 'France',
        phone: '',
        plan: 'start' // free, start, pro, enterprise
    });

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(curr => curr + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (!user) return;

            // 1. Create Company via API
            const response = await fetch('/api/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    owner_id: user.uid,
                    name: formData.companyName,
                    siret: formData.siret,
                    tva_number: formData.tva,
                    legal_form: formData.legalForm,
                    address: formData.address,
                    city: formData.city,
                    zip_code: formData.zipCode,
                    country: formData.country,
                    phone: formData.phone,
                    subscription_plan: formData.plan,
                    email: user.email
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create company');
            }

            // 2. Redirect to Dashboard
            router.replace('/dashboard/entreprise');

        } catch (error) {
            console.error('Onboarding failed:', error);
            alert('Une erreur est survenue lors de la création de votre entreprise.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
                <div className="font-bold text-[#001F3F] text-xl">Sygma Consult</div>
                <div className="text-sm text-gray-500">Configuration de votre espace</div>
            </header>

            <main className="flex-1 max-w-3xl mx-auto w-full p-8">

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>

                        {STEPS.map((step) => {
                            const isCompleted = currentStep > step.id;
                            const isCurrent = currentStep === step.id;
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-2 bg-[#F4F6F9] px-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-green-500 text-white' :
                                        isCurrent ? 'bg-[#001F3F] text-white ring-4 ring-blue-100' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <span className={`text-sm font-medium ${isCurrent ? 'text-[#001F3F]' : 'text-gray-500'}`}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 min-h-[400px] flex flex-col">

                    {/* Step 1: Identity */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900">Identité de l'entreprise</h2>
                            <p className="text-gray-500">Commençons par les informations de base de votre structure.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise *</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                        placeholder="Ma Super Entreprise"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Forme Juridique</label>
                                        <select
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F] focus:outline-none bg-white"
                                            value={formData.legalForm}
                                            onChange={(e) => setFormData({ ...formData, legalForm: e.target.value })}
                                        >
                                            <option value="Auto-Entrepreneur">Auto-Entrepreneur</option>
                                            <option value="EI">EI</option>
                                            <option value="EURL">EURL</option>
                                            <option value="SARL">SARL</option>
                                            <option value="SASU">SASU</option>
                                            <option value="SAS">SAS</option>
                                            <option value="SA">SA</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SIRET (Optionnel)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                            placeholder="123 456 789 00012"
                                            value={formData.siret}
                                            onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Address */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900">Coordonnées</h2>
                            <p className="text-gray-500">Où est située votre activité ? Ces informations apparaîtront sur vos factures.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                        placeholder="123 Avenue des Champs-Élysées"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Code Postal</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                            placeholder="75008"
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                            placeholder="Paris"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de TVA (Optionnel)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
                                        placeholder="FR XX XXXXXXXXX"
                                        value={formData.tva}
                                        onChange={(e) => setFormData({ ...formData, tva: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Subscription */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-gray-900">Choisissez votre plan</h2>
                            <p className="text-gray-500">Commencez gratuitement, changez quand vous voulez.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Free Plan */}
                                <div
                                    onClick={() => setFormData({ ...formData, plan: 'free' })}
                                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${formData.plan === 'free' ? 'border-[#001F3F] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <h3 className="font-bold text-lg">Gratuit</h3>
                                    <div className="text-2xl font-bold mt-2">0€<span className="text-base font-normal text-gray-500">/mois</span></div>
                                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 3 Clients</li>
                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Factures Illimitées</li>
                                    </ul>
                                </div>

                                {/* Start Plan */}
                                <div
                                    onClick={() => setFormData({ ...formData, plan: 'start' })}
                                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${formData.plan === 'start' ? 'border-[#001F3F] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="absolute top-0 right-0 bg-[#001F3F] text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                                        POPULAIRE
                                    </div>
                                    <h3 className="font-bold text-lg text-[#001F3F]">Start</h3>
                                    <div className="text-2xl font-bold mt-2">19€<span className="text-base font-normal text-gray-500">/mois</span></div>
                                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Clients Illimités</li>
                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Personnalisation</li>
                                    </ul>
                                </div>

                                {/* Pro Plan */}
                                <div
                                    onClick={() => setFormData({ ...formData, plan: 'pro' })}
                                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${formData.plan === 'pro' ? 'border-[#001F3F] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <h3 className="font-bold text-lg">Pro</h3>
                                    <div className="text-2xl font-bold mt-2">49€<span className="text-base font-normal text-gray-500">/mois</span></div>
                                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Tout illimité</li>
                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> API Access</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-auto pt-8 flex justify-between">
                        {currentStep > 1 ? (
                            <button
                                onClick={() => setCurrentStep(curr => curr - 1)}
                                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Retour
                            </button>
                        ) : (
                            <div></div>
                        )}

                        <button
                            onClick={handleNext}
                            disabled={(currentStep === 1 && !formData.companyName) || isSubmitting}
                            className="bg-[#001F3F] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#003366] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : currentStep === 3 ? (
                                'Terminer et Accéder'
                            ) : (
                                <>Suivant <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
