'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B00';

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

function StampGrid({ earned, total }: { earned: number; total: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(total, 5)}, 1fr)`, gap: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          style={{
            aspectRatio: '1',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            background: i < earned
              ? `linear-gradient(135deg,${PURPLE},${PINK})`
              : 'rgba(255,255,255,0.05)',
            border: i < earned
              ? 'none'
              : '1.5px dashed rgba(255,255,255,0.15)',
            boxShadow: i < earned ? '0 4px 16px rgba(90,49,244,0.4)' : 'none',
            transition: 'all 0.3s',
          }}>
          {i < earned ? '⭐' : ''}
        </motion.div>
      ))}
    </div>
  );
}

export default function StampCardPage() {
  const [stamps] = useState(DEMO_STAMPS);
  const progress = (stamps / STAMPS_FOR_REWARD) * 100;
  const remaining = STAMPS_FOR_REWARD - stamps;

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* Back */}
        <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: 700, marginBottom: 32, textDecoration: 'none' }}>
          ← Terug
        </Link>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 900, marginBottom: 6 }}>
          Stempelkaart 🎟️
        </motion.h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, marginBottom: 40 }}>
          Spaar stempels en win gratis maaltijden!
        </p>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            padding: '32px', borderRadius: 24,
            background: `linear-gradient(135deg, rgba(90,49,244,0.2), rgba(255,0,128,0.1))`,
            border: '1px solid rgba(90,49,244,0.3)',
            marginBottom: 28,
          }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 900, fontSize: 16 }}>Jouw voortgang</span>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              {stamps}/{STAMPS_FOR_REWARD} stempels
            </span>
          </div>
          <div style={{ height: 10, borderRadius: 10, background: 'rgba(255,255,255,0.1)', marginBottom: 28, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 10, background: `linear-gradient(90deg,${PURPLE},${PINK})` }}
            />
          </div>

          <StampGrid earned={stamps} total={STAMPS_FOR_REWARD} />

          <div style={{ marginTop: 24, padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28 }}>🎁</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 3 }}>
                Nog {remaining} stempel{remaining !== 1 ? 's' : ''} tot jouw gratis maaltijd!
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                Bestel voor €10 of meer om een stempel te verdienen
              </div>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ padding: '24px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>Hoe werkt het?</h2>
          {[
            { icon: '🛍️', title: 'Bestel', text: 'Bestel bij een deelnemend restaurant voor minimaal €10' },
            { icon: '⭐', title: 'Verdien',  text: 'Ontvang 1 stempel per bestelling, 2x bij aanbiedingen' },
            { icon: '🎁', title: 'Win',     text: 'Verzamel 10 stempels en win een gratis maaltijd t/m €15' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < 2 ? 18 : 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${PURPLE}22,${PINK}22)`, border: `1px solid ${PURPLE}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {step.icon}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{step.text}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* History */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 16 }}>Recente activiteit</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HISTORY.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>⭐</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{h.restaurant}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{h.date}</div>
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: PINK }}>+{h.stamps} stempel{h.stamps > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div style={{ marginTop: 36, textAlign: 'center' }}>
          <Link href="/discover"
            style={{ display: 'inline-block', padding: '16px 40px', borderRadius: 50, background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', fontWeight: 900, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,107,0,0.35)' }}>
            Bestel nu & verdien stempels →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
