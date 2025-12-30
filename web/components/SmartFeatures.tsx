'use client';

import { Cpu, Smartphone, ShieldCheck, Zap } from 'lucide-react';

const features = [
    {
        icon: Cpu,
        title: "Automatisation Intelligente",
        description: "Fini la saisie manuelle. Nos algorithmes traitent vos factures automatiquement pour un gain de temps précieux."
    },
    {
        icon: Smartphone,
        title: "Pilotage 24/7",
        description: "Accédez à vos chiffres clés, trésorerie et documents comptables depuis votre mobile, où que vous soyez."
    },
    {
        icon: ShieldCheck,
        title: "Sécurité Bancaire",
        description: "Vos données sont cryptées et stockées sur des serveurs sécurisés répondant aux normes bancaires les plus strictes."
    },
    {
        icon: Zap,
        title: "Conseil Proactif",
        description: "Plus qu'un bilan, nous analysons vos données en temps réel pour vous conseiller avant qu'il ne soit trop tard."
    }
];

export default function SmartFeatures() {
    return (
        <section className="py-24 bg-[#F8F9FA] text-[#001F3F] relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-sm font-semibold mb-4">
                        L'Ère du Digital
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-[#001F3F]">
                        L'Expertise Comptable <span className="text-[#D4AF37]">Réinventée</span>
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Sygma Consult allie l'excellence de l'expertise comptable traditionnelle à la puissance des outils digitaux modernes.
                        Simplifiez votre gestion, concentrez-vous sur votre croissance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#D4AF37]/30 transition-all duration-300 hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B4941F] flex items-center justify-center mb-6 shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                                <feature.icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-serif text-[#001F3F]">{feature.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
