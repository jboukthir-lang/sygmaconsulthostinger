// Edge Function لإرسال إشعارات البريد الإلكتروني عند الحجز
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface BookingEmailData {
  bookingId: string
  customerName: string
  customerEmail: string
  date: string
  time: string
  topic: string
  duration: number
  appointmentType: string
  specialization?: string
  isOnline: boolean
  meetingLink?: string
  location?: string
  consultantName?: string
  price?: number
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get booking data from request
    const { bookingId } = await req.json()

    // Fetch booking details from database
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (bookingError) {
      throw new Error(`Error fetching booking: ${bookingError.message}`)
    }

    // Get admin email from settings
    const { data: adminEmailSetting } = await supabase
      .from('site_settings')
      .select('value_text')
      .eq('key', 'admin_email')
      .single()

    const adminEmail = adminEmailSetting?.value_text || 'admin@sygmaconsult.com'

    // Prepare email data
    const emailData: BookingEmailData = {
      bookingId: booking.id,
      customerName: booking.name,
      customerEmail: booking.email,
      date: booking.date,
      time: booking.time,
      topic: booking.topic,
      duration: booking.duration || 30,
      appointmentType: booking.appointment_type || 'consultation',
      specialization: booking.specialization,
      isOnline: booking.is_online !== false,
      meetingLink: booking.meeting_link,
      location: booking.location,
      consultantName: booking.consultant_name,
      price: booking.price,
    }

    // Send email to admin
    const adminEmailHTML = generateAdminEmailHTML(emailData)
    await sendEmail(
      adminEmail,
      'Nouvelle réservation / حجز جديد / New Booking',
      adminEmailHTML
    )

    // Send confirmation email to customer
    const customerEmailHTML = generateCustomerEmailHTML(emailData)
    await sendEmail(
      emailData.customerEmail,
      'Confirmation de votre réservation / تأكيد حجزك / Booking Confirmation',
      customerEmailHTML
    )

    return new Response(
      JSON.stringify({ success: true, message: 'Emails sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log('Email would be sent (RESEND_API_KEY not set):', { to, subject })
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Sygma Consult <noreply@sygmaconsult.com>',
      to: [to],
      subject: subject,
      html: html,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Failed to send email: ${error}`)
  }

  return await res.json()
}

function generateAdminEmailHTML(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html dir="ltr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle Réservation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #001F3F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 4px; }
        .label { font-weight: bold; color: #001F3F; }
        .value { margin-top: 5px; }
        .badge { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 12px; }
        .badge-online { background-color: #10b981; color: white; }
        .badge-onsite { background-color: #f59e0b; color: white; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Nouvelle Réservation</h1>
          <p>حجز جديد • New Booking</p>
        </div>
        <div class="content">
          <div class="info-row">
            <div class="label">👤 Client / العميل / Customer</div>
            <div class="value">${data.customerName}</div>
          </div>

          <div class="info-row">
            <div class="label">📧 Email / البريد الإلكتروني</div>
            <div class="value">${data.customerEmail}</div>
          </div>

          <div class="info-row">
            <div class="label">📅 Date / التاريخ</div>
            <div class="value">${new Date(data.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
          </div>

          <div class="info-row">
            <div class="label">🕐 Heure / الوقت / Time</div>
            <div class="value">${data.time}</div>
          </div>

          <div class="info-row">
            <div class="label">⏱️ Durée / المدة / Duration</div>
            <div class="value">${data.duration} minutes / دقيقة</div>
          </div>

          <div class="info-row">
            <div class="label">📋 Sujet / الموضوع / Topic</div>
            <div class="value">${data.topic}</div>
          </div>

          ${data.specialization ? `
          <div class="info-row">
            <div class="label">🎯 Spécialisation / التخصص / Specialization</div>
            <div class="value">${data.specialization}</div>
          </div>
          ` : ''}

          <div class="info-row">
            <div class="label">📍 Type de rendez-vous / نوع الموعد / Appointment Type</div>
            <div class="value">
              ${data.isOnline
                ? '<span class="badge badge-online">💻 En ligne / أونلاين / Online</span>'
                : '<span class="badge badge-onsite">🏢 Sur place / حضوري / On-site</span>'
              }
            </div>
          </div>

          ${data.isOnline && data.meetingLink ? `
          <div class="info-row">
            <div class="label">🔗 Lien de réunion / رابط الاجتماع / Meeting Link</div>
            <div class="value"><a href="${data.meetingLink}">${data.meetingLink}</a></div>
          </div>
          ` : ''}

          ${!data.isOnline && data.location ? `
          <div class="info-row">
            <div class="label">📍 Lieu / الموقع / Location</div>
            <div class="value">${data.location}</div>
          </div>
          ` : ''}

          ${data.consultantName ? `
          <div class="info-row">
            <div class="label">👨‍💼 Consultant / المستشار</div>
            <div class="value">${data.consultantName}</div>
          </div>
          ` : ''}

          ${data.price ? `
          <div class="info-row">
            <div class="label">💰 Prix / السعر / Price</div>
            <div class="value">${data.price}€</div>
          </div>
          ` : ''}

          <div class="footer">
            <p>Gérez cette réservation depuis votre <a href="${SUPABASE_URL}/admin/bookings">tableau de bord admin</a></p>
            <p style="margin-top: 10px;">Sygma Consult • Paris • Tunis</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCustomerEmailHTML(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html dir="ltr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de Réservation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #001F3F; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-icon { font-size: 48px; margin-bottom: 10px; }
        .info-row { margin: 15px 0; padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #001F3F; }
        .label { font-weight: bold; color: #001F3F; font-size: 14px; }
        .value { margin-top: 5px; font-size: 16px; }
        .badge { display: inline-block; padding: 8px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; }
        .badge-online { background-color: #10b981; color: white; }
        .badge-onsite { background-color: #f59e0b; color: white; }
        .button { display: inline-block; padding: 12px 30px; background-color: #D4AF37; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✅</div>
          <h1>Réservation Confirmée!</h1>
          <p>تم تأكيد الحجز • Booking Confirmed</p>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour <strong>${data.customerName}</strong>,<br>
            مرحباً • Hello<br><br>
            Nous avons bien reçu votre demande de réservation. Voici les détails :
          </p>

          <div class="info-row">
            <div class="label">📅 Date / التاريخ</div>
            <div class="value">${new Date(data.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
          </div>

          <div class="info-row">
            <div class="label">🕐 Heure / الوقت / Time</div>
            <div class="value">${data.time}</div>
          </div>

          <div class="info-row">
            <div class="label">⏱️ Durée / المدة / Duration</div>
            <div class="value">${data.duration} minutes / دقيقة</div>
          </div>

          <div class="info-row">
            <div class="label">📋 Sujet / الموضوع / Topic</div>
            <div class="value">${data.topic}</div>
          </div>

          <div class="info-row">
            <div class="label">📍 Type de rendez-vous / نوع الموعد</div>
            <div class="value">
              ${data.isOnline
                ? '<span class="badge badge-online">💻 En ligne / أونلاين / Online</span>'
                : '<span class="badge badge-onsite">🏢 Sur place / حضوري / On-site</span>'
              }
            </div>
          </div>

          ${data.isOnline && data.meetingLink ? `
          <div class="info-row">
            <div class="label">🔗 Lien de réunion / رابط الاجتماع</div>
            <div class="value">
              <a href="${data.meetingLink}" class="button">Rejoindre la réunion / انضم للاجتماع</a>
            </div>
          </div>
          ` : ''}

          ${!data.isOnline && data.location ? `
          <div class="info-row">
            <div class="label">📍 Lieu / الموقع / Location</div>
            <div class="value">${data.location}</div>
          </div>
          ` : ''}

          <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>ℹ️ Important:</strong><br>
            Notre équipe examinera votre demande et vous contactera sous peu pour confirmer le rendez-vous final.<br>
            <br>
            سيقوم فريقنا بمراجعة طلبك وسيتصل بك قريباً لتأكيد الموعد النهائي.<br>
            <br>
            Our team will review your request and contact you shortly to confirm the final appointment.
          </p>

          <div class="footer">
            <p><strong>Sygma Consult</strong></p>
            <p>Paris • Tunis</p>
            <p>Email: contact@sygmaconsult.com</p>
            <p style="margin-top: 15px;">
              Des questions? Contactez-nous!<br>
              هل لديك أسئلة؟ اتصل بنا<br>
              Questions? Contact us!
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
