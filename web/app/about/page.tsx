'use client';

import Header from "@/components/Header";
import OfficeMap from "@/components/OfficeMap";
import { Award, Globe, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <section className="bg-[#001F3F] py-24 text-center text-white">
                <div className="container px-4 mx-auto">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">{t.aboutPage.hero_title}</h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                        {t.aboutPage.hero_subtitle}
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-[#F8F9FA] border-b border-gray-100">
                <div className="container px-4 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">10+</div>
                        <div className="text-sm font-semibold text-[#001F3F] uppercase tracking-wide">{t.aboutPage.stats_years}</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">500+</div>
                        <div className="text-sm font-semibold text-[#001F3F] uppercase tracking-wide">{t.aboutPage.stats_clients}</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">2</div>
                        <div className="text-sm font-semibold text-[#001F3F] uppercase tracking-wide">{t.aboutPage.stats_offices}</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-[#D4AF37] mb-2">50M€+</div>
                        <div className="text-sm font-semibold text-[#001F3F] uppercase tracking-wide">{t.aboutPage.stats_value}</div>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20">
                <div className="container px-4 mx-auto max-w-4xl space-y-8">
                    <h2 className="text-3xl font-bold text-[#001F3F] font-serif">{t.aboutPage.story_title}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t.aboutPage.story_p1}
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t.aboutPage.story_p2}
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 pt-12">
                        <div className="text-center p-6 rounded-xl bg-gray-50">
                            <Globe className="h-10 w-10 text-[#001F3F] mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">{t.aboutPage.vision_title}</h3>
                            <p className="text-sm text-gray-500">{t.aboutPage.vision_desc}</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gray-50">
                            <Users className="h-10 w-10 text-[#001F3F] mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">{t.aboutPage.client_title}</h3>
                            <p className="text-sm text-gray-500">{t.aboutPage.client_desc}</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gray-50">
                            <Award className="h-10 w-10 text-[#001F3F] mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">{t.aboutPage.excellence_title}</h3>
                            <p className="text-sm text-gray-500">{t.aboutPage.excellence_desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Locations Map */}
            <section className="py-20 bg-[#F8F9FA]">
                <div className="container px-4 mx-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-[#001F3F] font-serif mb-4">{t.aboutPage.offices_title}</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {t.aboutPage.offices_subtitle}
                            </p>
                        </div>
                        <OfficeMap />
                    </div>
                </div>
            </section>

        </main>
    );
}
