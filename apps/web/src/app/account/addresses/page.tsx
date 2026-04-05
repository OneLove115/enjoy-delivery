'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Address = { id: string; label: string; street: string; city: string; zip: string; postcode?: string; isDefault?: boolean };

function AddressSkeleton({ index }: { index: number }) {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.8s ease-in-out infinite',
    borderRadius: 8,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{ padding: '20px 24px', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}
    >
      <div style={{ ...shimmerStyle, width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ ...shimmerStyle, width: 100, height: 14, marginBottom: 8 }} />
        <div style={{ ...shimmerStyle, width: 220, height: 13 }} />
      </div>
    </motion.div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, x: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: { opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.25 } },
};

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: '', street: '', city: '', zip: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
        setFormError(data.error || data.message || 'Kon adres niet opslaan. Probeer opnieuw.');
      }
    } catch {
      setFormError('Netwerkfout. Controleer je verbinding en probeer opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    background: focusedField === fieldName ? 'rgba(90,49,244,0.06)' : 'rgba(255,255,255,0.04)',
    border: `1.5px solid ${focusedField === fieldName ? PURPLE : 'rgba(255,255,255,0.10)'}`,
    borderRadius: 12,
    padding: '13px 16px',
    color: 'var(--text-primary)',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    boxSizing: 'border-box' as const,
    boxShadow: focusedField === fieldName ? `0 0 0 3px ${PURPLE}20` : 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
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
      <section style={{ padding: '100px 24px 60px', maxWidth: 680, margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back link */}
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

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h1 style={{
              fontSize: 38, fontWeight: 900, letterSpacing: '-0.5px',
              background: `linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6))`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Mijn adressen
            </h1>
            <motion.button
              onClick={() => { setAdding(!adding); setFormError(''); }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: adding
                  ? 'rgba(255,255,255,0.08)'
                  : `linear-gradient(135deg,${PURPLE},${PINK})`,
                color: adding ? 'var(--text-secondary)' : '#fff',
                border: adding ? '1px solid rgba(255,255,255,0.12)' : 'none',
                borderRadius: 12, padding: '10px 20px',
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Outfit, sans-serif',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                boxShadow: adding ? 'none' : `0 4px 16px ${PURPLE}35`,
              }}
            >
              {adding ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Annuleren
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Adres toevoegen
                </>
              )}
            </motion.button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>Opgeslagen bezorgadressen voor sneller afrekenen.</p>

          {/* Add address form */}
          <AnimatePresence>
            {adding && (
              <motion.form
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                onSubmit={handleAdd}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 20,
                  border: `1px solid rgba(90,49,244,0.25)`,
                  padding: '28px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  overflow: 'hidden',
                  boxShadow: `0 8px 32px rgba(90,49,244,0.12)`,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Nieuw adres
                </div>
                <input
                  placeholder="Label (bijv. Thuis, Kantoor)"
                  value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })}
                  onFocus={() => setFocusedField('label')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={getInputStyle('label')}
                />
                <input
                  placeholder="Straat en huisnummer"
                  value={form.street}
                  onChange={e => setForm({ ...form, street: e.target.value })}
                  onFocus={() => setFocusedField('street')}
                  onBlur={() => setFocusedField(null)}
                  required
                  style={getInputStyle('street')}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input
                    placeholder="Stad"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={getInputStyle('city')}
                  />
                  <input
                    placeholder="Postcode"
                    value={form.zip}
                    onChange={e => setForm({ ...form, zip: e.target.value })}
                    onFocus={() => setFocusedField('zip')}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={getInputStyle('zip')}
                  />
                </div>
                {formError && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#FF4444', fontSize: 13, fontWeight: 600, textAlign: 'center', marginTop: 4, marginBottom: 0 }}
                  >
                    {formError}
                  </motion.p>
                )}
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: saving ? `rgba(90,49,244,0.5)` : `linear-gradient(135deg,${PURPLE},${PINK})`,
                    color: '#fff', border: 'none', borderRadius: 12,
                    padding: '14px 0', fontSize: 15, fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    marginTop: 4,
                    fontFamily: 'Outfit, sans-serif',
                    boxShadow: saving ? 'none' : `0 4px 16px ${PURPLE}35`,
                    transition: 'background 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {saving ? 'Opslaan...' : 'Adres opslaan'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Address list */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[0, 1, 2].map(i => <AddressSkeleton key={i} index={i} />)}
            </div>
          ) : addresses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', padding: '60px 0' }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${PURPLE}20, ${PINK}20)`,
                  border: `1px solid ${PURPLE}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </motion.div>
              <h3 style={{
                fontSize: 22, fontWeight: 800, marginBottom: 8,
                background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Nog geen adressen opgeslagen
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 28, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                Sla je bezorgadressen op voor sneller afrekenen.
              </p>
              <motion.button
                onClick={() => { setAdding(true); setFormError(''); }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                  color: '#fff', border: 'none', borderRadius: 14,
                  padding: '14px 36px', fontSize: 15, fontWeight: 800,
                  cursor: 'pointer', boxShadow: `0 8px 30px ${PURPLE}40`,
                  fontFamily: 'Outfit, sans-serif',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Voeg je eerste adres toe
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {addresses.map((a, i) => {
                  const isHovered = hoveredId === a.id;
                  const isDefault = a.isDefault || i === 0;
                  return (
                    <motion.div
                      key={a.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={cardVariants}
                      onMouseEnter={() => setHoveredId(a.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        padding: '20px 24px',
                        background: isHovered ? 'rgba(255,255,255,0.04)' : 'var(--bg-card)',
                        borderRadius: 18,
                        border: `1px solid ${isHovered ? `${PURPLE}45` : 'rgba(255,255,255,0.06)'}`,
                        display: 'flex', alignItems: 'center', gap: 16,
                        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                        boxShadow: isHovered ? `0 8px 24px rgba(0,0,0,0.25)` : 'none',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                        cursor: 'default',
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: isHovered ? `${PURPLE}20` : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${isHovered ? `${PURPLE}40` : 'rgba(255,255,255,0.08)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isHovered ? PURPLE : 'var(--text-muted)',
                        transition: 'all 0.2s ease',
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{a.label}</p>
                          {isDefault && (
                            <span style={{
                              fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 10,
                              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                              color: '#fff', letterSpacing: '0.5px', textTransform: 'uppercase',
                            }}>
                              Standaard
                            </span>
                          )}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
                          {a.street}, {a.zip || a.postcode} {a.city}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
