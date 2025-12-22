import { NextResponse } from 'next/server';
import { supabase, type Contact } from '@/lib/supabase';
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

        // Save to Supabase
        const contactData: Contact = {
            name,
            email,
            subject: subject || 'General Inquiry',
            message,
            status: 'new'
        };

        const { data, error } = await supabase
            .from('contacts')
            .insert([contactData])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json(
                { error: 'Failed to save contact message' },
                { status: 500 }
            );
        }

        console.log('Contact saved successfully:', data);

        // Send notification email to admin
        try {
            await sendContactNotification(data);
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
