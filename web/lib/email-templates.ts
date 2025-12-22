import type { Booking, Contact } from './supabase';

// Booking Confirmation Email Template (to client)
export const bookingConfirmationEmail = (booking: Booking) => ({
  subject: 'Booking Confirmation - Sygma Consult',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #001F3F; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #001F3F; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
            <p>Your consultation has been scheduled</p>
          </div>
          <div class="content">
            <p>Dear ${booking.name},</p>
            <p>Thank you for booking a consultation with Sygma Consult. We're excited to help you achieve your business goals.</p>

            <div class="booking-details">
              <h3 style="color: #001F3F; margin-top: 0;">Consultation Details</h3>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${booking.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span>${booking.time} (CET)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Topic:</span>
                <span>${booking.topic}</span>
              </div>
              <div class="detail-row" ${booking.meet_link ? '' : 'style="border-bottom: none;"'}>
                <span class="detail-label">Email:</span>
                <span>${booking.email}</span>
              </div>
              ${booking.meet_link ? `
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Meeting Link:</span>
                <span><a href="${booking.meet_link}" style="color: #D4AF37;">Join Google Meet</a></span>
              </div>
              ` : ''}
            </div>

            <p><strong>What's Next?</strong></p>
            <ul>
              <li>You will receive a calendar invitation shortly</li>
              ${booking.meet_link ? '<li>Use the Google Meet link above to join your consultation</li>' : ''}
              <li>A reminder will be sent 24 hours before your consultation</li>
              <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
            </ul>

            <center>
              ${booking.meet_link ? `<a href="${booking.meet_link}" class="button">Join Google Meet</a>` : ''}
              <a href="https://sygmaconsult.com/contact" class="button">Contact Us</a>
            </center>

            <p>If you have any questions, please don't hesitate to reach out.</p>

            <p>Best regards,<br><strong>The Sygma Consult Team</strong></p>
          </div>
          <div class="footer">
            <p>Sygma Consult | Paris & Tunis</p>
            <p>+33 7 52 03 47 86 | contact@sygma-consult.com</p>
            <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `
});

// Booking Notification Email Template (to admin)
export const bookingNotificationEmail = (booking: Booking) => ({
  subject: `New Booking: ${booking.topic} - ${booking.date}`,
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
          .alert { background: #D4AF37; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
          .details { background: white; padding: 20px; border-radius: 8px; }
          .row { padding: 10px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #001F3F; display: inline-block; min-width: 100px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert">
            <h2 style="margin: 0;">🔔 New Booking Alert</h2>
          </div>
          <div class="details">
            <h3 style="color: #001F3F;">Booking Information</h3>
            <div class="row"><span class="label">Client:</span> ${booking.name}</div>
            <div class="row"><span class="label">Email:</span> ${booking.email}</div>
            <div class="row"><span class="label">Topic:</span> ${booking.topic}</div>
            <div class="row"><span class="label">Date:</span> ${booking.date}</div>
            <div class="row"><span class="label">Time:</span> ${booking.time}</div>
            <div class="row" style="border-bottom: none;"><span class="label">Status:</span> ${booking.status}</div>
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="https://supabase.com/dashboard" style="background: #001F3F; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Dashboard</a>
          </p>
        </div>
      </body>
    </html>
  `
});

// Contact Notification Email Template (to admin)
export const contactNotificationEmail = (contact: Contact) => ({
  subject: `New Contact: ${contact.subject}`,
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
          .alert { background: #D4AF37; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
          .details { background: white; padding: 20px; border-radius: 8px; }
          .message { background: #f8f9fa; padding: 15px; border-left: 4px solid #001F3F; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert">
            <h2 style="margin: 0;">📧 New Contact Message</h2>
          </div>
          <div class="details">
            <h3 style="color: #001F3F;">Contact Information</h3>
            <p><strong>From:</strong> ${contact.name} &lt;${contact.email}&gt;</p>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <div class="message">
              <strong>Message:</strong><br>
              ${contact.message}
            </div>
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="mailto:${contact.email}?subject=Re: ${contact.subject}" style="background: #001F3F; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Reply to ${contact.name}</a>
          </p>
        </div>
      </body>
    </html>
  `
});

// Auto-reply Email Template (to client after contact)
export const contactAutoReplyEmail = (contact: Contact) => ({
  subject: 'We received your message - Sygma Consult',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #001F3F; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Message Received</h1>
            <p>Thank you for contacting us!</p>
          </div>
          <div class="content">
            <p>Dear ${contact.name},</p>
            <p>Thank you for reaching out to Sygma Consult. We have received your message regarding "${contact.subject}".</p>
            <p>Our team will review your inquiry and get back to you within 24 hours.</p>
            <p>In the meantime, feel free to explore our services or book a consultation directly through our website.</p>
            <p>Best regards,<br><strong>The Sygma Consult Team</strong></p>
          </div>
          <div class="footer">
            <p>Sygma Consult | Paris & Tunis</p>
            <p>+33 7 52 03 47 86 | contact@sygma-consult.com</p>
          </div>
        </div>
      </body>
    </html>
  `
});
// General Notification Email Template (manual from admin)
export const generalNotificationEmail = (title: string, message: string, link?: string | null, subject?: string) => ({
  subject: subject || `${title} - Sygma Consult`,
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 0; background: #ffffff; }
          .header { background: #001F3F; color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; color: #D4AF37; }
          .header p { margin: 10px 0 0; font-size: 14px; color: #blue-200; letter-spacing: 1px; }
          .content { padding: 40px 30px; background: #ffffff; }
          .content h2 { color: #001F3F; font-size: 22px; margin-top: 0; border-bottom: 2px solid #D4AF37; display: inline-block; padding-bottom: 5px; }
          .message-box { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #001F3F; }
          .footer { text-align: center; padding: 30px; background: #f3f4f6; color: #666; font-size: 13px; }
          .button { display: inline-block; background: #001F3F; color: #ffffff !important; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 25px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .contact-info { margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sygma Consult</h1>
            <p>COMMUNICATION OFFICIELLE</p>
          </div>
          <div class="content">
            <h2>${title}</h2>
            <div class="message-box">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            ${link ? `
            <center>
              <a href="https://sygma-consult.com${link.startsWith('/') ? '' : '/'}${link}" class="button">Vérifier les détails</a>
            </center>
            ` : ''}
            
            <p style="margin-top: 30px;">Si vous avez des questions concernant cette notification, notre équipe reste à votre entière disposition.</p>
            <p>Sincèrement,<br><strong style="color: #001F3F;">Direction Sygma Consult</strong></p>
          </div>
          <div class="footer">
            <p><strong>Sygma Consult France & Tunisie</strong></p>
            <p>Expertise en Conseil & Stratégie d'Entreprise</p>
            <div class="contact-info">
              <p>Paris: +33 7 52 03 47 86 | Tunis: +216 50 123 456</p>
              <p>Email: contact@sygma-consult.com | Web: www.sygma-consult.com</p>
            </div>
            <p style="margin-top: 20px; font-size: 11px;">Cet e-mail est confidentiel et destiné uniquement à son destinataire.</p>
          </div>
        </div>
      </body>
    </html>
  `
});
