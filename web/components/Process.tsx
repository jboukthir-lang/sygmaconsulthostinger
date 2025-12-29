'use client';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, FileSearch, Plane, ArrowRight } from 'lucide-react';

export default function Process() {
    const { language } = useLanguage();

    const steps = [
        {
            icon: Calendar,
            step_en: "Step 01",
            step_fr: "Étape 01",
            step_ar: "الخطوة 01",
            title_en: "Book Consultation",
            title_fr: "Réserver une consultation",
            title_ar: "حجز استشارة",
            desc_en: "Schedule a meeting with our experts to discuss your specific needs.",
            desc_fr: "Planifiez une réunion avec nos experts pour discuter de vos besoins.",
            desc_ar: "حدد موعدًا مع خبرائنا لمناقشة احتياجاتك الخاصة."
        },
        {
            icon: FileSearch,
            step_en: "Step 02",
            step_fr: "Étape 02",
            step_ar: "الخطوة 02",
            title_en: "Strategy & Audit",
            title_fr: "Stratégie et Audit",
            title_ar: "الاستراتيجية والتدقيق",
            desc_en: "We analyze your profile and develop a tailored roadmap for success.",
            desc_fr: "Nous analysons votre profil et élaborons une feuille de route sur mesure.",
            desc_ar: "نحن نحلل ملفك الشخصي ونضع خارطة طريق مخصصة للنجاح."
        },
        {
            icon: Plane,
            step_en: "Step 03",
            step_fr: "Étape 03",
            step_ar: "الخطوة 03",
            title_en: "Execution & Result",
            title_fr: "Exécution et Résultat",
            title_ar: "التنفيذ والنتيجة",
            desc_en: "We handle all paperwork and logistics until your goal is achieved.",
            desc_fr: "Nous gérons toute la paperasse et la logistique jusqu'à la réussite.",
            desc_ar: "نتعامل مع جميع الأوراق والخدمات اللوجستية حتى يتحقق هدفك."
        }
    ];

    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-20">
                    <span className="text-[#D4AF37] font-semibold tracking-wider uppercase text-sm">
                        {language === 'ar' ? 'كيف نعمل' : language === 'fr' ? 'Notre Processus' : 'Our Process'}
                    </span>
                    <h2 className="text-4xl font-bold text-[#001F3F] mt-3 font-serif">
                        {language === 'ar' ? 'طريقك المبسط للنجاح' : language === 'fr' ? 'Votre chemin simplifié vers le succès' : 'Your Simplified Path to Success'}
                    </h2>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 z-0"></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white rounded-full border-4 border-[#F8F9FA] shadow-xl flex items-center justify-center mb-8 group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300">
                                <step.icon className="h-10 w-10 text-[#001F3F] group-hover:text-[#D4AF37] transition-colors" />
                            </div>

                            <span className="text-[#D4AF37] font-bold text-sm tracking-widest mb-2">
                                {language === 'ar' ? step.step_ar : language === 'fr' ? step.step_fr : step.step_en}
                            </span>

                            <h3 className="text-xl font-bold text-[#001F3F] mb-4">
                                {language === 'ar' ? step.title_ar : language === 'fr' ? step.title_fr : step.title_en}
                            </h3>

                            <p className="text-gray-500 max-w-xs leading-relaxed">
                                {language === 'ar' ? step.desc_ar : language === 'fr' ? step.desc_fr : step.desc_en}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
