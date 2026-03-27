'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B00';
const GOLD   = '#FFD700';

const STAMPS_EARNED = 7;
const STAMPS_TOTAL  = 10;
const POINTS        = 340;

const HISTORY = [
  { date: '22 mrt', restaurant: 'Royal Kitchen',  points: 34, type: 'earned' },
  { date: '20 mrt', restaurant: 'Sushi Palace',   points: 58, type: 'earned' },
  { date: '18 mrt', restaurant: 'Burger Empire',  points: 22, type: 'earned' },
  { date: '15 mrt', restaurant: 'Pizza Throne',   points: 19, type: 'earned' },
  { date: '10 mrt', restaurant: 'Welkomstbonus',  points: 100, type: 'bonus' },
];

const REWARDS = [
  { title: '€2,50 korting',      points: 250, icon: '🎫', available: POINTS >= 250 },
  { title: '€5,00 korting',      points: 500, icon: '🎟️', available: POINTS >= 500 },
  { title: 'Gratis bezorging',   points: 150, icon: '🚲', available: POINTS >= 150 },
  { title: 'Gratis dessert',     points: 300, icon: '🍰', available: POINTS >= 300 },
];

export default function RewardenPage() {
  const [tab, setTab] = useState<'punten' | 'stempel'>('punten');

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: `linear-gradient(135deg, rgba(90,49,244,0.15), rgba(255,0,128,0.1))`, border: '1px solid rgba(90,49,244,0.2)', borderRadius: 24, padding: '32px', marginBottom: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Jouw beloningen</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Spaar punten bij elke bestelling en wissel ze in voor kortingen.</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 40, padding: '12px 28px' }}>
            <span style={{ fontSize: 28 }}>⭐</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: GOLD }}>{POINTS}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>punten</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--bg-card)', borderRadius: 14, padding: 6, border: '1px solid var(--border)' }}>
          {(['punten', 'stempel'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
              background: tab === t ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'transparent',
              color: tab === t ? 'white' : 'var(--text-muted)',
            }}>
              {t === 'punten' ? '⭐ Punten' : '🎟️ Stempelkaart'}
            </button>
          ))}
        </div>

        {tab === 'punten' && (
          <>
            {/* Redeem rewards */}
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Inwisselen</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
              {REWARDS.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                  style={{ background: r.available ? 'var(--bg-card)' : 'rgba(255,255,255,0.02)', border: `1px solid ${r.available ? 'rgba(90,49,244,0.3)' : 'var(--border)'}`, borderRadius: 16, padding: '20px 16px', textAlign: 'center', opacity: r.available ? 1 : 0.5 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{r.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{r.points} punten</div>
                  <button disabled={!r.available}
                    style={{ background: r.available ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.06)', color: r.available ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: 20, padding: '8px 18px', fontWeight: 700, fontSize: 12, cursor: r.available ? 'pointer' : 'not-allowed', width: '100%' }}>
                    {r.available ? 'Inwisselen →' : `Nog ${r.points - POINTS} nodig`}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* History */}
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Geschiedenis</h2>
            <div style={{ background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', overflow: 'hidden' }}>
              {HISTORY.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < HISTORY.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{h.restaurant}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{h.date}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: h.type === 'bonus' ? GOLD : ORANGE }}>+{h.points} ⭐</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'stempel' && (
          <>
            <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>Stempelkaart</h2>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{STAMPS_EARNED}/{STAMPS_TOTAL}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
                {Array.from({ length: STAMPS_TOTAL }).map((_, i) => (
                  <motion.div key={i} initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
                    style={{ aspectRatio: '1', borderRadius: 12, border: `2px solid ${i < STAMPS_EARNED ? ORANGE : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: i < STAMPS_EARNED ? `rgba(255,107,0,0.15)` : 'transparent' }}>
                    {i < STAMPS_EARNED ? '🍕' : ''}
                  </motion.div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Nog <strong style={{ color: 'var(--text-primary)' }}>{STAMPS_TOTAL - STAMPS_EARNED} stempels</strong> tot een gratis maaltijd ter waarde van <strong style={{ color: ORANGE }}>€15,00</strong>.
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', padding: '20px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Stempelgeschiedenis</h3>
              {[
                { date: '22 mrt', restaurant: 'Royal Kitchen',  stamps: 1 },
                { date: '20 mrt', restaurant: 'Sushi Palace',   stamps: 2 },
                { date: '18 mrt', restaurant: 'Burger Empire',  stamps: 1 },
                { date: '15 mrt', restaurant: 'Pizza Throne',   stamps: 1 },
                { date: '12 mrt', restaurant: 'Pho Dynasty',    stamps: 1 },
              ].map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{h.restaurant}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{h.date}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: ORANGE, fontSize: 13 }}>+{h.stamps} 🍕</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/discover"
            style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 40, background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
            Bestel nu en spaar punten →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
