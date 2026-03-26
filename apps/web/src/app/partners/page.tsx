'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const benefits = [
  { icon: '📈', title: 'Grow your revenue', text: 'Our restaurants see an average 34% revenue increase in the first 3 months.' },
  { icon: '🧠', title: 'Smart dashboard', text: 'Powered by VelociPizza — manage orders, menus, and analytics in real time.' },
  { icon: '📸', title: 'AI menu photos', text: 'We generate stunning food photography for your entire menu at no extra cost.' },
  { icon: '💜', title: '0% commission first month', text: 'Onboard for free. We only succeed when you succeed.' },
];

const stats = [
  { value: '1,200+', label: 'Restaurant partners' },
  { value: '98%', label: 'Partner satisfaction' },
  { value: '€2.4M', label: 'Paid out this month' },
  { value: '34%', label: 'Avg revenue uplift' },
];

export default function PartnersPage() {
  const vpDomain = process.env.NEXT_PUBLIC_VP_DOMAIN ?? '';

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,0,128,0.08) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,0,128,0.1)', border: `1px solid ${PINK}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PINK, marginBottom: 24 }}>
            🍽️ Restaurant partners
          </div>
          <h1 style={{ fontSize: 'clamp(28px,6vw,58px)', fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Grow your restaurant<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with EnJoy</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
            Join 1,200+ restaurants on the platform that treats your brand as royalty. Full dashboard, AI menus, and zero compromise on quality.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={vpDomain ? `${vpDomain}/signup` : '/contact'}
              style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 24px ${PURPLE}40` }}>
              Add your restaurant
            </a>
            <Link href="/contact" style={{ background: 'var(--b8)', color: 'var(--text-primary)', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Talk to sales
            </Link>
          </div>
        </motion.div>
      </section>

      <section style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 36, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.03)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 38, fontWeight: 900, marginBottom: 48 }}>Everything your restaurant needs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {benefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{b.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{b.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 15 }}>{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
