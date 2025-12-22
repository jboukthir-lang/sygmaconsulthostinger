# Google Calendar API Setup Guide

Follow these steps to enable Google Calendar integration for automatic booking synchronization.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select existing project
3. Enter project name (e.g., "Sygma Consult Calendar")
4. Click "Create"

## Step 2: Enable Google Calendar API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on it and press **Enable**

## Step 3: Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Enter details:
   - **Name**: Sygma Consult Booking
   - **ID**: sygma-consult-booking (auto-generated)
   - **Description**: Service account for booking calendar integration
4. Click **Create and Continue**
5. Skip optional steps (Grant access, Grant users access)
6. Click **Done**

## Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Click **Create**
6. A JSON file will be downloaded - **Keep this safe!**

## Step 5: Share Calendar with Service Account

1. Open [Google Calendar](https://calendar.google.com/)
2. Create a new calendar (or use existing):
   - Click the **+** next to "Other calendars"
   - Select **Create new calendar**
   - Name it: "Sygma Consult Bookings"
   - Click **Create calendar**
3. Go to calendar settings (click ⚙️ on the calendar)
4. Scroll to **Share with specific people**
5. Click **Add people**
6. Enter the service account email (found in the JSON file, looks like: `sygma-consult-booking@project-id.iam.gserviceaccount.com`)
7. Set permission to **Make changes to events**
8. Click **Send**

## Step 6: Get Calendar ID

1. In calendar settings, scroll down to **Integrate calendar**
2. Copy the **Calendar ID** (looks like: `abc123@group.calendar.google.com`)
3. If using primary calendar, the ID is just `primary`

## Step 7: Configure Environment Variables

### Local Development (.env.local)

Add these variables to your `.env.local` file:

```bash
# Google Calendar API
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"sygma-consult-booking@project-id.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
ADMIN_EMAIL=contact@sygma-consult.com
```

**Important**:
- The `GOOGLE_SERVICE_ACCOUNT_KEY` must be the entire JSON content as a **single line** (no line breaks)
- Replace `\n` in the private key with actual newlines or keep as `\n` (both work)

### Vercel Production

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these three variables:
   - `GOOGLE_SERVICE_ACCOUNT_KEY` = (paste entire JSON as single line)
   - `GOOGLE_CALENDAR_ID` = your calendar ID
   - `ADMIN_EMAIL` = contact@sygma-consult.com
5. Click **Save**
6. Redeploy your application

## Step 8: Update Supabase Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Add Google Calendar fields to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS calendar_event_id TEXT;

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS meet_link TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_calendar_event_id ON bookings(calendar_event_id);

-- Add comments
COMMENT ON COLUMN bookings.calendar_event_id IS 'Google Calendar event ID for calendar integration';
COMMENT ON COLUMN bookings.meet_link IS 'Google Meet link for online consultation';
```

## Features Enabled

Once configured, the system will automatically:

✅ Create Google Calendar events for each booking
✅ Generate Google Meet links for online consultations
✅ Send calendar invitations to both client and admin
✅ Set reminders (24 hours before via email, 1 hour before as popup)
✅ Sync booking details with calendar
✅ Store event ID and Meet link in database

## Testing

To test the integration:

1. Make sure all environment variables are set
2. Create a test booking through the website
3. Check your Google Calendar - you should see the event
4. Check the email - it should include the Google Meet link
5. Verify the booking in Supabase has `calendar_event_id` and `meet_link` populated

## Troubleshooting

### "Calendar not configured" messages in logs
- Check that `GOOGLE_SERVICE_ACCOUNT_KEY` is set correctly
- Verify JSON is valid (use a JSON validator)
- Ensure no line breaks in the environment variable

### "Failed to create calendar event"
- Verify the service account email has access to the calendar
- Check that Google Calendar API is enabled
- Ensure the Calendar ID is correct

### No Google Meet link
- Make sure `conferenceDataVersion: 1` is set in the API call
- Verify calendar permissions allow creating conference links
- Check Google Workspace settings if using workspace account

## Security Notes

⚠️ **Never commit the service account JSON to git**
⚠️ Keep the private key secure
⚠️ Use different service accounts for development and production
⚠️ Regularly rotate service account keys

---

Need help? Contact: contact@sygma-consult.com
