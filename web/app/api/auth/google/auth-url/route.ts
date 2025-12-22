import { NextResponse } from 'next/server';
import { getAuthUrl, GOOGLE_SCOPES } from '@/lib/google-auth';

export async function GET() {
  try {
    const authUrl = getAuthUrl(GOOGLE_SCOPES);

    return NextResponse.json({
      authUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
