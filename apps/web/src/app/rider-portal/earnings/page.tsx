'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

interface EarningsData {
  status: string;
  name?: string;
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '3px solid rgba(90,49,244,0.15)',
        borderTopColor: PURPLE,
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function RiderEarningsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EarningsData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('enjoy-rider-token');
    if (!token) { router.replace('/rider-portal'); return; }

    fetch(`${API_URL}/api/riders/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 401) {
          localStorage.removeItem('enjoy-rider-token');
          router.replace('/rider-portal?expired=true');
          return;
        }
        if (!res.ok) throw new Error('Kan gegevens niet ophalen');
        return res.json();
      })
      .then(json => { if (json) setData(json); })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  const card: React.CSSProperties = {
    background: 'var(--bg-card)', borderRadius: 20,
    border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24,
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%, rgba(90,49,244,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,40px)' }}>

          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 8 }}>
              Verdiensten
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Overzicht van je inkomsten en uitbetalingen.
            </p>
          </div>

          {loading ? <Spinner /> : error ? (
            <div style={{ ...card, borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>{error}</div>
          ) : (
            <>
              {/* Summary cards — all zero for now */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Deze week', value: '€0,00', sub: '0 bestellingen' },
                  { label: 'Deze maand', value: '€0,00', sub: '0 bestellingen' },
                  { label: 'Dit jaar', value: '€0,00', sub: '0 bestellingen' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: '20px 22px' }}>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>{item.label}</p>
                    <p style={{ fontSize: 28, fontWeight: 950, letterSpacing: -1, margin: '0 0 4px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {item.value}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* Empty state */}
              <div style={card}>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Nog geen verdiensten</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, maxWidth: 420, margin: '0 auto' }}>
                    Zodra je je eerste bezorging doet, verschijnen je verdiensten hier.
                    Je ontvangt een overzicht per week, per maand en je uitbetalingsgeschiedenis.
                  </p>
                  {data?.status && data.status !== 'approved' && (
                    <div style={{ marginTop: 20, padding: '12px 20px', background: `${PURPLE}10`, borderRadius: 12, border: `1px solid ${PURPLE}20`, display: 'inline-block' }}>
                      <p style={{ fontSize: 13, color: PURPLE, fontWeight: 700, margin: 0 }}>
                        Je account is momenteel: {data.status === 'pending' ? 'in behandeling' : data.status}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
