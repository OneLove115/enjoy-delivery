'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

/* Demo data — replace with real API when auth is wired */
const DEMO_STAMPS = 7;
const STAMPS_FOR_REWARD = 10;
const HISTORY = [
  { date: '22 mrt',  restaurant: 'Royal Kitchen',  stamps: 1 },
  { date: '20 mrt',  restaurant: 'Sushi Palace',   stamps: 2 },
  { date: '18 mrt',  restaurant: 'Burger Empire',  stamps: 1 },
  { date: '15 mrt',  restaurant: 'Pizza Throne',   stamps: 1 },
  { date: '12 mrt',  restaurant: 'Pho Dynasty',    stamps: 1 },
  { date: '9 mrt',   restaurant: 'Dragon Wok',     stamps: 1 },
];

function StampCell({ index, earned }: { index: number; earned: boolean }) {
  const [justEarned] = useState(false);
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 220, damping: 18 }}
      style={{
        aspectRatio: '1',
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
        background: earned
          ? `linear-gradient(135deg,${PURPLE},${PINK})`
          : 'rgba(255,255,255,0.04)',
        border: earned
          ? 'none'
          : '1.5px dashed rgba(255,255,255,0.12)',
        boxShadow: earned
          ? justEarned
            ? `0 0 0 6px ${PURPLE}40, 0 4px 20px ${PINK}50`
            : `0 4px 16px rgba(90,49,244,0.45)`
          : 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {earned ? (
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.05 + 0.1, type: 'spring', stiffness: 260 }}
          style={{ fontSize: 18 }}
        >
          ⭐
        </motion.span>
      ) : (
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.15)', fontWeight: 700 }}>
          {index + 1}
        </span>
      )}
    </motion.div>
  );
}

function StampGrid({ earned, total }: { earned: number; total: number }) {
  const cols = Math.min(total, 5);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <StampCell key={i} index={i} earned={i < earned} />
      ))}
    </div>
  );
}

export default function StampCardPage() {
  const [stamps] = useState(DEMO_STAMPS);
  const progress = (stamps / STAMPS_FOR_REWARD) * 100;
  const remaining = STAMPS_FOR_REWARD - stamps;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 8px ${PURPLE}60; }
          50% { box-shadow: 0 0 20px ${PINK}80; }
        }
      `}</style>
      <Nav />
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* Back */}
        <Link
          href="/account"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, marginBottom: 24, textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Account
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 36, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px',
            background: `linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6))`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          Stempelkaart
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 36 }}
        >
          Spaar stempels en win gratis maaltijden!
        </motion.p>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            padding: '32px 28px', borderRadius: 24,
            background: `linear-gradient(135deg, rgba(90,49,244,0.18), rgba(255,0,128,0.10), rgba(255,107,53,0.07))`,
            backgroundSize: '200% 200%',
            animation: 'gradientShift 6s ease infinite',
            border: '1px solid rgba(90,49,244,0.28)',
            marginBottom: 24,
            boxShadow: '0 20px 60px rgba(90,49,244,0.18)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative orb */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: `radial-gradient(circle, ${PINK}20 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontWeight: 900, fontSize: 16 }}>Jouw voortgang</span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: 900, fontSize: 22, color: PINK }}>{stamps}</span>
              <span style={{ fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>/{STAMPS_FOR_REWARD}</span>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>stempels</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 10, borderRadius: 10, background: 'rgba(255,255,255,0.08)', marginBottom: 28, overflow: 'hidden', position: 'relative' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
              style={{
                height: '100%', borderRadius: 10,
                background: `linear-gradient(90deg,${PURPLE},${PINK})`,
                animation: 'progressGlow 2.5s ease-in-out infinite',
              }}
            />
          </div>

          {/* Stamp grid */}
          <StampGrid earned={stamps} total={STAMPS_FOR_REWARD} />

          {/* Reward teaser */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: 24, padding: '16px 20px', borderRadius: 16,
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.10)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 28 }}
            >
              🎁
            </motion.span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 3 }}>
                Nog <span style={{ color: PINK }}>{remaining}</span> stempel{remaining !== 1 ? 's' : ''} tot jouw gratis maaltijd!
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                Bestel voor €10 of meer om een stempel te verdienen
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress indicator to next reward */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{ marginBottom: 24, padding: '18px 22px', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Volgende beloning</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: PURPLE }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ height: '100%', borderRadius: 6, background: `linear-gradient(90deg,${PURPLE},${ORANGE})` }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>0 stempels</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Gratis maaltijd bij {STAMPS_FOR_REWARD}</span>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ padding: '24px 24px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 900, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.7)' }}>Hoe werkt het?</h2>
          {[
            { icon: '🛍️', title: 'Bestel', text: 'Bestel bij een deelnemend restaurant voor minimaal €10', accent: PURPLE },
            { icon: '⭐', title: 'Verdien', text: 'Ontvang 1 stempel per bestelling, 2x bij aanbiedingen', accent: PINK },
            { icon: '🎁', title: 'Win',    text: 'Verzamel 10 stempels en win een gratis maaltijd t/m €15', accent: ORANGE },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < 2 ? 18 : 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${step.accent}15`,
                border: `1px solid ${step.accent}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {step.icon}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4, color: step.accent }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.text}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* History */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.6)' }}>Recente activiteit</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HISTORY.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 + i * 0.06 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: 14,
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${PINK}15`, border: `1px solid ${PINK}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    ⭐
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{h.restaurant}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{h.date}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 800,
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  +{h.stamps} stempel{h.stamps > 1 ? 's' : ''}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ marginTop: 36, textAlign: 'center' }}
        >
          <Link
            href="/discover"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 40px', borderRadius: 50,
              background: `linear-gradient(135deg,${ORANGE},${PINK})`,
              color: '#fff', fontWeight: 900, fontSize: 16,
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(255,107,53,0.40)',
            }}
          >
            Bestel nu & verdien stempels
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
