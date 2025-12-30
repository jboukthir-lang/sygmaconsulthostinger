'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Sarah M.",
        role: "CEO, TechStart France",
        content: "Sygma Consult a transformé notre gestion financière. Leur approche digitale nous fait gagner un temps précieux chaque mois. Un vrai partenaire stratégique.",
        rating: 5
    },
    {
        name: "Karim B.",
        role: "Fondateur, Atlas Import/Export",
        content: "Une expertise pointue et une réactivité exemplaire. Grâce à leurs conseils sur la fiscalité internationale, nous avons optimisé notre structure dès la première année.",
        rating: 5
    },
    {
        name: "Élodie D.",
        role: "Directrice, Mode & Création",
        content: "Enfin un cabinet comptable qui parle le même langage que les entrepreneurs. Les tableaux de bord sont clairs, précis et m'aident à prendre les bonnes décisions.",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-[#F8F9FA] relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#001F3F] mb-4">
                        Ils nous font <span className="text-[#D4AF37]">Confiance</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Rejoignez plus de 500 entrepreneurs qui pilotent leur réussite avec Sygma Consult.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testi, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative">
                            <Quote className="absolute top-6 right-6 h-8 w-8 text-[#D4AF37]/20" />
                            <div className="flex gap-1 mb-6">
                                {[...Array(testi.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                                ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-8 italic">
                                "{testi.content}"
                            </p>
                            <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                                <div className="w-10 h-10 rounded-full bg-[#001F3F] text-white flex items-center justify-center font-bold text-sm">
                                    {testi.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-[#001F3F] text-sm">{testi.name}</p>
                                    <p className="text-xs text-gray-500">{testi.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
