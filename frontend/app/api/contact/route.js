import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendContactEmail(payload) {
  const smtpHost = (process.env.SMTP_HOST || '').trim();
  const smtpPort = Number((process.env.SMTP_PORT || '587').trim());
  const smtpSecureRaw = (process.env.SMTP_SECURE || '').trim().toLowerCase();
  const smtpSecure = smtpSecureRaw === 'true' ? true : smtpSecureRaw === 'false' ? false : smtpPort === 465;
  const smtpUser = (process.env.SMTP_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || '').trim();
  const contactToEmail = (process.env.CONTACT_TO_EMAIL || '').trim();

  if (!smtpHost || !smtpUser || !smtpPass || !contactToEmail) {
    throw new Error('Mail config missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and CONTACT_TO_EMAIL.');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const senderName = `${payload.firstName} ${payload.lastName}`.trim();
  const subject = `Website Contact: ${payload.subject}`;
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(senderName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message).replace(/\n/g, '<br/>')}</p>
  `;

  await transporter.sendMail({
    from: `"${escapeHtml(senderName)}" <${smtpUser}>`,
    to: contactToEmail,
    replyTo: payload.email,
    subject,
    html,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const payload = {
      firstName: typeof body.firstName === 'string' ? body.firstName.trim() : '',
      lastName: typeof body.lastName === 'string' ? body.lastName.trim() : '',
      email: typeof body.email === 'string' ? body.email.trim() : '',
      subject: typeof body.subject === 'string' ? body.subject.trim() : '',
      message: typeof body.message === 'string' ? body.message.trim() : '',
    };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.subject || !payload.message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    await sendContactEmail(payload);
    return NextResponse.json({ ok: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact email error:', err);
    const message = err?.message || 'Unable to send email.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
