'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

const sections = [
  {
    title: 'Bestellen & Bezorging',
    icon: '📦',
    color: ORANGE,
    faqs: [
      { q: 'Hoe plaats ik een bestelling?', a: 'Voer je adres in op de homepagina, blader door restaurants bij jou in de buurt, kies je gerechten en rond de bestelling af. Je maaltijd staat binnen minuten voor je deur.' },
      { q: 'Kan ik een bestelling volgen?', a: 'Ja! Zodra je bestelling bevestigd is, kun je je bezorger in realtime volgen via de app en website. Je ontvangt ook pushmeldingen met statusupdates.' },
      { q: 'Hoe lang duurt de bezorging?', a: 'De meeste bestellingen komen binnen 15–40 minuten aan, afhankelijk van het restaurant en je locatie. De geschatte tijd staat op de restaurantpagina.' },
      { q: 'Kan ik een bestelling annuleren?', a: 'Je kunt annuleren binnen 2 minuten na het plaatsen. Daarna is de order al in behandeling bij de keuken. Neem contact op via Joya voor assistentie.' },
      { q: 'Kan ik een bestelling van tevoren plannen?', a: 'Ja — plan tot 7 dagen vooruit. Ideaal voor lunchafspraken en evenementen.' },
      { q: 'Mijn bestelling is verkeerd of incompleet. Wat nu?', a: 'Neem contact op via Joya AI of het Help Center binnen 24 uur na ontvangst. We regelen direct een terugbetaling of vervanging.' },
    ],
  },
  {
    title: 'Betaling & Facturen',
    icon: '💳',
    color: PURPLE,
    faqs: [
      { q: 'Welke betaalmethoden accepteren jullie?', a: 'We accepteren iDEAL, Visa, Mastercard, American Express, Apple Pay, Google Pay en Bancontact. Alle betalingen zijn beveiligd met end-to-end encryptie.' },
      { q: 'Is er een minimale bestelling?', a: 'De minimale bestelling verschilt per restaurant en staat vermeld op de restaurantpagina voordat je items aan je winkelwagen toevoegt.' },
      { q: 'Hoe vraag ik een factuur aan?', a: 'Ga naar Mijn Account → Bestellingen, open de betreffende bestelling en klik op "Factuur downloaden". Voor zakelijke facturen kun je contact opnemen via zakelijk@enjoy.nl.' },
      { q: 'Hoe lang duurt een terugbetaling?', a: 'Terugbetalingen worden direct verwerkt vanuit ons systeem. Afhankelijk van je bank duurt het 1–5 werkdagen voordat het bedrag zichtbaar is.' },
    ],
  },
  {
    title: 'Account & Instellingen',
    icon: '👤',
    color: PINK,
    faqs: [
      { q: 'Hoe maak ik een account aan?', a: 'Ga naar /signup, voer je e-mailadres in en kies een wachtwoord. Je kunt ook direct inloggen via Google.' },
      { q: 'Ik ben mijn wachtwoord vergeten. Wat nu?', a: 'Klik op "Wachtwoord vergeten" op de inlogpagina en voer je e-mailadres in. Je ontvangt een resetlink binnen een minuut.' },
      { q: 'Hoe verwijder ik mijn account?', a: 'Ga naar Account → Instellingen → Account verwijderen. Na bevestiging worden al je gegevens binnen 30 dagen permanent verwijderd conform de AVG.' },
      { q: 'Hoe werk de stempelkaart?', a: 'Voor elke bestelling van €10 of meer ontvang je een stempel. Bij 10 stempels ontvang je een gratis maaltijd tot €15 waarde. Je stempelkaart staat in Beloningen.' },
    ],
  },
  {
    title: 'Joya AI',
    icon: '🤖',
    color: '#00BCD4',
    faqs: [
      { q: 'Hoe werkt Joya AI?', a: 'Joya is onze AI-voedselconcierge. Je kunt chatten of spraakopdrachten gebruiken voor gepersonaliseerde restaurantaanbevelingen, favorieten herbestellen of nieuwe keukens ontdekken op basis van je stemming.' },
      { q: 'Spreekt Joya meerdere talen?', a: 'Ja! Joya spreekt vloeiend Nederlands, Engels, Duits en Arabisch. Ze detecteert automatisch de taal van je bericht.' },
      { q: 'Kan ik Joya gebruiken zonder te typen?', a: 'Absoluut. Tik op het microfoonpictogram in de Joya-balk onderaan de Discover-pagina voor spraakinteractie. Zeg gewoon "Hé Joya, ik heb trek in…".' },
    ],
  },
  {
    title: 'Restaurant Partners',
    icon: '🍽️',
    color: '#8B5CF6',
    faqs: [
      { q: 'Hoe word ik restaurantpartner?', a: 'Bezoek onze Partners-pagina of stuur een e-mail naar partners@enjoy.nl. We begeleiden je door het onboardingproces, menu-instelling (inclusief AI-fotografie!) en het live gaan.' },
      { q: 'Wat zijn de kosten voor restaurants?', a: 'De eerste maand is volledig gratis. Daarna werken we met een transparant commissiemodel. Neem contact op via partners@enjoy.nl voor de actuele tarieven.' },
      { q: 'Hoe beheer ik mijn menu?', a: 'Via het VelociPizza-dashboard kun je in realtime je menu, prijzen, beschikbaarheid en openingstijden beheren.' },
    ],
  },
];

const faqSchemaData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: sections.flatMap(section =>
    section.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    }))
  ),
};

export default function FAQPage() {
  const [openSection, setOpenSection] = useState<number>(0);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleItem = (key: string) => setOpenItem(openItem === key ? null : key);

  // Filter across all sections when searching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: { section: string; sectionColor: string; q: string; a: string; key: string }[] = [];
    sections.forEach((sec, si) => {
      sec.faqs.forEach((faq, fi) => {
        if (faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)) {
          results.push({ section: sec.title, sectionColor: sec.color, q: faq.q, a: faq.a, key: `search-${si}-${fi}` });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const activeColor = sections[openSection].color;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }} />
      <Nav />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,40px)', paddingTop: 'clamp(60px,8vw,100px)' }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 style={{
            fontSize: 'clamp(28px,5vw,46px)', fontWeight: 950, marginBottom: 12, letterSpacing: -1,
            background: `linear-gradient(135deg, ${PURPLE}, ${PINK}, ${ORANGE})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Veelgestelde vragen
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 36, lineHeight: 1.6 }}>
            Alles wat je wilt weten over EnJoy. Niet gevonden? Chat met Joya of neem contact op.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 36, position: 'relative' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 20px',
            background: 'var(--bg-card)',
            borderRadius: 16,
            border: `1px solid ${searchFocused ? `rgba(90,49,244,0.6)` : 'var(--border)'}`,
            boxShadow: searchFocused ? `0 0 0 3px rgba(90,49,244,0.12)` : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>
            <span style={{ fontSize: 18, opacity: 0.5 }}>🔍</span>
            <input
              type="text"
              placeholder="Zoek in de FAQ..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setOpenItem(null); }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: 15, fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, padding: 0 }}>
                ×
              </button>
            )}
          </div>
        </motion.div>

        {/* Search results */}
        <AnimatePresence mode="wait">
          {searchResults !== null ? (
            <motion.div key="search" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {searchResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)', fontSize: 15 }}>
                  Geen resultaten gevonden voor &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 48 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{searchResults.length} resultaten</p>
                  {searchResults.map(r => {
                    const isOpen = openItem === r.key;
                    return (
                      <div key={r.key} style={{ borderRadius: 16, background: 'var(--bg-card)', border: `1px solid ${isOpen ? `${r.sectionColor}30` : 'var(--border)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                        <button onClick={() => toggleItem(r.key)}
                          style={{ width: '100%', padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, textAlign: 'left', gap: 16 }}>
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: r.sectionColor, display: 'block', marginBottom: 4 }}>{r.section}</span>
                            {r.q}
                          </div>
                          <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.22 }}
                            style={{ flexShrink: 0, fontSize: 18, color: isOpen ? r.sectionColor : 'rgba(255,255,255,0.3)', lineHeight: 1 }}>
                            +
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                              <div style={{ padding: '0 22px 20px', color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.75, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ marginTop: 14 }}>{r.a}</div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Category tabs */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                {sections.map((s, i) => {
                  const isActive = openSection === i;
                  return (
                    <motion.button
                      key={i}
                      onClick={() => { setOpenSection(i); setOpenItem(null); }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '9px 18px', borderRadius: 40,
                        border: `1px solid ${isActive ? s.color : 'rgba(255,255,255,0.1)'}`,
                        background: isActive ? `${s.color}18` : 'transparent',
                        color: isActive ? s.color : 'var(--text-secondary)',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        transition: 'all 0.2s', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', gap: 6,
                        position: 'relative',
                      }}
                    >
                      <span>{s.icon}</span>
                      {s.title}
                      {/* Gradient underline indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="tab-indicator"
                          style={{
                            position: 'absolute', bottom: -1, left: '15%', right: '15%',
                            height: 2, borderRadius: 2,
                            background: `linear-gradient(90deg, ${s.color}, ${PINK})`,
                          }}
                          transition={{ duration: 0.25 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* FAQ accordion */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={openSection}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  {sections[openSection].faqs.map((faq, i) => {
                    const key = `${openSection}-${i}`;
                    const isOpen = openItem === key;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ backgroundColor: isOpen ? undefined : 'rgba(255,255,255,0.015)' }}
                        style={{
                          borderRadius: 16, background: 'var(--bg-card)',
                          border: `1px solid ${isOpen ? `${activeColor}35` : 'var(--border)'}`,
                          overflow: 'hidden', transition: 'border-color 0.2s',
                        }}
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, textAlign: 'left', gap: 16 }}>
                          <span>{faq.q}</span>
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.22 }}
                            style={{ flexShrink: 0, fontSize: 18, color: isOpen ? activeColor : 'rgba(255,255,255,0.3)', lineHeight: 1 }}
                          >
                            +
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ padding: '0 22px 20px', color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.75, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ marginTop: 14 }}>{faq.a}</div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginTop: 48, textAlign: 'center', padding: '40px 32px', background: 'rgba(90,49,244,0.06)', borderRadius: 20, border: '1px solid rgba(90,49,244,0.15)' }}
        >
          <p style={{ fontSize: 19, fontWeight: 900, marginBottom: 8 }}>Nog steeds niet gevonden?</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>Ons supportteam staat 24/7 voor je klaar.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/help" style={{ display: 'inline-block', padding: '13px 28px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, borderRadius: 40, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
              💬 Help Center
            </Link>
            <Link href="/contact" style={{ display: 'inline-block', padding: '13px 28px', background: 'rgba(255,255,255,0.08)', borderRadius: 40, color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
              📧 Stuur een bericht
            </Link>
          </div>
        </motion.div>

      </div>
      <Footer />
    </div>
  );
}
