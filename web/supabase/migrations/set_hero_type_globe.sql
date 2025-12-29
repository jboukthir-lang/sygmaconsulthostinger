-- Update hero_type to globe if it's null or empty
UPDATE app_config
SET hero_type = 'globe'
WHERE key = 'main'
    AND (
        hero_type IS NULL
        OR hero_type = ''
    );
-- Verify the update
SELECT key,
    hero_type,
    badge_en,
    title_en
FROM app_config
WHERE key = 'main';