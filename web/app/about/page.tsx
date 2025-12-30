'use client';

import Header from "@/components/Header";
import OfficeMap from "@/components/OfficeMap";
import { Award, Globe, Users, Target, Rocket, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    const { t, language } = useLanguage();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stats = [
        { value: "10+", label: t.aboutPage?.stats_years || "Years Experience", icon: Award },
        { value: "500+", label: t.aboutPage?.stats_clients || "Satisfied Clients", icon: Users },
        { value: "2", label: t.aboutPage?.stats_offices || "Global Offices", icon: Globe },
        { value: "50M€+", label: t.aboutPage?.stats_value || "Value Created", icon: Target },
    ];

    const values = [
        {
            icon: Globe,
            title: t.aboutPage?.vision_title || "Global Vision",
            desc: t.aboutPage?.vision_desc || "Bridging markets with local expertise and international standards."
        },
        {
            icon: Users,
            title: t.aboutPage?.client_title || "Client Centric",
            desc: t.aboutPage?.client_desc || "Your success is our primary metric for performance."
        },
        {
            icon: Shield,
            title: t.aboutPage?.excellence_title || "Integrity & Trust",
            desc: t.aboutPage?.excellence_desc || "Building lasting partnerships through transparent practices."
        },
    ];

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-white text-[#001F3F] hidden md:block">
                {/* Abstract Background */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-40"></div>
                </div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block py-1 px-3 rounded-full bg-[#f0f9ff] border border-[#001F3F]/10 text-[#001F3F] text-sm font-semibold tracking-wider mb-6"
                    >
                        SINCE 2014
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight text-[#001F3F]"
                    >
                        {t.aboutPage?.hero_title || "Defining Excellence in Consulting"}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        {t.aboutPage?.hero_subtitle || "We are a premier consultancy firm dedicated to empowering businesses through strategic innovation and expert guidance."}
                    </motion.p>
                </div>
            </section>

            {/* Stats Section with Glassmorphism */}
            <section className="relative mt-6 md:-mt-16 z-20 pb-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/80 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-xl text-center hover:-translate-y-1 transition-transform duration-300"
                            >
                                <stat.icon className="h-8 w-8 text-[#D4AF37] mx-auto mb-4" />
                                <div className="text-4xl font-bold text-[#001F3F] mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story & Mission */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 space-y-8">
                            <h2 className="text-4xl font-bold font-serif text-[#001F3F]">
                                {t.aboutPage?.story_title || "Our Story"}
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    {t.aboutPage?.story_p1 || "Founded with a vision to bridge the gap between ambition and achievement, Sygma Consult has grown into a trusted partner for businesses across Tunisia and France."}
                                </p>
                                <p>
                                    {t.aboutPage?.story_p2 || "Our journey is defined by a relentless pursuit of excellence and a deep commitment to our clients' success. We believe in the power of strategic thinking combined with practical execution."}
                                </p>
                            </div>

                            <div className="flex gap-6 pt-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-[#D4AF37]" />
                                    <span className="font-medium text-[#001F3F]">Certified Experts</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-[#D4AF37]" />
                                    <span className="font-medium text-[#001F3F]">Proven Methodology</span>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Link
                                    href="/services"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#001F3F] text-white rounded-xl hover:bg-[#003366] transition-all shadow-lg hover:shadow-xl"
                                >
                                    Explore Our Services
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Visual Side */}
                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-[2rem] transform rotate-3"></div>
                            <div className="relative bg-white p-2 rounded-[2rem] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="aspect-[4/3] relative rounded-[1.5rem] overflow-hidden bg-gray-100">
                                    {/* Abstract placeholder or real image */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F] to-[#003366] opacity-90"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <h3 className="text-white text-3xl font-serif font-bold opacity-20">SYGMA CONSULT</h3>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white">
                                        <p className="font-serif italic text-xl">"Excellence is not an act, but a habit."</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-[#D4AF37] font-semibold tracking-wider uppercase">Our Core Values</span>
                        <h2 className="text-4xl font-bold font-serif text-[#001F3F] mt-3">What Drives Us Forward</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((item, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="w-14 h-14 rounded-xl bg-[#001F3F]/5 flex items-center justify-center mb-6 group-hover:bg-[#001F3F] group-hover:text-white transition-colors">
                                    <item.icon className="h-7 w-7 text-[#001F3F] group-hover:text-[#D4AF37]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#001F3F] mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Office Map Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                        <div className="relative z-10 text-center mb-12">
                            <h2 className="text-3xl font-bold text-[#001F3F] font-serif mb-4">{t.aboutPage?.offices_title || "Our Global Presence"}</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {t.aboutPage?.offices_subtitle || "Strategically located to serve you better, with offices in key economic hubs."}
                            </p>
                        </div>

                        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                            <OfficeMap />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-[#001F3F] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold font-serif mb-6">Ready to Transform Your Business?</h2>
                    <p className="text-blue-200 text-xl max-w-2xl mx-auto mb-10">
                        Join hundreds of satisfied clients who have elevated their operations with Sygma Consult.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/booking"
                            className="px-8 py-4 bg-[#D4AF37] text-white rounded-xl font-bold hover:bg-[#C5A028] transition-all shadow-lg hover:shadow-[#D4AF37]/20"
                        >
                            Book a Consultation
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
