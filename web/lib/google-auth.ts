import { google } from 'googleapis';

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

/**
 * Get OAuth2 client for Google APIs (Async with DB Fallback)
 */
export async function getGoogleOAuth2Client() {
  let clientId = process.env.GOOGLE_CLIENT_ID;
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  let redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret) {
    try {
      const { supabaseAdmin } = await import('./supabase-admin');
      const { data } = await supabaseAdmin
        .from('site_settings')
        .select('key, value');

      if (data) {
        data.forEach(setting => {
          if (setting.value && setting.value !== 'REPLACE_ME' && !setting.value.includes('REPLACE')) {
            if (setting.key === 'GOOGLE_CLIENT_ID') clientId = setting.value;
            if (setting.key === 'GOOGLE_CLIENT_SECRET') clientSecret = setting.value;
            if (setting.key === 'GOOGLE_REDIRECT_URI') redirectUri = setting.value;
          }
        });
      }

      if (clientId && clientSecret) {
        console.log('✅ Google Auth config loaded from database fallback');
      }
    } catch (e) {
      console.error('Failed to load Google Auth config from DB fallback:', e);
    }
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  return oauth2Client;
}

/**
 * Generate authorization URL for Google OAuth
 */
export async function getAuthUrl(scopes: string[]) {
  const oauth2Client = await getGoogleOAuth2Client();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  return authUrl;
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string): Promise<GoogleTokens> {
  const oauth2Client = await getGoogleOAuth2Client();

  const { tokens } = await oauth2Client.getToken(code);

  return tokens as GoogleTokens;
}

/**
 * Set credentials from stored tokens
 */
export async function setCredentials(tokens: GoogleTokens) {
  const oauth2Client = await getGoogleOAuth2Client();
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
  const oauth2Client = await getGoogleOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();

  return credentials as GoogleTokens;
}

/**
 * Get all required scopes for our integrations
 */
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];
