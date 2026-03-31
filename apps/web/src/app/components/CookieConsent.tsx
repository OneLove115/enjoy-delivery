'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'enjoy-cookie-consent';

type ConsentChoice = 'granted' | 'denied' | null;

function getStoredConsent(): ConsentChoice {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentChoice;
}

function updateGtagConsent(granted: boolean) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (!w.gtag) return;
  const value = granted ? 'granted' : 'denied';
  w.gtag('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === null) {
      setVisible(true);
    } else if (stored === 'granted') {
      updateGtagConsent(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    updateGtagConsent(true);
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    w.fbq?.('consent', 'grant');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    updateGtagConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '16px 20px',
        background: 'rgba(15, 10, 30, 0.97)',
        borderTop: '1px solid rgba(90, 49, 244, 0.3)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontFamily: 'Outfit, system-ui, sans-serif',
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
      }}
    >
      <span>
        We use cookies to improve your experience and analyze site traffic.{' '}
        <Link href="/cookies" style={{ color: '#5A31F4', textDecoration: 'underline' }}>
          Cookie Policy
        </Link>
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={decline}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
        <button
          onClick={accept}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(135deg, #5A31F4, #FF0080)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
