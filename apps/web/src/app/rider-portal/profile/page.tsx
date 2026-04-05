'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

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

const VEHICLE_ICONS: Record<string, string> = {
  fiets: '🚲',
  scooter: '🛵',
  auto: '🚗',
  bromfiets: '🏍️',
  default: '🚲',
};

function getVehicleIcon(vehicle?: string): string {
  if (!vehicle) return VEHICLE_ICONS.default;
  const key = vehicle.toLowerCase();
  return VEHICLE_ICONS[key] ?? VEHICLE_ICONS.default;
}

function ProfileSkeleton() {
  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', flexShrink: 0, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 22, width: 180, borderRadius: 6, marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          <div style={{ height: 14, width: 200, borderRadius: 6, marginBottom: 12, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ height: 24, width: 90, borderRadius: 99, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
            <div style={{ height: 24, width: 60, borderRadius: 99, animation: 'shimmer 1.8s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)', backgroundSize: '200% 100%' }} />
          </div>
        </div>
      </div>
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

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function RiderProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 800, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 20,
  };

  const firstName = profile?.name?.split(' ')[0] ?? '';
  const lastName = profile?.name?.split(' ').slice(1).join(' ') ?? '';
  const initials = (firstName[0] ?? '') + (lastName[0] ?? '');
  const statusLabel = profile?.status === 'approved' ? 'Actief bezorger'
    : profile?.status === 'pending' ? 'In behandeling'
    : profile?.status ?? '—';
  const statusColor = profile?.status === 'approved' ? '#22c55e' : PURPLE;
  const vehicleIcon = getVehicleIcon(profile?.vehicle);

  const infoItems = [
    { label: 'Naam', value: profile?.name ?? '—', icon: '👤' },
    { label: 'E-mailadres', value: profile?.email ?? '—', icon: '✉️' },
    { label: 'Telefoonnummer', value: profile?.phone ?? '—', icon: '📞' },
    { label: 'Stad', value: profile?.city ?? '—', icon: '📍' },
    { label: 'Vervoersmiddel', value: profile?.vehicle ?? '—', icon: vehicleIcon },
  ];

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse at 60% 0%, ${PURPLE}10 0%, transparent 55%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: 'clamp(32px,5vw,56px) clamp(16px,4vw,40px)' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 36 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700,
            color: PINK, background: `${PINK}15`, padding: '4px 12px', borderRadius: 20,
            marginBottom: 12, border: `1px solid ${PINK}25`,
          }}>
            👤 Profiel
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 950, letterSpacing: -1.5, marginBottom: 8, lineHeight: 1.1 }}>
            Mijn Profiel
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
            Bekijk je persoonlijke gegevens.
          </p>
        </motion.div>

        {loading ? <ProfileSkeleton /> : error ? (
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: 'rgba(239,68,68,0.3) solid 1px', padding: 'clamp(20px,4vw,32px)', color: '#ef4444', marginBottom: 24 }}>{error}</div>
        ) : profile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Avatar + status card */}
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{
                background: 'var(--bg-card)', borderRadius: 20,
                border: '1px solid var(--border)', padding: 'clamp(22px,4vw,36px)',
                marginBottom: 24, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Subtle background gradient */}
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
                background: `radial-gradient(ellipse at right, ${PURPLE}08, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              {/* Avatar with gradient border */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 92, height: 92, borderRadius: '50%', padding: 3,
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                }}>
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 34, fontWeight: 900, color: 'white',
                  }}>
                    {initials || '?'}
                  </div>
                </div>
                {/* Status dot */}
                <div style={{
                  position: 'absolute', bottom: 4, right: 4, width: 18, height: 18,
                  borderRadius: '50%', background: statusColor,
                  border: '3px solid var(--bg-card)',
                  boxShadow: `0 0 8px ${statusColor}80`,
                }} />
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px', letterSpacing: -0.5 }}>{profile.name || 'Bezorger'}</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 14px', fontSize: 14 }}>{profile.email || '—'}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 99,
                    background: `${statusColor}18`, color: statusColor,
                    border: `1px solid ${statusColor}30`,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, display: 'inline-block', boxShadow: `0 0 6px ${statusColor}` }} />
                    {statusLabel}
                  </span>
                  {profile.vehicle && (
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 99,
                      background: `${PURPLE}15`, color: PURPLE, border: `1px solid ${PURPLE}25`,
                    }}>
                      {vehicleIcon} {profile.vehicle}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Personal info card */}
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{
                background: 'var(--bg-card)', borderRadius: 20,
                border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24,
              }}
            >
              <p style={sectionLabel}>Persoonlijke gegevens</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20 }}>
                {infoItems.map((item) => (
                  <div key={item.label} style={{
                    background: focusedField === item.label ? `${PURPLE}08` : 'transparent',
                    borderRadius: 12, padding: focusedField === item.label ? '12px 14px' : '0',
                    transition: 'all 0.2s',
                  }}>
                    <p style={{
                      fontSize: 11, color: 'var(--text-muted)', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span>{item.icon}</span>{item.label}
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div style={{
                padding: '14px 18px', background: `${PURPLE}08`,
                borderRadius: 12, border: `1px solid ${PURPLE}15`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>ℹ️</span>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                  Om je gegevens te wijzigen, neem contact op met{' '}
                  <a href="mailto:support@enjoy.nl" style={{ color: PURPLE, fontWeight: 700 }}>support@enjoy.nl</a>.
                </p>
              </div>
            </motion.div>

            {/* Vehicle info card */}
            {profile.vehicle && (
              <motion.div
                custom={2}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}10, ${PINK}06)`,
                  border: `1px solid ${ORANGE}25`,
                  borderRadius: 20, padding: 'clamp(20px,4vw,32px)', marginBottom: 24,
                }}
              >
                <p style={sectionLabel}>Voertuiginformatie</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 20, flexShrink: 0,
                    background: `${ORANGE}18`, border: `1px solid ${ORANGE}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
                  }}>
                    {vehicleIcon}
                  </div>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 900, margin: '0 0 4px' }}>{profile.vehicle}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Geregistreerd voertuig</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bank info */}
            {profile.iban && (
              <motion.div
                custom={3}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                style={{
                  background: 'var(--bg-card)', borderRadius: 20,
                  border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)', marginBottom: 24,
                }}
              >
                <p style={sectionLabel}>Bankgegevens</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      🏦 IBAN
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: 0.5 }}>{profile.iban}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      📆 Uitbetaling
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Tweewekelijks</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Documents */}
            <motion.div
              custom={4}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{
                background: 'var(--bg-card)', borderRadius: 20,
                border: '1px solid var(--border)', padding: 'clamp(20px,4vw,32px)',
              }}
            >
              <p style={sectionLabel}>Documenten</p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', background: 'rgba(255,255,255,0.03)',
                borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: 24 }}>📄</span>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                  Documentverificatie wordt automatisch verwerkt. Als er aanvullende documenten nodig zijn,
                  ontvang je een e-mail met instructies.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
