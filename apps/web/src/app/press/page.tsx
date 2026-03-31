'use client';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const articles = [
  { outlet: 'TechCrunch', title: 'EnJoy raises €8M to bring elite food delivery to European cities', date: 'Jan 2026', tag: 'Funding' },
  { outlet: 'Het Financieele Dagblad', title: 'EnJoy: De Nederlandse startup die bezorging heruitvindt', date: 'Feb 2026', tag: 'Feature' },
  { outlet: 'Wired NL', title: 'How AI and purple bags are changing the food delivery game', date: 'Mar 2026', tag: 'Tech' },
  { outlet: 'Business Insider', title: 'EnJoy hits 1,000 restaurant partners in 6 months', date: 'Mar 2026', tag: 'Milestone' },
];

export default function PressPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 760, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(26px,5.5vw,52px)', fontWeight: 950, marginBottom: 16, letterSpacing: -2 }}>
            Press & <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Media</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            For media enquiries, interview requests, and brand assets, contact our communications team.
          </p>
          <a href="mailto:press@enjoy.delivery" style={{ color: PURPLE, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>press@enjoy.delivery</a>

          {/* Brand assets */}
          <div style={{ display: 'flex', gap: 16, marginTop: 32, marginBottom: 56, flexWrap: 'wrap' }}>
            {['Logo pack (.zip)', 'Brand guidelines (.pdf)', 'Press photos'].map((a, i) => (
              <div key={i} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                📎 {a}
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Recent coverage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {articles.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: 'clamp(16px,3vw,24px) clamp(16px,3vw,28px)', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: PURPLE }}>{a.outlet}</span>
                    <span style={{ fontSize: 12, padding: '2px 10px', background: `${PURPLE}15`, color: PURPLE, borderRadius: 20 }}>{a.tag}</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, margin: 0 }}>{a.title}</p>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 13, flexShrink: 0 }}>{a.date}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
