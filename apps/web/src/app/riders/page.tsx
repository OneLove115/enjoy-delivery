'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const perks = [
  { icon: '💰', title: 'Earn your way', text: 'Set your own hours. Top riders earn €1,200+ per month on their own schedule.' },
  { icon: '🚲', title: 'Ride anything', text: 'Bike, scooter, car — any vehicle works. We supply the iconic purple delivery bag.' },
  { icon: '📱', title: 'Simple app', text: 'Accept orders with one tap. Real-time navigation built in. Instant weekly pay.' },
  { icon: '🛡️', title: 'Fully insured', text: 'Comprehensive delivery insurance included from your first order.' },
];

const steps = [
  { num: '01', title: 'Sign up online', text: 'Fill in your details and upload your ID. Takes 5 minutes.' },
  { num: '02', title: 'Get approved', text: 'We verify your account within 24 hours.' },
  { num: '03', title: 'Start earning', text: 'Download the rider app, pick your first order, and go.' },
];

export default function RidersPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,40px)', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(90,49,244,0.12) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <div style={{ display: 'inline-block', background: 'rgba(90,49,244,0.15)', border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 24 }}>
            🚲 Deliver with EnJoy
          </div>
          <h1 style={{ fontSize: 'clamp(30px,7vw,62px)', fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Ride on your<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>own terms</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
            Join 5,000+ riders delivering for EnJoy. Flexible hours, instant pay, and the most iconic bag in the city.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 24px ${PURPLE}40` }}>
              Apply to ride
            </Link>
            <a href="#how-it-works" style={{ background: 'var(--b8)', color: 'var(--text-primary)', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Learn more
            </a>
          </div>
        </motion.div>
      </section>

      <section style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 38, fontWeight: 900, marginBottom: 48 }}>Why ride with EnJoy?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {perks.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{p.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 15 }}>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.03)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 38, fontWeight: 900, marginBottom: 56 }}>Start in 3 steps</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, maxWidth: 900, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(26px,5.5vw,52px)', fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>{s.num}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>{s.text}</p>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <Link href="/signup" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', padding: '16px 48px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
            Become a rider
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
