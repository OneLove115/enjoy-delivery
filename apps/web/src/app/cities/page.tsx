'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const cities = [
  { name: 'Amsterdam', flag: '🇳🇱', restaurants: 342, status: 'live' },
  { name: 'Rotterdam', flag: '🇳🇱', restaurants: 218, status: 'live' },
  { name: 'Den Haag', flag: '🇳🇱', restaurants: 187, status: 'live' },
  { name: 'Utrecht', flag: '🇳🇱', restaurants: 156, status: 'live' },
  { name: 'Eindhoven', flag: '🇳🇱', restaurants: 98, status: 'live' },
  { name: 'Breda', flag: '🇳🇱', restaurants: 72, status: 'live' },
  { name: 'Brussels', flag: '🇧🇪', restaurants: 0, status: 'coming' },
  { name: 'Antwerp', flag: '🇧🇪', restaurants: 0, status: 'coming' },
  { name: 'Berlin', flag: '🇩🇪', restaurants: 0, status: 'coming' },
  { name: 'London', flag: '🇬🇧', restaurants: 0, status: 'coming' },
  { name: 'Paris', flag: '🇫🇷', restaurants: 0, status: 'coming' },
  { name: 'Barcelona', flag: '🇪🇸', restaurants: 0, status: 'coming' },
];

export default function CitiesPage() {
  const live = cities.filter(c => c.status === 'live');
  const coming = cities.filter(c => c.status === 'coming');

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,60px)', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 'clamp(26px,5.5vw,52px)', fontWeight: 950, marginBottom: 16, letterSpacing: -2 }}>
            We deliver in <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your city</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 60px' }}>Currently live in 6 Dutch cities. Expanding across Europe in 2026.</p>
        </motion.div>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, textAlign: 'left' }}>🟢 Live now</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 56 }}>
            {live.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link href="/discover" style={{ display: 'block', padding: '28px 24px', background: 'var(--bg-card)', borderRadius: 20, border: `1px solid ${PURPLE}20`, textDecoration: 'none', color: 'var(--text-primary)' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{c.flag}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{c.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{c.restaurants} restaurants</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, textAlign: 'left' }}>⏳ Coming soon</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 60 }}>
            {coming.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.015)', borderRadius: 20, border: '1px solid var(--border)' as const, opacity: 0.6 }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{c.flag}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{c.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Coming 2026</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
