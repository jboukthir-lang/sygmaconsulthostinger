-- Sync App Config to MySQL
-- Run this in phpMyAdmin
-- Create app_config table
CREATE TABLE IF NOT EXISTS app_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    logo_url TEXT,
    favicon_url TEXT,
    site_name VARCHAR(255),
    site_description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Insert default app config (if table is empty)
INSERT INTO app_config (
        logo_url,
        favicon_url,
        site_name,
        site_description,
        contact_email,
        contact_phone
    )
SELECT 'https://ldbsacdpkinbpcguvgai.supabase.co/storage/v1/object/public/public/logo.png',
    'https://ldbsacdpkinbpcguvgai.supabase.co/storage/v1/object/public/public/favicon.ico',
    'SYGMA CONSULT',
    'Expert consulting services',
    'contact@sygmaconsult.com',
    '+33 1 23 45 67 89'
WHERE NOT EXISTS (
        SELECT 1
        FROM app_config
        LIMIT 1
    );
-- Verify
SELECT *
FROM app_config;