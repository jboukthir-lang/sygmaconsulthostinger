# Google Maps API Setup Guide

Follow these steps to enable Google Maps integration for displaying office locations.

## Step 1: Enable Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing project (or create a new one)
3. Go to **APIs & Services** → **Library**
4. Search for "Maps JavaScript API"
5. Click on it and press **Enable**

## Step 2: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. A new API key will be generated
4. **Important**: Click **Edit API key** to restrict it

## Step 3: Restrict API Key (Recommended)

### Application Restrictions
1. Select **HTTP referrers (web sites)**
2. Add your domains:
   - `localhost:3000` (for development)
   - `*.vercel.app` (for Vercel previews)
   - `sygmaconsult.vercel.app` (your production domain)
   - Your custom domain if you have one

### API Restrictions
1. Select **Restrict key**
2. Choose **Maps JavaScript API** from the dropdown
3. Click **Save**

## Step 4: Configure Environment Variables

### Local Development (.env.local)

Add this variable to your `.env.local` file:

```bash
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your-api-key-here
```

**Note**: The `NEXT_PUBLIC_` prefix is required because this API key is used in the browser.

### Vercel Production

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value**: Your Google Maps API key
5. Click **Save**
6. Redeploy your application

## Features Enabled

Once configured, the map will display:

✅ Interactive Google Map on the About page
✅ Custom markers for Paris and Tunis offices
✅ Info windows with office details (address, phone, email)
✅ Clickable markers to show office information
✅ Styled map with custom colors matching brand
✅ Fallback UI if API key is not configured

## Office Locations

The map displays these office locations:

### Paris Office
- **Location**: Paris, France (48.8566°N, 2.3522°E)
- **Description**: European Headquarters
- **Phone**: +33 7 52 03 47 86
- **Email**: contact@sygma-consult.com

### Tunis Office
- **Location**: Tunis, Tunisia (36.8065°N, 10.1815°E)
- **Description**: North Africa Operations
- **Phone**: +33 7 52 03 47 86
- **Email**: contact@sygma-consult.com

## Customization

To update office locations, edit `components/OfficeMap.tsx`:

```typescript
const offices = [
  {
    id: 'paris',
    name: 'Paris Office',
    address: 'Your exact address',
    position: { lat: 48.8566, lng: 2.3522 },
    phone: '+33 7 52 03 47 86',
    email: 'contact@sygma-consult.com',
    description: 'European Headquarters',
  },
  // Add more offices...
];
```

## Testing

To test the map:

1. Make sure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
2. Run `npm run dev`
3. Navigate to `/about` page
4. You should see an interactive map with office markers
5. Click on markers to view office information

## Troubleshooting

### Map not loading
- Check that the API key is correct
- Verify Maps JavaScript API is enabled
- Check browser console for errors
- Ensure domain is added to API restrictions

### "For development purposes only" watermark
- This appears when using unrestricted API keys
- Add HTTP referrer restrictions to remove it
- Enable billing on your Google Cloud account

### Markers not showing
- Verify office coordinates are correct
- Check that `position` objects have valid lat/lng values
- Ensure markers are within the map bounds

## Cost & Billing

Google Maps offers:
- **$200 free credit** per month
- Map loads: ~$7 per 1,000 loads (after free tier)
- For typical traffic, you'll likely stay within the free tier

**Best Practice**: Set up billing alerts in Google Cloud Console to monitor usage.

## Security Notes

⚠️ **API Key Security**:
- Always restrict API keys by HTTP referrer
- Never commit API keys to git
- Use environment variables
- Rotate keys if exposed
- Monitor usage in Google Cloud Console

## Alternative: Map Without API Key

If you prefer not to use Google Maps API, the component includes a fallback that displays:
- Static office location cards
- Contact information
- No interactive map

Simply don't set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and the fallback will be shown automatically.

---

Need help? Contact: contact@sygma-consult.com
