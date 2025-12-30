'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "Comment se déroule la transition vers Sygma Consult ?",
        answer: "C'est très simple. Nous nous occupons de tout : récupération de vos archives, contact avec votre ancien expert-comptable, et paramétrage de votre espace digital. Vous êtes opérationnel en moins de 48h."
    },
    {
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument. Nous utilisons des protocoles de cryptage de niveau bancaire (AES-256). Vos données sont stockées sur des serveurs sécurisés en Europe et sauvegardées quotidiennement."
    },
    {
        question: "Proposez-vous des conseils fiscaux pour l'international ?",
        answer: "Oui, c'est l'une de nos spécialités. Nous accompagnons les entreprises dans leur structuration internationale (France, Tunisie, Dubaï...) pour optimiser légalement leur fiscalité."
    },
    {
        question: "Puis-je changer d'offre en cours de route ?",
        answer: "Bien sûr. Nos offres sont flexibles et sans engagement de durée. Vous pouvez évoluer vers un pack supérieur ou inférieur selon la croissance de votre activité."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <span className="text-[#D4AF37] font-semibold text-sm tracking-widest uppercase mb-2 block">FAQ</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#001F3F] mb-6">
                            Questions <br /><span className="text-gray-400 font-light">Fréquentes</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Tout ce que vous devez savoir sur notre fonctionnement et nos services.
                            Vous avez d'autres questions ? Notre équipe est là pour vous répondre.
                        </p>
                        <a href="/contact" className="inline-flex items-center text-[#001F3F] font-bold border-b-2 border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors">
                            Contactez un expert
                        </a>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`border rounded-xl transition-all duration-300 ${openIndex === index ? 'border-[#D4AF37] bg-[#FDFBF7]' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className={`font-bold text-lg ${openIndex === index ? 'text-[#001F3F]' : 'text-gray-700'}`}>
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <Minus className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
