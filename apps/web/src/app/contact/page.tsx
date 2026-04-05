'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

const contactMethods = [
  {
    icon: '📧',
    title: 'Email',
    info: 'hello@enjoy.delivery',
    desc: 'We reageren binnen 24 uur',
    color: PURPLE,
    href: 'mailto:hello@enjoy.delivery',
  },
  {
    icon: '📞',
    title: 'Telefoon',
    info: '+31 (0) 70 123 4567',
    desc: 'Ma–Vr, 09:00–18:00',
    color: PINK,
    href: 'tel:+31701234567',
  },
  {
    icon: '💬',
    title: 'Live Chat',
    info: 'Chat met Joya AI',
    desc: '24/7 direct antwoord',
    color: ORANGE,
    href: '/help',
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 900);
  }

  const inputStyle = (name: string): React.CSSProperties => ({
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${focusedField === name ? `rgba(90,49,244,0.6)` : 'rgba(255,255,255,0.08)'}`,
    boxShadow: focusedField === name ? `0 0 0 3px rgba(90,49,244,0.12)` : 'none',
    borderRadius: 12,
    color: 'var(--text-primary)',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url(/marketing/contact-support.png) center/cover no-repeat',
          opacity: 0.12,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, transparent 0%, var(--bg-page) 80%)`,
        }} />
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: '60px clamp(16px,4vw,40px) 48px' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 40, marginBottom: 20,
                background: `linear-gradient(135deg, rgba(90,49,244,0.2), rgba(255,0,128,0.1))`,
                border: `1px solid rgba(90,49,244,0.35)`,
              }}
            >
              <span style={{ fontSize: 13 }}>📬</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE }}>We horen graag van je</span>
            </motion.div>
            <h1 style={{
              fontSize: 'clamp(30px, 6vw, 48px)', fontWeight: 900, marginBottom: 16, letterSpacing: -1,
              background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Contact opnemen
            </h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 17, maxWidth: 560, marginBottom: 0 }}>
              Vragen over bestellingen, partnerships, media of iets anders — ons team staat voor je klaar.
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) clamp(40px,6vw,80px)' }}>

        {/* Contact method cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}
        >
          {contactMethods.map((c, i) => (
            <motion.a
              key={i}
              href={c.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{ y: -4, boxShadow: `0 12px 40px ${c.color}25` }}
              style={{
                textAlign: 'center', padding: '28px 16px',
                background: 'var(--bg-card)', borderRadius: 20,
                border: `1px solid ${c.color}25`,
                textDecoration: 'none', color: 'inherit',
                display: 'block', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${c.color}60`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${c.color}25`; }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.35 }}
                style={{ fontSize: 32, marginBottom: 12 }}
              >
                {c.icon}
              </motion.div>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, color: c.color }}>{c.title}</h3>
              <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{c.info}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.desc}</p>
            </motion.a>
          ))}
        </motion.div>

        {/* Office address */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '20px 24px', borderRadius: 16, marginBottom: 40,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ fontSize: 28, flexShrink: 0 }}>📍</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>Ons kantoor</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>EnJoy B.V., Spui 70, 2511 BT Den Haag, The Netherlands</div>
          </div>
        </motion.div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
              style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(90,49,244,0.06)', borderRadius: 24, border: '1px solid rgba(90,49,244,0.2)' }}
            >
              <motion.svg
                width="72" height="72" viewBox="0 0 72 72" fill="none"
                style={{ marginBottom: 24 }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              >
                <motion.circle
                  cx="36" cy="36" r="32"
                  stroke={PURPLE} strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.path
                  d="M22 36l10 10 18-18"
                  stroke={PINK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                />
              </motion.svg>
              <p style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>Bericht verstuurd!</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                We reageren binnen 24 uur. Je kunt ook direct chatten met Joya voor snelle hulp.
              </p>
              <Link href="/help" style={{ display: 'inline-block', padding: '13px 28px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, borderRadius: 40, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
                💬 Chat met Joya
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 0.55 }}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Name + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Naam</label>
                  <input
                    placeholder="Je naam"
                    required
                    style={inputStyle('name')}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>E-mailadres</label>
                  <input
                    placeholder="jouw@email.nl"
                    type="email"
                    required
                    style={inputStyle('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Topic */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Onderwerp</label>
                <select
                  style={{ ...inputStyle('topic'), color: 'var(--text-secondary)' }}
                  onFocus={() => setFocusedField('topic')}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="">Selecteer een onderwerp</option>
                  <option value="order">Bestellingsprobleem</option>
                  <option value="partner">Partner aanvraag</option>
                  <option value="media">Media & Pers</option>
                  <option value="careers">Vacatures</option>
                  <option value="other">Anders</option>
                </select>
              </div>

              {/* Message */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Bericht</label>
                <textarea
                  placeholder="Vertel ons waar we je mee kunnen helpen..."
                  rows={5}
                  required
                  style={{ ...inputStyle('message'), resize: 'vertical' }}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              <motion.button
                type="submit"
                data-track="contact-submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '16px 36px',
                  background: submitting
                    ? 'rgba(90,49,244,0.4)'
                    : `linear-gradient(135deg,${PURPLE},${PINK})`,
                  border: 'none', borderRadius: 40,
                  color: '#fff', fontWeight: 800, fontSize: 16,
                  cursor: submitting ? 'wait' : 'pointer',
                  width: '100%', maxWidth: 320, fontFamily: 'inherit',
                  transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                {submitting ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      style={{ display: 'inline-block', fontSize: 16 }}
                    >
                      ⟳
                    </motion.span>
                    Verzenden...
                  </>
                ) : (
                  'Stuur bericht'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
