'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

function AnimatedBalance({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <span>
      €{display},00
    </span>
  );
}

export default function GiftCardPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemFocused, setRedeemFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes shimmerCard {
          0% { opacity: 0.4; transform: translateX(-100%) skewX(-15deg); }
          100% { opacity: 0; transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>
      <Nav />
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '100px 20px 80px', textAlign: 'center' }}>

        {/* Back */}
        <div style={{ textAlign: 'left', marginBottom: 32 }}>
          <Link
            href="/account"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Account
          </Link>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 72, marginBottom: 20, display: 'inline-block' }}
          >
            🎁
          </motion.div>
          <h1 style={{
            fontSize: 42, fontWeight: 900, marginBottom: 12, lineHeight: 1.15,
            background: `linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.65))`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Cadeaukaarten
          </h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              display: 'inline-block', padding: '6px 20px', borderRadius: 20,
              background: `linear-gradient(135deg,${ORANGE},${PINK})`,
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
              fontSize: 12, fontWeight: 900, color: '#fff', marginBottom: 20,
              letterSpacing: '1px', textTransform: 'uppercase',
              boxShadow: `0 4px 16px ${PINK}40`,
            }}
          >
            Coming soon
          </motion.div>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, maxWidth: 420, margin: '0 auto 48px' }}>
            Geef het cadeau van heerlijk eten. EnJoy cadeaukaarten — stuur ze in seconden naar iemand die je lief hebt.
          </p>
        </motion.div>

        {/* Visual gift card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginBottom: 52, display: 'flex', justifyContent: 'center' }}
        >
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            background: `linear-gradient(135deg, ${PURPLE}, ${PINK}, ${ORANGE})`,
            backgroundSize: '200% 200%',
            animation: 'gradientShift 4s ease infinite',
            padding: '40px 32px',
            boxShadow: `0 30px 80px ${PURPLE}50, 0 10px 30px ${PINK}30`,
            position: 'relative',
            width: '100%',
            maxWidth: 420,
          }}>
            {/* Shimmer sweep */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '40%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              animation: 'shimmerCard 3s ease-in-out 1s infinite',
              pointerEvents: 'none',
            }} />

            {/* Card top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', opacity: 0.95 }}>EnJoy</div>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                🎁
              </div>
            </div>

            {/* Balance */}
            <div style={{ textAlign: 'left', marginBottom: 28 }}>
              <div style={{ fontSize: 13, opacity: 0.7, fontWeight: 600, marginBottom: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Saldo</div>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>
                <AnimatedBalance target={25} />
              </div>
            </div>

            {/* Card code */}
            <div style={{
              background: 'rgba(0,0,0,0.20)',
              borderRadius: 12, padding: '12px 20px',
              fontSize: 14, letterSpacing: '3px', fontWeight: 700,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>ENJOY-XXXX-XXXX</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            </div>

            {/* Tagline */}
            <div style={{ marginTop: 16, fontSize: 13, opacity: 0.65, fontStyle: 'italic' }}>
              Voor heerlijk eten, altijd en overal
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40, textAlign: 'left' }}
        >
          {[
            { icon: '💸', title: 'Elk bedrag',   text: 'Van €5 tot €100, kies zelf', accent: PURPLE },
            { icon: '📲', title: 'Direct bezorgd', text: 'Stuur per e-mail in seconden', accent: PINK },
            { icon: '♾️', title: 'Nooit vervalt', text: 'Gebruik wanneer je wilt',     accent: ORANGE },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.07 }}
              style={{
                padding: '20px 18px', borderRadius: 18,
                background: 'var(--bg-card)',
                border: `1px solid rgba(255,255,255,0.06)`,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, marginBottom: 12,
                background: `${f.accent}18`, border: `1px solid ${f.accent}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.text}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Redeem code section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          style={{
            padding: '24px 24px', borderRadius: 20,
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 16,
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>Cadeaukaart verzilveren</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Voer je code in zodra cadeaukaarten beschikbaar zijn.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={redeemCode}
              onChange={e => setRedeemCode(e.target.value.toUpperCase())}
              onFocus={() => setRedeemFocused(true)}
              onBlur={() => setRedeemFocused(false)}
              placeholder="ENJOY-XXXX-XXXX"
              maxLength={18}
              disabled
              style={{
                flex: 1,
                padding: '13px 18px',
                borderRadius: 12,
                background: redeemFocused ? 'rgba(90,49,244,0.06)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${redeemFocused ? PURPLE : 'rgba(255,255,255,0.10)'}`,
                color: 'var(--text-muted)',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'Outfit, monospace',
                letterSpacing: '1px',
                boxShadow: redeemFocused ? `0 0 0 3px ${PURPLE}20` : 'none',
                transition: 'all 0.2s',
                cursor: 'not-allowed',
              }}
            />
            <button
              disabled
              style={{
                padding: '13px 22px', borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 800, fontSize: 14,
                cursor: 'not-allowed',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Verzilver
            </button>
          </div>
        </motion.div>

        {/* Notify form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            padding: '32px', borderRadius: 20,
            background: `linear-gradient(135deg, rgba(90,49,244,0.10), rgba(255,0,128,0.06))`,
            border: '1px solid rgba(90,49,244,0.20)',
            textAlign: 'left',
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '8px 0' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
                  style={{ fontSize: 48, marginBottom: 12 }}
                >
                  ✅
                </motion.div>
                <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Je staat op de lijst!</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>We sturen je een mail zodra cadeaukaarten beschikbaar zijn.</div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 6 }}>Wil je als eerste weten wanneer het live gaat?</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Laat je e-mailadres achter en we laten het je weten.</div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocusedField(true)}
                    onBlur={() => setFocusedField(false)}
                    required
                    placeholder="jouw@email.nl"
                    style={{
                      flex: 1, padding: '13px 18px', borderRadius: 12,
                      background: focusedField ? 'rgba(90,49,244,0.08)' : 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${focusedField ? PURPLE : 'rgba(255,255,255,0.10)'}`,
                      color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                      fontFamily: 'Outfit, sans-serif',
                      boxShadow: focusedField ? `0 0 0 3px ${PURPLE}20` : 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '13px 22px', borderRadius: 12,
                      background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                      border: 'none', color: '#fff',
                      fontWeight: 800, fontSize: 14,
                      cursor: 'pointer', flexShrink: 0,
                      fontFamily: 'Outfit, sans-serif',
                      boxShadow: `0 4px 16px ${PURPLE}35`,
                    }}
                  >
                    Meld aan
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
