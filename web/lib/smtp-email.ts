import nodemailer from 'nodemailer';
import type { Booking, Contact } from './supabase';
import {
  bookingConfirmationEmail,
  bookingNotificationEmail,
  contactNotificationEmail,
  contactAutoReplyEmail,
  generalNotificationEmail
} from './email-templates';

// Send general notification email
export const sendGeneralNotification = async (
  email: string,
  title: string,
  message: string,
  link?: string | null,
  subject?: string,
  attachments?: any[]
) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('SMTP not configured, skipping general notification email');
    return null;
  }

  try {
    const emailTemplate = generalNotificationEmail(title, message, link, subject);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${process.env.SMTP_USER}>`,
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      attachments: attachments
    });

    console.log('General notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send general notification email:', error);
    throw error;
  }
};


// Create reusable transporter
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn('SMTP not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

// Send booking confirmation email to client
export const sendBookingConfirmation = async (booking: Booking) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('SMTP not configured, skipping booking confirmation email');
    return null;
  }

  try {
    const emailTemplate = bookingConfirmationEmail(booking);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log('Booking confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw error;
  }
};

// Send booking notification to admin
export const sendBookingNotification = async (booking: Booking) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('SMTP not configured, skipping booking notification email');
    return null;
  }

  try {
    const emailTemplate = bookingNotificationEmail(booking);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log('Booking notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send booking notification email:', error);
    throw error;
  }
};

// Send contact notification to admin
export const sendContactNotification = async (contact: Contact) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('SMTP not configured, skipping contact notification email');
    return null;
  }

  try {
    const emailTemplate = contactNotificationEmail(contact);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log('Contact notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
    throw error;
  }
};

// Send auto-reply to client after contact
export const sendContactAutoReply = async (contact: Contact) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('SMTP not configured, skipping contact auto-reply email');
    return null;
  }

  try {
    const emailTemplate = contactAutoReplyEmail(contact);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${process.env.SMTP_USER}>`,
      to: contact.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log('Contact auto-reply email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send contact auto-reply email:', error);
    throw error;
  }
};
