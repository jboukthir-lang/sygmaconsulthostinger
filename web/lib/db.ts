import { supabaseAdmin } from './supabase-admin';
import mysqlPool, { executeQuery } from './mysql';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface ContactData {
    id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status?: 'new' | 'read' | 'replied';
    reply?: string;
    created_at?: Date;
}

export interface BookingData {
    id?: string;
    user_id?: string;
    name: string;
    email: string;
    topic: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm:ss
    status: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
    created_at?: Date;
}

/**
 * Unified Database Adapter
 * Handles Dual Write to Supabase (Primary) and MySQL (Secondary/Failover)
 */
class UnifiedDatabaseAdapter {

    // ==========================================
    // CONTACTS
    // ==========================================
    async createContact(data: ContactData): Promise<ContactData> {
        const id = data.id || uuidv4();
        const cleanData = { ...data, id, status: data.status || 'new' };

        const results = await Promise.allSettled([
            this.writeContactToSupabase(cleanData),
            this.writeContactToMySQL(cleanData)
        ]);

        // If both failed, throw error
        if (results.every(r => r.status === 'rejected')) {
            throw new Error('Failed to save contact to both Supabase and MySQL');
        }

        // Log failures if any
        if (results[0].status === 'rejected') console.error('Supabase write failed:', results[0].reason);
        if (results[1].status === 'rejected') console.error('MySQL write failed:', results[1].reason);

        return cleanData;
    }

    private async writeContactToSupabase(data: ContactData) {
        const { error } = await supabaseAdmin.from('contacts').insert(data);
        if (error) throw error;
    }

    private async writeContactToMySQL(data: ContactData) {
        if (!mysqlPool) return; // Skip if no MySQL config
        await executeQuery(
            `INSERT INTO contacts (id, name, email, subject, message, status, reply) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data.id, data.name, data.email, data.subject, data.message, data.status, data.reply || null]
        );
    }

    // ==========================================
    // BOOKINGS
    // ==========================================
    async createBooking(data: BookingData): Promise<BookingData> {
        const id = data.id || uuidv4();
        const cleanData = { ...data, id };

        const results = await Promise.allSettled([
            this.writeBookingToSupabase(cleanData),
            this.writeBookingToMySQL(cleanData)
        ]);

        if (results.every(r => r.status === 'rejected')) {
            throw new Error('Failed to save booking to both Supabase and MySQL');
        }

        if (results[0].status === 'rejected') console.error('Supabase write failed:', results[0].reason);
        if (results[1].status === 'rejected') console.error('MySQL write failed:', results[1].reason);

        return cleanData;
    }

    private async writeBookingToSupabase(data: BookingData) {
        const { error } = await supabaseAdmin.from('bookings').insert(data);
        if (error) throw error;
    }

    private async writeBookingToMySQL(data: BookingData) {
        if (!mysqlPool) return;
        await executeQuery(
            `INSERT INTO bookings (id, user_id, name, email, topic, date, time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.id, data.user_id || null, data.name, data.email, data.topic, data.date, data.time, data.status, data.notes || null]
        );
    }
}

export const db = new UnifiedDatabaseAdapter();
