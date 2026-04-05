'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

const promos = [
  { code: 'ROYAL10', discount: '10% korting', description: 'Je eerste 3 bestellingen', expires: '2026-03-31', color: PURPLE, active: true },
  { code: 'LUNCH50', discount: '€2,50 korting', description: 'Bestellingen 11:00–14:00', expires: '2026-04-30', color: ORANGE, active: true },
  { code: 'NEWCITY', discount: 'Gratis bezorging', description: 'Alle bestellingen deze week', expires: '2026-04-07', color: PINK, active: true },
  { code: 'FRIDAY20', discount: '20% korting', description: 'Elke vrijdag bestelling', expires: 'weekly', color: '#00BCD4', active: true },
];

const steps = [
  { num: '01', title: 'Kopieer de code', desc: 'Klik op een promotiecode om hem te kopiëren.' },
  { num: '02', title: 'Kies je maaltijd', desc: 'Blader door restaurants en voeg items toe aan je winkelwagen.' },
  { num: '03', title: 'Voer in bij afrekenen', desc: 'Plak de code in het promotieveld bij de kassa.' },
];

function parseDeadline(expires: string): Date | null {
  if (expires === 'weekly') return null;
  const d = new Date(expires);
  return isNaN(d.getTime()) ? null : d;
}

function useCountdown(target: Date | null) {
  const calc = useCallback(() => {
    if (!target) return null;
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    const s = Math.floor(diff / 1000);
    return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  }, [target]);

  const [time, setTime] = useState(calc);
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [target, calc]);
  return time;
}

function CountdownBadge({ expires }: { expires: string }) {
  const deadline = parseDeadline(expires);
  const time = useCountdown(deadline);

  if (!deadline) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: 'rgba(0,188,212,0.12)', border: '1px solid rgba(0,188,212,0.25)' }}>
        <span style={{ fontSize: 10, color: '#00BCD4', fontWeight: 700 }}>♾ ELKE VRIJDAG</span>
      </div>
    );
  }
  if (!time) return null;

  const parts = time.d > 0
    ? [{ v: time.d, l: 'd' }, { v: time.h, l: 'u' }, { v: time.m, l: 'm' }]
    : [{ v: time.h, l: 'u' }, { v: time.m, l: 'm' }, { v: time.s, l: 's' }];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Verloopt over</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {parts.map(({ v, l }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <span style={{ fontWeight: 800, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{String(v).padStart(2, '0')}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{l}</span>
            {i < parts.length - 1 && <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 2 }}>:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PromoCard({ p, i, onCopy }: { p: typeof promos[number]; i: number; onCopy: (code: string) => void }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(p.code).catch(() => {});
    setCopied(true);
    onCopy(p.code);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ y: -6, boxShadow: `0 16px 48px ${p.color}28` }}
      style={{
        padding: '32px 28px', background: 'var(--bg-card)',
        borderRadius: 22,
        border: `1px solid ${p.color}35`,
        textAlign: 'left', position: 'relative', overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Glow orb */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `${p.color}15`, filter: 'blur(30px)', pointerEvents: 'none' }} />

      {/* Active badge */}
      {p.active && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 20,
          background: `${p.color}18`, border: `1px solid ${p.color}40`,
        }}>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }}
          />
          <span style={{ fontSize: 10, fontWeight: 800, color: p.color }}>ACTIEF</span>
        </div>
      )}

      {/* Code */}
      <div style={{ fontSize: 30, fontWeight: 950, color: p.color, marginBottom: 10, fontFamily: 'monospace', letterSpacing: 2 }}>
        {p.code}
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>{p.discount}</div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 20 }}>{p.description}</p>

      {/* Countdown */}
      <div style={{ marginBottom: 20 }}>
        <CountdownBadge expires={p.expires} />
      </div>

      {/* Dashed separator */}
      <div style={{ borderTop: `2px dashed ${p.color}25`, marginBottom: 20 }} />

      {/* Copy button */}
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%', padding: '12px 20px',
          background: copied ? `${p.color}20` : `${p.color}12`,
          border: `1px solid ${p.color}${copied ? '60' : '30'}`,
          borderRadius: 12,
          color: p.color, fontWeight: 800, fontSize: 14,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background 0.2s, border-color 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span key="check" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
              ✓ Gekopieerd!
            </motion.span>
          ) : (
            <motion.span key="copy" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}>
              📋 Kopieer code
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

export default function PromotionsPage() {
  const [lastCopied, setLastCopied] = useState<string | null>(null);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url(/marketing/promotions-deals.png) center/cover no-repeat',
          opacity: 0.1,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, transparent 0%, var(--bg-page) 75%)`,
        }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,40px) 48px' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '7px 18px', borderRadius: 40, marginBottom: 20,
                background: `linear-gradient(135deg, rgba(90,49,244,0.2), rgba(255,0,128,0.15))`,
                border: '1px solid rgba(255,0,128,0.3)',
              }}
            >
              <motion.span
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{ fontSize: 14 }}
              >
                🎁
              </motion.span>
              <span style={{ fontSize: 13, fontWeight: 700, color: PINK }}>{promos.filter(p => p.active).length} actieve aanbiedingen</span>
            </motion.div>

            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 58px)', fontWeight: 950, marginBottom: 16, letterSpacing: -2,
            }}>
              Royal{' '}
              <span style={{
                background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                deals
              </span>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 0' }}>
              Actieve promotiecodes en aanbiedingen. Pas toe bij het afrekenen.
            </p>
          </motion.div>
        </div>
      </div>

      <section style={{ padding: '0 clamp(16px,4vw,60px) clamp(40px,6vw,80px)', maxWidth: 960, margin: '0 auto' }}>

        {/* Promo cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 64 }}>
          {promos.map((p, i) => (
            <PromoCard key={p.code} p={p} i={i} onCopy={setLastCopied} />
          ))}
        </div>

        {/* How to use */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 56 }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 32, textAlign: 'center' }}>Hoe gebruik je een code?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{
                  padding: '28px 24px', borderRadius: 18,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  fontSize: 48, fontWeight: 950, opacity: 0.06,
                  color: PURPLE, fontFamily: 'monospace',
                }}>
                  {step.num}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, color: '#fff',
                  marginBottom: 16,
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          {lastCopied && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: PINK, fontWeight: 700, fontSize: 14, marginBottom: 16 }}
            >
              ✓ Code &ldquo;{lastCopied}&rdquo; staat klaar in je klembord
            </motion.p>
          )}
          <Link href="/discover" style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
            color: '#fff', padding: '18px 48px',
            borderRadius: 16, fontSize: 17, fontWeight: 800,
            textDecoration: 'none', letterSpacing: -0.3,
          }}>
            Bestel met korting →
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
