'use client';

import Header from "@/components/Header";
import Services from "@/components/Services";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-[#F8F9FA]">
            <Header />

            {/* Hero Section */}
            <div className="bg-[#001F3F] text-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{t.servicesPage.hero_title}</h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                        {t.servicesPage.hero_subtitle}
                    </p>
                </div>
            </div>

            {/* Services List */}
            <div className="-mt-12 relative z-10">
                {/* We reuse the component but might need to adjust spacing if it has its own padding */}
                <Services />
            </div>

            {/* CTA Section */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-[#001F3F] mb-6 font-serif">{t.servicesPage.cta_title}</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        {t.servicesPage.cta_desc}
                    </p>
                    <a
                        href="/book"
                        className="inline-flex items-center justify-center px-8 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#C5A028] transition-colors shadow-lg shadow-[#D4AF37]/20"
                    >
                        {t.servicesPage.cta_button}
                    </a>
                </div>
            </section>
        </main>
    );
}
