'use client';
import { useEffect, useState } from 'react';

const PURPLE = '#5A31F4';
const ORANGE = '#FF6B35';

export default function OfflinePage() {
  const [retrying, setRetrying] = useState(false);

  const retry = () => {
    setRetrying(true);
    // Try navigating to discover; if still offline the SW will catch it
    window.location.href = '/discover';
  };

  return (
    <div
      style={{
        background: '#0A0A0F',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        fontFamily: "'Outfit', system-ui, sans-serif",
        color: '#fff',
        textAlign: 'center',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 24,
          background: `linear-gradient(135deg, ${PURPLE}33, ${PURPLE}11)`,
          border: `1.5px solid ${PURPLE}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          marginBottom: 28,
        }}
      >
        📡
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12 }}>
        You&apos;re offline
      </h1>

      <p
        style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.65,
          maxWidth: 320,
          marginBottom: 32,
        }}
      >
        Your cart is saved. We&apos;ll sync your session as soon as you&apos;re
        back online.
      </p>

      <button
        onClick={retry}
        disabled={retrying}
        style={{
          padding: '15px 36px',
          borderRadius: 999,
          border: 'none',
          background: retrying ? 'rgba(255,255,255,0.12)' : ORANGE,
          color: '#fff',
          fontSize: 15,
          fontWeight: 800,
          cursor: retrying ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          boxShadow: retrying ? 'none' : '0 6px 20px rgba(255,107,53,0.28)',
          minHeight: 44,
          minWidth: 44,
        }}
      >
        {retrying ? 'Trying…' : 'Try again'}
      </button>
    </div>
  );
}
