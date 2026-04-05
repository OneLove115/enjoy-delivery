"use client";
import { useEffect, useState } from "react";

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

export function PWAInstall() {
  const [prompt, setPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Track visit count
    const visits = parseInt(localStorage.getItem('pwa-visits') || '0') + 1;
    localStorage.setItem('pwa-visits', String(visits));

    // Don't show if already installed or permanently dismissed
    if (localStorage.getItem('pwa-installed') === '1') return;
    const dismissCount = parseInt(localStorage.getItem('pwa-dismiss-count') || '0');
    if (dismissCount >= 5) return; // Stop after 5 dismissals

    // Check if already in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      localStorage.setItem('pwa-installed', '1');
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      // Show after a delay — first visit: 5s, subsequent: 2s
      const delay = visits <= 1 ? 5000 : 2000;
      setTimeout(() => setVisible(true), delay);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);

    // For iOS (no beforeinstallprompt) — show manual instructions after 2nd visit
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && visits >= 2 && !sessionStorage.getItem('pwa-ios-shown')) {
      setTimeout(() => setVisible(true), 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const install = async () => {
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', '1');
      }
    }
    setVisible(false);
    setPrompt(null);
  };

  const dismiss = () => {
    setVisible(false);
    const count = parseInt(localStorage.getItem('pwa-dismiss-count') || '0') + 1;
    localStorage.setItem('pwa-dismiss-count', String(count));
    sessionStorage.setItem('pwa-ios-shown', '1');
  };

  if (!visible) return null;

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 16, right: 16, zIndex: 9800,
      background: 'rgba(10,10,18,0.97)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 18,
      border: `1px solid rgba(90,49,244,0.4)`,
      padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(90,49,244,0.15)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26,
      }}>
        🍽️
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: 'white', fontWeight: 800, fontSize: 14, marginBottom: 2 }}>
          Installeer EnJoy
        </div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.4 }}>
          {isIOS
            ? 'Tik op ⎋ Delen → "Zet op beginscherm"'
            : 'Voeg toe aan je startscherm voor snelle toegang'
          }
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        {!isIOS && (
          <button onClick={install} style={{
            padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`,
            color: 'white', fontWeight: 800, fontSize: 13, fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}>
            Installeer
          </button>
        )}
        <button onClick={dismiss} style={{
          padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
          cursor: 'pointer', background: 'transparent',
          color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}>
          Niet nu
        </button>
      </div>
    </div>
  );
}
