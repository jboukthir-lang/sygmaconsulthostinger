'use client';

import { useLanguage } from "@/context/LanguageContext";

export default function Loading() {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-[#001F3F]/20 animate-spin border-t-[#D4AF37]" />
                <div className="mt-4 text-[#001F3F] font-bold text-sm tracking-widest text-center">{t.loading.text}</div>
            </div>
        </div>
    )
}
