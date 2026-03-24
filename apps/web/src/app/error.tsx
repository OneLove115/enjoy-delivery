'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ fontSize: 80, marginBottom: 24 }}>⚠️</div>
      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Something went wrong</h2>
      <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 32 }}>The royal kitchen hit a snag. Please try again.</p>
      <div style={{ display: 'flex', gap: 16 }}>
        <button onClick={reset} style={{ background: 'linear-gradient(135deg,#5A31F4,#FF0080)', color: 'white', padding: '14px 32px', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          Try again
        </button>
        <Link href="/" style={{ background: 'rgba(255,255,255,0.06)', color: 'white', padding: '14px 32px', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>
          Go home
        </Link>
      </div>
    </div>
  );
}
