'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const features = [
  { icon: '🏢', title: 'Team meal budgets', text: 'Set monthly allowances per employee. They order, you stay in control.' },
  { icon: '📊', title: 'Expense reporting', text: 'Auto-generated reports every month. Integrates with your accounting tools.' },
  { icon: '🤝', title: 'Catering for events', text: 'Office lunch, team celebration, board dinner — we handle it all at scale.' },
  { icon: '💳', title: 'One invoice', text: 'All team orders consolidated into a single monthly invoice. Easy for finance.' },
];

const logos = ['Google', 'Booking.com', 'Philips', 'ASML', 'ING'];

export default function BusinessPage() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '40px 60px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(90,49,244,0.1) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(90,49,244,0.12)', border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 24 }}>
            🏢 EnJoy for Business
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Feed your team.<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Impress your clients.</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)', marginBottom: 40, lineHeight: 1.6 }}>
            Corporate meal management, team allowances, and office catering — all in one royal platform.
          </p>
          <Link href="/contact" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
            Contact our business team
          </Link>
        </motion.div>
      </section>

      {/* Trusted by */}
      <section style={{ padding: '0 60px 60px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24 }}>Trusted by teams at</p>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {logos.map(l => (
            <span key={l} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18, fontWeight: 800 }}>{l}</span>
          ))}
        </div>
      </section>

      <section style={{ padding: '60px 60px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontSize: 15 }}>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px', textAlign: 'center', background: `linear-gradient(135deg, ${PURPLE}10, ${PINK}08)`, borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Ready to feed your team royally?</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 16 }}>Get set up in 24 hours. No minimum spend required.</p>
        <Link href="/contact" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
          Get started
        </Link>
      </section>
      <Footer />
    </div>
  );
}
