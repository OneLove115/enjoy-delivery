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

        {/* Social Media */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingTop: 24, borderTop: '1px solid var(--border)', marginTop: 8, marginBottom: 16 }}>
          {[
            { name: 'Instagram', href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
            { name: 'Facebook', href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
            { name: 'LinkedIn', href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
            { name: 'TikTok', href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.33-6.33V9.06a8.16 8.16 0 0 0 4.29 1.2v-3.4a4.85 4.85 0 0 1-.4-.17z"/></svg> },
            { name: 'Google', href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 7.5 19 4m0 0v5m0-5h-5M4 12a8 8 0 0 1 14.5-4.5M20 12a8 8 0 0 1-14.5 4.5"/></svg> },
          ].map(s => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" title={s.name}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.borderColor = `${PURPLE}`; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; (e.target as HTMLElement).style.borderColor = 'var(--border)'; }}>
              {s.icon}
            </a>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, paddingBottom: 8 }}>
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
