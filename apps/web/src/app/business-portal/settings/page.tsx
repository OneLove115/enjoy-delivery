'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

const EMPTY_FORM = {
  companyName: '', address: '', kvk: '', btw: '',
  billingEmail: '', deliveryAddress: '',
};

const NOTIF_OPTIONS = [
  { key: 'orderConfirm', label: 'Orderbevestiging', desc: 'Ontvang een e-mail bij elke nieuwe bestelling' },
  { key: 'orderDelivered', label: 'Bezorging bevestiging', desc: 'Melding wanneer een bestelling is bezorgd' },
  { key: 'invoiceNew', label: 'Nieuwe factuur', desc: 'E-mail wanneer een nieuwe factuur klaar staat' },
  { key: 'budgetAlert', label: 'Budget waarschuwing (80%)', desc: 'Waarschuwing wanneer 80% van je budget op is' },
  { key: 'weeklyReport', label: 'Wekelijks overzicht', desc: 'Elke maandag een overzicht van de afgelopen week' },
];

function SettingsSkeleton() {
  const shimmerStyle: React.CSSProperties = {
    animation: 'shimmer 1.8s infinite',
    backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)',
    backgroundSize: '200% 100%',
    borderRadius: 6,
  };
  return (
    <div style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 800, margin: '0 auto' }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {/* Title skeleton */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...shimmerStyle, height: 28, width: 160, marginBottom: 8 }} />
        <div style={{ ...shimmerStyle, height: 14, width: 280 }} />
      </div>
      {/* Form section skeletons */}
      {[0,1].map(s => (
        <div key={s} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ ...shimmerStyle, height: 15, width: 140 }} />
          </div>
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[0,1,2,3].map(i => (
              <div key={i}>
                <div style={{ ...shimmerStyle, height: 12, width: 80, marginBottom: 8 }} />
                <div style={{ ...shimmerStyle, height: 42, width: '100%', borderRadius: 10 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Notification toggles skeleton */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ ...shimmerStyle, height: 15, width: 160 }} />
        </div>
        <div style={{ padding: 24 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ ...shimmerStyle, height: 14, width: 140, marginBottom: 6 }} />
                <div style={{ ...shimmerStyle, height: 12, width: 220 }} />
              </div>
              <div style={{ ...shimmerStyle, width: 44, height: 24, borderRadius: 12 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    orderConfirm: true, orderDelivered: true, invoiceNew: true, budgetAlert: true, weeklyReport: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showDanger, setShowDanger] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleNotif = (key: string) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    const token = localStorage.getItem('enjoy-business-token');
    if (!token) { router.replace('/business-portal'); return; }

    fetch(`${API_URL}/api/business-portal/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('enjoy-business-token');
          router.replace('/business-portal');
          return;
        }
        if (!res.ok) return;
        return res.json();
      })
      .then(json => {
        if (json) {
          setForm(prev => ({
            ...prev,
            companyName: json.companyName ?? json.name ?? '',
            address: json.address ?? '',
            billingEmail: json.email ?? json.billingEmail ?? '',
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const token = localStorage.getItem('enjoy-business-token');
    try {
      const res = await fetch(`${API_URL}/api/business-portal/team`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings: { ...form, notifications: notifs } }),
      });
      if (res.status === 401) {
        localStorage.removeItem('enjoy-business-token');
        router.replace('/business-portal');
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Opslaan mislukt. Probeer het opnieuw.');
    } finally {
      setSaving(false);
    }
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
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );

  if (loading) return <SettingsSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: 'clamp(20px,3vw,40px)', maxWidth: 800, margin: '0 auto' }}
    >

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 950, letterSpacing: -0.5, margin: '0 0 6px' }}>
          Instellingen
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          Beheer je bedrijfsinformatie en voorkeuren
        </p>
      </div>

      {error && (
        <div style={{ padding: '14px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#ef4444', fontWeight: 600, marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}

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

      <Section title="Meldingsinstellingen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {NOTIF_OPTIONS.map((opt, i) => (
            <div
              key={opt.key}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 0', borderBottom: i < NOTIF_OPTIONS.length - 1 ? '1px solid var(--border)' : 'none',
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
            </div>
          ))}
        </div>
      </Section>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saved ? 'rgba(34,197,94,0.15)' : `linear-gradient(135deg,${PURPLE},${PINK})`,
            color: saved ? '#22c55e' : 'white',
            border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none',
            borderRadius: 12, padding: '14px 28px',
            cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700,
            fontFamily: 'Outfit, sans-serif',
            boxShadow: saved ? 'none' : `0 4px 14px ${PURPLE}35`,
            transition: 'all 0.3s',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Opslaan...' : saved ? '✓ Opgeslagen!' : 'Wijzigingen opslaan'}
        </button>
      </div>

      {/* Danger zone */}
      <div style={{
        background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 18, overflow: 'hidden',
      }}>
        <div
          style={{ padding: '18px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: showDanger ? '1px solid rgba(239,68,68,0.15)' : 'none' }}
          onClick={() => setShowDanger(!showDanger)}
        >
          <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: '#ef4444' }}>Gevarenzone</h2>
          <span style={{ color: '#ef4444', fontSize: 18 }}>{showDanger ? '−' : '+'}</span>
        </div>
        {showDanger && (
          <div style={{ padding: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              Het verwijderen van je account is permanent. Neem contact op met <strong>support@enjoy.nl</strong> om je account te verwijderen.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
