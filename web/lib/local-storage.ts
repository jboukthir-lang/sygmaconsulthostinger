import { supabase } from './supabase';

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
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        ...message,
        status: 'new',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: data.status,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error saving message to Supabase:', error);
    throw new Error('Failed to save message to database');
  }
}

export async function getMessages() {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      status: row.status,
      createdAt: row.created_at
    })) as StoredMessage[];
  } catch (error) {
    console.error('Error fetching messages from Supabase:', error);
    return [];
  }
}

export async function updateMessageStatus(id: string, status: 'new' | 'read' | 'replied') {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { id: data.id, status: data.status };
  } catch (error) {
    console.error('Error updating message status in Supabase:', error);
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
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...booking,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return data as Booking;
  } catch (error) {
    console.error('Error saving booking to Supabase:', error);
    throw new Error('Failed to save booking to database');
  }
}

export async function updateBooking(id: string, updates: Partial<Booking>) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  } catch (error) {
    console.error('Error updating booking in Supabase:', error);
    throw new Error('Failed to update booking');
  }
}

export async function deleteBooking(id: string) {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting booking from Supabase:', error);
    throw new Error('Failed to delete booking');
  }
}

export async function getBookingById(id: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Booking;
  } catch (error) {
    console.error('Error getting booking by ID:', error);
    return null;
  }
}

export async function getBookings() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: false })
      .order('time', { ascending: false });

    if (error) throw error;
    return data as Booking[];
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
}
