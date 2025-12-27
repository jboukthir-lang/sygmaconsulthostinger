'use client';

import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Briefcase, Users, Rocket, Mail, Globe, Heart } from 'lucide-react';

export default function CareersPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-[#F8F9FA]">
            <Header />
            <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#001F3F] mb-4">{t.careers.title}</h1>
                    <p className="text-xl text-gray-600">{t.careers.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="p-6 bg-blue-50 rounded-2xl text-center transition-all hover:bg-blue-100">
                        <Users className="h-10 w-10 text-[#001F3F] mx-auto mb-4" />
                        <h3 className="font-bold text-[#001F3F] mb-2">Team Expertise</h3>
                        <p className="text-sm text-gray-600">{t.careers.whyJoinContent}</p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-2xl text-center transition-all hover:bg-blue-100">
                        <Globe className="h-10 w-10 text-[#001F3F] mx-auto mb-4" />
                        <h3 className="font-bold text-[#001F3F] mb-2">Global Impact</h3>
                        <p className="text-sm text-gray-600">Work on cross-border projects between Europe and Africa.</p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-2xl text-center transition-all hover:bg-blue-100">
                        <Rocket className="h-10 w-10 text-[#001F3F] mx-auto mb-4" />
                        <h3 className="font-bold text-[#001F3F] mb-2">Growth</h3>
                        <p className="text-sm text-gray-600">Continuous professional development and learning.</p>
                    </div>
                </div>

                <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md mb-12">
                    <h2 className="text-2xl font-bold text-[#001F3F] mb-6 flex items-center gap-2">
                        <Briefcase className="h-6 w-6" />
                        {t.careers.positionsTitle}
                    </h2>

                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                        <p className="text-gray-500 mb-4">{t.careers.noPositions}</p>
                        <a
                            href="mailto:careers@sygmaconsult.com"
                            className="inline-flex items-center gap-2 text-[#001F3F] font-bold hover:underline"
                        >
                            <Mail className="h-5 w-5" />
                            {t.careers.contactCTA}
                        </a>
                    </div>
                </section>

                <section className="text-center bg-[#001F3F] text-white p-12 rounded-3xl">
                    <Heart className="h-12 w-12 mx-auto mb-6 text-[#D4AF37]" />
                    <h2 className="text-3xl font-bold mb-4">{t.careers.whyJoinTitle}</h2>
                    <p className="max-w-2xl mx-auto text-gray-300">
                        {t.careers.whyJoinContent}
                    </p>
                </section>
            </div>
            <Footer />
        </main>
    );
}
