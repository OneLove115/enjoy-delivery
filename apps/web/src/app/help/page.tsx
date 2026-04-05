'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { JoyaChatWidget } from '../components/JoyaChatWidget';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';

const categories = [
  { icon: '📦', title: 'Bestellingen & Bezorging', items: ['Bestelling volgen', 'Ontbrekende of verkeerde items', 'Te late bezorging', 'Bestelling annuleren', 'Herhaal een vorige bestelling'] },
  { icon: '💳', title: 'Betalingen & Facturen',   items: ['Betaalmethoden', 'Terugbetalingsstatus', 'Promotiecode of voucher', 'Factuur aanvragen', 'Betaling mislukt'] },
  { icon: '👤', title: 'Account & Instellingen',  items: ['Account aanmaken of verwijderen', 'Profiel bijwerken', 'Wachtwoord wijzigen', 'Meldingsvoorkeuren', 'Opgeslagen adressen'] },
  { icon: '🍽️', title: 'Restaurant Partners',     items: ['Word partner', 'Menu bijwerken', 'AI fotogeneratie', 'Partner dashboard', 'Commissie & uitbetalingen'] },
];

const faqs = [
  { q: 'Wanneer wordt mijn bestelling bezorgd?', a: 'De bezorgtijd staat vermeld op de restaurantpagina. Je kunt je bestelling live volgen via de track-pagina na je order.' },
  { q: 'Kan ik een bestelling annuleren?', a: 'Je kunt annuleren binnen 2 minuten na het plaatsen, daarna is de order al onderweg naar de keuken. Neem contact op via Joya.' },
  { q: 'Hoe werkt de stempelkaart?', a: 'Voor elke bestelling van €10+ ontvang je een stempel. Bij 10 stempels win je een gratis maaltijd t/m €15.' },
  { q: 'Welke betaalmethoden zijn er?', a: 'We accepteren iDEAL, creditcard (Visa/Mastercard), Apple Pay, Google Pay en Bancontact.' },
  { q: 'Hoe maak ik een account aan?', a: 'Ga naar /signup, voer je e-mailadres in en maak een wachtwoord aan. Je kunt ook inloggen via Google of Facebook.' },
];

const iconColors = [PURPLE, PINK, ORANGE, '#00BCD4'];

export default function HelpCenterPage() {
  const [joyaTrigger, setJoyaTrigger] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 40,
              background: `linear-gradient(135deg, rgba(90,49,244,0.2), rgba(255,0,128,0.15))`,
              border: `1px solid rgba(90,49,244,0.4)`,
              marginBottom: 20,
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ fontSize: 14 }}
            >
              💜
            </motion.span>
            <span style={{ fontSize: 13, fontWeight: 700, color: PURPLE }}>24/7 Support beschikbaar</span>
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, marginBottom: 12, letterSpacing: -1,
            background: `linear-gradient(135deg, ${PURPLE}, ${PINK}, ${ORANGE})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundSize: '200%',
          }}>
            Hoe kunnen we helpen?
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 32, lineHeight: 1.7 }}>
            Antwoorden op je vragen, of chat direct met Joya voor persoonlijke hulp.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 40, position: 'relative' }}
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
              placeholder="Zoek in het Help Center..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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

        {/* Joya chat CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 20, padding: '24px 28px',
            background: `linear-gradient(135deg, rgba(90,49,244,0.18), rgba(255,0,128,0.1))`,
            borderRadius: 24, border: '1px solid rgba(90,49,244,0.3)',
            marginBottom: 48, cursor: 'pointer',
          }}
          onClick={() => setJoyaTrigger(t => t + 1)}
          whileHover={{ scale: 1.01, boxShadow: `0 8px 40px rgba(90,49,244,0.2)` }}
          whileTap={{ scale: 0.99 }}
        >
          <img src="/joya.jpg" alt="Joya" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', flexShrink: 0, border: '2px solid rgba(90,49,244,0.5)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Chat met Joya — direct antwoord</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
              Joya is onze AI-concierge. Ze helpt je 24/7 met bestellingen, aanbevelingen en al je vragen.
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 20, background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: '#fff', fontWeight: 800, fontSize: 14 }}>
              <span>💬</span> Start een gesprek
            </div>
          </div>
          <div style={{ fontSize: 32, opacity: 0.4 }}>→</div>
        </motion.div>

        {/* Help categories grid */}
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Onderwerpen</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
          {categories.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              whileHover={{
                y: -4,
                boxShadow: `0 12px 40px ${iconColors[i]}22`,
                border: `1px solid ${iconColors[i]}50`,
              }}
              style={{
                padding: '24px', background: 'var(--bg-card)',
                borderRadius: 18, border: '1px solid var(--border)',
                cursor: 'default', transition: 'border-color 0.2s',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.35 }}
                style={{ fontSize: 28, marginBottom: 12, display: 'inline-block' }}
              >
                {c.icon}
              </motion.div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>{c.title}</h3>
              {c.items.map((item, j) => (
                <button key={j} onClick={() => setJoyaTrigger(t => t + 1)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    color: 'var(--text-muted)', fontSize: 13, marginBottom: 8, cursor: 'pointer',
                    padding: '6px 10px',
                    borderLeft: `2px solid ${iconColors[i]}40`,
                    background: 'none', border: 'none',
                    fontFamily: 'inherit', transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                    (e.currentTarget as HTMLButtonElement).style.borderLeftColor = iconColors[i];
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)';
                    (e.currentTarget as HTMLButtonElement).style.borderLeftColor = `${iconColors[i]}40`;
                  }}>
                  {item}
                </button>
              ))}
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Veelgestelde vragen</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              style={{ borderRadius: 16, background: 'var(--bg-card)', border: `1px solid ${openFaq === i ? `${PURPLE}40` : 'var(--border)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, textAlign: 'left', gap: 12 }}>
                <span>{faq.q}</span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ flexShrink: 0, opacity: 0.5, fontSize: 16, lineHeight: 1, color: openFaq === i ? PURPLE : 'inherit' }}
                >
                  ▾
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 20px 18px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ marginTop: 12 }}>{faq.a}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still need help */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: 'center', padding: '40px', background: 'rgba(90,49,244,0.06)', borderRadius: 20, border: '1px solid rgba(90,49,244,0.15)' }}
        >
          <p style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Nog steeds niet gevonden?</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 15 }}>Ons supportteam staat 24/7 voor je klaar.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setJoyaTrigger(t => t + 1)}
              style={{ padding: '13px 28px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, border: 'none', borderRadius: 40, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
              💬 Chat met Joya
            </button>
            <Link href="/contact" style={{ display: 'inline-block', padding: '13px 28px', background: 'rgba(255,255,255,0.08)', borderRadius: 40, color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
              📧 Stuur een bericht
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
      <JoyaChatWidget triggerOpen={joyaTrigger} />
    </div>
  );
}
