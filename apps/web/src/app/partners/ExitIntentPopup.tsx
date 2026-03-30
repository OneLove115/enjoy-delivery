'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

export function PartnersExitPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('partners-exit-dismissed')) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 5 && !show) setShow(true);
    }

    document.addEventListener('mouseleave', handleMouseLeave);

    const mobileTimer = setTimeout(() => {
      if (!sessionStorage.getItem('partners-exit-dismissed')) setShow(true);
    }, 45000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, [show]);

  function dismiss() {
    setShow(false);
    sessionStorage.setItem('partners-exit-dismissed', '1');
  }

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 460, background: 'linear-gradient(135deg, #0f0f0f, #1a1a2e)', border: `1px solid ${PURPLE}30`, borderRadius: 20, overflow: 'hidden', boxShadow: `0 20px 60px ${PURPLE}20` }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 200, height: 100, background: `${PURPLE}25`, filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Close */}
        <button onClick={dismiss} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#666', cursor: 'pointer', zIndex: 10 }}>
          <X size={20} />
        </button>

        <div style={{ position: 'relative', padding: 32, textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-block', background: `${PURPLE}15`, border: `1px solid ${PURPLE}30`, borderRadius: 40, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: PURPLE, textTransform: 'uppercase', letterSpacing: 2 }}>Exclusief aanbod</span>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 950, color: 'white', lineHeight: 1.2, marginBottom: 12 }}>
            Wacht — krijg<br />
            <span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>20% korting</span> op je eerste jaar
          </h2>

          <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Start vandaag met AI-bestelsysteem voor je restaurant. Deze korting geldt automatisch bij aanmelding.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: '#666', textDecoration: 'line-through' }}>€99.95/maand</span>
                <p style={{ fontSize: 22, fontWeight: 950, color: 'white', margin: '4px 0 0' }}>€79.96<span style={{ fontSize: 13, color: '#666', fontWeight: 400 }}>/maand</span></p>
              </div>
              <div style={{ height: 40, width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: PURPLE, textTransform: 'uppercase' }}>Je bespaart</span>
                <p style={{ fontSize: 22, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '4px 0 0' }}>€239.88</p>
                <span style={{ fontSize: 10, color: '#555' }}>per jaar</span>
              </div>
            </div>
          </div>

          <a href="https://www.veloci.online/signup?discount=20" onClick={dismiss}
            style={{ display: 'block', width: '100%', padding: '16px 24px', background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', fontWeight: 800, borderRadius: 14, fontSize: 15, textDecoration: 'none', textAlign: 'center', boxShadow: `0 8px 24px ${PURPLE}40` }}>
            Claim 20% korting — Start €1 proefperiode
          </a>

          <button onClick={dismiss} style={{ marginTop: 16, background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer' }}>
            Nee bedankt, ik betaal de volle prijs
          </button>
        </div>
      </div>
    </div>
  );
}
