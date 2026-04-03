'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const input: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12, padding: '14px 18px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
  fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
};

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Wachtwoorden komen niet overeen'); return; }
    if (password.length < 8) { setError('Wachtwoord moet minimaal 8 tekens zijn'); return; }
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://veloci.online';
      const res = await fetch(`${apiUrl}/api/riders/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kon wachtwoord niet instellen');
      setSuccess(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => router.push('/rider-portal'), 3000);
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || token.trim().length < 20) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Ongeldige link</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Deze link is ongeldig of verlopen.</p>
        <Link href="/rider-portal" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none' }}>Ga naar Rider Portal →</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Wachtwoord ingesteld!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Je wordt doorgestuurd naar de login pagina...</p>
        <Link href="/rider-portal" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '14px 28px', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>
          Nu inloggen →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <img src="/logo-enjoy.png" alt="EnJoy" style={{ height: 48, marginBottom: 20 }} />
        <h1 style={{ fontSize: 28, fontWeight: 950, marginBottom: 10 }}>Stel je wachtwoord in</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Kies een wachtwoord om toegang te krijgen tot je Rider Dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)', padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Nieuw wachtwoord *</label>
          <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 tekens" style={input} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Bevestig wachtwoord *</label>
          <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Herhaal je wachtwoord" style={input} />
        </div>
        {error && <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 14, padding: '17px 0', fontSize: 16, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Instellen...' : 'Wachtwoord instellen →'}
        </button>
      </form>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>Laden...</div>}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}
