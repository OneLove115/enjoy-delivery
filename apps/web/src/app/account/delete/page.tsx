'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ORANGE = '#FF6B35';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!confirmed) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      if (res.status === 204) {
        router.push('/login?deleted=1');
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? 'Er is iets misgegaan. Probeer opnieuw.');
      }
    } catch {
      setError('Verbindingsfout. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-page, #0A0A0F)', minHeight: '100vh', color: '#fff', fontFamily: "'Outfit', system-ui, sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Account verwijderen</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            Je accountgegevens worden verwijderd. Bestellingen blijven anoniem bewaard voor administratiedoeleinden.
          </p>
        </div>

        {/* Warning box */}
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: '16px 20px', marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: '#EF4444' }}>Let op:</strong> Dit kan niet ongedaan worden gemaakt. Je naam, e-mailadres, telefoonnummer en adresgegevens worden permanent verwijderd.
          </p>
        </div>

        {/* Confirmation checkbox */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            style={{ width: 18, height: 18, marginTop: 2, accentColor: '#EF4444', flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
            Ik begrijp dat mijn account permanent wordt verwijderd en dit niet ongedaan gemaakt kan worden.
          </span>
        </label>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#EF4444' }}>
            {error}
          </div>
        )}

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={!confirmed || loading}
          style={{
            width: '100%', padding: '16px', borderRadius: 999, border: 'none',
            background: confirmed ? '#EF4444' : 'rgba(255,255,255,0.08)',
            color: confirmed ? '#fff' : 'rgba(255,255,255,0.3)',
            fontSize: 15, fontWeight: 800, cursor: confirmed ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', transition: 'all 0.2s', marginBottom: 16,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Bezig met verwijderen…' : 'Mijn account verwijderen'}
        </button>

        {/* Cancel */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/account" style={{ color: ORANGE, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            ← Annuleren
          </Link>
        </div>
      </div>
    </div>
  );
}
