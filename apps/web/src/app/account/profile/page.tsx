'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

type Profile = { id: string; name: string; email: string; phone?: string };

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

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
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  };

  const input: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-strong)',
    borderRadius: 12, padding: '14px 18px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
    fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />
      <section style={{ padding: '100px 60px 60px', maxWidth: 600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 8 }}>Your profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 40 }}>Manage your personal information.</p>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading...</div>
          ) : profile ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Full name</label>
                <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Email address</label>
                <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Phone number</label>
                <input type="tel" value={profile.phone ?? ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+31 6 00 00 00 00" style={input} />
              </div>
              <button type="submit" disabled={saving}
                style={{ background: saved ? '#22C55E' : `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 15, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, marginTop: 8, transition: 'background 0.3s' }}>
                {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
              </button>
            </form>
          ) : null}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
