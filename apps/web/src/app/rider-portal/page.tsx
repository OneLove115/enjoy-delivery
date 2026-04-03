'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function RiderPortalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  useEffect(() => {
    if (isExpired) {
      window.history.replaceState({}, '', '/rider-portal');
    }
  }, [isExpired]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';
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
      const msg = err?.message || '';
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('CORS')) {
        setError('Verbinding mislukt. Controleer je internetverbinding en probeer opnieuw.');
      } else {
        setError(msg || 'Er ging iets mis. Probeer opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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

      {/* Role indicator */}
      <div style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: 12, padding: '10px 16px', marginBottom: 20, textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: '#FF6B00', fontWeight: 600 }}>🚲 Dit portaal is voor bezorgers van EnJoy</span>
      </div>

      {/* Expired session banner */}
      {isExpired && (
        <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, textAlign: 'center' }}>
          <span style={{ fontSize: 14, color: '#ca8a04', fontWeight: 600 }}>Je sessie is verlopen. Log opnieuw in.</span>
        </div>
      )}

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
  );
}

export default function RiderPortalPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Nav />

      <section style={{ minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px,5vw,80px) clamp(16px,4vw,40px)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(90,49,244,0.1) 0%, transparent 65%)' }} />

        <Suspense fallback={
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 15 }}>Laden…</div>
          </div>
        }>
          <RiderPortalForm />
        </Suspense>
      </section>

      <Footer />
    </div>
  );
}
