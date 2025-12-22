-- Migration: Create homepage_sections table for managing homepage content
-- Created: 2025-12-21
-- Description: Allows admins to manage hero, about, and other homepage sections content

-- Create homepage_sections table
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  section_name TEXT UNIQUE NOT NULL, -- 'hero', 'about', 'cta', etc.

  -- Section Title
  title_en TEXT,
  title_fr TEXT,
  title_ar TEXT,

  -- Section Subtitle
  subtitle_en TEXT,
  subtitle_fr TEXT,
  subtitle_ar TEXT,

  -- Section Description/Content
  description_en TEXT,
  description_fr TEXT,
  description_ar TEXT,

  -- Additional Content (JSON for flexibility)
  content_en JSONB,
  content_fr JSONB,
  content_ar JSONB,

  -- Call-to-Action
  cta_text_en TEXT,
  cta_text_fr TEXT,
  cta_text_ar TEXT,
  cta_url TEXT,

  cta_secondary_text_en TEXT,
  cta_secondary_text_fr TEXT,
  cta_secondary_text_ar TEXT,
  cta_secondary_url TEXT,

  -- Badge/Label (for Hero section)
  badge_en TEXT,
  badge_fr TEXT,
  badge_ar TEXT,

  -- Settings
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  -- System
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default Hero section
INSERT INTO public.homepage_sections (section_name, title_en, title_fr, title_ar, subtitle_en, subtitle_fr, subtitle_ar, badge_en, badge_fr, badge_ar, cta_text_en, cta_text_fr, cta_text_ar, cta_url, cta_secondary_text_en, cta_secondary_text_fr, cta_secondary_text_ar, cta_secondary_url, content_en, content_fr, content_ar)
VALUES (
  'hero',
  -- Titles
  'Your Strategic Partner in',
  'Votre Partenaire Stratégique à',
  'شريكك الاستراتيجي في',
  -- Subtitles
  'Empowering businesses and individuals with world-class digital transformation, legal compliance, and strategic financial growth solutions.',
  'Accompagner les entreprises et les particuliers avec des solutions de transformation numérique, de conformité juridique et de croissance financière.',
  'تمكين الشركات والأفراد من خلال حلول التحول الرقمي، الامتثال القانوني، والنمو المالي الاستراتيجي.',
  -- Badges
  'Premium Consulting Services',
  'Services de Conseil Premium',
  'خدمات استشارية متميزة',
  -- CTAs
  'Book a Consultation',
  'Prendre Rendez-vous',
  'احجز موعد',
  '/book',
  'Explore Services',
  'Nos Services',
  'اكتشف خدماتنا',
  '/services',
  -- Content (JSON for Paris & Tunis highlights)
  '{"highlight1": "Paris", "highlight2": "Tunis"}'::jsonb,
  '{"highlight1": "Paris", "highlight2": "Tunis"}'::jsonb,
  '{"highlight1": "باريس", "highlight2": "تونس"}'::jsonb
)
ON CONFLICT (section_name) DO NOTHING;

-- Insert default About section
INSERT INTO public.homepage_sections (section_name, title_en, title_fr, title_ar, subtitle_en, subtitle_fr, subtitle_ar, description_en, description_fr, description_ar, cta_text_en, cta_text_fr, cta_text_ar, cta_url, content_en, content_fr, content_ar)
VALUES (
  'about',
  -- Titles
  'Bridging Opportunities Between',
  'Créer des Opportunités entre',
  'ربط الفرص بين',
  -- Subtitles (used for "Europe & Africa")
  'Europe & Africa',
  'l''Europe & l''Afrique',
  'أوروبا وأفريقيا',
  -- Descriptions
  'At Sygma Consult, we are more than just consultants; we are your strategic partners in growth. With established presence in both Paris and Tunis, we possess the unique cultural and regulatory insights needed to bridge markets.',
  'Chez Sygma Consult, nous sommes plus que de simples consultants ; nous sommes vos partenaires stratégiques. Avec une présence établie à Paris et à Tunis, nous possédons les connaissances culturelles et réglementaires uniques pour relier les marchés.',
  'في سيجما كونسلت، نحن أكثر من مجرد مستشارين؛ نحن شركاؤك الاستراتيجيون في النمو. بفضل وجودنا في باريس وتونس، نمتلك رؤى ثقافية وتنظيمية فريدة لربط الأسواق.',
  -- CTAs
  'Learn More About Us',
  'En Savoir Plus',
  'اعرف المزيد عنا',
  '/about',
  -- Content (JSON for bullet points)
  '{"points": ["Deep expertise in French and North African regulations", "Multilingual team (English, French, Arabic)", "Proven track record in M&A and digital transformation", "Personalized approach to every client case"]}'::jsonb,
  '{"points": ["Expertise approfondie des réglementations françaises et nord-africaines", "Équipe multilingue (Anglais, Français, Arabe)", "Expérience prouvée en fusions-acquisitions et transformation numérique", "Approche personnalisée pour chaque dossier client"]}'::jsonb,
  '{"points": ["خبرة عميقة في اللوائح الفرنسية وشمال أفريقيا", "فريق متعدد اللغات (الفرنسية، العربية، الإنجليزية)", "سجل حافل في عمليات الدمج والاستحواذ والتحول الرقمي", "نهج مخصص لكل حالة عميل"]}'::jsonb
)
ON CONFLICT (section_name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_homepage_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_homepage_sections_updated_at_trigger ON public.homepage_sections;
CREATE TRIGGER update_homepage_sections_updated_at_trigger
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_sections_updated_at();

-- Enable Row Level Security
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read homepage sections
CREATE POLICY "Homepage sections are viewable by everyone"
  ON public.homepage_sections
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can view all sections (including inactive)
CREATE POLICY "All homepage sections viewable by authenticated users"
  ON public.homepage_sections
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update homepage sections
CREATE POLICY "Homepage sections are updatable by authenticated users"
  ON public.homepage_sections
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can insert homepage sections
CREATE POLICY "Homepage sections are insertable by authenticated users"
  ON public.homepage_sections
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_homepage_sections_section_name ON public.homepage_sections(section_name);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_active ON public.homepage_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON public.homepage_sections(display_order);

-- Grant permissions
GRANT SELECT ON public.homepage_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;

-- Add helpful comment
COMMENT ON TABLE public.homepage_sections IS 'Stores editable content for homepage sections (hero, about, etc.) in multiple languages';
