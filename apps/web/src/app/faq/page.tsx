'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

const sections = [
  {
    title: 'Bestellen & Bezorging',
    icon: '📦',
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
    faqs: [
      { q: 'Hoe werkt Joya AI?', a: 'Joya is onze AI-voedselconcierge. Je kunt chatten of spraakopdrachten gebruiken voor gepersonaliseerde restaurantaanbevelingen, favorieten herbestellen of nieuwe keukens ontdekken op basis van je stemming.' },
      { q: 'Spreekt Joya meerdere talen?', a: 'Ja! Joya spreekt vloeiend Nederlands, Engels, Duits en Arabisch. Ze detecteert automatisch de taal van je bericht.' },
      { q: 'Kan ik Joya gebruiken zonder te typen?', a: 'Absoluut. Tik op het microfoonpictogram in de Joya-balk onderaan de Discover-pagina voor spraakinteractie. Zeg gewoon "Hé Joya, ik heb trek in…".' },
    ],
  },
  {
    title: 'Restaurant Partners',
    icon: '🍽️',
    faqs: [
      { q: 'Hoe word ik restaurantpartner?', a: 'Bezoek onze Partners-pagina of stuur een e-mail naar partners@enjoy.nl. We begeleiden je door het onboardingproces, menu-instelling (inclusief AI-fotografie!) en het live gaan.' },
      { q: 'Wat zijn de kosten voor restaurants?', a: 'De eerste maand is volledig gratis. Daarna werken we met een transparant commissiemodel. Neem contact op via partners@enjoy.nl voor de actuele tarieven.' },
      { q: 'Hoe beheer ik mijn menu?', a: 'Via het VelociPizza-dashboard kun je in realtime je menu, prijzen, beschikbaarheid en openingstijden beheren.' },
    ],
  },
];

export default function FAQPage() {
  const [openSection, setOpenSection] = useState<number>(0);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (key: string) => setOpenItem(openItem === key ? null : key);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,40px)' }}>

        <h1 style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 950, marginBottom: 12, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1 }}>
          Veelgestelde vragen
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 48, lineHeight: 1.6 }}>
          Alles wat je wilt weten over EnJoy. Niet gevonden? Chat met Joya of neem contact op.
        </p>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {sections.map((s, i) => (
            <button key={i} onClick={() => { setOpenSection(i); setOpenItem(null); }}
              style={{ padding: '9px 18px', borderRadius: 40, border: `1px solid ${openSection === i ? PURPLE : 'rgba(255,255,255,0.1)'}`, background: openSection === i ? `rgba(90,49,244,0.15)` : 'transparent', color: openSection === i ? PURPLE : 'var(--text-secondary)', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{s.icon}</span> {s.title}
            </button>
          ))}
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
                <div key={key} style={{ borderRadius: 16, background: 'var(--bg-card)', border: `1px solid ${isOpen ? `${PURPLE}30` : 'var(--border)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  <button
                    onClick={() => toggleItem(key)}
                    style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, textAlign: 'left', gap: 16 }}>
                    <span>{faq.q}</span>
                    <span style={{ flexShrink: 0, fontSize: 18, transition: 'transform 0.25s', transform: isOpen ? 'rotate(45deg)' : 'none', color: isOpen ? PURPLE : 'rgba(255,255,255,0.3)', lineHeight: 1 }}>+</span>
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
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div style={{ marginTop: 48, textAlign: 'center', padding: '40px 32px', background: 'rgba(90,49,244,0.06)', borderRadius: 20, border: '1px solid rgba(90,49,244,0.15)' }}>
          <p style={{ fontSize: 19, fontWeight: 900, marginBottom: 8 }}>Nog steeds niet gevonden?</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>Ons supportteam staat 24/7 voor je klaar.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/help" style={{ display: 'inline-block', padding: '13px 28px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, borderRadius: 40, color: 'white', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
              💬 Help Center
            </Link>
            <Link href="/contact" style={{ display: 'inline-block', padding: '13px 28px', background: 'rgba(255,255,255,0.08)', borderRadius: 40, color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
              📧 Stuur een bericht
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
