'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

/* ── Data ─────────────────────────────────────────────────────────── */
const deptColors: Record<string, string> = {
  Engineering: PURPLE,
  Design:      PINK,
  Operations:  ORANGE,
  Marketing:   '#27AE60',
};

const jobs = [
  { dept: 'Engineering', title: 'Senior Full-Stack Developer',     loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Build the next generation of food delivery with React, Next.js, and AI integrations. You own features end-to-end.' },
  { dept: 'Engineering', title: 'AI / ML Engineer',                loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Power Joya AI concierge with natural language understanding, voice recognition, and personalised recommendations.' },
  { dept: 'Engineering', title: 'Mobile Developer (React Native)', loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Craft a buttery-smooth mobile experience for iOS and Android with Expo and React Native.' },
  { dept: 'Design',       title: 'Senior Product Designer',        loc: 'Den Haag',          type: 'Full-Time', desc: 'Design premium, crown-worthy interfaces that make ordering food feel like a royal experience.' },
  { dept: 'Operations',   title: 'City Manager — Amsterdam',       loc: 'Amsterdam',         type: 'Full-Time', desc: 'Launch and manage EnJoy operations in Amsterdam. Own restaurant partnerships, courier fleet, and local growth.' },
  { dept: 'Marketing',    title: 'Growth Marketing Manager',       loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Drive user acquisition, SEO, and brand awareness across channels. Make EnJoy the household name for food delivery.' },
];

const perks = [
  { icon: '🌍', title: 'Remote-First',        text: 'Werk vanuit overal in de EU',         color: PURPLE },
  { icon: '🍕', title: 'Gratis maaltijden',   text: 'EnJoy-tegoed elke maand',             color: PINK },
  { icon: '📈', title: 'Aandelen',            text: 'Stock options voor elke rol',         color: ORANGE },
  { icon: '🏖️', title: '30 vakantiedagen',   text: 'Plus alle lokale feestdagen',         color: '#27AE60' },
];

const whyCards = [
  { icon: '🚀', title: 'Bouwen op schaal',      text: 'Je code bereikt direct honderdduizenden gebruikers in meerdere steden.' },
  { icon: '🧠', title: 'AI van dag één',         text: 'We integreren AI in elk product — van Joya tot menu-fotografie tot logistiek.' },
  { icon: '💜', title: 'Een cultuur van trots',  text: 'We leveren kwaliteit. Dat geldt voor onze producten én voor hoe we met elkaar omgaan.' },
];

const input: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12, padding: '14px 18px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
  fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
};

/* ── Page ─────────────────────────────────────────────────────────── */
export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin: '', motivation: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string>('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const applyFor = (title: string) => {
    setSelectedRole(title);
    setTimeout(() => {
      document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitted(true);
    setLoading(false);
  };

  const focusStyle = (name: string): React.CSSProperties => ({
    ...input,
    borderColor: focused === name ? `${PURPLE}80` : 'rgba(255,255,255,0.12)',
    boxShadow: focused === name ? `0 0 0 3px ${PURPLE}22` : 'none',
  });

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 'clamp(380px, 52vh, 560px)', overflow: 'hidden' }}>
        <img
          src="/marketing/careers-office.png"
          alt="EnJoy office"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,10,20,0.85) 0%, rgba(90,49,244,0.4) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(24px,5vw,60px) clamp(20px,6vw,80px)', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 20 }}>
              👑 Werken bij EnJoy
            </div>
            <h1 style={{ fontSize: 'clamp(36px,7vw,68px)', fontWeight: 950, lineHeight: 1.0, letterSpacing: -3, margin: '0 0 18px' }}>
              Sluit je aan bij{' '}
              <span style={{ background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                het koninklijke hof
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(15px,2vw,20px)', maxWidth: 520, lineHeight: 1.6, marginBottom: 28 }}>
              Bouw de toekomst van bezorging. Wij geloven dat geweldige technologie geweldig eten dient.
            </p>
            <a href="#open-positions" style={{ display: 'inline-block', background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '15px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 28px ${PURPLE}50` }}>
              Bekijk vacatures
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Why EnJoy? ───────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(48px,6vw,80px) clamp(20px,6vw,60px)', background: `linear-gradient(180deg, rgba(90,49,244,0.03), transparent)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 950, letterSpacing: -1, marginBottom: 12 }}>Waarom EnJoy?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 440, margin: '0 auto' }}>Drie redenen waarom top-talent kiest voor ons platform.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {whyCards.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: `0 20px 48px ${PURPLE}20` }}
                style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}
              >
                <div style={{ fontSize: 36, marginBottom: 14 }}>{w.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{w.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{w.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks ─────────────────────────────────────────────────── */}
      <section style={{ padding: '0 clamp(20px,6vw,60px) clamp(48px,6vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
          {perks.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: `0 16px 40px ${p.color}25` }}
              style={{ textAlign: 'center', padding: '28px 16px', background: 'var(--bg-card)', borderRadius: 18, border: `1px solid ${p.color}25`, cursor: 'default', transition: 'border-color 0.25s' }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.15 }}
                transition={{ duration: 0.4 }}
                style={{ fontSize: 32, marginBottom: 12, display: 'inline-block' }}
              >
                {p.icon}
              </motion.div>
              <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{p.title}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5 }}>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Open Positions ────────────────────────────────────────── */}
      <section id="open-positions" style={{ padding: 'clamp(32px,5vw,80px) clamp(20px,6vw,60px)', background: 'rgba(90,49,244,0.02)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 950, marginBottom: 32, letterSpacing: -1 }}>
            Openstaande vacatures
          </motion.h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {jobs.map((j, i) => {
              const deptColor = deptColors[j.dept] ?? PURPLE;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3, boxShadow: `0 12px 36px ${deptColor}18` }}
                  style={{ padding: '24px 28px', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', transition: 'border-color 0.2s' }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: 17, fontWeight: 800 }}>{j.title}</h3>
                      <span style={{ background: `${deptColor}20`, color: deptColor, padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, flexShrink: 0, letterSpacing: 0.3 }}>
                        {j.dept}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 10, lineHeight: 1.5 }}>{j.desc}</p>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>📍 {j.loc}</span>
                      <span>⏰ {j.type}</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => applyFor(j.title)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ background: `linear-gradient(135deg,${deptColor},${deptColor === PURPLE ? PINK : PURPLE})`, color: 'white', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap', boxShadow: `0 6px 20px ${deptColor}35` }}
                  >
                    Solliciteer →
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Application Form ──────────────────────────────────────── */}
      <section id="apply-form" style={{ padding: 'clamp(48px,6vw,96px) clamp(20px,6vw,60px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-block', background: `${PURPLE}18`, border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 16 }}>
                Sollicitatieformulier
              </div>
              <h2 style={{ fontSize: 'clamp(24px,5vw,40px)', fontWeight: 950, letterSpacing: -1, marginBottom: 10 }}>Solliciteer bij EnJoy</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>We nemen binnen 3 werkdagen contact op.</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '56px 40px', background: `${PURPLE}08`, borderRadius: 24, border: `1px solid ${PURPLE}30` }}
              >
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Sollicitatie ontvangen!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                  Bedankt {form.name}! We bekijken je sollicitatie en nemen binnen <strong>3 werkdagen</strong> contact op via {form.email}.
                </p>
                <Link href="/discover" style={{ display: 'inline-block', background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                  Ontdek EnJoy →
                </Link>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', padding: 'clamp(24px,4vw,44px)', display: 'flex', flexDirection: 'column', gap: 0 }}
              >
                {/* Section: Vacature */}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: PURPLE, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14 }}>01 — Vacature</p>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Gewenste functie *</label>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    onFocus={() => setFocused('role')}
                    onBlur={() => setFocused('')}
                    required
                    style={{ ...focusStyle('role'), appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                  >
                    <option value="">Kies een vacature</option>
                    {jobs.map(j => <option key={j.title} value={j.title}>{j.title}</option>)}
                    <option value="Open sollicitatie">Open sollicitatie</option>
                  </select>
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 28 }} />

                {/* Section: Persoonlijk */}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: PURPLE, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14 }}>02 — Persoonlijke gegevens</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Volledige naam *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} onFocus={() => setFocused('name')} onBlur={() => setFocused('')} placeholder="Jan de Vries" required style={focusStyle('name')} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>E-mailadres *</label>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} placeholder="jan@example.com" required style={focusStyle('email')} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginTop: 14 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Telefoonnummer</label>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} onFocus={() => setFocused('phone')} onBlur={() => setFocused('')} placeholder="+31 6 12345678" style={focusStyle('phone')} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>LinkedIn / Portfolio</label>
                      <input type="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} onFocus={() => setFocused('linkedin')} onBlur={() => setFocused('')} placeholder="linkedin.com/in/jouw-naam" style={focusStyle('linkedin')} />
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 28 }} />

                {/* Section: Motivatie */}
                <div style={{ marginBottom: 32 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: PURPLE, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14 }}>03 — Motivatie</p>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Motivatiebrief *</label>
                  <textarea
                    value={form.motivation}
                    onChange={e => set('motivation', e.target.value)}
                    onFocus={() => setFocused('motivation')}
                    onBlur={() => setFocused('')}
                    required
                    placeholder="Vertel ons waarom je bij EnJoy wilt werken en wat jou onderscheidt…"
                    rows={5}
                    style={{ ...focusStyle('motivation'), resize: 'vertical' }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 14, padding: '17px 0', fontSize: 16, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: `0 8px 28px ${PURPLE}40`, letterSpacing: '-0.2px' }}
                >
                  {loading ? 'Verwerken…' : 'Sollicitatie versturen →'}
                </motion.button>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 16 }}>
                  We reageren binnen 3 werkdagen. Al je gegevens worden vertrouwelijk behandeld.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
