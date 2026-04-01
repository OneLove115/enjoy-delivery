'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const ORANGE = '#FF6B00';

const input: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  padding: '14px 18px',
  color: 'var(--text-primary)',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'Outfit, sans-serif',
  boxSizing: 'border-box',
};

export default function RiderPortalPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://veloci.online';
      const res = await fetch(`${apiUrl}/api/riders/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Inloggen mislukt');
      localStorage.setItem('enjoy-rider-token', data.token);
      router.push('/rider-portal/dashboard');
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      <section style={{ minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,40px)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(90,49,244,0.1) 0%, transparent 65%)' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg,${PURPLE},${PINK})`, fontSize: 32, marginBottom: 20, boxShadow: `0 8px 24px ${PURPLE}40` }}>
              🚲
            </div>
            <h1 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 950, letterSpacing: -1, marginBottom: 10 }}>
              Rider Portal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6 }}>
              Log in om je aanmeldstatus te bekijken.
            </p>
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit}
            style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', padding: 'clamp(24px,4vw,40px)', display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                E-mailadres *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                style={input}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                Wachtwoord *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Jouw wachtwoord"
                style={input}
              />
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600, margin: 0 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 14, padding: '17px 0', fontSize: 16, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: `0 8px 24px ${PURPLE}35`, letterSpacing: '-0.2px' }}>
              {loading ? 'Inloggen…' : 'Inloggen →'}
            </button>

            <div style={{ textAlign: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
                Nog geen account?{' '}
                <Link href="/riders" style={{ color: ORANGE, fontWeight: 700, textDecoration: 'none' }}>
                  Meld je aan als bezorger →
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
