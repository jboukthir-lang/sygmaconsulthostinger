-- Add About section additional fields for the Paris-Tunis visual
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_highlight1_en TEXT DEFAULT 'Europe';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_highlight1_fr TEXT DEFAULT 'Europe';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_highlight1_ar TEXT DEFAULT 'أوروبا';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_highlight2_en TEXT DEFAULT 'Africa';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_highlight2_fr TEXT DEFAULT 'Afrique';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_highlight2_ar TEXT DEFAULT 'أفريقيا';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_location1_en TEXT DEFAULT 'Paris';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_location1_fr TEXT DEFAULT 'Paris';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_location1_ar TEXT DEFAULT 'باريس';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_location2_en TEXT DEFAULT 'Tunis';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_location2_fr TEXT DEFAULT 'Tunis';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_location2_ar TEXT DEFAULT 'تونس';
-- About points (bullet list)
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point1_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point1_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point1_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point2_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point2_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point2_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point3_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point3_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point3_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point4_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point4_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_point4_ar TEXT;
-- Update with default content from the image
UPDATE app_config
SET about_title_en = 'Connecting Commercial Success between',
    about_title_fr = 'Connecter le Succès Commercial entre',
    about_title_ar = 'ربط النجاح التجاري بين',
    about_description_en = 'SYGMA CONSULT bridges European and African markets, offering strategic consulting services that foster sustainable growth. Our expertise covers digital transformation, market entry strategies, and cross-cultural commercial development.',
    about_description_fr = 'SYGMA CONSULT comble le fossé entre les marchés européens et africains, offrant des services de conseil stratégique qui favorisent une croissance durable. Notre expertise couvre la transformation numérique, les stratégies d''entrée sur le marché et le développement commercial interculturel.',
    about_description_ar = 'تربط SYGMA CONSULT بين الأسواق الأوروبية والأفريقية، وتقدم خدمات استشارية استراتيجية تعزز النمو المستدام. تغطي خبرتنا التحول الرقمي واستراتيجيات دخول السوق والتطوير التجاري عبر الثقافات.',
    about_point1_en = 'Strategic Market Analysis',
    about_point1_fr = 'Analyse Stratégique du Marché',
    about_point1_ar = 'تحليل استراتيجي للسوق',
    about_point2_en = 'Digital Transformation Solutions',
    about_point2_fr = 'Solutions de Transformation Digitale',
    about_point2_ar = 'حلول التحول الرقمي',
    about_point3_en = 'Cross-Border Commercial Development',
    about_point3_fr = 'Développement Commercial Transfrontalier',
    about_point3_ar = 'التطوير التجاري عبر الحدود',
    about_point4_en = 'Regulatory Support & Compliance',
    about_point4_fr = 'Support Réglementaire et Conformité',
    about_point4_ar = 'الدعم التنظيمي والامتثال',
    about_cta_text_en = 'Learn More',
    about_cta_text_fr = 'En Savoir Plus',
    about_cta_text_ar = 'اعرف المزيد',
    about_cta_url = '/about'
WHERE key = 'main';