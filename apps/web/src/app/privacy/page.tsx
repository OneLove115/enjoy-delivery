'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

const sections = [
  { id: 'collection',  title: '1. Informatie die we verzamelen' },
  { id: 'usage',       title: '2. Hoe we je informatie gebruiken' },
  { id: 'sharing',     title: '3. Gegevens delen' },
  { id: 'security',    title: '4. Gegevensbeveiliging' },
  { id: 'rights',      title: '5. Jouw rechten (AVG/GDPR)' },
  { id: 'cookies-ref', title: '6. Cookies' },
  { id: 'contact',     title: '7. Contact' },
];

export default function PrivacyPage() {
  const [active, setActive] = useState<string>('collection');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach(s => {
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

          {/* Sticky sidebar nav */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              flexShrink: 0, width: 200,
              position: 'sticky', top: 96,
              display: 'none',
            }}
            className="privacy-sidebar"
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16 }}>Inhoud</div>
            {sections.map(s => (
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
                {s.title.replace(/^\d+\.\s/, '')}
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
                  🛡️
                </div>
                <div>
                  <h1 style={{
                    fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, margin: 0, letterSpacing: -1,
                    background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    Privacybeleid
                  </h1>
                </div>
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
                  ✓ AVG/GDPR-conform
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16, marginBottom: 40 }}>
                EnJoy (&ldquo;wij,&rdquo; &ldquo;ons&rdquo; of &ldquo;onze&rdquo;) hecht grote waarde aan je privacy. Dit beleid legt uit hoe wij je gegevens verzamelen, gebruiken en beschermen wanneer je ons bezorgplatform, onze app of website gebruikt.
              </p>
            </motion.div>

            {/* Sections */}
            {[
              {
                id: 'collection', title: '1. Informatie die we verzamelen',
                content: (
                  <>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16, marginBottom: 12 }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Persoonsgegevens:</strong> Naam, e-mailadres, telefoonnummer, bezorgadres, betaalgegevens en locatiedata wanneer je onze diensten gebruikt.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16, marginBottom: 12 }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Gebruiksdata:</strong> Browsertype, apparaatinfo, bezochte pagina&apos;s, tijd besteed, klikpatronen en zoekopdrachten binnen ons platform.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Locatiedata:</strong> Met je toestemming verzamelen we nauwkeurige geolocatiegegevens om bezorgdiensten te verlenen en restaurants bij jou in de buurt te tonen.
                    </p>
                  </>
                ),
              },
              {
                id: 'usage', title: '2. Hoe we je informatie gebruiken',
                content: (
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                    We gebruiken je persoonsgegevens voor: het verwerken en bezorgen van je bestellingen, klantenondersteuning via Joya AI, het personaliseren van je ervaring en aanbevelingen, het sturen van orderupdates en promotionele communicatie (met toestemming), het verbeteren van ons platform en het ontwikkelen van nieuwe functies, en het waarborgen van de veiligheid van onze diensten.
                  </p>
                ),
              },
              {
                id: 'sharing', title: '3. Gegevens delen',
                content: (
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                    We delen je gegevens met: restaurantpartners (ordergegevens voor bereiding), bezorgkoeriers (bezorgadres en contact), betalingsverwerkers (versleutelde betaaldata) en analysediensten (geanonimiseerde gebruiksdata). Wij verkopen jouw persoonsgegevens <strong style={{ color: 'var(--text-primary)' }}>nooit</strong> aan derden.
                  </p>
                ),
              },
              {
                id: 'security', title: '4. Gegevensbeveiliging',
                content: (
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                    We implementeren industriestandaard beveiligingsmaatregelen, waaronder SSL/TLS-versleuteling, beveiligde API-proxies, getokeniseerde betalingen en regelmatige beveiligingsaudits om jouw informatie te beschermen.
                  </p>
                ),
              },
              {
                id: 'rights', title: '5. Jouw rechten (AVG/GDPR)',
                content: (
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                    Op grond van de Algemene Verordening Gegevensbescherming heb je het recht op: inzage in je persoonsgegevens, rectificatie van onjuiste gegevens, verwijdering van je gegevens, beperking van de verwerking, gegevensoverdraagbaarheid en bezwaar tegen verwerking. Neem contact op via <strong style={{ color: 'var(--text-primary)' }}>privacy@enjoy.delivery</strong> om deze rechten uit te oefenen.
                  </p>
                ),
              },
              {
                id: 'cookies-ref', title: '6. Cookies',
                content: (
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                    Wij gebruiken cookies en vergelijkbare technologieën om je ervaring te verbeteren. Zie ons{' '}
                    <Link href="/cookies" style={{ color: PURPLE, fontWeight: 700 }}>Cookiebeleid</Link>{' '}
                    voor meer informatie.
                  </p>
                ),
              },
              {
                id: 'contact', title: '7. Contact',
                content: (
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>
                    Voor privacygerelateerde vragen kun je contact opnemen met onze Functionaris voor Gegevensbescherming via <strong style={{ color: 'var(--text-primary)' }}>privacy@enjoy.delivery</strong> of schrijven naar EnJoy B.V., Spui 70, 2511 BT Den Haag, Nederland.
                  </p>
                ),
              },
            ].map((section, i) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  padding: '28px 28px',
                  background: 'var(--bg-card)',
                  borderRadius: 18,
                  border: '1px solid var(--border)',
                  marginBottom: 16,
                  scrollMarginTop: 110,
                }}
              >
                <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 16, color: 'var(--text-primary)' }}>
                  {section.title}
                </h2>
                {section.content}
              </motion.section>
            ))}
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @media (min-width: 860px) {
          .privacy-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  );
}
