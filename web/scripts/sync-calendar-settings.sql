-- Sync Calendar Settings to MySQL
-- Run this in phpMyAdmin
-- Create calendar_settings table
CREATE TABLE IF NOT EXISTS calendar_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slot_duration INT DEFAULT 30,
    start_time VARCHAR(10) DEFAULT '09:00',
    end_time VARCHAR(10) DEFAULT '17:00',
    working_days JSON,
    buffer_time INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Insert default calendar settings (if table is empty)
-- First, check if table has data
SELECT COUNT(*) as count
FROM calendar_settings;
-- If count is 0, insert default settings
INSERT INTO calendar_settings (
        slot_duration,
        start_time,
        end_time,
        working_days,
        buffer_time
    )
SELECT 30,
    '09:00',
    '17:00',
    '["1","2","3","4","5"]',
    0
WHERE NOT EXISTS (
        SELECT 1
        FROM calendar_settings
        LIMIT 1
    );
-- Verify
SELECT *
FROM calendar_settings;