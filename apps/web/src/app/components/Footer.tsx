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
    { label: 'Referral Program',    href: 'https://www.veloci.online/referral' },
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

function SocialIcon({ href, label, d }: { href: string; label: string; d: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={label}
      className="social-icon"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
    </a>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 40px 32px' }} className="footer-inner">
        {/* Top row */}
        <div className="footer-top">
          {/* Brand */}
          <div style={{ maxWidth: 260, marginBottom: 8 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <img src="/logo-enjoy.png" alt="EnJoy" style={{ height: 40, width: 'auto' }} width={128} height={40} />
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
                  l.href.startsWith('http') ? (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={{
                      display: 'block', color: 'var(--text-muted)', fontSize: 14,
                      marginBottom: 10, transition: 'color 0.2s', textDecoration: 'none',
                    }}>
                      {l.label}
                    </a>
                  ) : (
                    <Link key={l.href} href={l.href} style={{
                      display: 'block', color: 'var(--text-muted)', fontSize: 14,
                      marginBottom: 10, transition: 'color 0.2s',
                    }}>
                      {l.label}
                    </Link>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, paddingTop: 24, borderTop: '1px solid var(--border)', marginTop: 8, marginBottom: 16 }}>
          <SocialIcon href="#" label="Instagram" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          <SocialIcon href="#" label="Facebook" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
          <SocialIcon href="#" label="LinkedIn" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          <SocialIcon href="#" label="TikTok" d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64C4.16 18.78 7.01 21 9.52 21a5.31 5.31 0 0 0 5.3-5.33V9.07a7.35 7.35 0 0 0 4.18 1.3V7.2s-1.88.09-2.4-1.38z" />
          <SocialIcon href="#" label="Google My Business" d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
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
        .social-icon:hover { color: #fff !important; border-color: #5A31F4 !important; background: rgba(90,49,244,0.1) !important; }
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
