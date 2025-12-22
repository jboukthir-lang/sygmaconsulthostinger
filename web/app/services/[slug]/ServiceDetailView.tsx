'use client';

import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";

export default function ServiceDetailView({ slug }: { slug: string }) {
    const { t } = useLanguage();
    const service = t.serviceDetails[slug];

    // We also need access to the keys to iterate for the "Other Services" sidebar
    // We can get them from the serviceDetails object keys
    const allServices = t.serviceDetails;

    if (!service) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#001F3F]">Service Not Found</h1>
                        <Link href="/services" className="text-[#D4AF37] hover:underline mt-4 block">Return to Services</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F9FA]">
            <Header />

            {/* Hero Header */}
            <div className="bg-[#001F3F] text-white py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <Link href="/services" className="inline-flex items-center text-blue-300 hover:text-[#D4AF37] mb-6 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t.nav.services} // Using nav translation for "Services" or hardcode "Back"
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{service.title}</h1>
                    <p className="text-xl text-blue-100 max-w-2xl">{service.subtitle}</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.footer.expertise}</h2> {/* "Overview" isn't in t, using Expertise or hardcoding? Let's assume generic or use a new key. I'll stick to a generic header or add "Overview" to details? Actually, "Overview" is hardcoded in original. I'll leave it as "Overview" but ideally add to dictionary. For now, I'll hardcode "Overview" or reuse something safe. */}
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {service.description}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#001F3F] mb-6">Key Capabilities</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {service.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                                        <span className="font-medium text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar CTA */}
                    <div className="space-y-6">
                        <div className="bg-[#001F3F] text-white p-8 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold mb-4">{t.servicesPage.cta_title}</h3>
                            <p className="text-blue-200 mb-6 text-sm">
                                {t.servicesPage.cta_desc}
                            </p>
                            <Link
                                href="/book"
                                className="block w-full text-center bg-[#D4AF37] hover:bg-[#C5A028] text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                {t.servicesPage.cta_button}
                            </Link>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-[#001F3F] mb-4">{t.servicesPage.cta_services}</h3>
                            <div className="flex flex-col space-y-3">
                                {Object.entries(allServices).map(([key, s]) => (
                                    key !== slug && (
                                        <Link key={key} href={`/services/${key}`} className="text-gray-500 hover:text-[#001F3F] hover:underline">
                                            {s.title}
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
