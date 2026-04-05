'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

interface RiderProfile {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  vehicle?: string;
  iban?: string;
  status?: string;
  createdAt?: string;
}

function ProfileSkeleton() {
  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {/* Avatar + status skeleton */}
      <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', flexShrink: 0, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 22, width: 180, borderRadius: 6, marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          <div style={{ height: 14, width: 200, borderRadius: 6, marginBottom: 12, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ height: 24, width: 90, borderRadius: 99, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
            <div style={{ height: 24, width: 60, borderRadius: 99, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          </div>
        </div>
      </div>
      {/* Personal info form skeleton */}
      <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24 }}>
        <div style={{ height: 12, width: 140, borderRadius: 6, marginBottom: 24, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i}>
              <div style={{ height: 12, width: 80, borderRadius: 6, marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
              <div style={{ height: 15, width: '80%', borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RiderProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RiderProfile | null>(null);
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
        if (!res.ok) throw new Error('Kan profiel niet ophalen');
        return res.json();
      })
      .then(json => { if (json) setProfile(json); })
      .catch(err => setError(err.message || 'Netwerkfout'))
      .finally(() => setLoading(false));
  }, [router]);

  const card: React.CSSProperties = {
    background: 'var(--bg-card)', borderRadius: 20,
    border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24,
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 12, fontWeight: 800, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 20,
  };

  const infoGrid: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20,
  };

  const infoItem = (label: string, value: string) => (
    <div key={label}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{value || '—'}</p>
    </div>
  );

  const firstName = profile?.name?.split(' ')[0] ?? '';
  const lastName = profile?.name?.split(' ').slice(1).join(' ') ?? '';
  const initials = (firstName[0] ?? '') + (lastName[0] ?? '');
  const statusLabel = profile?.status === 'approved' ? 'Actief bezorger'
    : profile?.status === 'pending' ? 'In behandeling'
    : profile?.status ?? '—';
  const statusColor = profile?.status === 'approved' ? '#22c55e' : PURPLE;

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%, rgba(90,49,244,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,40px)' }}>

          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1, marginBottom: 8 }}>
              Mijn Profiel
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Bekijk je persoonlijke gegevens.
            </p>
          </div>

          {loading ? <ProfileSkeleton /> : error ? (
            <div style={{ ...card, borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>{error}</div>
          ) : profile ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Avatar + status */}
              <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg,${PURPLE},${PINK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: 'white', flexShrink: 0 }}>
                  {initials || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>{profile.name || 'Bezorger'}</h2>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 10px', fontSize: 14 }}>{profile.email || '—'}</p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: `${statusColor}18`, color: statusColor }}>
                      ● {statusLabel}
                    </span>
                    {profile.vehicle && (
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: `${PURPLE}18`, color: PURPLE }}>
                        {profile.vehicle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal info */}
              <div style={card}>
                <p style={sectionLabel}>Persoonlijke gegevens</p>
                <div style={infoGrid}>
                  {infoItem('Naam', profile.name ?? '—')}
                  {infoItem('E-mailadres', profile.email ?? '—')}
                  {infoItem('Telefoonnummer', profile.phone ?? '—')}
                  {infoItem('Stad', profile.city ?? '—')}
                  {infoItem('Vervoersmiddel', profile.vehicle ?? '—')}
                </div>
                <div style={{ marginTop: 20, padding: '12px 16px', background: `${PURPLE}08`, borderRadius: 10, border: `1px solid ${PURPLE}15` }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                    Om je gegevens te wijzigen, neem contact op met <strong>support@enjoy.nl</strong>.
                  </p>
                </div>
              </div>

              {/* Bank info */}
              {profile.iban && (
                <div style={card}>
                  <p style={sectionLabel}>Bankgegevens</p>
                  <div style={infoGrid}>
                    {infoItem('IBAN', profile.iban)}
                    {infoItem('Uitbetalingsfrequentie', 'Tweewekelijks')}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div style={card}>
                <p style={sectionLabel}>Documenten</p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Documentverificatie wordt automatisch verwerkt. Als er aanvullende documenten nodig zijn,
                  ontvang je een e-mail met instructies.
                </p>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
