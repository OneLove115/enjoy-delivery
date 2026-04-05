'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, animate } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

// ---------- data ----------
const features = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    color: PURPLE,
    title: 'Team maaltijdbudgetten',
    text: 'Stel maandelijkse budgetten per medewerker in. Zij bestellen, jij houdt de controle.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    color: PINK,
    title: 'Automatische rapportages',
    text: 'Maandelijkse rapporten die integreren met je boekhoudsoftware. Nul handmatig werk.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    color: PURPLE,
    title: 'Catering voor evenementen',
    text: 'Bedrijfslunch, teamborrel, directiedineer — wij regelen het op schaal en op tijd.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    color: PINK,
    title: 'Één factuur',
    text: 'Alle teambestellingen op één maandelijkse factuur. Eenvoudig voor de boekhouding.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    color: PURPLE,
    title: 'SSO & integraties',
    text: 'Single sign-on, Slack-meldingen en integratie met HR-tools zoals Workday.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.83a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
      </svg>
    ),
    color: PINK,
    title: 'Dedicated account manager',
    text: 'Een persoonlijke account manager voor vragen, onboarding en alles daartussen.',
  },
];

const statsData = [
  { value: 500, prefix: '', suffix: '+', label: 'Bedrijfsklanten' },
  { value: 2, prefix: '€', suffix: 'M+', label: 'Budget beheerd' },
  { value: 24, prefix: '', suffix: 'u', label: 'Onboarding tijd' },
  { value: 98, prefix: '', suffix: '%', label: 'Klanttevredenheid' },
];

const testimonials = [
  { quote: 'EnJoy Business heeft onze lunch-workflow volledig getransformeerd. Setup in één dag, geen gedoe.', name: 'Marta K.', role: 'Office Manager, TechCorp Amsterdam', initials: 'MK', color: PURPLE },
  { quote: 'De rapportages zijn geweldig. Onze boekhouder is blij, ons team is blij. Win-win.', name: 'Daan V.', role: 'CFO, Scale-up Rotterdam', initials: 'DV', color: PINK },
  { quote: 'Catering voor 200 man geregeld in minder dan een uur. Ongelooflijk.', name: 'Sophie L.', role: 'HR Director, Consultancy Den Haag', initials: 'SL', color: ORANGE },
];

const logos = ['Google', 'Booking.com', 'Philips', 'ASML', 'ING'];

const teamSizes = ['1–10 medewerkers', '11–50 medewerkers', '51–200 medewerkers', '200–500 medewerkers', '500+ medewerkers'];
const useCases = ['Dagelijkse teamlunches', 'Maaltijdbudget per medewerker', 'Catering voor evenementen', 'Klantrelatiebeheer / representatie', 'Combinatie van bovenstaande'];
const budgets = ['< €500/maand', '€500 – €2.000/maand', '€2.000 – €5.000/maand', '€5.000 – €10.000/maand', '> €10.000/maand'];

// ---------- animated counter ----------
function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate(latest) {
        if (ref.current) ref.current.textContent = prefix + Math.round(latest) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ---------- shared input styles ----------
const inputStyle: React.CSSProperties = {
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
const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  background: 'rgba(255,255,255,0.05) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' fill=\'none\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\'/%3E%3C/svg%3E") no-repeat right 16px center',
};

// ---------- focus style injection ----------
const focusStyleId = 'business-focus-styles';

export default function BusinessPage() {
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', teamSize: '', useCase: '', budget: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // inject focus ring CSS once
  useEffect(() => {
    if (document.getElementById(focusStyleId)) return;
    const style = document.createElement('style');
    style.id = focusStyleId;
    style.textContent = `
      .biz-input:focus {
        border-color: ${PURPLE} !important;
        box-shadow: 0 0 0 3px ${PURPLE}28 !important;
      }
      .biz-select:focus {
        border-color: ${PURPLE} !important;
        box-shadow: 0 0 0 3px ${PURPLE}28 !important;
      }
      .biz-textarea:focus {
        border-color: ${PURPLE} !important;
        box-shadow: 0 0 0 3px ${PURPLE}28 !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';
      const res = await fetch(`${apiUrl}/api/business/inquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: form.company,
          name: form.name,
          email: form.email,
          phone: form.phone,
          teamSize: form.teamSize,
          useCase: form.useCase,
          budget: form.budget,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Aanvraag mislukt');
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

      {/* ── Hero with background image ── */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image src="/food/hero-feast.png" alt="Business feast" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.78) 100%)' }} />
        </div>
        {/* Gradient accent */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: `radial-gradient(ellipse at 50% 55%, ${PURPLE}28 0%, transparent 60%)` }} />

        {/* Animated grain overlay for premium texture */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.03,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 2, maxWidth: 780, textAlign: 'center', padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,40px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(90,49,244,0.25)', backdropFilter: 'blur(8px)', border: `1px solid ${PURPLE}60`, borderRadius: 40, padding: '7px 20px', fontSize: 13, fontWeight: 700, color: '#d4c8ff', marginBottom: 28 }}>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE, boxShadow: `0 0 8px ${PURPLE}`, display: 'block' }} />
            EnJoy voor Bedrijven
          </motion.div>

          <h1 style={{ fontSize: 'clamp(32px,7vw,68px)', fontWeight: 950, lineHeight: 1.03, marginBottom: 22, letterSpacing: -2, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            Voed je team.{' '}
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Imponeer je klanten.
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(16px,2.2vw,20px)', color: 'rgba(255,255,255,0.83)', marginBottom: 44, lineHeight: 1.65, maxWidth: 600, margin: '0 auto 44px' }}>
            Bedrijfsmaaltijden, teambudgetten en kantoormaaltijden — allemaal op één koninklijk platform.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.a href="#aanvragen" whileHover={{ scale: 1.04, boxShadow: `0 12px 40px ${PURPLE}60` }} whileTap={{ scale: 0.97 }}
              style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 32px ${PURPLE}50`, display: 'inline-block' }}>
              Aanvraag indienen
            </motion.a>
            <motion.a href="#features" whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.18)' }} whileTap={{ scale: 0.97 }}
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: '#fff', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-block' }}>
              Bekijk features
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.55 }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6))' }} />
        </motion.div>
      </section>

      {/* ── Trusted by ── */}
      <section style={{ padding: 'clamp(32px,4vw,56px) clamp(16px,4vw,60px)', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 28, fontWeight: 700 }}>Vertrouwd door teams bij</p>
        <div style={{ display: 'flex', gap: 'clamp(20px,4vw,48px)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {logos.map((l, i) => (
            <motion.span key={l} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ opacity: 0.6, scale: 1.05 }}
              style={{ color: 'rgba(255,255,255,0.22)', fontSize: 'clamp(14px,2vw,18px)', fontWeight: 800, letterSpacing: -0.5, cursor: 'default' }}>
              {l}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ── Animated Stats ── */}
      <section style={{ padding: 'clamp(32px,5vw,72px) clamp(16px,4vw,60px)', background: `linear-gradient(135deg,${PURPLE}14,${PINK}0a)`, borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        {/* gradient top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${PURPLE},${PINK},${ORANGE})` }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 32, maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          {statsData.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              whileHover={{ scale: 1.05 }}>
              <div style={{ fontSize: 'clamp(30px,5vw,48px)', fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8, fontWeight: 600 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: 'clamp(40px,5vw,96px) clamp(16px,4vw,60px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${PURPLE}0e,transparent 70%)`, pointerEvents: 'none' }} />

        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: 'clamp(26px,5vw,42px)', fontWeight: 900, marginBottom: 56, letterSpacing: -1 }}>
          Alles wat je team nodig heeft
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: `0 28px 60px ${f.color}28` }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', cursor: 'default', transition: 'box-shadow 0.25s', position: 'relative', overflow: 'hidden' }}>
              {/* glow spot */}
              <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle,${f.color}18,transparent 70%)`, pointerEvents: 'none' }} />
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5, boxShadow: `0 8px 24px ${f.color}40` }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, background: `${f.color}18`, color: f.color, position: 'relative' }}>
                {f.icon}
              </motion.div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 15, margin: 0 }}>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: 'clamp(40px,5vw,88px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.03)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 360, height: 360, borderRadius: '50%', background: `radial-gradient(circle,${PINK}0c,transparent 70%)`, pointerEvents: 'none' }} />

        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: 'clamp(24px,4.5vw,38px)', fontWeight: 900, marginBottom: 56, letterSpacing: -1 }}>
          Wat onze klanten zeggen
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -7, scale: 1.02, boxShadow: `0 24px 56px ${t.color}22` }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 20, transition: 'box-shadow 0.25s', position: 'relative', overflow: 'hidden', cursor: 'default' }}>
              {/* per-card accent top bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${t.color},${PINK})`, borderRadius: '24px 24px 0 0' }} />
              {/* stars */}
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                {[...Array(5)].map((_, k) => (
                  <motion.svg key={k} width="16" height="16" viewBox="0 0 24 24"
                    initial={{ fill: t.color, opacity: 0.75 }}
                    whileHover={{ opacity: 1, scale: 1.2 }}
                    style={{ fill: t.color, opacity: 0.85 }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </motion.svg>
                ))}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.75, fontStyle: 'italic', margin: 0, flex: 1 }}>
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${t.color},${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Business Inquiry Form ── */}
      <section id="aanvragen" style={{ padding: 'clamp(40px,5vw,96px) clamp(16px,4vw,60px)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <div style={{ display: 'inline-block', background: `rgba(90,49,244,0.12)`, border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 16 }}>
                Zakelijke aanvraag
              </div>
              <h2 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 12 }}>Aan de slag met EnJoy Business</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6 }}>Vul het formulier in. Onze sales consultant neemt binnen 24 uur contact op.</p>
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
                <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 14 }}>Aanvraag ontvangen!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                  U kunt nu een account aanmaken om toegang te krijgen tot uw Business Dashboard.
                </p>
                <Link href="/business-portal" style={{ display: 'inline-block', background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '14px 36px', borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: 'none', marginBottom: 18, boxShadow: `0 8px 24px ${PURPLE}35` }}>
                  Account aanmaken →
                </Link>
                <br />
                <Link href="/discover" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                  Ontdek EnJoy →
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}
                style={{ background: 'var(--bg-card)', borderRadius: 28, border: '1px solid var(--border)', padding: 'clamp(24px,4vw,44px)', display: 'flex', flexDirection: 'column', gap: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}>

                {/* Section: Bedrijfsgegevens */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${PURPLE},${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Bedrijfsgegevens</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Bedrijfsnaam *</label>
                      <input className="biz-input" value={form.company} onChange={e => set('company', e.target.value)} placeholder="EnJoy BV" required style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Uw naam *</label>
                      <input className="biz-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jan de Vries" required style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border)', margin: '0 -4px' }} />

                {/* Section: Contactgegevens */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${PINK},${ORANGE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Contactgegevens</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Zakelijk e-mailadres *</label>
                      <input className="biz-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jan@bedrijf.nl" required style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Telefoonnummer *</label>
                      <input className="biz-input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+31 70 123 4567" required style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border)', margin: '0 -4px' }} />

                {/* Section: Over uw behoefte */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${ORANGE},${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Over uw behoefte</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Team size */}
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Aantal medewerkers *</label>
                      <select className="biz-select" value={form.teamSize} onChange={e => set('teamSize', e.target.value)} required style={selectStyle}>
                        <option value="">Selecteer teamgrootte</option>
                        {teamSizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Use case & Budget */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Gebruik *</label>
                        <select className="biz-select" value={form.useCase} onChange={e => set('useCase', e.target.value)} required style={selectStyle}>
                          <option value="">Waarvoor heeft u EnJoy nodig?</option>
                          {useCases.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Maandbudget</label>
                        <select className="biz-select" value={form.budget} onChange={e => set('budget', e.target.value)} style={selectStyle}>
                          <option value="">Geschat maandbudget</option>
                          {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8 }}>Extra toelichting</label>
                      <textarea className="biz-textarea" value={form.message} onChange={e => set('message', e.target.value)} placeholder="Vertel ons over uw specifieke wensen of vragen…" rows={4}
                        style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#ef4444', fontSize: 14, fontWeight: 600, background: 'rgba(239,68,68,0.08)', padding: '10px 14px', borderRadius: 10, margin: 0 }}>
                    {error}
                  </motion.p>
                )}

                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? undefined : `0 16px 40px ${PURPLE}50` }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 14, padding: '18px 0', fontSize: 17, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4, boxShadow: `0 10px 28px ${PURPLE}38`, letterSpacing: '-0.2px' }}>
                  {loading ? 'Verwerken…' : 'Aanvraag versturen →'}
                </motion.button>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                  Geen minimale besteding vereist. Setup binnen 24 uur. Geen verborgen kosten.
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
