'use client';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

/* ── Data ─────────────────────────────────────────────────────────── */
const articles = [
  { outlet: 'TechCrunch',            title: 'EnJoy raises €8M to bring elite food delivery to European cities', date: 'Jan 2026', tag: 'Funding' },
  { outlet: 'Het Financieele Dagblad', title: 'EnJoy: De Nederlandse startup die bezorging heruitvindt',         date: 'Feb 2026', tag: 'Feature' },
  { outlet: 'Wired NL',              title: 'How AI and purple bags are changing the food delivery game',         date: 'Mrt 2026', tag: 'Tech' },
  { outlet: 'Business Insider',      title: 'EnJoy hits 1,000 restaurant partners in 6 months',                  date: 'Mrt 2026', tag: 'Milestone' },
  { outlet: 'Emerce',                title: 'Joya: hoe een AI-concierge de maaltijdbestelling transformeert',     date: 'Apr 2026', tag: 'Product' },
];

const tagColors: Record<string, string> = {
  Funding:   '#27AE60',
  Feature:   PURPLE,
  Tech:      PINK,
  Milestone: ORANGE,
  Product:   '#2980B9',
};

const mediaKitCards = [
  {
    icon: '🎨',
    title: 'Logo Pack',
    desc: 'SVG, PNG en EPS in alle varianten (kleur, wit, zwart)',
    cta: 'Download .zip',
    color: PURPLE,
  },
  {
    icon: '📖',
    title: 'Brand Guide',
    desc: 'Kleurpalet, typografie, tone-of-voice en gebruik richtlijnen',
    cta: 'Download .pdf',
    color: PINK,
  },
  {
    icon: '📷',
    title: 'Product Screenshots',
    desc: 'Hi-res app screenshots, product beelden en team foto\'s',
    cta: 'Download .zip',
    color: ORANGE,
  },
];

const pressStats = [
  { value: '1.000+', label: 'Partner restaurants' },
  { value: '€8M',    label: 'Series A gefinancierd' },
  { value: '12',     label: 'Steden actief' },
  { value: '2024',   label: 'Opgericht' },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function PressPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 'clamp(340px, 48vh, 520px)', overflow: 'hidden' }}>
        <img
          src="/marketing/press-media.png"
          alt="EnJoy press"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,10,20,0.88) 0%, rgba(90,49,244,0.35) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(24px,5vw,60px) clamp(20px,6vw,80px)', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 18 }}>
              Pers &amp; Media
            </div>
            <h1 style={{ fontSize: 'clamp(36px,7vw,70px)', fontWeight: 950, lineHeight: 1.0, letterSpacing: -3, margin: '0 0 16px' }}>
              <span style={{ background: `linear-gradient(135deg, #ffffff 0%, ${PINK} 55%, ${PURPLE} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Press &amp; Media
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(14px,1.8vw,19px)', maxWidth: 520, lineHeight: 1.6 }}>
              Persberichten, merkassets en interviews. Alles wat journalisten nodig hebben om het EnJoy-verhaal te vertellen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(90deg, ${PURPLE}10 0%, ${PINK}08 100%)`, borderTop: `1px solid ${PURPLE}20`, borderBottom: `1px solid ${PURPLE}20` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(20px,3vw,32px) clamp(20px,6vw,60px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, textAlign: 'center' }}>
          {pressStats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <p style={{ fontSize: 'clamp(22px,3.5vw,34px)', fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1, marginBottom: 4 }}>
                {s.value}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Media Kit ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(20px,6vw,60px)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 950, letterSpacing: -1, marginBottom: 10 }}>Media Kit</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 480 }}>Download officiële EnJoy-assets voor publicaties en presentaties.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {mediaKitCards.map((k, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: `0 20px 48px ${k.color}25` }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 20, border: `1px solid ${k.color}25`, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                {k.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>{k.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.65 }}>{k.desc}</p>
              </div>
              <motion.a
                href="#"
                onClick={e => e.preventDefault()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, background: `${k.color}15`, border: `1px solid ${k.color}35`, color: k.color, padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none', width: 'fit-content', cursor: 'pointer' }}
              >
                ↓ {k.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Press Coverage ────────────────────────────────────────── */}
      <section style={{ background: 'rgba(90,49,244,0.02)', padding: 'clamp(40px,6vw,72px) clamp(20px,6vw,60px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 950, letterSpacing: -1, marginBottom: 10 }}>Recent Coverage</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Wat de pers zegt over EnJoy.</p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {articles.map((a, i) => {
              const tagColor = tagColors[a.tag] ?? PURPLE;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4, boxShadow: `0 8px 28px ${tagColor}15` }}
                  style={{ padding: 'clamp(16px,3vw,24px) clamp(16px,3vw,28px)', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', transition: 'border-color 0.2s' }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: PURPLE }}>{a.outlet}</span>
                      <span style={{ fontSize: 11, padding: '3px 12px', background: `${tagColor}18`, color: tagColor, borderRadius: 20, fontWeight: 800, letterSpacing: 0.3 }}>
                        {a.tag}
                      </span>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, margin: 0 }}>{a.title}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>{a.date}</span>
                    <motion.a
                      href="#"
                      onClick={e => e.preventDefault()}
                      whileHover={{ scale: 1.05 }}
                      style={{ background: `${PURPLE}15`, border: `1px solid ${PURPLE}30`, color: PURPLE, padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}
                    >
                      Lees meer →
                    </motion.a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Press Contact ─────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(48px,6vw,96px) clamp(20px,6vw,60px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ background: `linear-gradient(135deg, ${PURPLE}12 0%, ${PINK}08 100%)`, border: `1px solid ${PURPLE}25`, borderRadius: 28, padding: 'clamp(32px,5vw,60px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40, alignItems: 'center' }}
        >
          <div>
            <div style={{ display: 'inline-block', background: `${PURPLE}18`, border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 18 }}>
              Perscontact
            </div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 950, letterSpacing: -1, marginBottom: 14 }}>
              Een verhaal over<br />
              <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                EnJoy schrijven?
              </span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7 }}>
              Ons communicatieteam staat klaar voor interviews, quotes, achtergronden en exclusieve verhalen. We reageren doorgaans binnen 24 uur.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <a
              href="mailto:press@enjoy.delivery"
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text-primary)' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${PURPLE}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✉️</div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 2 }}>E-mail</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: PURPLE }}>press@enjoy.delivery</p>
              </div>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${PINK}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📞</div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 2 }}>Telefoon (werkdagen)</p>
                <p style={{ fontSize: 15, fontWeight: 800 }}>+31 70 123 4567</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
