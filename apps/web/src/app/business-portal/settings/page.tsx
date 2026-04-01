'use client';
import { useState } from 'react';

// TODO: wire to /api/business-portal/settings when available

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const INITIAL = {
  companyName: 'TechCorp BV',
  address: 'Herengracht 420, 1017 BZ Amsterdam',
  kvk: '12345678',
  btw: 'NL001234567B01',
  billingEmail: 'finance@techcorp.nl',
  deliveryAddress: 'Herengracht 420, 1017 BZ Amsterdam',
};

const NOTIF_OPTIONS = [
  { key: 'orderConfirm',   label: 'Orderbevestiging',           desc: 'Ontvang een e-mail bij elke nieuwe bestelling' },
  { key: 'orderDelivered', label: 'Bezorging bevestiging',      desc: 'Melding wanneer een bestelling is bezorgd' },
  { key: 'invoiceNew',     label: 'Nieuwe factuur',             desc: 'E-mail wanneer een nieuwe factuur klaar staat' },
  { key: 'budgetAlert',    label: 'Budget waarschuwing (80%)',   desc: 'Waarschuwing wanneer 80% van je budget op is' },
  { key: 'weeklyReport',   label: 'Wekelijks overzicht',        desc: 'Elke maandag een overzicht van de afgelopen week' },
];

export default function SettingsPage() {
  const [form, setForm] = useState(INITIAL);
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    orderConfirm: true, orderDelivered: true, invoiceNew: true, budgetAlert: true, weeklyReport: false,
  });
  const [saved, setSaved] = useState(false);
  const [showDanger, setShowDanger] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleNotif = (key: string) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
    padding: '12px 16px', color: 'var(--text-primary)',
    fontSize: 15, fontFamily: 'Outfit, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
    display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 18, overflow: 'hidden', marginBottom: 20,
    }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -0.5, margin: '0 0 6px' }}>
          Instellingen
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Beheer je bedrijfsinformatie en voorkeuren
        </p>
      </div>

      {/* Company info */}
      <Section title="Bedrijfsinformatie">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
          <div>
            <label style={labelStyle}>Bedrijfsnaam</label>
            <input value={form.companyName} onChange={e => set('companyName', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Adres</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>KVK-nummer</label>
            <input value={form.kvk} onChange={e => set('kvk', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>BTW-nummer</label>
            <input value={form.btw} onChange={e => set('btw', e.target.value)} style={inputStyle} />
          </div>
        </div>
      </Section>

      {/* Billing */}
      <Section title="Facturatie">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
          <div>
            <label style={labelStyle}>Factuur e-mail</label>
            <input type="email" value={form.billingEmail} onChange={e => set('billingEmail', e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Standaard bezorgadres</label>
            <input value={form.deliveryAddress} onChange={e => set('deliveryAddress', e.target.value)} style={inputStyle} />
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Meldingsinstellingen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {NOTIF_OPTIONS.map((opt, i) => (
            <label
              key={opt.key}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0', cursor: 'pointer',
                borderBottom: i < NOTIF_OPTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                gap: 16,
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 3px' }}>{opt.label}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>{opt.desc}</p>
              </div>
              <div
                onClick={() => toggleNotif(opt.key)}
                style={{
                  width: 44, height: 24, borderRadius: 12, flexShrink: 0,
                  background: notifs[opt.key] ? `linear-gradient(90deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.1)',
                  position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
                }}
              >
                <span style={{
                  position: 'absolute', top: 4, width: 16, height: 16, borderRadius: '50%',
                  background: 'white', transition: 'left 0.2s',
                  left: notifs[opt.key] ? 24 : 4,
                }} />
              </div>
            </label>
          ))}
        </div>
      </Section>

      {/* Save button */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button
          onClick={handleSave}
          style={{
            background: saved ? 'rgba(34,197,94,0.15)' : `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: saved ? '#22c55e' : 'white',
            border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none',
            borderRadius: 12, padding: '14px 28px',
            cursor: 'pointer', fontSize: 15, fontWeight: 700,
            fontFamily: 'Outfit, sans-serif',
            boxShadow: saved ? 'none' : `0 4px 14px ${PURPLE}35`,
            transition: 'all 0.3s',
          }}
        >
          {saved ? '✓ Opgeslagen!' : 'Wijzigingen opslaan'}
        </button>
      </div>

      {/* Danger zone */}
      <div style={{
        background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 18, overflow: 'hidden',
      }}>
        <div
          style={{ padding: '18px 24px', borderBottom: showDanger ? '1px solid rgba(239,68,68,0.15)' : 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={() => setShowDanger(!showDanger)}
        >
          <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: '#ef4444' }}>Gevarenzone</h2>
          <span style={{ color: '#ef4444', fontSize: 18 }}>{showDanger ? '−' : '+'}</span>
        </div>
        {showDanger && (
          <div style={{ padding: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              Het verwijderen van je account is permanent en kan niet ongedaan worden gemaakt.
              Alle data, bestellingen en facturen worden gewist.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ ...labelStyle, color: '#ef4444' }}>
                Typ "VERWIJDEREN" om te bevestigen
              </label>
              <input
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="VERWIJDEREN"
                style={{
                  ...inputStyle,
                  border: '1px solid rgba(239,68,68,0.3)',
                  maxWidth: 280,
                }}
              />
            </div>
            <button
              disabled={deleteConfirm !== 'VERWIJDEREN'}
              style={{
                background: deleteConfirm === 'VERWIJDEREN' ? 'rgba(239,68,68,0.9)' : 'rgba(239,68,68,0.2)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '12px 22px', cursor: deleteConfirm === 'VERWIJDEREN' ? 'pointer' : 'not-allowed',
                fontSize: 14, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                transition: 'background 0.2s',
              }}
            >
              Account definitief verwijderen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
