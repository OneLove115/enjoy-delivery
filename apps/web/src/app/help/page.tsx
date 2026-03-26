'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { JoyaChatWidget } from '../components/JoyaChatWidget';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

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

export default function HelpCenterPage() {
  const [joyaTrigger, setJoyaTrigger] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 20px 80px' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Hulp nodig?
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>
            Antwoorden op je vragen, of chat direct met Joya voor persoonlijke hulp.
          </p>
        </motion.div>

        {/* Joya chat CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 20, padding: '24px 28px',
            background: `linear-gradient(135deg, rgba(90,49,244,0.18), rgba(255,0,128,0.1))`,
            borderRadius: 24, border: '1px solid rgba(90,49,244,0.3)',
            marginBottom: 48, cursor: 'pointer',
          }}
          onClick={() => setJoyaTrigger(t => t + 1)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <img src="/joya.jpg" alt="Joya" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', flexShrink: 0, border: '2px solid rgba(90,49,244,0.5)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Chat met Joya — direct antwoord</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
              Joya is onze AI-concierge. Ze helpt je 24/7 met bestellingen, aanbevelingen en al je vragen.
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 20, background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', fontWeight: 800, fontSize: 14 }}>
              <span>💬</span> Start een gesprek
            </div>
          </div>
          <div style={{ fontSize: 32, opacity: 0.4 }}>→</div>
        </motion.div>

        {/* Help categories grid */}
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Onderwerpen</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
          {categories.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>{c.title}</h3>
              {c.items.map((item, j) => (
                <button key={j} onClick={() => setJoyaTrigger(t => t + 1)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    color: 'var(--text-muted)', fontSize: 13, marginBottom: 8, cursor: 'pointer',
                    padding: '6px 10px', paddingLeft: 10,
                    borderLeft: `2px solid rgba(90,49,244,0.2)`,
                    background: 'none', border: 'none',
                    fontFamily: 'inherit', transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}>
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
            <div key={i}
              style={{ borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, textAlign: 'left', gap: 12 }}>
                <span>{faq.q}</span>
                <span style={{ flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none', opacity: 0.5 }}>▾</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 18px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(90,49,244,0.06)', borderRadius: 20, border: '1px solid rgba(90,49,244,0.15)' }}>
          <p style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Nog steeds niet gevonden?</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 15 }}>Ons supportteam staat 24/7 voor je klaar.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setJoyaTrigger(t => t + 1)}
              style={{ padding: '13px 28px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, border: 'none', borderRadius: 40, color: 'var(--text-primary)', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
              💬 Chat met Joya
            </button>
            <Link href="/contact" style={{ display: 'inline-block', padding: '13px 28px', background: 'rgba(255,255,255,0.08)', borderRadius: 40, color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
              📧 Stuur een bericht
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      {/* Joya chat widget — triggered when user clicks help items */}
      <JoyaChatWidget triggerOpen={joyaTrigger} />
    </div>
  );
}
