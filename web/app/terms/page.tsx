'use client';

import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-[#001F3F] mb-8">{t.terms.title}</h1>

                <div className="prose prose-lg max-w-none space-y-8 text-gray-600">
                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.terms.agreementTitle}</h2>
                        <p>{t.terms.agreementContent}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.terms.licenseTitle}</h2>
                        <p>{t.terms.licenseContent}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.terms.disclaimerTitle}</h2>
                        <p>{t.terms.disclaimerContent}</p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
