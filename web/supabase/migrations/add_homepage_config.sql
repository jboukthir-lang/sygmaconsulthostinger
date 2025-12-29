-- Add new configuration columns for homepage settings
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS hero_type TEXT DEFAULT 'globe',
    -- 'globe', 'image', 'video'
ADD COLUMN IF NOT EXISTS hero_media_url TEXT,
    ADD COLUMN IF NOT EXISTS show_stats BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS show_partners BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS show_process BOOLEAN DEFAULT true;