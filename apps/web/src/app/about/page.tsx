'use client';
import Link from 'next/link';

const S = { page: { background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' } as const, container: { maxWidth: 900, margin: '0 auto', padding: '120px 40px 60px' } as const, h1: { fontSize: 42, fontWeight: 900, marginBottom: 16, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const } as const, p: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 } as const, back: { display: 'inline-block', marginBottom: 32, color: '#5A31F4', fontWeight: 700, fontSize: 14 } as const };

export default function AboutPage() {
  return (
    <div style={S.page}><div style={S.container}>
      <Link href="/" style={S.back}>← Back to EnJoy</Link>
      <h1 style={S.h1}>About EnJoy</h1>
      <p style={{ ...S.p, fontSize: 20, marginBottom: 48 }}>We believe food is culture. Every dish tells a story. Every delivery is a celebration.</p>

      {/* Hero image */}
      <div style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 48, position: 'relative' }}>
        <img src="/food/couple-delivery.png" alt="EnJoy delivery experience" style={{ width: '100%', borderRadius: 24 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.8) 0%, transparent 50%)', borderRadius: 24 }} />
        <div style={{ position: 'absolute', bottom: 30, left: 30 }}>
          <p style={{ fontSize: 28, fontWeight: 900 }}>Royal Delivery. Zero Compromise.</p>
        </div>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>Our Mission</h2>
      <p style={S.p}>EnJoy was founded with a singular vision: to transform food delivery from a mundane transaction into a royal experience. We connect discerning foodies with the finest local kitchens, leveraging cutting-edge AI and a relentless commitment to quality.</p>

      <h2 style={{ fontSize: 28, fontWeight: 800, marginTop: 40, marginBottom: 20 }}>What Sets Us Apart</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 40 }}>
        {[
          { icon: '👑', title: 'Royal Standards', text: 'Every partner restaurant is hand-selected and vetted for excellence. No mediocre meals.' },
          { icon: '🤖', title: 'Joya AI Concierge', text: 'Our voice-powered AI recommends dishes, tracks orders, and learns your preferences over time.' },
          { icon: '📸', title: 'AI Food Photography', text: 'We generate stunning, ultra-realistic images of every dish so you see exactly what you will savor.' },
          { icon: '💜', title: 'The Purple Promise', text: 'Our iconic purple branded bag is a symbol of trust, speed, and the royal treatment you deserve.' },
        ].map((f, i) => (
          <div key={i} style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6 }}>{f.text}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 800, marginTop: 40, marginBottom: 20 }}>Our Numbers</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {[{ n: '1000+', l: 'Partner Restaurants' }, { n: '50K+', l: 'Happy Customers' }, { n: '4.8★', l: 'Average Rating' }, { n: '25min', l: 'Avg Delivery Time' }].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '24px 16px', background: 'rgba(90,49,244,0.04)', borderRadius: 16 }}>
            <p style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600 }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div></div>
  );
}
