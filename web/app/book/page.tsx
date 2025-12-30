'use client';

import Header from "@/components/Header";
import BookingCalendar from "@/components/BookingCalendar";
import { useLanguage } from "@/context/LanguageContext";

export default function BookingPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-[#F8F9FA] pb-24">
            <Header />
            <div className="container mx-auto px-4 py-6 md:py-12">
                <div className="text-center mb-6 md:mb-12 space-y-4 hidden md:block">
                    <h1 className="text-4xl font-bold text-[#001F3F] font-serif">{t.booking.page_title}</h1>
                    <p className="text-[#4A4A4A] max-w-2xl mx-auto">
                        {t.booking.page_subtitle}
                    </p>
                </div>
                <BookingCalendar />
            </div>
        </main>
    );
}
