'use client';
import Link from 'next/link';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';

const sections: Record<string, { label: string; href: string }[]> = {
  Order: [
    { label: 'Discover restaurants', href: '/discover' },
    { label: 'How it works',         href: '/how-it-works' },
    { label: 'Promotions',           href: '/promotions' },
    { label: 'Cities',               href: '/cities' },
  ],
  Partners: [
    { label: 'Add your restaurant', href: '/partners' },
    { label: 'Ride with us',        href: '/riders' },
    { label: 'Business orders',     href: '/business' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'Careers',  href: '/careers' },
    { label: 'Blog',     href: '/blog' },
    { label: 'Press',    href: '/press' },
  ],
  Support: [
    { label: 'Help center', href: '/help' },
    { label: 'Contact',     href: '/contact' },
    { label: 'FAQ',         href: '/faq' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms',   href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
  ],
};

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 40px 32px' }} className="footer-inner">
        {/* Top row */}
        <div className="footer-top">
          {/* Brand */}
          <div style={{ maxWidth: 260, marginBottom: 8 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span translate="no" style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>
                En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>
              Elite gourmet delivery. Royally crafted, impeccably delivered.
            </p>
            {/* App store badges */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {[
                { icon: '🍎', label: 'App Store' },
                { icon: '🤖', label: 'Google Play' },
              ].map(b => (
                <div key={b.label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '8px 14px', cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 20 }}>{b.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="footer-links">
            {Object.entries(sections).map(([title, links]) => (
              <div key={title}>
                <h4 style={{ color: 'var(--text-primary)', fontWeight: 800, marginBottom: 16, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {title}
                </h4>
                {links.map(l => (
                  <Link key={l.href} href={l.href} style={{
                    display: 'block', color: 'var(--text-muted)', fontSize: 14,
                    marginBottom: 10, transition: 'color 0.2s',
                  }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, paddingTop: 24, borderTop: '1px solid var(--border)', marginTop: 8 }}>
          © 2026 EnJoy. All rights reserved. &nbsp;·&nbsp;
          <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy</Link>
          &nbsp;·&nbsp;
          <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link>
          &nbsp;·&nbsp;
          <Link href="/cookies" style={{ color: 'var(--text-muted)' }}>Cookies</Link>
        </div>
      </div>

      <style>{`
        .footer-top   { display: flex; gap: 48px; flex-wrap: wrap; margin-bottom: 40px; }
        .footer-links { display: flex; gap: 40px; flex-wrap: wrap; flex: 1; }
        .footer-inner { padding: 60px 40px 32px; }
        @media (max-width: 768px) {
          .footer-inner { padding: 40px 20px 24px !important; }
          .footer-top   { flex-direction: column; gap: 28px; }
          .footer-links { gap: 24px; }
          .footer-links > div { min-width: calc(50% - 12px); }
        }
      `}</style>
    </footer>
  );
}
