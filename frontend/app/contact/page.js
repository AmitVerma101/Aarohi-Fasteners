'use client';

import { useState } from 'react';
import { sendContactMessage } from '@/lib/api';
import Breadcrumb from '@/components/Breadcrumb';
import CopyButton from '@/components/CopyButton';

export default function ContactPage() {
  const officeEmail = 'Sales@afsind.com';
  const officePhone = '+91 74949 29226';
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setSending(true);

    try {
      await sendContactMessage(form);
      setStatus({ type: 'success', text: 'Message sent! We will contact you shortly.' });
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to send message.' });
    } finally {
      setSending(false);
    }
  };

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };


  return (
    <section className="contact-page">
      <Breadcrumb items={[{ label: 'Contact' }]} />
      <div className="contact-wrap">
        <div className="fade-in">
          <p className="section-tag">Get in touch</p>
          <h2 className="section-title">We&apos;d love to<br />hear from you.</h2>
          <p className="contact-info-text">
            Have a question about a product, bulk orders, or just want to say hello? We read every message and reply within 24 hours.
          </p>
          <div className="contact-detail">
            <div className="contact-detail-item">📍 <a href="https://maps.google.com/?q=Plot+No.+20A,+IDC+Hisar+Road,+Rohtak,+124001" target="_blank" rel="noreferrer">Plot No. 20A, IDC Hisar Road, Rohtak, 124001</a></div>
            <div className="contact-detail-item">
              ✉️
              <span className="contact-action-row">
                <a href={`mailto:${officeEmail}`}>{officeEmail}</a>
                <CopyButton value={officeEmail} />
              </span>
            </div>
            <div className="contact-detail-item">
              📞
              <span className="contact-action-row">
                <a href="tel:+917494929226">{officePhone}</a>
                <CopyButton value={officePhone} />
              </span>
            </div>
          </div>
        </div>

        <div className="fade-in">
          <form className="contact-form" onSubmit={submitForm}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="First Name" value={form.firstName} onChange={onChange('firstName')} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Last Name" value={form.lastName} onChange={onChange('lastName')} />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={onChange('email')} />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" placeholder="Enter subject" value={form.subject} onChange={onChange('subject')} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="4" placeholder="Tell us how we can help…" value={form.message} onChange={onChange('message')} />
            </div>
            <button className="btn-submit" type="submit" disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'}
            </button>
            <div
              className="form-success"
              style={{ display: status.text ? 'block' : 'none', color: status.type === 'error' ? 'crimson' : '' }}
            >
              {status.type === 'success' ? '✓ ' : ''}
              {status.text}
            </div>
          </form>
        </div>
      </div>

      <div className="contact-map-wrap fade-in">
        <h3>Visit Our Office</h3>
        <p>Plot No. 20A, IDC Hisar Road, Rohtak, 124001</p>
        <div className="contact-map-frame">
          <iframe
            title="Office Location Map"
            src="https://www.google.com/maps?q=Plot+No.+20A,+IDC+Hisar+Road,+Rohtak,+124001&z=16&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
