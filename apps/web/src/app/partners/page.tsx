'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { PartnersExitPopup } from './ExitIntentPopup';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration = 1800, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

/* ─── Veloci feature set ─── */
const features = [
  {
    icon: '📞',
    tag: 'PHONE AI',
    title: 'Mis nooit meer een bestelling',
    text: 'Onze AI beantwoordt elke oproep, neemt bestellingen op en verwerkt vragen — ook tijdens de drukste vrijdagavond. Klinkt natuurlijk, werkt 24/7.',
    accent: PURPLE,
  },
  {
    icon: '📱',
    tag: 'MULTI-CHANNEL',
    title: 'Telefoon, web, SMS & WhatsApp',
    text: 'Elk bestelkanaal komt samen in één dashboard. Geen tablets meer jongleren — alles op één plek.',
    accent: PINK,
  },
  {
    icon: '🖥️',
    tag: 'KITCHEN HQ',
    title: 'Realtime keuken commandocentrum',
    text: 'Live order heatmaps, voorspellende pacingmeldingen en keukenoptimalisatie houden je team op gang, zonder de chaos.',
    accent: ORANGE,
  },
  {
    icon: '🚲',
    tag: 'DELIVERY',
    title: 'Slimme routeoptimalisatie',
    text: 'AI-verzending met live bezorgersvolgen en automatische ETA-updates rechtstreeks naar jouw klanten.',
    accent: PURPLE,
  },
  {
    icon: '📊',
    tag: 'ANALYTICS',
    title: 'Omzetintelligentie',
    text: 'Piekuren, bestsellers, upsell-kansen en omzettrends — allemaal realtime bijgewerkt.',
    accent: PINK,
  },
  {
    icon: '🔌',
    tag: 'INTEGRATIES',
    title: 'Werkt met je huidige setup',
    text: 'Integreert met je bestaande kassa, betaalterminal en printer. Geen hardware vervanging nodig.',
    accent: ORANGE,
  },
];

/* ─── Pricing ─── */
const plans = [
  {
    name: 'Growth',
    price: '€99.95',
    period: '/maand',
    desc: 'Alles wat je nodig hebt om online te beginnen met bestellen',
    perks: ['Tot 500 bestellingen/maand', 'Web + SMS bestellen', 'Menubeheer', 'Keuken display systeem', 'Basis analytics', 'E-mail support', '3 teamleden', '1 telefoonnummer inbegrepen', 'Bestelnotificaties altijd gratis', 'Betaal-per-gebruik communicatietegoed'],
    cta: 'Start €1 proefperiode',
    href: 'https://www.veloci.online/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '€199.95',
    period: '/maand',
    desc: 'Geavanceerde functies voor groeiende restaurants',
    perks: ['Onbeperkte bestellingen', 'Alles van Growth', 'WhatsApp bestellen', 'Bezorgbeheer', 'Live kaart volgen', 'Chauffeursbeheer (max 10)', '10 teamleden', '1 telefoonnummer inbegrepen', 'Betaal-per-gebruik communicatietegoed', 'AI telefoon bestellen inbegrepen', 'Bestelnotificaties altijd gratis', 'Prioriteit support'],
    cta: 'Start €1 proefperiode',
    href: 'https://www.veloci.online/signup',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '€299.95',
    period: '/maand',
    desc: 'Volledig platform met AI en onbeperkte schaal',
    perks: ['Alles onbeperkt', 'Alles van Pro', 'AI telefoon bestellen', 'Bezorgautomatisering', 'API toegang', 'AI analytics & inzichten', 'Video marketingtools', 'Onbeperkte teamleden & chauffeurs', '2 telefoonnummers inbegrepen', 'Betaal-per-gebruik communicatietegoed', 'Bestelnotificaties altijd gratis', 'Dedicated account manager'],
    cta: 'Start €1 proefperiode',
    href: 'https://www.veloci.online/signup',
    highlight: false,
  },
];

const stats = [
  { raw: 2400, display: '2.400+', label: 'Restaurants' },
  { raw: 1200, display: '1,2M',   label: 'Bestellingen / maand' },
  { raw: 999,  display: '99,9%',  label: 'Uptime' },
  { raw: 1,    display: '< 1s',   label: 'AI responstijd' },
];

const steps = [
  { num: '01', title: 'Maak een Veloci-account aan', text: 'Ga naar veloci.online/signup. Naam, restaurant, e-mail — klaar in 5 minuten.' },
  { num: '02', title: 'AI leert jouw restaurant kennen', text: 'Upload je menu. Veloci traint de AI op jouw specifieke items, tijden en aanbiedingen — live binnen 24 uur.' },
  { num: '03', title: 'Bestellingen stromen automatisch binnen', text: 'Telefoon, WhatsApp, web en EnJoy — alles in één dashboard. Nul gemiste bestellingen.' },
];

const testimonials = [
  {
    quote: 'We misten vroeger 30+ oproepen elke vrijdagavond. Nu verwerkt de AI alles en verkoopt hij zelfs desserts beter dan mijn personeel.',
    name: 'Marco Pellegrini',
    role: "Eigenaar, Pellegrini's Pizzeria",
    accent: PURPLE,
    stars: 5,
  },
  {
    quote: 'Setup duurde één middag. Bij de volgende dinnerush hadden we nul gemiste bestellingen. Ik wou dat we dit twee jaar geleden hadden gedaan.',
    name: 'Sarah Kowalski',
    role: 'GM, Brooklyn Slice Co.',
    accent: PINK,
    stars: 5,
  },
  {
    quote: 'WhatsApp-bestellen alleen al betaalde het abonnement terug in de eerste maand. Klanten zijn er dol op.',
    name: 'Dante Ruiz',
    role: 'Eigenaar, Ruiz Family Kitchen',
    accent: ORANGE,
    stars: 5,
  },
];

/* ─── Stat card with counting animation ─── */
function StatCard({ s, delay }: { s: typeof stats[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(s.raw, 1600, inView);
  const displayValue = s.raw === 1 || s.raw === 999 ? s.display : `${count.toLocaleString('nl-NL')}+`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        textAlign: 'center', padding: '32px 16px',
        background: 'var(--bg-card)', borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `0 0 0 0 ${PURPLE}`,
      }}
      whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${PURPLE}30` }}
    >
      <div style={{
        fontSize: 32, fontWeight: 950,
        background: `linear-gradient(135deg,${PURPLE},${PINK})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6,
      }}>
        {displayValue}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.label}</div>
    </motion.div>
  );
}

/* ─── Feature card with hover glow + icon rotation ─── */
function FeatureCard({ f, i }: { f: typeof features[0]; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07 }}
      whileHover={{ scale: 1.03, y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        padding: '30px 26px', borderRadius: 20,
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? f.accent + '40' : 'var(--border)'}`,
        boxShadow: hovered ? `0 8px 32px ${f.accent}25` : 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <motion.div
          animate={{ rotate: hovered ? 12 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ fontSize: 32, display: 'inline-block' }}
        >
          {f.icon}
        </motion.div>
        <div style={{
          fontSize: 10, fontWeight: 800, color: f.accent, letterSpacing: 1.5,
          textTransform: 'uppercase', background: `${f.accent}18`,
          borderRadius: 6, padding: '3px 8px',
        }}>
          {f.tag}
        </div>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{f.title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: 14 }}>{f.text}</p>
    </motion.div>
  );
}

/* ─── Star animation ─── */
function Stars({ count, accent }: { count: number; accent: string }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 15 }}
          style={{ color: accent, fontSize: 16 }}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}

/* ─── Testimonial card ─── */
function TestimonialCard({ t, i }: { t: typeof testimonials[0]; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ y: -6, boxShadow: `0 16px 48px ${t.accent}25` }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        padding: '28px 26px', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0,
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? t.accent + '50' : 'var(--border)'}`,
        transition: 'border-color 0.25s',
        borderLeft: `3px solid ${t.accent}`,
      }}
    >
      <Stars count={t.stars} accent={t.accent} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.75, fontStyle: 'italic', flex: 1, marginBottom: 20 }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div>
        <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{t.name}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{t.role}</div>
      </div>
    </motion.div>
  );
}

/* ─── Pricing card ─── */
function PricingCard({ p, i }: { p: typeof plans[0]; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        padding: '36px 30px', borderRadius: 24, position: 'relative',
        display: 'flex', flexDirection: 'column',
        background: p.highlight
          ? `linear-gradient(145deg, rgba(90,49,244,0.18), rgba(255,0,128,0.1))`
          : 'var(--bg-card)',
        boxShadow: p.highlight
          ? hovered ? `0 24px 60px ${PURPLE}35` : `0 0 40px ${PURPLE}20`
          : hovered ? `0 16px 40px rgba(0,0,0,0.3)` : 'none',
        transition: 'box-shadow 0.3s',
        ...(p.highlight ? {
          padding: '36px 30px',
          background: `linear-gradient(145deg, rgba(90,49,244,0.18), rgba(255,0,128,0.1))`,
          /* gradient border via outline trick */
          outline: 'none',
        } : {}),
      }}
    >
      {/* Gradient border for Pro */}
      {p.highlight && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 24, padding: 2,
          background: `linear-gradient(135deg,${PURPLE},${PINK})`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }} />
      )}
      {!p.highlight && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 24,
          border: '1px solid var(--border)',
          pointerEvents: 'none',
        }} />
      )}

      {p.highlight && (
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
          background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white',
          fontSize: 11, fontWeight: 800, padding: '5px 18px', borderRadius: 20,
          whiteSpace: 'nowrap', letterSpacing: 0.5,
        }}>
          MEEST POPULAIR
        </div>
      )}

      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{p.name}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '12px 0 6px' }}>
        <span style={{ fontSize: 40, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.price}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{p.period}</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>{p.desc}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {p.perks.map((perk, pi) => (
          <li key={pi} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
            <span style={{ color: '#22C55E', flexShrink: 0, marginTop: 1 }}>✓</span>
            {perk}
          </li>
        ))}
      </ul>
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block', textAlign: 'center', padding: '14px 0',
          borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none',
          background: p.highlight ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.07)',
          color: 'white',
          border: p.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)',
          boxShadow: p.highlight ? `0 6px 20px ${PURPLE}40` : 'none',
        }}
      >
        {p.cta}
      </a>
    </motion.div>
  );
}

export default function PartnersPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <PartnersExitPopup />
      <Nav />

      {/* ─── Hero ─── */}
      <section style={{ position: 'relative', padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', textAlign: 'center', overflow: 'hidden', minHeight: 520, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/marketing/partners-hero.png), url(/food/hero-feast.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 60%, var(--bg-page) 100%)' }} />
        {/* Grain texture */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, opacity: 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', backgroundSize: '160px 160px',
        }} />
        {/* Radial accent */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(ellipse at 50% 40%, rgba(90,49,244,0.18) 0%, transparent 65%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 4, maxWidth: 760, margin: '0 auto' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 40, padding: '8px 20px', fontSize: 13, fontWeight: 700, marginBottom: 28, backdropFilter: 'blur(8px)' }}>
            <span translate="no" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EnJoy</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>×</span>
            <span style={{ color: 'white' }}>Veloci</span>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22C55E', marginLeft: 4 }} />
          </div>

          <h1 style={{ fontSize: 'clamp(28px,6vw,58px)', fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Bereik duizenden klanten<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>via het Veloci-platform</span>
          </h1>

          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.75)', marginBottom: 14, lineHeight: 1.65, maxWidth: 620, margin: '0 auto 16px' }}>
            EnJoy draait op <strong style={{ color: 'white' }}>Veloci</strong> — het AI-orderplatform voor bezorgrestaurants. Meld je aan bij Veloci en je restaurant verschijnt automatisch op EnJoy.
          </p>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>
            Geen gemiste bestellingen meer. Setup in 24 uur. Start voor slechts €1.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.a
              href="https://www.veloci.online/signup"
              target="_blank"
              rel="noopener noreferrer"
              data-track="partner-cta"
              whileHover={{ scale: 1.05, boxShadow: `0 12px 36px ${PURPLE}60` }}
              whileTap={{ scale: 0.97 }}
              style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 38px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 24px ${PURPLE}40` }}
            >
              Start €1 proefperiode →
            </motion.a>
            <motion.a
              href="https://www.veloci.online/signup?demo=true"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
            >
              Boek een demo
            </motion.a>
          </div>

          <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            €1 proefperiode · 5 dagen · Annuleer wanneer je wilt
          </p>
        </motion.div>
      </section>

      {/* ─── Stats bar ─── */}
      <section style={{ padding: '0 clamp(16px,4vw,60px) clamp(24px,4vw,60px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, maxWidth: 880, margin: '0 auto' }}>
          {stats.map((s, i) => (
            <StatCard key={i} s={s} delay={i * 0.07} />
          ))}
        </div>
      </section>

      {/* ─── Trusted by ─── */}
      <section style={{ padding: 'clamp(16px,3vw,40px) clamp(16px,4vw,60px)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>Vertrouwd door restaurants in heel Noord-Amerika & Europa</p>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {["Pellegrini's Pizzeria", 'Brooklyn Slice Co.', 'Ruiz Family Kitchen', 'The Crust Factory', 'Napoli Express', 'Urban Pies'].map(name => (
            <span key={name} style={{ color: 'rgba(255,255,255,0.18)', fontSize: 14, fontWeight: 700 }}>{name}</span>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section style={{ padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(24px,5vw,40px)', fontWeight: 950, letterSpacing: -1, marginBottom: 14 }}>Alles gebouwd voor drukke bezorgrestaurants</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17 }}>Elke functie is ontworpen rond één doel: zorg dat je nooit een sale verliest aan een gemiste oproep of een ingewikkeld bestelsysteem.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, maxWidth: 980, margin: '0 auto' }}>
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} i={i} />
          ))}
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section style={{ padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.03)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(24px,5vw,38px)', fontWeight: 950, letterSpacing: -1 }}>Op en actief in één middag</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>Geen IT-team nodig. Geen hardware te installeren. Gewoon aansluiten en gaan.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 36, maxWidth: 820, margin: '0 auto 52px' }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 14 }}>{s.num}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65 }}>{s.text}</p>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <motion.a
            href="https://www.veloci.online/signup"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, boxShadow: `0 12px 36px ${PURPLE}45` }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-block', background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '15px 40px', borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: `0 8px 24px ${PURPLE}35` }}
          >
            Maak je gratis account aan →
          </motion.a>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section style={{ padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 950, letterSpacing: -1, marginBottom: 48 }}>Wat restaurants zeggen</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 980, margin: '0 auto' }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} i={i} />
          ))}
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section style={{ padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.03)' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'inline-block', background: 'rgba(90,49,244,0.1)', border: `1px solid ${PURPLE}30`, borderRadius: 40, padding: '6px 18px', fontSize: 12, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Prijzen</div>
          <h2 style={{ fontSize: 'clamp(24px,5vw,40px)', fontWeight: 950, letterSpacing: -1 }}>Simpel en transparant</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>Geen opzetkosten. Geen contracten. Annuleer wanneer je wilt.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 980, margin: '0 auto' }}>
          {plans.map((p, i) => (
            <PricingCard key={i} p={p} i={i} />
          ))}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 28 }}>
          Alle abonnementen starten met een proefperiode van €1 (5 dagen). Bestelnotificaties (SMS & WhatsApp) inbegrepen bij alle abonnementen.
        </p>
      </section>

      {/* ─── Final CTA ─── */}
      <section style={{ padding: 'clamp(48px,6vw,96px) clamp(16px,4vw,60px)', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: 620, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 950, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20 }}>
            Klaar om te stoppen met bestellingen missen?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 36, lineHeight: 1.65 }}>
            Start je €1 proefperiode (5 dagen). Opzet in 24 uur. Annuleer wanneer je wilt.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.a
              href="https://www.veloci.online/signup"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: `0 12px 36px ${PURPLE}55` }}
              whileTap={{ scale: 0.97 }}
              style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 28px ${PURPLE}45` }}
            >
              Start €1 proefperiode
            </motion.a>
            <motion.a
              href="https://www.veloci.online/pricing"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ background: 'var(--b8)', color: 'var(--text-primary)', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Bekijk prijzen
            </motion.a>
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
            {['€1 · 5 dagen', 'Annuleer altijd', '24/7 support'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                <span style={{ color: '#22C55E', fontSize: 15 }}>✓</span>{t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
