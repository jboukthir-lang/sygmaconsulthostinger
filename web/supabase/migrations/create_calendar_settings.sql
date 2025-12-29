-- Create calendar_settings table in Supabase
-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS calendar_settings (
    id SERIAL PRIMARY KEY,
    slot_duration INTEGER DEFAULT 30,
    start_time VARCHAR(10) DEFAULT '09:00',
    end_time VARCHAR(10) DEFAULT '17:00',
    working_days JSONB DEFAULT '["1","2","3","4","5"]'::jsonb,
    buffer_time INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Insert default settings if table is empty
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
    '["1","2","3","4","5"]'::jsonb,
    0
WHERE NOT EXISTS (
        SELECT 1
        FROM calendar_settings
        LIMIT 1
    );
-- Verify
SELECT *
FROM calendar_settings;