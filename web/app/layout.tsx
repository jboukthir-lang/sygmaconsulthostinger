import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Alexandria, Montserrat } from "next/font/google";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});
// Force dynamic rendering to ensure fresh metadata
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  let logoUrl = '/logo.png';
  let faviconUrl = '/favicon-32x32.png';

  try {
    const { data } = await supabase
      .from('app_config')
      .select('logo_url, favicon_url')
      .eq('key', 'main')
      .single();

    if (data) {
      if (data.logo_url) logoUrl = data.logo_url;
      if (data.favicon_url) faviconUrl = `${data.favicon_url}?t=${Date.now()}`;
    }
  } catch (error) {
    console.error('Error fetching site settings for metadata:', error);
  }

  return {
    metadataBase: new URL('https://sygma-consult.com'),
    title: {
      default: 'SYGMA CONSULT - Strategic Consulting Europe & Africa | Paris - Tunis',
      template: '%s | SYGMA CONSULT'
    },
    description: 'Expert strategic consulting bridging European and African markets. Digital transformation, market entry strategies, and cross-border commercial development. Offices in Paris & Tunis.',
    keywords: [
      'conseil stratégique',
      'consulting Europe Africa',
      'transformation digitale',
      'Paris Tunis consulting',
      'market entry Africa',
      'strategic consulting France Tunisia',
      'business development cross-border',
      'consulting international',
      'développement commercial transfrontalier',
      'conseil en stratégie Paris',
    ],
    publisher: 'Sygma Consult',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      alternateLocale: ['ar_TN', 'en_US'],
      url: 'https://sygmaconsult.vercel.app',
      siteName: 'Sygma Consult',
      title: 'Sygma Consult | Transformation Digitale & Conseil Stratégique',
      description: 'Cabinet de conseil expert en transformation digitale, conseil juridique et stratégie de croissance. Présent à Paris et Tunis.',
      images: [
        {
          url: logoUrl,
          width: 150,
          height: 150,
          alt: 'Sygma Consult Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sygma Consult | Transformation Digitale & Conseil Stratégique',
      description: 'Cabinet de conseil expert en transformation digitale, conseil juridique et stratégie de croissance. Présent à Paris et Tunis.',
      images: [logoUrl],
      creator: '@sygmaconsult',
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: 'c7I_RSypaQKRXKNbGMD6C9S5bcnEuRzMmlk7prvY6tQ',
    }
  };
}

import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import StructuredData from "@/components/StructuredData";

import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        className={`${alexandria.variable} ${montserrat.variable} antialiased font-sans flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Footer />
            <ChatBot />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
