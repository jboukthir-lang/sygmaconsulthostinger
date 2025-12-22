import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode } from '@/lib/google-auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/settings?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/admin/settings?error=no_code', request.url)
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    // Get user from session or cookie
    // For now, we'll store in a cookie (you should use proper session management)
    const response = NextResponse.redirect(
      new URL('/admin/settings?google_connected=true', request.url)
    );

    // Store tokens in httpOnly cookie (more secure)
    response.cookies.set('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.redirect(
      new URL('/admin/settings?error=token_exchange_failed', request.url)
    );
  }
}
