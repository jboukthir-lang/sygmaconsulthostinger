import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokensStr = cookieStore.get('google_tokens')?.value;

    return NextResponse.json({
      connected: !!tokensStr,
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
    });
  }
}
