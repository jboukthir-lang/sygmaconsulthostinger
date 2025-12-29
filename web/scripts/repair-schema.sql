-- Database Schema Repair Script
-- Run this in phpMyAdmin on Hostinger
-- Add missing columns to services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS subtitle_en TEXT;
ALTER TABLE services
ADD COLUMN IF NOT EXISTS subtitle_fr TEXT;
ALTER TABLE services
ADD COLUMN IF NOT EXISTS subtitle_ar TEXT;
ALTER TABLE services
ADD COLUMN IF NOT EXISTS features_en JSON;
ALTER TABLE services
ADD COLUMN IF NOT EXISTS features_fr JSON;
ALTER TABLE services
ADD COLUMN IF NOT EXISTS features_ar JSON;
-- Verify the columns were added
SELECT COLUMN_NAME,
    DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'services'
    AND COLUMN_NAME IN (
        'subtitle_en',
        'subtitle_fr',
        'subtitle_ar',
        'features_en',
        'features_fr',
        'features_ar'
    );