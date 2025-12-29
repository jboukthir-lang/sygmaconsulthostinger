import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { executeQuery } from '@/lib/mysql';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        // Simple security check using an environment variable or a hardcoded value for now
        // In production, use a strong ADMIN_API_SECRET
        if (secret !== process.env.ADMIN_API_SECRET && secret !== 'sygma-migration-2024') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const results = {
            contacts: { success: 0, failed: 0 },
            bookings: { success: 0, failed: 0 }
        };

        // 1. Migrate Contacts
        const { data: contacts, error: contactsError } = await supabaseAdmin
            .from('contacts')
            .select('*');

        if (contactsError) throw contactsError;

        if (contacts && contacts.length > 0) {
            for (const contact of contacts) {
                try {
                    await executeQuery(
                        `INSERT INTO contacts (id, name, email, subject, message, status, reply, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             status = VALUES(status), reply = VALUES(reply), updated_at = CURRENT_TIMESTAMP`,
                        [
                            contact.id,
                            contact.name,
                            contact.email,
                            contact.subject || 'No Subject',
                            contact.message,
                            contact.status || 'new',
                            contact.reply,
                            new Date(contact.created_at)
                        ]
                    );
                    results.contacts.success++;
                } catch (err) {
                    console.error(`Failed to migrate contact ${contact.id}:`, err);
                    results.contacts.failed++;
                }
            }
        }

        // 2. Migrate Bookings
        const { data: bookings, error: bookingsError } = await supabaseAdmin
            .from('bookings')
            .select('*');

        if (bookingsError) throw bookingsError;

        if (bookings && bookings.length > 0) {
            for (const booking of bookings) {
                try {
                    await executeQuery(
                        `INSERT INTO bookings (id, user_id, name, email, topic, date, time, status, notes, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             status = VALUES(status), notes = VALUES(notes), updated_at = CURRENT_TIMESTAMP`,
                        [
                            booking.id,
                            booking.user_id,
                            booking.name,
                            booking.email,
                            booking.topic,
                            booking.date,
                            booking.time,
                            booking.status || 'pending',
                            booking.notes,
                            new Date(booking.created_at)
                        ]
                    );
                    results.bookings.success++;
                } catch (err) {
                    console.error(`Failed to migrate booking ${booking.id}:`, err);
                    results.bookings.failed++;
                }
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error: any) {
        console.error('Migration Error:', error);
        return NextResponse.json(
            { error: error.message || 'Migration failed' },
            { status: 500 }
        );
    }
}
