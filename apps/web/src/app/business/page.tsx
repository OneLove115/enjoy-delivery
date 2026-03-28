'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const features = [
  { icon: '🏢', title: 'Team maaltijdbudgetten', text: 'Stel maandelijkse budgetten per medewerker in. Zij bestellen, jij houdt de controle.' },
  { icon: '📊', title: 'Automatische rapportages', text: 'Maandelijkse rapporten die integreren met je boekhoudsoftware.' },
  { icon: '🤝', title: 'Catering voor evenementen', text: 'Bedrijfslunch, teamborrel, directiedineer — wij regelen het op schaal.' },
  { icon: '💳', title: 'Één factuur', text: 'Alle teambestellingen op één maandelijkse factuur. Eenvoudig voor de boekhouding.' },
  { icon: '🔐', title: 'SSO & integraties', text: 'Single sign-on, Slack-meldingen en integratie met HR-tools zoals Workday.' },
  { icon: '📞', title: 'Dedicated account manager', text: 'Een persoonlijke account manager voor vragen, onboarding en alles daartussen.' },
];

const logos = ['Google', 'Booking.com', 'Philips', 'ASML', 'ING'];

const teamSizes = ['1–10 medewerkers', '11–50 medewerkers', '51–200 medewerkers', '200–500 medewerkers', '500+ medewerkers'];
const useCases = ['Dagelijkse teamlunches', 'Maaltijdbudget per medewerker', 'Catering voor evenementen', 'Klantrelatiebeheer / representatie', 'Combinatie van bovenstaande'];
const budgets = ['< €500/maand', '€500 – €2.000/maand', '€2.000 – €5.000/maand', '€5.000 – €10.000/maand', '> €10.000/maand'];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12, padding: '14px 18px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
  fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
};
const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
  background: 'rgba(255,255,255,0.04) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' fill=\'none\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\'/%3E%3C/svg%3E") no-repeat right 16px center',
};

export default function BusinessPage() {
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', teamSize: '', useCase: '', budget: '', message: '' });
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
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(90,49,244,0.1) 0%, transparent 65%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(90,49,244,0.12)', border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 24 }}>
            🏢 EnJoy voor Bedrijven
          </div>
          <h1 style={{ fontSize: 'clamp(28px,6vw,56px)', fontWeight: 950, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2 }}>
            Voed je team.<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Imponeer je klanten.</span>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
            Bedrijfsmaaltijden, teambudgetten en kantoormaaltijden — allemaal op één koninklijk platform.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#aanvragen" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: `0 8px 24px ${PURPLE}40` }}>
              Aanvraag indienen
            </a>
            <a href="#features" style={{ background: 'var(--b8)', color: 'var(--text-primary)', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Bekijk features
            </a>
          </div>
        </motion.div>
      </section>

      {/* Trusted by */}
      <section style={{ padding: '0 clamp(16px,4vw,60px) clamp(24px,5vw,60px)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24 }}>Vertrouwd door teams bij</p>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {logos.map(l => (
            <span key={l} style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18, fontWeight: 800 }}>{l}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: 'clamp(24px,5vw,80px) clamp(16px,4vw,60px)', background: 'rgba(90,49,244,0.02)' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 900, marginBottom: 48 }}>Alles wat je team nodig heeft</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, maxWidth: 960, margin: '0 auto' }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ padding: '32px 28px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 15 }}>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,60px)', background: `linear-gradient(135deg, ${PURPLE}12, ${PINK}08)`, borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {[
            { num: '500+', label: 'Bedrijfsklanten' },
            { num: '€2M+', label: 'Maaltijdbudget beheerd' },
            { num: '24u', label: 'Onboarding tijd' },
            { num: '98%', label: 'Klanttevredenheid' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.num}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Business Inquiry Form */}
      <section id="aanvragen" style={{ padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,60px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-block', background: `rgba(90,49,244,0.12)`, border: `1px solid ${PURPLE}40`, borderRadius: 40, padding: '6px 18px', fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 16 }}>
                📋 Zakelijke aanvraag
              </div>
              <h2 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 950, letterSpacing: -1 }}>Aan de slag met EnJoy Business</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>Vul het formulier in. Onze sales consultant neemt binnen 24 uur contact op.</p>
            </div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '56px 40px', background: 'rgba(90,49,244,0.06)', borderRadius: 24, border: `1px solid ${PURPLE}30` }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎊</div>
                <h3 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12 }}>Aanvraag ontvangen!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                  Bedankt {form.name}! Een account manager van EnJoy Business neemt binnen <strong>24 uur</strong> contact op via {form.email}.
                </p>
                <Link href="/discover" style={{ display: 'inline-block', background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                  Ontdek EnJoy →
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}
                style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', padding: 'clamp(24px,4vw,40px)', display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Company & Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Bedrijfsnaam *</label>
                    <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="EnJoy BV" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Uw naam *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jan de Vries" required style={inputStyle} />
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Zakelijk e-mailadres *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jan@bedrijf.nl" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Telefoonnummer *</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+31 70 123 4567" required style={inputStyle} />
                  </div>
                </div>

                {/* Team size */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Aantal medewerkers *</label>
                  <select value={form.teamSize} onChange={e => set('teamSize', e.target.value)} required style={selectStyle}>
                    <option value="">Selecteer teamgrootte</option>
                    {teamSizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Use case & Budget */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Gebruik *</label>
                    <select value={form.useCase} onChange={e => set('useCase', e.target.value)} required style={selectStyle}>
                      <option value="">Waarvoor heeft u EnJoy nodig?</option>
                      {useCases.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Maandbudget</label>
                    <select value={form.budget} onChange={e => set('budget', e.target.value)} style={selectStyle}>
                      <option value="">Geschat maandbudget</option>
                      {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Extra toelichting</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Vertel ons over uw specifieke wensen of vragen…" rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <button type="submit" disabled={loading}
                  style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 14, padding: '17px 0', fontSize: 16, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4, boxShadow: `0 8px 24px ${PURPLE}35`, letterSpacing: '-0.2px' }}>
                  {loading ? 'Verwerken…' : 'Aanvraag versturen →'}
                </button>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                  Geen minimale besteding vereist. Setup binnen 24 uur. Geen verborgen kosten.
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
