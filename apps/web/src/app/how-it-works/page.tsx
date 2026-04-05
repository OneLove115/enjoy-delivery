'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

const steps = [
  { num: '01', icon: '📍', title: 'Set your location', text: 'Share your address or let us detect it. We show you the best restaurants within range.' },
  { num: '02', icon: '🍽️', title: 'Pick your meal', text: 'Browse curated menus with AI-powered photos. Filter by cuisine, dietary needs, or delivery time.' },
  { num: '03', icon: '🛒', title: 'Place your order', text: 'Add items to cart, choose delivery or pickup, and pay securely in seconds.' },
  { num: '04', icon: '📡', title: 'Track live', text: "Watch your order get prepared and follow your rider's journey in real time on the map." },
  { num: '05', icon: '👑', title: 'Enjoy royally', text: 'Your food arrives fresh, hot, and in the iconic EnJoy purple bag. Every time.' },
];

const faqs = [
  { q: 'How long does delivery take?', a: 'Most orders arrive in 15–40 minutes depending on the restaurant and your location.' },
  { q: 'Is there a minimum order?', a: 'Minimum orders vary by restaurant, typically €8–€20. Free delivery above a certain amount.' },
  { q: 'Can I schedule orders in advance?', a: 'Yes — schedule up to 7 days ahead. Perfect for lunch meetings and events.' },
  { q: 'What if something is wrong with my order?', a: "Contact us via the app and we'll make it right immediately. No questions asked." },
];

const sectionStats = [
  { value: '2,400+', label: 'Restaurants', accent: PURPLE },
  { value: '1.2M',   label: 'Orders served', accent: PINK },
  { value: '< 40m',  label: 'Avg. delivery', accent: ORANGE },
  { value: '4.9★',   label: 'App rating', accent: PURPLE },
];

const stepAccents = [PURPLE, PINK, ORANGE, PURPLE, PINK];

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to order food with EnJoy',
  description: 'From craving to doorstep in under 40 minutes.',
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.text,
  })),
};

const howItWorksFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/* ─── FAQ accordion item ─── */
function FaqItem({ f, i }: { f: { q: string; a: string }; i: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07 }}
      style={{
        borderRadius: 16, overflow: 'hidden',
        background: 'var(--bg-card)',
        border: `1px solid ${open ? PURPLE + '40' : 'var(--border)'}`,
        transition: 'border-color 0.25s',
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 28px', background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-primary)', textAlign: 'left', gap: 16,
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 800 }}>{f.q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
            background: open ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'white', lineHeight: 1,
          }}
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 28px 22px', color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.65 }}>
              {f.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Step card ─── */
function StepCard({ s, i, isLast }: { s: typeof steps[0]; i: number; isLast: boolean }) {
  const accent = stepAccents[i];
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Connector line */}
      {!isLast && (
        <div style={{
          position: 'absolute', left: 36, top: '100%', width: 2, height: 32,
          background: `linear-gradient(180deg, ${accent}60, ${stepAccents[i + 1]}30)`,
          zIndex: 0,
        }} />
      )}

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.12, type: 'spring', stiffness: 160, damping: 20 }}
        whileHover={{ x: 6, y: -2 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          display: 'flex', gap: 28, alignItems: 'flex-start',
          padding: '28px 28px', borderRadius: 20,
          background: hovered ? `linear-gradient(135deg, ${accent}10, rgba(0,0,0,0))` : 'var(--bg-card)',
          border: `1px solid ${hovered ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: hovered ? `0 8px 32px ${accent}20` : 'none',
          transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
          cursor: 'default', position: 'relative', zIndex: 1,
        }}
      >
        {/* Gradient circle number */}
        <div style={{
          flexShrink: 0, width: 56, height: 56, borderRadius: '50%',
          background: `linear-gradient(135deg, ${accent}, ${accent}80)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 950, color: 'white',
          boxShadow: hovered ? `0 4px 16px ${accent}50` : `0 2px 8px ${accent}30`,
          transition: 'box-shadow 0.25s',
        }}>
          {s.num}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 15, margin: 0 }}>{s.text}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksFaqSchema) }} />
      <Nav />

      {/* ─── Hero ─── */}
      <section style={{ position: 'relative', padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', textAlign: 'center', overflow: 'hidden', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/marketing/how-it-works-hero.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, var(--bg-page) 100%)' }} />
        {/* Grain */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(ellipse at 50% 60%, rgba(90,49,244,0.15) 0%, transparent 65%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ position: 'relative', zIndex: 4 }}
        >
          <h1 style={{ fontSize: 'clamp(28px,6vw,56px)', fontWeight: 950, marginBottom: 20, letterSpacing: -2 }}>
            How <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EnJoy</span> works
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            From craving to doorstep in under 40 minutes. Here&apos;s how we make it royal.
          </p>
        </motion.div>
      </section>

      {/* ─── Steps ─── */}
      <section style={{ padding: 'clamp(32px,5vw,72px) clamp(16px,4vw,60px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map((s, i) => (
            <StepCard key={i} s={s} i={i} isLast={i === steps.length - 1} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 56, textAlign: 'center' }}
        >
          <motion.div whileHover={{ scale: 1.05, boxShadow: `0 14px 40px ${PURPLE}50` }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
            <Link
              href="/discover"
              style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '18px 48px', borderRadius: 14, fontSize: 18, fontWeight: 800, textDecoration: 'none', display: 'inline-block', boxShadow: `0 8px 28px ${PURPLE}40` }}
            >
              Order now →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Stats ─── */}
      <section style={{ padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.04)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <h2 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 950, letterSpacing: -1 }}>By the numbers</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, maxWidth: 860, margin: '0 auto' }}>
          {sectionStats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 18 }}
              whileHover={{ scale: 1.05, boxShadow: `0 8px 28px ${s.accent}25` }}
              style={{
                textAlign: 'center', padding: '32px 16px',
                background: 'var(--bg-card)', borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 950, background: `linear-gradient(135deg,${s.accent},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>
                {s.value}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 900, marginBottom: 44, letterSpacing: -0.5 }}
        >
          Common questions
        </motion.h2>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((f, i) => (
            <FaqItem key={i} f={f} i={i} />
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
