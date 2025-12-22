-- Add Google Calendar fields to bookings table

-- Add calendar_event_id column to store Google Calendar event ID
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS calendar_event_id TEXT;

-- Add meet_link column to store Google Meet link
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS meet_link TEXT;

-- Create index for calendar_event_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_calendar_event_id ON bookings(calendar_event_id);

-- Add comment for documentation
COMMENT ON COLUMN bookings.calendar_event_id IS 'Google Calendar event ID for calendar integration';
COMMENT ON COLUMN bookings.meet_link IS 'Google Meet link for online consultation';
