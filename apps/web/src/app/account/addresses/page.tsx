'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Address = { id: string; label: string; street: string; city: string; zip: string; postcode?: string };

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

          {adding && (
            <form onSubmit={handleAdd} style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-strong)', padding: '28px', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Label (e.g. Home, Office)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} required style={input} />
              <input placeholder="Street and number" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} required style={input} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required style={input} />
                <input placeholder="Postcode" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} required style={input} />
              </div>
              {formError && (
                <p style={{ color: '#FF4444', fontSize: 13, fontWeight: 600, textAlign: 'center', marginTop: 4 }}>
                  ⚠️ {formError}
                </p>
              )}
              <button type="submit" disabled={saving}
                style={{ background: saving ? 'rgba(90,49,244,0.5)' : `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', border: 'none', borderRadius: 12, padding: '13px 0', fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {saving ? 'Saving...' : 'Save address'}
              </button>
            </form>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading...</div>
          ) : addresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>No saved addresses yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {addresses.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ padding: '20px 24px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
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
