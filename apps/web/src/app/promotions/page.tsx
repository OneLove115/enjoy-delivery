'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const promos = [
  { code: 'ROYAL10', discount: '10% off', description: 'Your first 3 orders', expires: '31 Mar 2026', color: PURPLE },
  { code: 'LUNCH50', discount: '€2.50 off', description: 'Orders placed 11:00–14:00', expires: '30 Apr 2026', color: '#FF6B35' },
  { code: 'NEWCITY', discount: 'Free delivery', description: 'All orders this week', expires: '28 Mar 2026', color: PINK },
  { code: 'FRIDAY20', discount: '20% off', description: 'Friday orders only', expires: 'Every Friday', color: '#00BCD4' },
];

export default function PromotionsPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 'clamp(26px,5.5vw,52px)', fontWeight: 950, marginBottom: 16, letterSpacing: -2 }}>
            Royal <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>deals</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 56px' }}>Active promotions and promo codes. Apply at checkout.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 860, margin: '0 auto 60px' }}>
          {promos.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 20, border: `1px solid ${p.color}30`, textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `${p.color}10`, filter: 'blur(20px)' }} />
              <div style={{ fontSize: 36, fontWeight: 950, color: p.color, marginBottom: 8, fontFamily: 'monospace' }}>{p.code}</div>
              <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{p.discount}</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 16 }}>{p.description}</p>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Expires: {p.expires}</div>
            </motion.div>
          ))}
        </div>

        <Link href="/discover" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
          Order with a promo
        </Link>
      </section>
      <Footer />
    </div>
  );
}
