'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

/* ── Animated counter ─────────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(start);
    }, 24);
    return () => clearInterval(id);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString('nl-NL')}{suffix}</span>;
}

/* ── Data ─────────────────────────────────────────────────────────── */
const values = [
  { icon: '👑', title: 'Kwaliteit', text: 'Elk partner-restaurant is persoonlijk bezocht en geproefd. Geen compromissen.' },
  { icon: '⚡', title: 'Snelheid',  text: 'Gemiddeld 25 minuten van bestelling tot bezorging — gegarandeerd warm en vers.' },
  { icon: '🤖', title: 'Innovatie', text: 'AI-voedingsfotografie, Joya spraakassistent en voorspellende aanbevelingen.' },
  { icon: '💜', title: 'Community', text: 'We ondersteunen lokale keukens, lokale koeriers en lokale smaak.' },
];

const stats = [
  { value: 1000, suffix: '+', label: 'Partner restaurants' },
  { value: 50000, suffix: '+', label: 'Bestellingen verzorgd' },
  { value: 12, suffix: '', label: 'Steden actief' },
  { value: 200, suffix: '+', label: 'Bezorgers' },
];

const team = [
  { initials: 'SV', name: 'Sophie van der Berg', role: 'CEO & Co-Founder', color: PURPLE },
  { initials: 'MK', name: 'Maxim Kowalski', role: 'CTO & Co-Founder', color: PINK },
  { initials: 'AL', name: 'Aisha Lumumba', role: 'Head of Design', color: ORANGE },
  { initials: 'TJ', name: 'Thomas Jansen', role: 'Head of Operations', color: '#27AE60' },
];

const milestones = [
  { year: '2024 Q1', event: 'EnJoy opgericht in Den Haag. Eerste 10 restaurants live.' },
  { year: '2024 Q3', event: 'Joya AI gelanceerd. 100 restaurants bereikt.' },
  { year: '2025 Q1', event: '€8M Series A-ronde afgerond. Uitbreiding naar Amsterdam & Rotterdam.' },
  { year: '2025 Q3', event: '500 partners, 12 steden, 200+ koeriers.' },
  { year: '2026',    event: '1.000 restaurant-partners en 50.000+ blije klanten.' },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 'clamp(380px, 55vh, 600px)', overflow: 'hidden' }}>
        <img
          src="/marketing/about-team.png"
          alt="EnJoy team"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* layered dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,10,20,0.82) 0%, rgba(90,49,244,0.35) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(24px,5vw,60px) clamp(20px,6vw,80px)', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 20 }}>
              👑 Over EnJoy
            </div>
            <h1 style={{ fontSize: 'clamp(36px,7vw,72px)', fontWeight: 950, lineHeight: 1.0, letterSpacing: -3, margin: 0 }}>
              <span style={{ background: `linear-gradient(135deg, #ffffff 0%, ${PINK} 60%, ${PURPLE} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ons Verhaal
              </span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(15px,2vw,20px)', marginTop: 16, maxWidth: 560, lineHeight: 1.6 }}>
              Eten is cultuur. Elke maaltijd vertelt een verhaal. Elke bezorging is een koninklijke viering.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(48px,7vw,96px) clamp(20px,6vw,60px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(32px,5vw,64px)', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-block', background: `${PURPLE}18`, border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 20 }}>
            Onze Missie
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 20, lineHeight: 1.15 }}>
            Koninklijke bezorging.<br />Nul compromissen.
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 }}>
            EnJoy is opgericht met één visie: voedselbezorging transformeren van een doorsnee transactie naar een koninklijke ervaring. We verbinden veeleisende fijnproevers met de beste lokale keukens, gedreven door geavanceerde AI en een onvermoeibare toewijding aan kwaliteit.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
            Elk restaurant op ons platform is persoonlijk bezocht, geproefd en goedgekeurd. Geen tussenpersonen, geen compromissen — alleen het beste voor jou.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
            <img
              src="/marketing/about-mission.png"
              alt="EnJoy mission"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${PURPLE}30 0%, transparent 60%)` }} />
          </div>
        </motion.div>
      </section>

      {/* ── Values ────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(180deg, transparent, rgba(90,49,244,0.04) 40%, transparent)`, padding: 'clamp(40px,6vw,80px) clamp(20px,6vw,60px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 12 }}>Onze Waarden</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>De principes die alles wat we doen sturen.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: `0 20px 48px ${PURPLE}22` }}
                style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', cursor: 'default', transition: 'border-color 0.2s' }}
              >
                <div style={{ fontSize: 38, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontSize: 19, fontWeight: 900, marginBottom: 10 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(20px,6vw,60px)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 12 }}>EnJoy in Cijfers</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center', padding: '36px 20px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}
            >
              <p style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 10 }}>
                <Counter target={s.value} suffix={s.suffix} />
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────── */}
      <section style={{ background: `rgba(90,49,244,0.03)`, padding: 'clamp(48px,6vw,80px) clamp(20px,6vw,60px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 12 }}>Het Team</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 440, margin: '0 auto' }}>De mensen achter de koninklijke ervaring.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {team.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center' }}
              >
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}90)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: 'white', margin: '0 auto 16px', boxShadow: `0 8px 24px ${t.color}40` }}>
                  {t.initials}
                </div>
                <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{t.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(48px,6vw,96px) clamp(20px,6vw,60px)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 12 }}>Onze Groei</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17 }}>Van kleine startup tot 1.000 partners.</p>
        </motion.div>

        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* vertical line */}
          <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: `linear-gradient(to bottom, ${PURPLE}, ${PINK})`, borderRadius: 2 }} />

          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              style={{ position: 'relative', marginBottom: i < milestones.length - 1 ? 36 : 0, paddingLeft: 24 }}
            >
              {/* dot */}
              <div style={{ position: 'absolute', left: -28, top: 6, width: 14, height: 14, borderRadius: '50%', background: i === milestones.length - 1 ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'var(--bg-card)', border: `2px solid ${PURPLE}`, boxShadow: i === milestones.length - 1 ? `0 0 16px ${PURPLE}60` : 'none' }} />
              <p style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 4 }}>{m.year}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>{m.event}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
