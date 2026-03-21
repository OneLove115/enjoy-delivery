'use client';
import Link from 'next/link';

const S = { page: { background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' } as const, container: { maxWidth: 800, margin: '0 auto', padding: '120px 40px 60px' } as const, h1: { fontSize: 42, fontWeight: 900, marginBottom: 32, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const } as const, h2: { fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 16, color: '#fff' } as const, p: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 } as const, back: { display: 'inline-block', marginBottom: 32, color: '#5A31F4', fontWeight: 700, fontSize: 14 } as const };

const categories = [
  { icon: '📦', title: 'Orders & Delivery', items: ['Track your order', 'Missing or wrong items', 'Late delivery', 'Cancel an order', 'Reorder a previous meal'] },
  { icon: '💳', title: 'Payments & Billing', items: ['Payment methods', 'Refund status', 'Promo codes & vouchers', 'Invoice requests', 'Payment failed'] },
  { icon: '👤', title: 'Account & Settings', items: ['Create or delete account', 'Update profile', 'Change password', 'Notification preferences', 'Saved addresses'] },
  { icon: '🍽️', title: 'Restaurant Partners', items: ['Become a partner', 'Update your menu', 'AI photo generation', 'Partner dashboard', 'Commission & payouts'] },
];

export default function HelpCenterPage() {
  return (
    <div style={S.page}><div style={S.container}>
      <Link href="/" style={S.back}>← Back to EnJoy</Link>
      <h1 style={S.h1}>Help Center</h1>
      <p style={{ ...S.p, marginBottom: 40 }}>Need a hand? Find answers below or chat with Joya, our AI concierge, for instant help.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 48 }}>
        {categories.map((c, i) => (
          <div key={i} style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, color: '#fff' }}>{c.title}</h3>
            {c.items.map((item, j) => (
              <p key={j} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 8, cursor: 'pointer', paddingLeft: 12, borderLeft: '2px solid rgba(90,49,244,0.2)' }}>{item}</p>
            ))}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(90,49,244,0.06)', borderRadius: 20, border: '1px solid rgba(90,49,244,0.15)' }}>
        <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Still need help?</p>
        <p style={{ ...S.p, marginBottom: 20 }}>Our support team is available 24/7.</p>
        <Link href="/contact" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg,#5A31F4,#FF0080)', borderRadius: 40, color: 'white', fontWeight: 800, fontSize: 16 }}>Contact Support</Link>
      </div>
    </div></div>
  );
}
