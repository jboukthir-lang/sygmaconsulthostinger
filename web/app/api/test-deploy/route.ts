import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        message: 'Deployment Successful',
        timestamp: new Date().toISOString()
    });
}
