import { NextResponse } from 'next/server';
import { saveMessage } from '@/lib/local-storage';
import { sendContactNotification, sendContactAutoReply } from '@/lib/smtp-email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, Email, and Message are required' },
                { status: 400 }
            );
        }

        // Save to Database (Supabase + MySQL)
        let savedData;
        try {
            const { db } = await import('@/lib/db');
            savedData = await db.createContact({
                name,
                email,
                subject: subject || 'General Inquiry',
                message
            });
            console.log('Contact saved to DB:', savedData);
        } catch (dbError) {
            console.error('Failed to save to DB:', dbError);
            // Fallback to local storage if DB fails completely
            savedData = await saveMessage({
                name,
                email,
                subject: subject || 'General Inquiry',
                message
            });
        }

        const data = savedData || await saveMessage({
            name,
            email,
            subject: subject || 'General Inquiry',
            message
        });

        // Send notification email to admin
        try {
            await sendContactNotification({
                ...data,
                created_at: data.created_at instanceof Date
                    ? data.created_at.toISOString()
                    : data.created_at || new Date().toISOString()
            } as any);
            console.log('Notification email sent to admin');
        } catch (emailError) {
            console.error('Failed to send notification email:', emailError);
            // Don't fail the contact form if email fails
        }

        // Send auto-reply to client
        try {
            await sendContactAutoReply(data);
            console.log('Auto-reply email sent to client');
        } catch (emailError) {
            console.error('Failed to send auto-reply email:', emailError);
            // Don't fail the contact form if email fails
        }

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
            contact: data
        });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
