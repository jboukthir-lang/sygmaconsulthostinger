'use client';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

const stats = [
    {
        id: 1,
        value: "10+",
        label_en: "Years Experience",
        label_fr: "Années d'expérience",
        label_ar: "سنوات من الخبرة"
    },
    {
        id: 2,
        value: "50+",
        label_en: "Partner Countries",
        label_fr: "Pays partenaires",
        label_ar: "دولة شريكة"
    },
    {
        id: 3,
        value: "98%",
        label_en: "Success Rate",
        label_fr: "Taux de réussite",
        label_ar: "نسبة النجاح"
    },
    {
        id: 4,
        value: "2k+",
        label_en: "Satisfied Clients",
        label_fr: "Clients satisfaits",
        label_ar: "عميل راضٍ"
    }
];

export default function Stats() {
    const { language } = useLanguage();

    return (
        <section className="py-12 bg-[#001F3F] border-t border-white/10 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="text-center group"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2 font-serif group-hover:scale-110 transition-transform duration-300">
                                {stat.value}
                            </div>
                            <div className="text-blue-200 text-sm md:text-base font-medium">
                                {language === 'ar' ? stat.label_ar : language === 'fr' ? stat.label_fr : stat.label_en}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
