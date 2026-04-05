'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Address = { id: string; label: string; street: string; city: string; zip: string; postcode?: string };

function AddressSkeleton({ index }: { index: number }) {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.8s ease-in-out infinite',
    borderRadius: 8,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        padding: '20px 24px',
        background: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div style={{ ...shimmerStyle, width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ ...shimmerStyle, width: 100, height: 15, marginBottom: 8 }} />
        <div style={{ ...shimmerStyle, width: 220, height: 14 }} />
      </div>
    </motion.div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, x: -24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: '', street: '', city: '', zip: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.push('/login?next=/account/addresses'); return false; } return true; })
      .then(ok => ok && fetch('/api/account/addresses'))
      .then(r => r && r.json())
      .then(d => d && setAddresses(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [router]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(prev => [...prev, data]);
        setForm({ label: '', street: '', city: '', zip: '' });
        setAdding(false);
      } else {
        setFormError(data.error || data.message || 'Could not save address. Please try again.');
      }
    } catch {
      setFormError('Network error. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const input: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-strong)',
    borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', fontSize: 14, outline: 'none',
    fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <Nav />
      <section style={{ padding: '100px 60px 60px', maxWidth: 680, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h1 style={{ fontSize: 38, fontWeight: 900 }}>Your addresses</h1>
            <button onClick={() => { setAdding(!adding); setFormError(''); }}
              style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              + Add address
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>Saved delivery addresses for faster checkout.</p>

          <AnimatePresence>
            {adding && (
              <motion.form
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleAdd}
                style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-strong)', padding: '28px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}
              >
                <input placeholder="Label (e.g. Home, Office)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} required style={input} />
                <input placeholder="Street and number" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required style={input} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required style={input} />
                  <input placeholder="Postcode" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} required style={input} />
                </div>
                {formError && (
                  <p style={{ color: '#FF4444', fontSize: 13, fontWeight: 600, textAlign: 'center', marginTop: 4 }}>
                    {formError}
                  </p>
                )}
                <button type="submit" disabled={saving}
                  style={{ background: saving ? 'rgba(90,49,244,0.5)' : `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', border: 'none', borderRadius: 12, padding: '13px 0', fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', marginTop: 4, fontFamily: 'Outfit, sans-serif' }}>
                  {saving ? 'Saving...' : 'Save address'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[0, 1, 2].map(i => (
                <AddressSkeleton key={i} index={i} />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', padding: '60px 0' }}
            >
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${PURPLE}20, ${PINK}20)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 style={{
                fontSize: 22,
                fontWeight: 800,
                marginBottom: 8,
                background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                No saved addresses yet
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 28, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                Save your delivery addresses for faster checkout next time.
              </p>
              <button
                onClick={() => { setAdding(true); setFormError(''); }}
                style={{
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 36px',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: `0 8px 30px ${PURPLE}40`,
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                + Add your first address
              </button>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {addresses.map((a, i) => (
                <motion.div
                  key={a.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  style={{ padding: '20px 24px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}
                >
                  <span style={{ fontSize: 24 }}>📍</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{a.label}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>{a.street}, {a.zip || a.postcode} {a.city}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
