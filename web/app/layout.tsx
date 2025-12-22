import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://sygmaconsult.vercel.app'),
  title: {
    default: 'Sygma Consult | Transformation Digitale & Conseil Stratégique',
    template: '%s | Sygma Consult'
  },
  description: 'Cabinet de conseil expert en transformation digitale, conseil juridique et stratégie de croissance. Présent à Paris et Tunis. Solutions sur-mesure pour entreprises.',
  keywords: [
    'transformation digitale',
    'conseil stratégique',
    'consulting Paris',
    'consulting Tunis',
    'conseil juridique',
    'stratégie entreprise',
    'digitalisation entreprise',
    'conseil en gestion',
    'accompagnement digital',
    'conseil business',
    'cabinet de conseil France',
    'cabinet de conseil Tunisie',
    'Sygma Consult',
    'digital transformation',
    'strategic consulting'
  ],
  authors: [{ name: 'Sygma Consult' }],
  creator: 'Sygma Consult',
  publisher: 'Sygma Consult',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '150x150', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
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
        url: '/logo.png',
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
    images: ['/logo.png'],
    creator: '@sygmaconsult',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'c7I_RSypaQKRXKNbGMD6C9S5bcnEuRzMmlk7prvY6tQ',
  },
  alternates: {
    canonical: 'https://sygmaconsult.vercel.app',
    languages: {
      'fr-FR': 'https://sygmaconsult.vercel.app',
      'ar-TN': 'https://sygmaconsult.vercel.app',
      'en-US': 'https://sygmaconsult.vercel.app',
    },
  },
};

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
    <html lang="fr">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${alexandria.variable} ${montserrat.variable} antialiased font-sans flex flex-col min-h-screen`}
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
