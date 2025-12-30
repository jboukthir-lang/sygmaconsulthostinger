'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Check, Loader2 } from 'lucide-react';
import { getSubscriptionPlans, type SubscriptionPlan } from '@/lib/subscription';

export default function OnboardingPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [step, setStep] = useState(1);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string>('free');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
            return;
        }

        async function loadPlans() {
            const fetchedPlans = await getSubscriptionPlans();
            setPlans(fetchedPlans);
            setIsLoading(false);
        }

        loadPlans();
    }, [user, loading, router]);

    const handleComplete = () => {
        // Redirect to dashboard
        router.push('/dashboard');
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Bienvenue sur SYGMAINVOICE
                    </h1>
                    <p className="text-lg text-gray-600">
                        Choisissez votre plan pour commencer
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.name)}
                            className={`bg-white rounded-xl p-6 cursor-pointer transition-all ${selectedPlan === plan.name
                                    ? 'ring-2 ring-blue-500 shadow-lg'
                                    : 'hover:shadow-md'
                                }`}
                        >
                            <h3 className="text-xl font-bold mb-2">{plan.display_name}</h3>
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                {plan.price_monthly > 0 ? `${plan.price_monthly}€/mois` : 'Gratuit'}
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                            <div className="space-y-2">
                                {plan.max_clients && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>Jusqu'à {plan.max_clients} clients</span>
                                    </div>
                                )}
                                {plan.custom_branding && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>Logo personnalisé</span>
                                    </div>
                                )}
                                {plan.export_accounting && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>Export comptable</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={handleComplete}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Commencer avec {plans.find(p => p.name === selectedPlan)?.display_name}
                    </button>
                </div>
            </div>
        </div>
    );
}
