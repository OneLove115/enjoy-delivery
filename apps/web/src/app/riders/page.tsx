'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, animate, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

// ---------- data ----------
const perks = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    color: ORANGE,
    title: 'Flexibele uren',
    text: 'Jij kiest wanneer je rijdt. Ochtend, middag, avond — jouw schema, jouw regels.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
      </svg>
    ),
    color: PURPLE,
    title: 'Tot €1.200/maand',
    text: 'Top bezorgers verdienen meer dan €1.200 per maand. Wekelijkse betaling, altijd op tijd.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: PINK,
    title: 'Volledig verzekerd',
    text: 'Uitgebreide bezorgverzekering inbegrepen vanaf je eerste bestelling. Geen verborgen kosten.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
      </svg>
    ),
    color: ORANGE,
    title: 'Eenvoudige app',
    text: 'Accepteer bestellingen met één tik. Realtime navigatie ingebouwd. Alles in één app.',
  },
];

const steps = [
  { num: '01', title: 'Aanmelden', text: 'Vul je gegevens in en upload je ID. Duurt 5 minuten.' },
  { num: '02', title: 'Goedgekeurd', text: 'We verifiëren je account binnen 24 uur en sturen je welkomstkit.' },
  { num: '03', title: 'Begin verdienen', text: 'Download de bezorger-app, kies je eerste bestelling en ga!' },
];

const statsData = [
  { value: 1200, prefix: '€', suffix: '/mnd', label: 'Max. verdiensten' },
  { value: 500, prefix: '', suffix: '+', label: 'Actieve bezorgers' },
  { value: 12, prefix: '', suffix: '', label: 'Steden' },
  { value: 4.9, prefix: '', suffix: '★', label: 'App-beoordeling', decimals: 1 },
];

const vehicles = ['Fiets', 'E-bike', 'Scooter / Bromfiets', 'Motorfiets', 'Auto'];
const cities = ['Amsterdam', 'Den Haag', 'Rotterdam', 'Utrecht', 'Eindhoven', 'Groningen', 'Breda', 'Tilburg', 'Andere stad'];

// ---------- animated counter ----------
function Counter({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate(latest) {
        if (ref.current) ref.current.textContent = prefix + latest.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, decimals]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ---------- shared input styles ----------
const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  padding: '14px 18px',
  color: 'var(--text-primary)',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'Outfit, sans-serif',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
const selectBase: React.CSSProperties = {
  ...inputBase,
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  background: 'rgba(255,255,255,0.05) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' fill=\'none\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\'/%3E%3C/svg%3E") no-repeat right 16px center',
};

// ---------- hero slides ----------
const heroSlides = [
  { src: '/food/couple-delivery.png', alt: 'Bezorger op weg', headline: 'Rijd op jouw eigen voorwaarden', sub: 'Sluit je aan bij 5.000+ bezorgers bij EnJoy.' },
  { src: '/food/delivery-joy.png', alt: 'EnJoy bezorging', headline: 'Verdien meer. Werk minder.', sub: 'Flexibele uren, directe betaling, de mooiste paarse tas van de stad.' },
];

// ---------- focus style injection ----------
const focusStyleId = 'rider-focus-styles';

export default function RidersPage() {
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '', vehicle: '', hours: '', iban: '', agreeCheck: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // inject focus ring CSS once
  useEffect(() => {
    if (document.getElementById(focusStyleId)) return;
    const style = document.createElement('style');
    style.id = focusStyleId;
    style.textContent = `
      .rider-input:focus {
        border-color: ${ORANGE} !important;
        box-shadow: 0 0 0 3px ${ORANGE}28 !important;
      }
      .rider-select:focus {
        border-color: ${PURPLE} !important;
        box-shadow: 0 0 0 3px ${PURPLE}28 !important;
      }
      .rider-textarea:focus {
        border-color: ${PURPLE} !important;
        box-shadow: 0 0 0 3px ${PURPLE}28 !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // auto-rotate hero
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreeCheck) return;
    if (form.iban && form.iban.trim().length > 0) {
      const cleaned = form.iban.replace(/\s/g, '').toUpperCase();
      if (cleaned.length < 15 || cleaned.length > 34 || !/^[A-Z]{2}\d{2}/.test(cleaned)) {
        setError('Voer een geldig IBAN-nummer in (bijv. NL00 ABCD 0123 4567 89)');
        return;
      }
    }
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';
      const res = await fetch(`${apiUrl}/api/riders/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          city: form.city,
          vehicle: form.vehicle,
          hoursPerWeek: form.hours,
          iban: form.iban,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Aanmelding mislukt');
      setSubmitted(true);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('CORS')) {
        setError('Verbinding mislukt. Controleer je internetverbinding en probeer opnieuw.');
      } else {
        setError(msg || 'Er ging iets mis. Probeer opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* ── Hero with rotating background ── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Slide images */}
        {heroSlides.map((s, i) => (
          <motion.div key={i} animate={{ opacity: slide === i ? 1 : 0 }} transition={{ duration: 1.2 }}
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Image src={s.src} alt={s.alt} fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority={i === 0} />
            {/* dark overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)' }} />
          </motion.div>
        ))}

        {/* Gradient accent */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at 50% 60%, rgba(90,49,244,0.25) 0%, transparent 60%)' }} />

        {/* Animated grain overlay for premium texture */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.035,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760, textAlign: 'center', padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,40px)' }}>
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(90,49,244,0.25)', backdropFilter: 'blur(8px)', border: `1px solid ${PURPLE}60`, borderRadius: 40, padding: '7px 20px', fontSize: 13, fontWeight: 700, color: '#d4c8ff', marginBottom: 28 }}>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE, boxShadow: `0 0 8px ${PURPLE}`, display: 'block' }} />
            Bezorgen met EnJoy
          </motion.div>

          {heroSlides.map((s, i) => (
            <motion.div key={i} animate={{ opacity: slide === i ? 1 : 0, y: slide === i ? 0 : 16 }} transition={{ duration: 0.8 }}
              style={{ position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0, right: 0, pointerEvents: slide === i ? 'auto' : 'none' }}>
              <h1 style={{ fontSize: 'clamp(32px,7vw,68px)', fontWeight: 950, lineHeight: 1.03, marginBottom: 20, letterSpacing: -2, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                {s.headline.split(' ').slice(0, -2).join(' ')}{' '}
                <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {s.headline.split(' ').slice(-2).join(' ')}
                </span>
              </h1>
              <p style={{ fontSize: 'clamp(16px,2.2vw,20px)', color: 'rgba(255,255,255,0.82)', marginBottom: 40, lineHeight: 1.6 }}>{s.sub}</p>
            </motion.div>
          ))}

          {/* Spacer to account for absolute positioned slides */}
          <div style={{ height: 'clamp(110px,18vw,170px)' }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.a href="#aanmelden" whileHover={{ scale: 1.04, boxShadow: `0 12px 40px ${ORANGE}60` }} whileTap={{ scale: 0.97 }}
              style={{ background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 32px ${ORANGE}50`, display: 'inline-block' }}>
              Aanmelden als bezorger
            </motion.a>
            <motion.a href="#how-it-works" whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.18)' }} whileTap={{ scale: 0.97 }}
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: '#fff', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-block' }}>
              Meer weten
            </motion.a>
          </motion.div>
        </div>

        {/* Slide dots */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: 10 }}>
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width: slide === i ? 28 : 10, height: 10, borderRadius: 5, background: slide === i ? PURPLE : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
          ))}
        </div>
      </section>

      {/* ── Animated Stats ── */}
      <section style={{ padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,60px)', background: `linear-gradient(135deg,${PURPLE}18,${PINK}0c)`, borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        {/* decorative gradient bar at top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${PURPLE},${PINK},${ORANGE})` }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 32, maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          {statsData.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div style={{ fontSize: 'clamp(30px,5vw,46px)', fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6, fontWeight: 600 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Perks ── */}
      <section style={{ padding: 'clamp(32px,5vw,88px) clamp(16px,4vw,60px)' }}>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: 'clamp(26px,5vw,40px)', fontWeight: 900, marginBottom: 56, letterSpacing: -1 }}>
          Waarom bezorgen bij EnJoy?
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24, maxWidth: 960, margin: '0 auto' }}>
          {perks.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: `0 24px 56px ${p.color}30` }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', cursor: 'default', transition: 'box-shadow 0.25s', position: 'relative', overflow: 'hidden' }}>
              {/* per-card glow spot */}
              <div style={{ position: 'absolute', top: -24, right: -24, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle,${p.color}20,transparent 70%)`, pointerEvents: 'none' }} />
              <motion.div
                whileHover={{ scale: 1.12, rotate: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, background: `${p.color}18`, color: p.color, position: 'relative' }}>
                {p.icon}
              </motion.div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{p.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 15, margin: 0 }}>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: 'clamp(32px,5vw,88px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.03)', position: 'relative', overflow: 'hidden' }}>
        {/* decorative blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle,${PURPLE}14,transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle,${PINK}0e,transparent 70%)`, pointerEvents: 'none' }} />

        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: 'clamp(26px,5vw,40px)', fontWeight: 900, marginBottom: 64, letterSpacing: -1 }}>
          Start in 3 stappen
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 40, maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          {/* connector line between steps (desktop only) */}
          <div style={{ position: 'absolute', top: 36, left: '16.5%', right: '16.5%', height: 2, background: `linear-gradient(90deg,${PURPLE}40,${PINK}40)`, pointerEvents: 'none', zIndex: 0 }} />

          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
              style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.1, boxShadow: `0 16px 40px ${PURPLE}45` }}
                style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg,${PURPLE},${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: `0 12px 32px ${PURPLE}30` }}>
                <span style={{ fontSize: 22, fontWeight: 950, color: '#fff' }}>{s.num}</span>
              </motion.div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, maxWidth: 260, margin: '0 auto' }}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Application Form ── */}
      <section id="aanmelden" style={{ padding: 'clamp(40px,5vw,96px) clamp(16px,4vw,60px)' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <div style={{ display: 'inline-block', background: `rgba(255,107,53,0.12)`, border: `1px solid ${ORANGE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: ORANGE, marginBottom: 16 }}>
                Aanmeldformulier
              </div>
              <h2 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 12 }}>Word bezorger bij EnJoy</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6 }}>Vul het formulier in en we nemen binnen 24 uur contact met je op.</p>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '60px 40px', background: `linear-gradient(135deg,${PURPLE}0a,${PINK}06)`, borderRadius: 28, border: `1px solid ${PURPLE}30` }}>
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg,${PURPLE},${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
                <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 14 }}>Aanmelding ontvangen!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                  We hebben een e-mail gestuurd naar <strong>{form.email}</strong> om je wachtwoord in te stellen en toegang te krijgen tot je Rider Dashboard.
                </p>
                <Link href="/rider-portal" style={{ display: 'inline-block', background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', padding: '14px 36px', borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: 'none', marginBottom: 18, boxShadow: `0 8px 24px ${ORANGE}35` }}>
                  Ga naar Rider Portal →
                </Link>
                <br />
                <Link href="/discover" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                  Ontdek EnJoy →
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}
                style={{ background: 'var(--bg-card)', borderRadius: 28, border: '1px solid var(--border)', padding: 'clamp(24px,4vw,44px)', display: 'flex', flexDirection: 'column', gap: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}>

                {/* Section: Persoonlijke gegevens */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${ORANGE},${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Persoonlijke gegevens</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Name row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Voornaam *</label>
                        <input className="rider-input" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Jan" required style={inputBase} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Achternaam *</label>
                        <input className="rider-input" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="de Vries" required style={inputBase} />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>E-mailadres *</label>
                        <input className="rider-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jan@example.com" required style={inputBase} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Telefoonnummer *</label>
                        <input className="rider-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+31 6 12345678" required style={inputBase} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border)', margin: '0 -4px' }} />

                {/* Section: Bezorgdetails */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${PURPLE},${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Bezorgdetails</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* City & Vehicle */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Stad *</label>
                        <select className="rider-select" value={form.city} onChange={e => set('city', e.target.value)} required style={selectBase}>
                          <option value="">Kies je stad</option>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Voertuig *</label>
                        <select className="rider-select" value={form.vehicle} onChange={e => set('vehicle', e.target.value)} required style={selectBase}>
                          <option value="">Kies je voertuig</option>
                          {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Hours */}
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Beschikbaarheid *</label>
                      <select className="rider-select" value={form.hours} onChange={e => set('hours', e.target.value)} required style={selectBase}>
                        <option value="">Hoeveel uur per week?</option>
                        <option value="10-20">10–20 uur (parttime)</option>
                        <option value="20-30">20–30 uur</option>
                        <option value="30+">30+ uur (fulltime)</option>
                        <option value="weekend">Alleen weekenden</option>
                        <option value="avond">Alleen avonden</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border)', margin: '0 -4px' }} />

                {/* Section: Betaling */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${ORANGE}90,${PURPLE}90)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Betaling</span>
                  </div>

                  {/* IBAN */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      IBAN <span style={{ fontWeight: 400, opacity: 0.55, textTransform: 'none', letterSpacing: 0 }}>(optioneel — voor snellere uitbetaling)</span>
                    </label>
                    <input className="rider-input" value={form.iban} onChange={e => set('iban', e.target.value)} placeholder="NL00 ABCD 0123 4567 89" style={inputBase} />
                  </div>
                </div>

                {/* Agreement */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, padding: '16px 18px', background: `rgba(90,49,244,0.04)`, borderRadius: 12, border: `1px solid ${PURPLE}18` }}>
                  <input type="checkbox" checked={form.agreeCheck} onChange={e => set('agreeCheck', e.target.checked)} required
                    style={{ width: 18, height: 18, marginTop: 3, accentColor: ORANGE, flexShrink: 0 }} />
                  <span>
                    Ik ga akkoord met een achtergrondcontrole en de{' '}
                    <Link href="/terms" style={{ color: PURPLE, textDecoration: 'none', fontWeight: 700 }}>Algemene Voorwaarden</Link>{' '}
                    en het{' '}
                    <Link href="/privacy" style={{ color: PURPLE, textDecoration: 'none', fontWeight: 700 }}>Privacybeleid</Link> van EnJoy.
                  </span>
                </label>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#ef4444', fontSize: 14, fontWeight: 600, background: 'rgba(239,68,68,0.08)', padding: '10px 14px', borderRadius: 10, margin: 0 }}>
                    {error}
                  </motion.p>
                )}

                <motion.button type="submit" data-track="rider-apply" disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? undefined : `0 16px 40px ${ORANGE}50` }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{ background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', border: 'none', borderRadius: 14, padding: '18px 0', fontSize: 17, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4, boxShadow: `0 10px 28px ${ORANGE}38`, letterSpacing: '-0.2px' }}>
                  {loading ? 'Verwerken…' : 'Aanmelding indienen →'}
                </motion.button>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                  Je gegevens worden veilig verwerkt. We nemen binnen 24 uur contact op.
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
