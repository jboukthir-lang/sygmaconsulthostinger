-- Add font_family column to app_config table
ALTER TABLE app_config
ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'inter';
-- Comment on column
COMMENT ON COLUMN app_config.font_family IS 'The primary font family for the website (e.g., inter, montserrat, alexandria)';