'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Profile = { id: string; name: string; email: string; phone?: string };

function ProfileSkeleton() {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.8s ease-in-out infinite',
    borderRadius: 8,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div style={{ ...shimmerStyle, width: 90, height: 13, marginBottom: 10 }} />
          <div style={{ ...shimmerStyle, width: '100%', height: 48, borderRadius: 12 }} />
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div style={{ ...shimmerStyle, width: '100%', height: 50, borderRadius: 12, marginTop: 8 }} />
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
    const res = await fetch('/api/account/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
    if (res.ok) {
      setSaved(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${focusedField === fieldName ? PURPLE : 'var(--border-strong)'}`,
    borderRadius: 12,
    padding: '14px 18px',
    color: 'var(--text-primary)',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    boxSizing: 'border-box' as const,
    boxShadow: focusedField === fieldName ? `0 0 0 2px ${PURPLE}` : 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  });

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <Nav />
      <section style={{ padding: '100px 60px 60px', maxWidth: 600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 8 }}>Your profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 40 }}>Manage your personal information.</p>
          {loading ? (
            <ProfileSkeleton />
          ) : profile ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Full name</label>
                <input
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={getInputStyle('name')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Email address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={getInputStyle('email')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Phone number</label>
                <input
                  type="tel"
                  value={profile.phone ?? ''}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="+31 6 00 00 00 00"
                  style={getInputStyle('phone')}
                />
              </div>
              <div style={{ position: 'relative', marginTop: 8 }}>
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    background: saved ? '#22C55E' : `linear-gradient(135deg,${PURPLE},${PINK})`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '15px 0',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    transition: 'background 0.4s ease, opacity 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {saving ? (
                      <motion.span key="saving" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        Saving...
                      </motion.span>
                    ) : saved ? (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
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
                        Saved
                      </motion.span>
                    ) : (
                      <motion.span key="default" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        Save changes
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>
          ) : null}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
