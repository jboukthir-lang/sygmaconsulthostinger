'use client';

import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-[#001F3F] mb-8">{t.privacy.title}</h1>

                <div className="prose prose-lg max-w-none space-y-8 text-gray-600">
                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.privacy.collectionTitle}</h2>
                        <p>{t.privacy.collectionContent}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.privacy.useTitle}</h2>
                        <p>{t.privacy.useContent}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.privacy.protectionTitle}</h2>
                        <p>{t.privacy.protectionContent}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.privacy.rightsTitle}</h2>
                        <p>{t.privacy.rightsContent}</p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
