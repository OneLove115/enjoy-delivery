'use client';

import { useEffect, useState } from 'react';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const CONSENT_KEY = 'enjoy-cookie-consent';

// Only load the Meta Pixel after the user has granted consent.
// PageView fires after consent grant so we don't drop the first impression under revoked consent.
export function MetaPixel() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setConsented(localStorage.getItem(CONSENT_KEY) === 'granted');
    update();
    window.addEventListener('storage', update);
    window.addEventListener('enjoy-consent-changed', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('enjoy-consent-changed', update);
    };
  }, []);

  useEffect(() => {
    if (!consented || !PIXEL_ID || typeof window === 'undefined') return;
    const w = window as unknown as {
      fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; push: unknown; loaded: boolean; version: string };
      _fbq?: unknown;
    };
    if (w.fbq) return;

    const n = (w.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    } as typeof w.fbq & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; push: unknown; loaded: boolean; version: string });
    if (!w._fbq) w._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);

    w.fbq('init', PIXEL_ID);
    w.fbq('consent', 'grant');
    w.fbq('track', 'PageView');
  }, [consented]);

  if (!PIXEL_ID || !consented) return null;

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
