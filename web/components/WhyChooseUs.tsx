'use client';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2, Award, Clock, Shield } from 'lucide-react';

export default function WhyChooseUs() {
    const { t, language } = useLanguage();

    const features = [
        {
            icon: Award,
            title_en: "Expert Guidance",
            title_fr: "Conseils d'experts",
            title_ar: "توجيهات الخبراء",
            desc_en: "Our team consists of certified professionals with years of experience in international consulting.",
            desc_fr: "Notre équipe est composée de professionnels certifiés avec des années d'expérience.",
            desc_ar: "فريقنا يتكون من محترفين معتمدين وسنوات من الخبرة في الاستشارات الدولية."
        },
        {
            icon: Clock,
            title_en: "Fast Processing",
            title_fr: "Traitement rapide",
            title_ar: "معالجة سريعة",
            desc_en: "We optimize every step to ensure the quickest possible turnaround for your applications.",
            desc_fr: "Nous optimisons chaque étape pour assurer le traitement le plus rapide possible.",
            desc_ar: "نحن نحسن كل خطوة لضمان أسرع وقت ممكن لمعالجة طلباتكم."
        },
        {
            icon: Shield,
            title_en: "Secure & Confidential",
            title_fr: "Sécurisé et confidentiel",
            title_ar: "آمن وسري",
            desc_en: "Your data privacy is our top priority. We use bank-grade security protocols.",
            desc_fr: "La confidentialité de vos données est notre priorité. Nous utilisons des protocoles bancaires.",
            desc_ar: "خصوصية بياناتكم هي أولويتنا القصوى. نحن نستخدم بروتوكولات أمان عالية المستوى."
        },
        {
            icon: CheckCircle2,
            title_en: "High Success Rate",
            title_fr: "Taux de réussite élevé",
            title_ar: "نسبة نجاح عالية",
            desc_en: "98% of our clients successfully achieve their visa and immigration goals.",
            desc_fr: "98% de nos clients atteignent leurs objectifs de visa et d'immigration.",
            desc_ar: "98% من عملائنا يحققون أهدافهم في التأشيرة والهجرة بنجاح."
        }
    ];

    return (
        <section className="py-24 bg-[#F8F9FA] text-[#001F3F] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 text-[#001F3F]">
                        {language === 'ar' ? 'لماذا تختار سيجما كونسلت؟' : language === 'fr' ? 'Pourquoi choisir Sygma Consult ?' : 'Why Choose Sygma Consult?'}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        {language === 'ar'
                            ? 'نحن نقدم حلولاً مبتكرة ومخصصة تلبي احتياجاتك بدقة واحترافية.'
                            : language === 'fr'
                                ? 'Nous proposons des solutions innovantes et sur mesure répondant à vos besoins avec précision.'
                                : 'We provide innovative, tailored solutions that meet your needs with precision and professionalism.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-[#D4AF37] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-[#D4AF37]/20">
                                <feature.icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-serif text-[#001F3F]">
                                {language === 'ar' ? feature.title_ar : language === 'fr' ? feature.title_fr : feature.title_en}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {language === 'ar' ? feature.desc_ar : language === 'fr' ? feature.desc_fr : feature.desc_en}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
