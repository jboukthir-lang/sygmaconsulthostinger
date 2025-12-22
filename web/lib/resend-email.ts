import { resend, EMAIL_FROM } from './resend';
import type { Booking, Contact } from './supabase';
import { 
  bookingConfirmationEmail, 
  bookingNotificationEmail, 
  contactNotificationEmail, 
  contactAutoReplyEmail 
} from './email-templates';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sygma-consult.com';

// Send booking confirmation email to client
export const sendBookingConfirmation = async (booking: Booking) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured. Emails will not be sent.');
    return null;
  }

  try {
    const emailTemplate = bookingConfirmationEmail(booking);

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: booking.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Failed to send booking confirmation email:', error);
      throw error;
    }

    console.log('Booking confirmation email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw error;
  }
};

// Send booking notification to admin
export const sendBookingNotification = async (booking: Booking) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured. Emails will not be sent.');
    return null;
  }

  try {
    const emailTemplate = bookingNotificationEmail(booking);

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Failed to send booking notification email:', error);
      throw error;
    }

    console.log('Booking notification email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send booking notification email:', error);
    throw error;
  }
};

// Send contact notification to admin
export const sendContactNotification = async (contact: Contact) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured. Emails will not be sent.');
    return null;
  }

  try {
    const emailTemplate = contactNotificationEmail(contact);

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Failed to send contact notification email:', error);
      throw error;
    }

    console.log('Contact notification email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
    throw error;
  }
};

// Send auto-reply to client after contact
export const sendContactAutoReply = async (contact: Contact) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured. Emails will not be sent.');
    return null;
  }

  try {
    const emailTemplate = contactAutoReplyEmail(contact);

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: contact.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Failed to send contact auto-reply email:', error);
      throw error;
    }

    console.log('Contact auto-reply email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send contact auto-reply email:', error);
    throw error;
  }
};
