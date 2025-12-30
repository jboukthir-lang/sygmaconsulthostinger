'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';

export default function PublicMobileTopBar() {
    const pathname = usePathname();
    const { logoUrl } = useLanguage();
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    useEffect(() => {
        setImgSrc(logoUrl || "/logo.png");
    }, [logoUrl]);

    // Hide on dashboard
    if (pathname?.startsWith('/dashboard')) return null;

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 z-40 flex items-center justify-center px-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <Image
                        src={imgSrc || "/logo.png"}
                        alt="Sygma Consult"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                        onError={() => setImgSrc("/logo.png")}
                    />
                    <span className="font-serif text-lg font-bold text-[#001F3F] tracking-tight">SYGMA<span className="text-[#D4AF37]">CONSULT</span></span>
                </div>
            </div>
            {/* Spacer */}
            <div className="md:hidden h-16 w-full flex-none" />
        </>
    );
}
