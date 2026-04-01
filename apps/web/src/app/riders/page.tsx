'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const perks = [
  { icon: '💰', title: 'Tot €1.200/maand', text: 'Stel je eigen uren in. Top bezorgers verdienen meer dan €1.200 per maand op hun eigen schema.' },
  { icon: '🚲', title: 'Elk voertuig', text: 'Fiets, scooter, e-bike of auto — alles werkt. Wij leveren de iconische paarse bezorgtas.' },
  { icon: '📱', title: 'Eenvoudige app', text: 'Accepteer bestellingen met één tik. Realtime navigatie ingebouwd. Wekelijkse betaling.' },
  { icon: '🛡️', title: 'Volledig verzekerd', text: 'Uitgebreide bezorgverzekering inbegrepen vanaf je eerste bestelling.' },
];

const steps = [
  { num: '01', title: 'Aanmelden', text: 'Vul je gegevens in en upload je ID. Duurt 5 minuten.' },
  { num: '02', title: 'Goedgekeurd', text: 'We verifiëren je account binnen 24 uur.' },
  { num: '03', title: 'Begin verdienen', text: 'Download de bezorger-app, kies je eerste bestelling en ga!' },
];

const vehicles = ['Fiets', 'E-bike', 'Scooter / Bromfiets', 'Motorfiets', 'Auto'];
const cities = ['Amsterdam', 'Den Haag', 'Rotterdam', 'Utrecht', 'Eindhoven', 'Groningen', 'Breda', 'Tilburg', 'Andere stad'];

const input: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12, padding: '14px 18px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
  fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
};
const select: React.CSSProperties = {
  ...input, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
  background: 'rgba(255,255,255,0.04) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' fill=\'none\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\'/%3E%3C/svg%3E") no-repeat right 16px center',
};

export default function RidersPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '', vehicle: '', hours: '', iban: '', cvFile: null as File | null, agreeCheck: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreeCheck) return;
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://veloci.online';
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
      setError(err.message || 'Er ging iets mis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* Hero */}
      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px,5vw,60px) clamp(16px,4vw,40px)', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(90,49,244,0.12) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <div style={{ display: 'inline-block', background: 'rgba(90,49,244,0.15)', border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 24 }}>
            🚲 Bezorgen met EnJoy
          </div>
          <h1 style={{ fontSize: 'clamp(30px,7vw,62px)', fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Rijd op jouw<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>eigen voorwaarden</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
            Sluit je aan bij 5.000+ bezorgers bij EnJoy. Flexibele uren, directe betaling en de meest iconische tas van de stad.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#aanmelden" style={{ background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 24px ${ORANGE}40` }}>
              Aanmelden als bezorger
            </a>
            <a href="#how-it-works" style={{ background: 'var(--b8)', color: 'var(--text-primary)', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Meer weten
            </a>
          </div>
        </motion.div>
      </section>

      {/* Perks */}
      <section style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 38, fontWeight: 900, marginBottom: 48 }}>Waarom bezorgen bij EnJoy?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {perks.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{p.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 15 }}>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.03)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 38, fontWeight: 900, marginBottom: 56 }}>Start in 3 stappen</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, maxWidth: 900, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(26px,5.5vw,52px)', fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>{s.num}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="aanmelden" style={{ padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-block', background: `rgba(255,107,0,0.12)`, border: `1px solid ${ORANGE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: ORANGE, marginBottom: 16 }}>
                📋 Aanmeldformulier
              </div>
              <h2 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 950, letterSpacing: -1 }}>Word bezorger bij EnJoy</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>Vul het formulier in en we nemen binnen 24 uur contact met je op.</p>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '56px 40px', background: 'rgba(90,49,244,0.06)', borderRadius: 24, border: `1px solid ${PURPLE}30` }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                <h3 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12 }}>Aanmelding ontvangen!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                  We hebben een e-mail gestuurd naar <strong>{form.email}</strong> om je wachtwoord in te stellen en toegang te krijgen tot je Rider Dashboard.
                </p>
                <Link href="/rider-portal" style={{ display: 'inline-block', background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', marginBottom: 16 }}>
                  Ga naar Rider Portal →
                </Link>
                <br />
                <Link href="/discover" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                  Ontdek EnJoy →
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}
                style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', padding: 'clamp(24px,4vw,40px)', display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Name row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Voornaam *</label>
                    <input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Jan" required style={input} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Achternaam *</label>
                    <input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="de Vries" required style={input} />
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>E-mailadres *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jan@example.com" required style={input} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Telefoonnummer *</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+31 6 12345678" required style={input} />
                  </div>
                </div>

                {/* City & Vehicle */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Stad *</label>
                    <select value={form.city} onChange={e => set('city', e.target.value)} required style={select}>
                      <option value="">Kies je stad</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Voertuig *</label>
                    <select value={form.vehicle} onChange={e => set('vehicle', e.target.value)} required style={select}>
                      <option value="">Kies je voertuig</option>
                      {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                {/* Hours */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Beschikbaarheid *</label>
                  <select value={form.hours} onChange={e => set('hours', e.target.value)} required style={select}>
                    <option value="">Hoeveel uur per week?</option>
                    <option value="10-20">10–20 uur (parttime)</option>
                    <option value="20-30">20–30 uur</option>
                    <option value="30+">30+ uur (fulltime)</option>
                    <option value="weekend">Alleen weekenden</option>
                    <option value="avond">Alleen avonden</option>
                  </select>
                </div>

                {/* IBAN optional */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    IBAN rekeningnummer <span style={{ fontWeight: 400, color: 'var(--text-muted)', opacity: 0.6 }}>(optioneel — voor snellere uitbetaling)</span>
                  </label>
                  <input value={form.iban} onChange={e => set('iban', e.target.value)} placeholder="NL00 BANK 0000 0000 00" style={input} />
                </div>

                {/* CV Upload */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, display: 'block' }}>Upload je CV (PDF, optioneel)</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => setForm(f => ({ ...f, cvFile: e.target.files?.[0] || null }))} style={{ ...input, padding: '10px 18px' }} />
                </div>

                {/* Agreement */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <input type="checkbox" checked={form.agreeCheck} onChange={e => set('agreeCheck', e.target.checked)} required
                    style={{ width: 18, height: 18, marginTop: 2, accentColor: ORANGE, flexShrink: 0 }} />
                  <span>
                    Ik ga akkoord met een achtergrondcontrole en de{' '}
                    <Link href="/terms" style={{ color: PURPLE, textDecoration: 'none', fontWeight: 700 }}>Algemene Voorwaarden</Link>{' '}
                    en het{' '}
                    <Link href="/privacy" style={{ color: PURPLE, textDecoration: 'none', fontWeight: 700 }}>Privacybeleid</Link> van EnJoy.
                  </span>
                </label>

                {error && <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>{error}</p>}

                <button type="submit" data-track="rider-apply" disabled={loading}
                  style={{ background: `linear-gradient(135deg,${ORANGE},${PINK})`, color: 'white', border: 'none', borderRadius: 14, padding: '17px 0', fontSize: 16, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4, boxShadow: `0 8px 24px ${ORANGE}35`, letterSpacing: '-0.2px' }}>
                  {loading ? 'Verwerken…' : 'Aanmelding indienen →'}
                </button>

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
