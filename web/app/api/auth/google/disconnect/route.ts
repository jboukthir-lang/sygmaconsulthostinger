import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete the Google tokens cookie
    cookieStore.delete('google_tokens');

    return NextResponse.json({
      success: true,
      message: 'Google account disconnected successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to disconnect Google account' },
      { status: 500 }
    );
  }
}
