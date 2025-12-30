# Sygma Consult - Professional Consulting Website

A modern, multilingual corporate website for Sygma Consult (Paris & Tunis), built with Next.js 14 and Tailwind CSS.

## 🚀 Features

- **Multilingual Support**: Seamless switching between English, French, and Arabic (RTL support)
- **Service Portfolio**: Dynamic routing for consulting services
- **Booking System**: Integrated calendar for scheduling consultations
- **AI Assistant**: Smart chatbot for instant client support
- **SEO Optimized**: Sitemap, robots.txt, and meta tags
- **Admin Dashboard**: Manage bookings, messages, and content

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **Fonts**: Montserrat (Latin) & Alexandria (Arabic)

## 📦 Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   # ... other variables
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

4. **Build for production:**

   ```bash
   npm run build
   npm start
   ```

## 📂 Project Structure

```
web/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── about/             # About page
│   ├── services/          # Services pages
│   ├── booking/           # Booking system
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # Reusable UI components
├── context/              # React contexts (Auth, Language)
├── lib/                  # Utility functions
├── public/               # Static assets
└── supabase/             # Database migrations
```

## 🌍 Multilingual Support

Translations are managed in `context/LanguageContext.tsx`. Supported languages:

- 🇫🇷 Français (French)
- 🇬🇧 English
- 🇸🇦 العربية (Arabic)

## 🗄️ Database

The project uses Supabase for:

- Bookings management
- Contact messages
- User profiles
- Admin notifications

Run migrations in `supabase/` folder to set up the database.

## 🔒 Security

- Row Level Security (RLS) enabled on Supabase
- Firebase Authentication
- Environment variables for sensitive data
- HTTPS only in production

## 📊 SEO

- ✅ Sitemap.xml generated
- ✅ Robots.txt configured
- ✅ Meta tags optimized
- ✅ Multilingual hreflang support

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel
```

### Hostinger

1. Build the project: `npm run build`
2. Upload to Hostinger
3. Configure environment variables
4. Deploy

## 📞 Support

- **Email**: <contact@sygma-consult.com>
- **Phone**: +33 7 52 03 47 86
- **Website**: <https://www.sygmaconsult.com>

---

© 2025 Sygma Consult. All rights reserved.
