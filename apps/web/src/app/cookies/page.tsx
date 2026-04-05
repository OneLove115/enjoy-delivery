'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

const cookieTypes = [
  {
    icon: '🔒',
    name: 'Essentieel',
    color: '#00C853',
    required: true,
    desc: 'Vereist voor basisfunctionaliteit — inlogsessies, winkelwagen-inhoud en beveiligingstokens. Kan niet worden uitgeschakeld.',
    examples: ['Sessie-token', 'CSRF-bescherming', 'Inlogstatus'],
  },
  {
    icon: '📊',
    name: 'Prestaties',
    color: PURPLE,
    required: false,
    desc: 'Helpen ons te begrijpen hoe bezoekers omgaan met ons platform door anonieme analysedata te verzamelen (paginaweergaven, bouncepercentages, populaire functies).',
    examples: ['Google Analytics', 'Vercel Analytics', 'Heatmaps'],
  },
  {
    icon: '⚙️',
    name: 'Functioneel',
    color: ORANGE,
    required: false,
    desc: 'Onthouden je voorkeuren zoals taal (Nederlands/Engels), bezorgmodus en opgeslagen adressen.',
    examples: ['Taalvoorkeur', 'Bezorgmodus', 'Opgeslagen adressen'],
  },
  {
    icon: '📣',
    name: 'Marketing',
    color: PINK,
    required: false,
    desc: 'Worden met jouw toestemming gebruikt voor gepersonaliseerde promoties en het meten van de effectiviteit van onze campagnes.',
    examples: ['Gerichte advertenties', 'Campagne-tracking', 'Retargeting'],
  },
];

const navSections = [
  { id: 'what',       title: 'Wat zijn cookies?' },
  { id: 'types',      title: 'Cookies die we gebruiken' },
  { id: 'managing',   title: 'Cookies beheren' },
  { id: 'thirdparty', title: 'Cookies van derden' },
];

export default function CookiesPage() {
  const [active, setActive] = useState('what');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    navSections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,40px)', paddingTop: 'clamp(60px,8vw,100px)' }}>
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>

          {/* Sticky sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              flexShrink: 0, width: 200,
              position: 'sticky', top: 96,
              display: 'none',
            }}
            className="cookies-sidebar"
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16 }}>Inhoud</div>
            {navSections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '8px 12px', borderRadius: 8, marginBottom: 2,
                  background: active === s.id ? `rgba(90,49,244,0.12)` : 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 13, fontWeight: active === s.id ? 700 : 500,
                  color: active === s.id ? PURPLE : 'var(--text-muted)',
                  transition: 'all 0.15s',
                  borderLeft: `2px solid ${active === s.id ? PURPLE : 'transparent'}`,
                }}
              >
                {s.title}
              </button>
            ))}
          </motion.aside>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${PURPLE}22, ${PINK}18)`,
                  border: `1px solid ${PURPLE}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>
                  🍪
                </div>
                <h1 style={{
                  fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, margin: 0, letterSpacing: -1,
                  background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Cookiebeleid
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)',
                }}>
                  📅 Bijgewerkt: 20 maart 2026
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: `rgba(90,49,244,0.1)`, border: `1px solid ${PURPLE}30`,
                  color: PURPLE,
                }}>
                  🛡️ ePrivacy-conform
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16, marginBottom: 40 }}>
                EnJoy gebruikt cookies om je surfervaring te verbeteren, verkeer te analyseren en inhoud te personaliseren. Dit beleid legt uit wat cookies zijn, hoe wij ze gebruiken en welke keuzes je hebt.
              </p>
            </motion.div>

            {/* What are cookies */}
            <motion.section
              id="what"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ padding: '28px', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', marginBottom: 16, scrollMarginTop: 110 }}
            >
              <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14 }}>Wat zijn cookies?</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je een website bezoekt. Ze helpen de site je voorkeuren, inlogstatus en surfgedrag te onthouden.
              </p>
            </motion.section>

            {/* Cookie type cards */}
            <section id="types" style={{ scrollMarginTop: 110, marginBottom: 16 }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ padding: '28px', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)' }}
              >
                <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 24 }}>Cookies die we gebruiken</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cookieTypes.map((ct, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      style={{
                        padding: '20px 20px',
                        borderRadius: 14,
                        background: `${ct.color}08`,
                        border: `1px solid ${ct.color}25`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <span style={{ fontSize: 20 }}>{ct.icon}</span>
                        <span style={{ fontWeight: 800, fontSize: 15, color: ct.color }}>{ct.name}</span>
                        {ct.required && (
                          <span style={{
                            marginLeft: 'auto',
                            fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20,
                            background: `${ct.color}15`, border: `1px solid ${ct.color}35`,
                            color: ct.color,
                          }}>
                            VERPLICHT
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{ct.desc}</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {ct.examples.map((ex, j) => (
                          <span key={j} style={{
                            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--text-muted)',
                          }}>
                            {ex}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Managing */}
            <motion.section
              id="managing"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ padding: '28px', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', marginBottom: 16, scrollMarginTop: 110 }}
            >
              <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14 }}>Cookies beheren</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                Je kunt cookievoorkeuren beheren via je browserinstellingen. Het uitschakelen van essentiële cookies kan sommige functies ontoegankelijk maken. De meeste browsers staan het blokkeren of verwijderen van cookies toe — raadpleeg de helpdocumentatie van je browser voor instructies.
              </p>
            </motion.section>

            {/* Third party */}
            <motion.section
              id="thirdparty"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ padding: '28px', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', marginBottom: 16, scrollMarginTop: 110 }}
            >
              <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14 }}>Cookies van derden</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                We kunnen cookies gebruiken van vertrouwde derde partijen, waaronder Google Analytics, Vercel Analytics en betalingsverwerkers. Deze cookies vallen onder het privacybeleid van de betreffende derde partij.
              </p>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', padding: '28px', borderRadius: 16, background: `rgba(90,49,244,0.06)`, border: `1px solid ${PURPLE}20` }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 0 }}>
                Meer weten over je privacy?{' '}
                <Link href="/privacy" style={{ color: PURPLE, fontWeight: 700 }}>Lees ons privacybeleid</Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @media (min-width: 860px) {
          .cookies-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  );
}
