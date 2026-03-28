'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

const benefits = [
  { icon: '📈', title: 'Omzet verhogen',      text: 'Onze partners zien gemiddeld 34% omzetgroei in de eerste 3 maanden.' },
  { icon: '🧠', title: 'Slim dashboard',       text: 'Powered by VelociPizza — beheer bestellingen, menu\'s en analyses in realtime.' },
  { icon: '📸', title: 'AI menufoto\'s',        text: 'Wij genereren verbluffende foodfotografie voor je volledige menu — gratis.' },
  { icon: '💜', title: '0% commissie, maand 1', text: 'Gratis onboarden. Wij slagen alleen als jij slaagt.' },
];

const stats = [
  { value: '1.200+', label: 'Restaurantpartners' },
  { value: '98%',    label: 'Partnertevredenheid' },
  { value: '€2.4M',  label: 'Uitbetaald deze maand' },
  { value: '34%',    label: 'Gem. omzetgroei' },
];

const cuisines = ['Italiaans', 'Aziatisch', 'Burger / Fast Food', 'Sushi', 'Indiaas', 'Turks / Döner', 'Grieks', 'Mexicaans', 'Vegan / Vegetarisch', 'Ontbijt / Brunch', 'Bakkerij / Desserts', 'Anders'];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12, padding: '14px 18px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
  fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
};
const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
  background: 'rgba(255,255,255,0.04) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' fill=\'none\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\'/%3E%3C/svg%3E") no-repeat right 16px center',
};

export default function PartnersPage() {
  const [form, setForm] = useState({ restaurant: '', ownerName: '', email: '', phone: '', address: '', city: '', cuisine: '', seats: '', website: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,0,128,0.08) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,0,128,0.1)', border: `1px solid ${PINK}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PINK, marginBottom: 24 }}>
            🍽️ Restaurantpartners
          </div>
          <h1 style={{ fontSize: 'clamp(28px,6vw,58px)', fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Laat je restaurant groeien<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>met EnJoy</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
            Sluit je aan bij 1.200+ restaurants op het platform dat jouw merk als koningshuis behandelt. Volledig dashboard, AI-menu&apos;s en geen compromissen op kwaliteit.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#aanmelden" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 24px ${PURPLE}40` }}>
              Voeg je restaurant toe
            </a>
            <a href="#voordelen" style={{ background: 'var(--b8)', color: 'var(--text-primary)', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Bekijk voordelen
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 clamp(16px,4vw,60px) clamp(24px,5vw,64px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 34, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section id="voordelen" style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.03)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 900, marginBottom: 48 }}>Alles wat je restaurant nodig heeft</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {benefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{b.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{b.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 15 }}>{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to join */}
      <section style={{ padding: 'clamp(24px,5vw,64px) clamp(16px,4vw,60px)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 48 }}>In 3 stappen live</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, maxWidth: 720, margin: '0 auto' }}>
          {[
            { num: '01', title: 'Aanmelden',        text: 'Vul het formulier hieronder in.' },
            { num: '02', title: 'Onboarding',        text: 'We bellen je binnen 24 uur voor setup.' },
            { num: '03', title: 'Live gaan',         text: 'Menu up, bestellingen binnen, klaar.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 14 }}>{s.num}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant Signup Form */}
      <section id="aanmelden" style={{ padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,60px)', background: 'rgba(255,0,128,0.02)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-block', background: 'rgba(255,0,128,0.1)', border: `1px solid ${PINK}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PINK, marginBottom: 16 }}>
                🍽️ Restaurantaanmelding
              </div>
              <h2 style={{ fontSize: 'clamp(24px,5vw,38px)', fontWeight: 950, letterSpacing: -1 }}>Voeg je restaurant toe aan EnJoy</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 10, fontSize: 15 }}>Vul het formulier in. We nemen binnen 24 uur contact op voor de onboarding.</p>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '56px 40px', background: 'rgba(90,49,244,0.06)', borderRadius: 24, border: `1px solid ${PURPLE}30` }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎊</div>
                <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Aanmelding ontvangen!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                  Geweldig {form.ownerName}! Een onboardingspecialist van EnJoy neemt binnen <strong>24 uur</strong> contact op via {form.email} om <strong>{form.restaurant}</strong> live te zetten.
                </p>
                <Link href="/discover" style={{ display: 'inline-block', background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                  Ontdek EnJoy →
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}
                style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', padding: 'clamp(24px,4vw,40px)', display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Restaurant & Owner */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Restaurantnaam *</label>
                    <input value={form.restaurant} onChange={e => set('restaurant', e.target.value)} placeholder="De Gouden Lepel" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Eigenaar / Contactpersoon *</label>
                    <input value={form.ownerName} onChange={e => set('ownerName', e.target.value)} placeholder="Jan de Vries" required style={inputStyle} />
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>E-mailadres *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="info@restaurant.nl" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Telefoonnummer *</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+31 70 123 4567" required style={inputStyle} />
                  </div>
                </div>

                {/* Address & City */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Straat + huisnummer *</label>
                    <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Voorstraat 12" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Stad *</label>
                    <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Den Haag" required style={inputStyle} />
                  </div>
                </div>

                {/* Cuisine & Seats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Keuken / Type *</label>
                    <select value={form.cuisine} onChange={e => set('cuisine', e.target.value)} required style={selectStyle}>
                      <option value="">Selecteer keukentype</option>
                      {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Gem. dagelijkse bestellingen</label>
                    <select value={form.seats} onChange={e => set('seats', e.target.value)} style={selectStyle}>
                      <option value="">Schatting per dag</option>
                      <option value="<20">Minder dan 20</option>
                      <option value="20-50">20 – 50</option>
                      <option value="50-100">50 – 100</option>
                      <option value="100+">Meer dan 100</option>
                    </select>
                  </div>
                </div>

                {/* Website optional */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Website <span style={{ fontWeight: 400, opacity: 0.6 }}>(optioneel)</span>
                  </label>
                  <input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://jouwrestaurant.nl" style={inputStyle} />
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Vragen of extra info</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)}
                    placeholder="Vertel ons meer over je restaurant of stel je vragen…" rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <button type="submit" disabled={loading}
                  style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 14, padding: '17px 0', fontSize: 16, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: `0 8px 24px ${PURPLE}35`, letterSpacing: '-0.2px' }}>
                  {loading ? 'Verwerken…' : 'Restaurant aanmelden →'}
                </button>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                  Geen verplichtingen. Setup volledig gratis. Eerste maand 0% commissie.
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
