'use client';

import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LegalPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-[#001F3F] mb-8">{t.legal.title}</h1>

                <div className="prose prose-lg max-w-none space-y-8 text-gray-600">
                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.legal.editorTitle}</h2>
                        <p>{t.legal.editorContent}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.legal.hostingTitle}</h2>
                        <p>{t.legal.hostingContent}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.legal.propertyTitle}</h2>
                        <p>{t.legal.propertyContent}</p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
