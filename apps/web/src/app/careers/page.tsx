'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

const jobs = [
  { dept: 'Engineering', title: 'Senior Full-Stack Developer',     loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Build the next generation of food delivery with React, Next.js, and AI integrations. You own features end-to-end.' },
  { dept: 'Engineering', title: 'AI / ML Engineer',                loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Power Joya AI concierge with natural language understanding, voice recognition, and personalised recommendations.' },
  { dept: 'Engineering', title: 'Mobile Developer (React Native)', loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Craft a buttery-smooth mobile experience for iOS and Android with Expo and React Native.' },
  { dept: 'Design',       title: 'Senior Product Designer',        loc: 'Den Haag',          type: 'Full-Time', desc: 'Design premium, crown-worthy interfaces that make ordering food feel like a royal experience.' },
  { dept: 'Operations',   title: 'City Manager — Amsterdam',       loc: 'Amsterdam',         type: 'Full-Time', desc: 'Launch and manage EnJoy operations in Amsterdam. Own restaurant partnerships, courier fleet, and local growth.' },
  { dept: 'Marketing',    title: 'Growth Marketing Manager',       loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Drive user acquisition, SEO, and brand awareness across channels. Make EnJoy the household name for food delivery.' },
];

const perks = [
  { icon: '🌍', title: 'Remote-First',    text: 'Work from anywhere in the EU' },
  { icon: '🍕', title: 'Gratis maaltijden', text: 'EnJoy-tegoed elke maand' },
  { icon: '📈', title: 'Aandelen',         text: 'Stock options voor elke rol' },
  { icon: '🏖️', title: '30 vakantiedagen', text: 'Plus lokale feestdagen' },
];

const input: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12, padding: '14px 18px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
  fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
};

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin: '', motivation: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(90,49,244,0.1) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(90,49,244,0.12)', border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 24 }}>
            👑 Werken bij EnJoy
          </div>
          <h1 style={{ fontSize: 'clamp(28px,6vw,58px)', fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Sluit je aan bij<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>het koninklijke hof</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
            Bouw de toekomst van bezorging. Wij geloven dat geweldige technologie geweldig eten dient.
          </p>
          <a href="#open-positions" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
            Bekijk vacatures
          </a>
        </motion.div>
      </section>

      {/* Perks */}
      <section style={{ padding: '0 clamp(16px,4vw,60px) clamp(32px,5vw,64px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, maxWidth: 860, margin: '0 auto' }}>
          {perks.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ textAlign: 'center', padding: '28px 16px', background: 'rgba(90,49,244,0.05)', borderRadius: 18, border: '1px solid rgba(90,49,244,0.12)' }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{p.icon}</div>
              <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{p.title}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5 }}>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.02)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 32, maxWidth: 860, margin: '0 auto 32px' }}>Openstaande vacatures</h2>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {jobs.map((j, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              style={{ padding: '24px 28px', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800 }}>{j.title}</h3>
                  <span style={{ background: 'rgba(90,49,244,0.15)', color: PURPLE, padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{j.dept}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>{j.desc}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>📍 {j.loc}</span>
                  <span>⏰ {j.type}</span>
                </div>
              </div>
              <button onClick={() => applyFor(j.title)}
                style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                Solliciteer →
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" style={{ padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ display: 'inline-block', background: 'rgba(90,49,244,0.12)', border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 16 }}>
                📋 Sollicitatieformulier
              </div>
              <h2 style={{ fontSize: 'clamp(24px,5vw,38px)', fontWeight: 950, letterSpacing: -1 }}>Solliciteer bij EnJoy</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 10, fontSize: 15 }}>We nemen binnen 3 werkdagen contact op.</p>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '56px 40px', background: 'rgba(90,49,244,0.06)', borderRadius: 24, border: `1px solid ${PURPLE}30` }}>
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
              <form onSubmit={handleSubmit}
                style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', padding: 'clamp(24px,4vw,40px)', display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Role selector */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Vacature *</label>
                  <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} required
                    style={{ ...input, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.04) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' fill=\'none\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\'/%3E%3C/svg%3E") no-repeat right 16px center' }}>
                    <option value="">Kies een vacature</option>
                    {jobs.map(j => <option key={j.title} value={j.title}>{j.title}</option>)}
                    <option value="Open sollicitatie">Open sollicitatie</option>
                  </select>
                </div>

                {/* Name & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Volledige naam *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jan de Vries" required style={input} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>E-mailadres *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jan@example.com" required style={input} />
                  </div>
                </div>

                {/* Phone & LinkedIn */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Telefoonnummer</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+31 6 12345678" style={input} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>LinkedIn / Portfolio</label>
                    <input type="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/jouw-naam" style={input} />
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Motivatiebrief *</label>
                  <textarea value={form.motivation} onChange={e => set('motivation', e.target.value)} required
                    placeholder="Vertel ons waarom je bij EnJoy wilt werken en wat jou onderscheidt…"
                    rows={5} style={{ ...input, resize: 'vertical' }} />
                </div>

                <button type="submit" disabled={loading}
                  style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 14, padding: '17px 0', fontSize: 16, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: `0 8px 24px ${PURPLE}35`, letterSpacing: '-0.2px' }}>
                  {loading ? 'Verwerken…' : 'Sollicitatie versturen →'}
                </button>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
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
