'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B00';

export default function GiftCardPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '100px 20px 80px', textAlign: 'center' }}>

        <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, marginBottom: 40, textDecoration: 'none' }}>
          ← Terug
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🎁</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 12, lineHeight: 1.15 }}>
            Cadeaukaarten
          </h1>
          <div style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: 20,
            background: `linear-gradient(135deg,${ORANGE},${PINK})`,
            fontSize: 13, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '0.5px',
          }}>
            Coming soon
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, maxWidth: 420, margin: '0 auto 48px' }}>
            Geef het cadeau van heerlijk eten. EnJoy cadeaukaarten — stuur ze in seconden naar iemand die je lief hebt.
          </p>
        </motion.div>

        {/* Preview card */}
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
          style={{
            borderRadius: 24, overflow: 'hidden', marginBottom: 48,
            background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
            padding: '40px 32px',
            boxShadow: '0 24px 60px rgba(90,49,244,0.4)',
            position: 'relative',
          }}>
          <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 11, fontWeight: 900, opacity: 0.6, letterSpacing: 1 }}>EnJoy</div>
          <div style={{ fontSize: 42, marginBottom: 16 }}>🎁</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>€25,00</div>
          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 24 }}>Voor heerlijk eten, altijd en overal</div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 20px', fontSize: 13, letterSpacing: 2, fontWeight: 700 }}>
            ENJOY-XXXX-XXXX
          </div>
        </motion.div>

        {/* What to expect */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 48, textAlign: 'left' }}>
          {[
            { icon: '💸', title: 'Elk bedrag', text: 'Van €5 tot €100, kies zelf het bedrag' },
            { icon: '📲', title: 'Direct bezorgd', text: 'Stuur per e-mail of deel de code' },
            { icon: '♾️', title: 'Nooit vervalt', text: 'Gebruik wanneer je wilt, geen deadline' },
          ].map((f, i) => (
            <div key={i} style={{ padding: '18px 16px', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.text}</div>
            </div>
          ))}
        </motion.div>

        {/* Notify form */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ padding: '32px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {submitted ? (
            <div>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Je staat op de lijst!</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>We sturen je een mail zodra cadeaukaarten beschikbaar zijn.</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>Wil je als eerste weten wanneer het live gaat?</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Laat je e-mailadres achter en we laten het je weten.</div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="jouw@email.nl"
                  style={{ flex: 1, padding: '13px 18px', borderRadius: 12, background: '#1a1a2e', border: '1px solid var(--border-strong)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                <button type="submit"
                  style={{ padding: '13px 22px', borderRadius: 12, background: `linear-gradient(135deg,${PURPLE},${PINK})`, border: 'none', color: 'var(--text-primary)', fontWeight: 800, fontSize: 14, cursor: 'pointer', flexShrink: 0 }}>
                  Meld aan
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
