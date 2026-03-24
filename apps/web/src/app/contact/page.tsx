'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const S = { page: { background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' } as const, container: { maxWidth: 800, margin: '0 auto', padding: '40px 40px 60px' } as const, h1: { fontSize: 42, fontWeight: 900, marginBottom: 16, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const } as const, p: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 } as const, back: { display: 'inline-block', marginBottom: 32, color: '#5A31F4', fontWeight: 700, fontSize: 14 } as const };

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div style={S.page}>
      <Nav />
      <div style={S.container}>
      <h1 style={S.h1}>Contact Us</h1>
      <p style={{ ...S.p, marginBottom: 40 }}>We&apos;d love to hear from you. Reach out for orders, partnerships, media inquiries, or anything else.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
        {[
          { icon: '📧', title: 'Email', info: 'hello@enjoy.delivery' },
          { icon: '📞', title: 'Phone', info: '+31 (0) 70 123 4567' },
          { icon: '📍', title: 'Office', info: 'Den Haag, The Netherlands' },
        ].map((c, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '28px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{c.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>{c.info}</p>
          </div>
        ))}
      </div>

      {sent ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(90,49,244,0.06)', borderRadius: 20 }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>✅</p>
          <p style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Message Sent!</p>
          <p style={S.p}>We&apos;ll get back to you within 24 hours. You can also chat with Joya for instant help.</p>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <input placeholder="Your Name" required style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
            <input placeholder="Email Address" type="email" required style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <select style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(255,255,255,0.5)', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}>
            <option value="">Select a topic</option>
            <option value="order">Order Issue</option>
            <option value="partner">Partnership Inquiry</option>
            <option value="media">Media & Press</option>
            <option value="careers">Careers</option>
            <option value="other">Other</option>
          </select>
          <textarea placeholder="Your message..." rows={5} required style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'white', fontSize: 15, outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
          <button type="submit" style={{ padding: '16px 36px', background: 'linear-gradient(135deg,#5A31F4,#FF0080)', border: 'none', borderRadius: 40, color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer', alignSelf: 'flex-start' }}>Send Message</button>
        </form>
      )}
    </div>
      <Footer />
    </div>
  );
}
