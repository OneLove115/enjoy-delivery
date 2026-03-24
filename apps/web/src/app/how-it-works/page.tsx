'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const steps = [
  { num: '01', icon: '📍', title: 'Set your location', text: 'Share your address or let us detect it. We show you the best restaurants within range.' },
  { num: '02', icon: '🍽️', title: 'Pick your meal', text: 'Browse curated menus with AI-powered photos. Filter by cuisine, dietary needs, or delivery time.' },
  { num: '03', icon: '🛒', title: 'Place your order', text: 'Add items to cart, choose delivery or pickup, and pay securely in seconds.' },
  { num: '04', icon: '📡', title: 'Track live', text: 'Watch your order get prepared and follow your rider\'s journey in real time on the map.' },
  { num: '05', icon: '👑', title: 'Enjoy royally', text: 'Your food arrives fresh, hot, and in the iconic EnJoy purple bag. Every time.' },
];

const faqs = [
  { q: 'How long does delivery take?', a: 'Most orders arrive in 15–40 minutes depending on the restaurant and your location.' },
  { q: 'Is there a minimum order?', a: 'Minimum orders vary by restaurant, typically €8–€20. Free delivery above a certain amount.' },
  { q: 'Can I schedule orders in advance?', a: 'Yes — schedule up to 7 days ahead. Perfect for lunch meetings and events.' },
  { q: 'What if something is wrong with my order?', a: 'Contact us via the app and we\'ll make it right immediately. No questions asked.' },
];

export default function HowItWorksPage() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '40px 60px 60px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 56, fontWeight: 950, marginBottom: 20, letterSpacing: -2 }}>
            How <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EnJoy</span> works
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 60px', lineHeight: 1.6 }}>From craving to doorstep in under 40 minutes. Here&apos;s how we make it royal.</p>
        </motion.div>

        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', gap: 32, alignItems: 'flex-start', padding: '40px 0', borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', textAlign: 'left' }}>
              <div style={{ fontSize: 44, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', minWidth: 60 }}>{s.num}</div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: 16 }}>{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: 60 }}>
          <Link href="/discover" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '18px 48px', borderRadius: 14, fontSize: 18, fontWeight: 800, textDecoration: 'none' }}>
            Order now
          </Link>
        </motion.div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 60px 80px', background: 'rgba(90,49,244,0.03)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 900, marginBottom: 40 }}>Common questions</h2>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ padding: '24px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{f.q}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{f.a}</p>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/faq" style={{ color: PURPLE, fontWeight: 700, fontSize: 15 }}>View all FAQs →</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
