import { NextResponse } from 'next/server';
import { sendGeneralNotification } from '@/lib/smtp-email';

export async function POST(request: Request) {
    try {
        const { recipients, title, message, link, subject, attachments } = await request.json();

        if (!recipients || !recipients.length || !title || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const results = [];
        const errors = [];

        // Process all emails
        for (const email of recipients) {
            try {
                await sendGeneralNotification(email, title, message, link, subject, attachments);
                results.push({ email, status: 'sent' });
            } catch (err: any) {
                console.error(`Failed to send email to ${email}:`, err);
                errors.push({ email, error: err.message || 'Unknown error' });
            }
        }

        return NextResponse.json({
            success: errors.length === 0,
            sentCount: results.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        console.error('API Error in send-email:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
