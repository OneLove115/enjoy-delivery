'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

const sections = [
  { id: 'platform',   title: '1. Platformomschrijving' },
  { id: 'account',    title: '2. Accountregistratie' },
  { id: 'orders',     title: '3. Bestellingen & Betalingen' },
  { id: 'delivery',   title: '4. Bezorging' },
  { id: 'conduct',    title: '5. Gebruikersgedrag' },
  { id: 'ip',         title: '6. Intellectueel eigendom' },
  { id: 'liability',  title: '7. Aansprakelijkheidsbeperking' },
  { id: 'law',        title: '8. Toepasselijk recht' },
];

export default function TermsPage() {
  const [active, setActive] = useState<string>('platform');

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
            className="terms-sidebar"
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
                  📋
                </div>
                <h1 style={{
                  fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, margin: 0, letterSpacing: -1,
                  background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Gebruiksvoorwaarden
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)',
                }}>
                  📅 Ingangsdatum: 20 maart 2026
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: `rgba(90,49,244,0.1)`, border: `1px solid ${PURPLE}30`,
                  color: PURPLE,
                }}>
                  ✓ Van kracht bij gebruik
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16, marginBottom: 40 }}>
                Welkom bij EnJoy. Door toegang te nemen tot of gebruik te maken van ons platform ga je akkoord met deze gebruiksvoorwaarden. Lees ze zorgvuldig door.
              </p>
            </motion.div>

            {/* Sections */}
            {[
              {
                id: 'platform', title: '1. Platformomschrijving',
                body: 'EnJoy is een premium bezorgmarktplaats die gebruikers verbindt met restaurantpartners. Wij faciliteren het bestelproces, de betalingsverwerking en de bezorglogistiek. EnJoy bereidt geen voedsel; onze restaurantpartners zijn verantwoordelijk voor de voedselkwaliteit en bereiding.',
              },
              {
                id: 'account', title: '2. Accountregistratie',
                body: 'Om gebruik te maken van onze diensten moet je een account aanmaken met accurate informatie. Je bent verantwoordelijk voor het vertrouwelijk houden van je inloggegevens en voor alle activiteiten onder jouw account. Je moet minimaal 16 jaar oud zijn.',
              },
              {
                id: 'orders', title: '3. Bestellingen & Betalingen',
                body: 'Alle prijzen zijn in EUR inclusief BTW. Betaling wordt verwerkt op het moment van bestelling. We accepteren creditcards, iDEAL en digitale portemonnees. Terugbetalingen worden verwerkt conform ons terugbetalingsbeleid en zijn afhankelijk van de aard van de klacht.',
              },
              {
                id: 'delivery', title: '4. Bezorging',
                body: 'Bezorgtijden zijn schattingen en kunnen variëren. EnJoy werkt samen met onafhankelijke koeriers. Wij zijn niet aansprakelijk voor vertragingen door verkeer, weersomstandigheden of bereidingstijden in restaurants. Neem bij niet-bezorging direct contact op met ons supportteam.',
              },
              {
                id: 'conduct', title: '5. Gebruikersgedrag',
                body: 'Je stemt ermee in het platform niet te gebruiken voor illegale doeleinden, bezorgpersoneel of restaurantmedewerkers te intimideren, nep-accounts of reviews aan te maken, beveiligingsmaatregelen te omzeilen of onderdelen van ons platform te reverse-engineeren.',
              },
              {
                id: 'ip', title: '6. Intellectueel eigendom',
                body: 'Alle inhoud, branding, logo\'s (inclusief de EnJoy-kroon en paarse branded bag) en AI-functies (Joya concierge) zijn het exclusieve eigendom van EnJoy B.V. Ongeautoriseerd gebruik is verboden.',
              },
              {
                id: 'liability', title: '7. Aansprakelijkheidsbeperking',
                body: 'De aansprakelijkheid van EnJoy is beperkt tot het betaalde bedrag voor de betreffende bestelling. Wij zijn niet aansprakelijk voor indirecte, incidentele of gevolgschade die voortvloeit uit het gebruik van ons platform.',
              },
              {
                id: 'law', title: '8. Toepasselijk recht',
                body: 'Deze voorwaarden worden beheerst door het recht van Nederland. Geschillen worden beslecht bij de rechtbank te Den Haag.',
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
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 16 }}>{section.body}</p>
              </motion.section>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', padding: '28px', borderRadius: 16, background: `rgba(90,49,244,0.06)`, border: `1px solid ${PURPLE}20`, marginTop: 8 }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 0 }}>
                Vragen over onze voorwaarden?{' '}
                <Link href="/contact" style={{ color: PURPLE, fontWeight: 700 }}>Neem contact op</Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @media (min-width: 860px) {
          .terms-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  );
}
