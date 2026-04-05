'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

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

const sectionStats = [
  { value: '12', label: 'Steden', accent: PURPLE },
  { value: '6',  label: 'Landen', accent: PINK },
  { value: '1,073', label: 'Restaurants', accent: ORANGE },
  { value: '2026', label: 'Expansiejaar', accent: PURPLE },
];

/* ─── Pulsing dot ─── */
function PulsingDot({ color }: { color: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14 }}>
      <motion.span
        animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }}
      />
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, position: 'relative', zIndex: 1 }} />
    </span>
  );
}

/* ─── Live city card ─── */
function LiveCityCard({ c, i }: { c: typeof cities[0]; i: number }) {
  return (
    <motion.div
      key={c.name}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, type: 'spring', stiffness: 180, damping: 22 }}
      whileHover={{ scale: 1.04, y: -6, boxShadow: `0 16px 48px ${PURPLE}30` }}
    >
      <Link
        href="/discover"
        style={{
          display: 'block', padding: '28px 24px',
          background: 'var(--bg-card)',
          borderRadius: 20,
          border: `1px solid ${PURPLE}25`,
          textDecoration: 'none', color: 'var(--text-primary)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Subtle inner gradient on hover — always rendered, opacity via CSS */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 20,
          background: `radial-gradient(ellipse at 30% 30%, ${PURPLE}12, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Live badge */}
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '3px 9px' }}>
          <PulsingDot color="#22C55E" />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#22C55E', letterSpacing: 0.5 }}>LIVE</span>
        </div>

        <div style={{ fontSize: 36, marginBottom: 12, position: 'relative' }}>{c.flag}</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, position: 'relative' }}>{c.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0, position: 'relative' }}>{c.restaurants} restaurants</p>
      </Link>
    </motion.div>
  );
}

/* ─── Coming soon city card ─── */
function ComingSoonCard({ c, i }: { c: typeof cities[0]; i: number }) {
  return (
    <motion.div
      key={c.name}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, type: 'spring', stiffness: 180, damping: 22 }}
    >
      <div style={{
        padding: '28px 24px',
        background: 'rgba(255,255,255,0.015)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', overflow: 'hidden',
        opacity: 0.65,
      }}>
        {/* Coming soon badge */}
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.25)', borderRadius: 20, padding: '3px 9px' }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: ORANGE, display: 'inline-block' }}
          />
          <span style={{ fontSize: 10, fontWeight: 800, color: ORANGE, letterSpacing: 0.5 }}>BINNENKORT</span>
        </div>

        <div style={{ fontSize: 36, marginBottom: 12 }}>{c.flag}</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{c.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Coming 2026</p>
      </div>
    </motion.div>
  );
}

export default function CitiesPage() {
  const live = cities.filter(c => c.status === 'live');
  const coming = cities.filter(c => c.status === 'coming');

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* ─── Hero ─── */}
      <section style={{ position: 'relative', padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', textAlign: 'center', overflow: 'hidden', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/marketing/cities-hero.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 55%, var(--bg-page) 100%)' }} />
        {/* Grain */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(ellipse at 50% 50%, rgba(90,49,244,0.16) 0%, transparent 65%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ position: 'relative', zIndex: 4 }}
        >
          <h1 style={{ fontSize: 'clamp(26px,5.5vw,52px)', fontWeight: 950, marginBottom: 16, letterSpacing: -2, lineHeight: 1.05 }}>
            We deliver in{' '}
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK},${ORANGE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              your city
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', maxWidth: 520, margin: '0 auto' }}>
            Currently live in 6 Dutch cities. Expanding across Europe in 2026.
          </p>
        </motion.div>
      </section>

      {/* ─── Stats ─── */}
      <section style={{ padding: '0 clamp(16px,4vw,60px) clamp(32px,4vw,56px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, maxWidth: 860, margin: '0 auto' }}>
          {sectionStats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.05, boxShadow: `0 8px 28px ${s.accent}25` }}
              style={{
                textAlign: 'center', padding: '28px 14px',
                background: 'var(--bg-card)', borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 950, background: `linear-gradient(135deg,${s.accent},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 5 }}>
                {s.value}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── City grids ─── */}
      <section style={{ padding: '0 clamp(16px,4vw,60px) clamp(40px,5vw,80px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Section header: Live */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
          >
            <PulsingDot color="#22C55E" />
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Live now</h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 56 }}>
            {live.map((c, i) => (
              <LiveCityCard key={c.name} c={c} i={i} />
            ))}
          </div>

          {/* Section header: Coming soon */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 10, height: 10, borderRadius: '50%', background: ORANGE, display: 'inline-block' }}
            />
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Coming soon</h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 60 }}>
            {coming.map((c, i) => (
              <ComingSoonCard key={c.name} c={c} i={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
