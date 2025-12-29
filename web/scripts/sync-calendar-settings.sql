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
-- Insert default calendar settings
INSERT INTO calendar_settings (
        slot_duration,
        start_time,
        end_time,
        working_days,
        buffer_time
    )
VALUES (30, '09:00', '17:00', '["1","2","3","4","5"]', 0) ON DUPLICATE KEY
UPDATE slot_duration =
VALUES(slot_duration),
    start_time =
VALUES(start_time),
    end_time =
VALUES(end_time),
    working_days =
VALUES(working_days),
    buffer_time =
VALUES(buffer_time);
-- Verify
SELECT *
FROM calendar_settings;