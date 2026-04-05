'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B35';

type Profile = { id: string; name: string; email: string; phone?: string };

function ProfileSkeleton() {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.8s ease-in-out infinite',
    borderRadius: 8,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Avatar skeleton */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ ...shimmerStyle, width: 96, height: 96, borderRadius: '50%' }} />
      </div>
      {[0, 1, 2].map(i => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <div style={{ ...shimmerStyle, width: 90, height: 13, marginBottom: 10 }} />
          <div style={{ ...shimmerStyle, width: '100%', height: 52, borderRadius: 14 }} />
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div style={{ ...shimmerStyle, width: '100%', height: 52, borderRadius: 14, marginTop: 8 }} />
      </motion.div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.push('/login?next=/account/profile'); return false; } return true; })
      .then(ok => ok && fetch('/api/account/profile'))
      .then(r => r && r.json())
      .then(d => d && setProfile(d))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const res = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      setSaved(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    background: focusedField === fieldName ? 'rgba(90,49,244,0.06)' : 'rgba(255,255,255,0.04)',
    border: `1.5px solid ${focusedField === fieldName ? PURPLE : 'rgba(255,255,255,0.10)'}`,
    borderRadius: 14,
    padding: '15px 18px',
    color: 'var(--text-primary)',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    boxSizing: 'border-box' as const,
    boxShadow: focusedField === fieldName ? `0 0 0 3px ${PURPLE}25, 0 2px 12px rgba(0,0,0,0.2)` : 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
  });

  const fields: { key: keyof Profile; label: string; type?: string; placeholder?: string }[] = [
    { key: 'name',  label: 'Volledige naam',  type: 'text',  placeholder: 'Jouw naam' },
    { key: 'email', label: 'E-mailadres',      type: 'email', placeholder: 'jouw@email.nl' },
    { key: 'phone', label: 'Telefoonnummer',   type: 'tel',   placeholder: '+31 6 00 00 00 00' },
  ];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <Nav />
      <section style={{ padding: '100px 24px 60px', maxWidth: 580, margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <Link
            href="/account"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, marginBottom: 20, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Account
          </Link>
          <h1 style={{
            fontSize: 38, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.5px',
            background: `linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6))`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Mijn profiel
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Beheer je persoonlijke gegevens.</p>
        </motion.div>

        {loading ? (
          <ProfileSkeleton />
        ) : profile ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

            {/* Avatar section */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
              <div style={{ position: 'relative' }}>
                {/* Gradient ring */}
                <div style={{
                  position: 'absolute', inset: -3, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${PURPLE}, ${PINK}, ${ORANGE})`,
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 3s ease infinite',
                  padding: 3,
                }} />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  style={{
                    width: 96, height: 96, borderRadius: '50%',
                    background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, fontWeight: 900, color: '#fff',
                    position: 'relative', zIndex: 1,
                    border: '3px solid var(--bg-page)',
                  }}
                >
                  {initials}
                </motion.div>
              </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {fields.map(({ key, label, type, placeholder }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: focusedField === key ? PURPLE : 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', textTransform: 'uppercase', transition: 'color 0.2s' }}>
                    {label}
                  </label>
                  <input
                    type={type ?? 'text'}
                    value={(profile[key] as string) ?? ''}
                    onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={placeholder}
                    style={getInputStyle(key)}
                  />
                </motion.div>
              ))}

              <div style={{ position: 'relative', marginTop: 8 }}>
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    width: '100%',
                    background: saved
                      ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                      : `linear-gradient(135deg,${PURPLE},${PINK})`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    padding: '16px 0',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    transition: 'background 0.4s ease, opacity 0.2s ease',
                    boxShadow: saved
                      ? '0 8px 24px rgba(34,197,94,0.35)'
                      : `0 8px 24px ${PURPLE}35`,
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {saving ? (
                      <motion.span key="saving" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        Opslaan...
                      </motion.span>
                    ) : saved ? (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <motion.path
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                          />
                        </svg>
                        Opgeslagen!
                      </motion.span>
                    ) : (
                      <motion.span key="default" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        Wijzigingen opslaan
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </section>
      <Footer />
    </div>
  );
}
