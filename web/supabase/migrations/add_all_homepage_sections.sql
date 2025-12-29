-- Add About and Stats sections to app_config
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_title_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_title_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_title_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_description_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_description_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_description_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_cta_text_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_cta_text_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_cta_text_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS about_cta_url TEXT DEFAULT '/about';
-- Stats (4 stats with value and label)
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat1_value TEXT DEFAULT '10+';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat1_label_en TEXT DEFAULT 'Years Experience';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat1_label_fr TEXT DEFAULT 'Années d''expérience';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat1_label_ar TEXT DEFAULT 'سنوات من الخبرة';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat2_value TEXT DEFAULT '50+';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat2_label_en TEXT DEFAULT 'Partner Countries';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat2_label_fr TEXT DEFAULT 'Pays partenaires';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat2_label_ar TEXT DEFAULT 'دولة شريكة';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat3_value TEXT DEFAULT '98%';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat3_label_en TEXT DEFAULT 'Success Rate';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat3_label_fr TEXT DEFAULT 'Taux de réussite';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat3_label_ar TEXT DEFAULT 'نسبة النجاح';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat4_value TEXT DEFAULT '2k+';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat4_label_en TEXT DEFAULT 'Satisfied Clients';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat4_label_fr TEXT DEFAULT 'Clients satisfaits';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS stat4_label_ar TEXT DEFAULT 'عميل راضٍ';
-- Why Choose Us title
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS why_title_en TEXT DEFAULT 'Why Choose Sygma Consult?';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS why_title_fr TEXT DEFAULT 'Pourquoi choisir Sygma Consult ?';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS why_title_ar TEXT DEFAULT 'لماذا تختار سيجما كونسلت؟';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS why_subtitle_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS why_subtitle_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS why_subtitle_ar TEXT;