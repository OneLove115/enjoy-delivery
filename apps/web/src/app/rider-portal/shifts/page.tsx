'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const API_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

function ShiftsSkeleton() {
  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {/* Stat cards skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border)', padding: '18px 20px' }}>
            <div style={{ height: 24, width: '40%', borderRadius: 8, marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
            <div style={{ height: 12, width: '70%', borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          </div>
        ))}
      </div>
      {/* Calendar/shift card skeleton */}
      <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 16 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ height: 12, borderRadius: 6, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {Array.from({ length: 21 }).map((_, i) => (
            <div key={i} style={{ height: 36, borderRadius: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RiderShiftsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
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
      .then(json => { if (json) setStatus(json.status); })
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
              Diensten
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Beheer je diensten en claim beschikbare shiften.
            </p>
          </div>

          {loading ? <ShiftsSkeleton /> : error ? (
            <div style={{ ...card, borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>{error}</div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Summary cards — all zero */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Bevestigde diensten', value: '0' },
                  { label: 'Open slots', value: '0' },
                  { label: 'Swap verzoeken', value: '0' },
                  { label: 'Uren deze week', value: '0u' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', padding: '18px 20px' }}>
                    <p style={{ fontSize: 24, fontWeight: 950, letterSpacing: -0.5, margin: '0 0 4px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Empty state */}
              <div style={card}>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Nog geen diensten beschikbaar</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
                    Zodra je account is goedgekeurd en restaurants in jouw regio actief zijn,
                    kun je hier diensten claimen, ruilen en beheren.
                  </p>
                  {status && status !== 'approved' && (
                    <div style={{ marginTop: 20, padding: '12px 20px', background: `${PURPLE}10`, borderRadius: 12, border: `1px solid ${PURPLE}20`, display: 'inline-block' }}>
                      <p style={{ fontSize: 13, color: PURPLE, fontWeight: 700, margin: 0 }}>
                        Account status: {status === 'pending' ? 'in behandeling' : status}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
