-- Add missing columns to app_config table
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS badge_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS badge_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS badge_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS title_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS title_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS subtitle_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS subtitle_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS subtitle_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS cta_text_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS cta_text_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS cta_text_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS cta_url TEXT DEFAULT '/book';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS cta_secondary_text_en TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS cta_secondary_text_fr TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS cta_secondary_text_ar TEXT;
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS cta_secondary_url TEXT DEFAULT '/services';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS hero_type TEXT DEFAULT 'globe';
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS hero_media_url TEXT;