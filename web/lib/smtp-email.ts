import nodemailer from 'nodemailer';
import type { Booking, Contact } from './supabase';
import {
  bookingConfirmationEmail,
  bookingNotificationEmail,
  contactNotificationEmail,
  contactAutoReplyEmail,
  generalNotificationEmail
} from './email-templates';

// Helper to get SMTP config from env or DB
const getSMTPConfig = async () => {
  const config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_USER,
    adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER
  };

  // If any critical part is missing, try fetching from database
  if (!config.host || !config.port || !config.user || !config.pass) {
    try {
      const { supabase } = await import('./supabase');
      const { data } = await supabase.from('site_settings').select('key, value');

      if (data) {
        data.forEach(setting => {
          if (setting.value && setting.value !== 'REPLACE_ME') {
            if (setting.key === 'SMTP_HOST') config.host = setting.value;
            if (setting.key === 'SMTP_PORT') config.port = setting.value;
            if (setting.key === 'SMTP_USER') {
              config.user = setting.value;
              config.from = setting.value;
            }
            if (setting.key === 'SMTP_PASSWORD') config.pass = setting.value;
            if (setting.key === 'ADMIN_EMAIL') config.adminEmail = setting.value;
          }
        });
      }
    } catch (e) {
      console.error('Failed to load SMTP config from DB fallback');
    }
  }

  return config;
};

// Create reusable transporter
const createTransporter = async () => {
  const config = await getSMTPConfig();

  if (!config.host || !config.port || !config.user || !config.pass) {
    console.warn('SMTP not configured. Emails will not be sent.');
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: parseInt(config.port),
    secure: parseInt(config.port) === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return { transporter, config };
};

// Send general notification email
export const sendGeneralNotification = async (
  email: string,
  title: string,
  message: string,
  link?: string | null,
  subject?: string,
  attachments?: any[]
) => {
  const transportData = await createTransporter();
  if (!transportData) {
    console.log('SMTP not configured, skipping general notification email');
    return null;
  }

  const { transporter, config } = transportData;

  try {
    const emailTemplate = generalNotificationEmail(title, message, link, subject);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${config.from}>`,
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

// Send booking confirmation email to client
export const sendBookingConfirmation = async (booking: Booking) => {
  const transportData = await createTransporter();
  if (!transportData) {
    console.log('SMTP not configured, skipping booking confirmation email');
    return null;
  }

  const { transporter, config } = transportData;

  try {
    const emailTemplate = bookingConfirmationEmail(booking);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${config.from}>`,
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
  const transportData = await createTransporter();
  if (!transportData) {
    console.log('SMTP not configured, skipping booking notification email');
    return null;
  }

  const { transporter, config } = transportData;

  try {
    const emailTemplate = bookingNotificationEmail(booking);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${config.from}>`,
      to: config.adminEmail,
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
  const transportData = await createTransporter();
  if (!transportData) {
    console.log('SMTP not configured, skipping contact notification email');
    return null;
  }

  const { transporter, config } = transportData;

  try {
    const emailTemplate = contactNotificationEmail(contact);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${config.from}>`,
      to: config.adminEmail,
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
  const transportData = await createTransporter();
  if (!transportData) {
    console.log('SMTP not configured, skipping contact auto-reply email');
    return null;
  }

  const { transporter, config } = transportData;

  try {
    const emailTemplate = contactAutoReplyEmail(contact);

    const info = await transporter.sendMail({
      from: `"Sygma Consult" <${config.from}>`,
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
