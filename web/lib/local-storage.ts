import { query } from './db';
import { RowDataPacket } from 'mysql2';

// --- MESSAGES ---

export interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export async function saveMessage(message: Omit<StoredMessage, 'id' | 'createdAt' | 'status'>) {
  try {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const status = 'new';

    // Using 'contacts' table as per schema
    const sql = `
      INSERT INTO contacts (id, name, email, subject, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      id,
      message.name,
      message.email,
      message.subject,
      message.message,
      status,
      createdAt
    ]);

    return {
      id,
      ...message,
      status,
      createdAt: createdAt.toISOString()
    };
  } catch (error) {
    console.error('Error saving message to DB:', error);
    throw new Error('Failed to save message to database');
  }
}

export async function getMessages() {
  try {
    const sql = 'SELECT * FROM contacts ORDER BY created_at DESC';
    const rows = await query<RowDataPacket[]>(sql);

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      status: row.status,
      createdAt: row.created_at
    })) as StoredMessage[];
  } catch (error) {
    console.error('Error fetching messages from DB:', error);
    return [];
  }
}

export async function updateMessageStatus(id: string, status: 'new' | 'read' | 'replied') {
  try {
    const sql = 'UPDATE contacts SET status = ? WHERE id = ?';
    await query(sql, [status, id]);
    return { id, status };
  } catch (error) {
    console.error('Error updating message status in DB:', error);
    throw new Error('Failed to update message status');
  }
}

// --- BOOKINGS ---

export interface Booking {
  id: string;
  name: string;
  email: string;
  topic: string;
  date: string;
  time: string;
  user_id?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'free';
  duration: number;
  appointment_type: string;
  appointment_type_id?: string | null;
  specialization?: string;
  is_online: boolean;
  notes?: string;
  price: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'free';
  stripe_session_id?: string;
  stripe_payment_id?: string;
  calendar_event_id?: string;
  meet_link?: string;
  created_at?: string;
  updated_at?: string;
  internal_notes?: string;
  consultant_id?: string;
}

export async function saveBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const id = crypto.randomUUID();
    const now = new Date();

    const sql = `
      INSERT INTO bookings (
        id, name, email, topic, date, time, user_id, status, duration, 
        appointment_type, appointment_type_id, specialization, is_online, 
        notes, price, payment_status, created_at, updated_at,
        stripe_session_id, stripe_payment_id, calendar_event_id, meet_link, internal_notes, consultant_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id, booking.name, booking.email, booking.topic,
      booking.date, booking.time, booking.user_id, booking.status,
      booking.duration, booking.appointment_type, booking.appointment_type_id,
      booking.specialization, booking.is_online, booking.notes,
      booking.price, booking.payment_status, now, now,
      booking.stripe_session_id, booking.stripe_payment_id, booking.calendar_event_id,
      booking.meet_link, booking.internal_notes, booking.consultant_id
    ];

    await query(sql, values);

    return {
      id,
      ...booking,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    } as Booking;
  } catch (error) {
    console.error('Error saving booking to DB:', error);
    throw new Error('Failed to save booking to database');
  }
}

export async function updateBooking(id: string, updates: Partial<Booking>) {
  try {
    const keys = Object.keys(updates).filter(k => k !== 'id');
    if (keys.length === 0) return null;

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => (updates as any)[k]);

    // Add id to values
    values.push(id);

    const sql = `UPDATE bookings SET ${setClause}, updated_at = NOW() WHERE id = ?`;

    await query(sql, values);
    return { id, ...updates } as Booking;
  } catch (error) {
    console.error('Error updating booking in DB:', error);
    throw new Error('Failed to update booking locally');
  }
}

export async function deleteBooking(id: string) {
  try {
    const sql = 'DELETE FROM bookings WHERE id = ?';
    await query(sql, [id]);
    return true;
  } catch (error) {
    console.error('Error deleting booking from DB:', error);
    throw new Error('Failed to delete booking locally');
  }
}

export async function getBookingById(id: string) {
  try {
    const sql = 'SELECT * FROM bookings WHERE id = ?';
    const rows = await query<RowDataPacket[]>(sql, [id]);
    return (rows.length > 0 ? rows[0] : null) as Booking | null;
  } catch (error) {
    console.error('Error getting booking by ID:', error);
    return null;
  }
}

export async function getBookings() {
  try {
    const sql = 'SELECT * FROM bookings ORDER BY date DESC, time DESC';
    const rows = await query<RowDataPacket[]>(sql);
    return rows as Booking[];
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
}
