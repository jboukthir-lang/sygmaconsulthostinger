# Sygma Consult - Premium Consulting Website

A modern, multilingual corporate website for Sygma Consult (Paris & Tunis), built with Next.js 14 and Tailwind CSS.

## 🚀 Features

- **Multilingual Core**: Seamless switching between English, French, and Arabic (RTL support).
- **Service Portfolio**: dynamic routing for 9 distinct service areas including Visa Procedures and Corporate Formalities.
- **Booking System**: Integrated calendar for scheduling consultations.
- **AI Assistant**: Smart chatbot for instant client support.
- **SEO Optimized**: Dynamic metadata and sitemap generation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Montserrat (Latin) & Alexandria (Arabic)

## 📦 Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

3.  **Build for production:**
    ```bash
    npm run build
    npm start
    ```

## 📂 Project Structure

- `/app`: App Router pages and API routes.
- `/components`: Reusable UI components (Header, Footer, ChatBot).
- `/context`: Global state (LanguageProvider).
- `/public`: Static assets.

## 🌍 Translations

Translations are managed in `context/LanguageContext.tsx`. New keys should be added there for full En/Fr/Ar support.

---
© 2025 Sygma Consult. All rights reserved.
