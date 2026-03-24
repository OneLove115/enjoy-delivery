'use client';
import Link from 'next/link';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

const sections: Record<string, { label: string; href: string }[]> = {
  Order: [
    { label: 'Discover restaurants', href: '/discover' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Promotions', href: '/promotions' },
    { label: 'Cities', href: '/cities' },
  ],
  Partners: [
    { label: 'Add your restaurant', href: '/partners' },
    { label: 'Ride with us', href: '/riders' },
    { label: 'Business orders', href: '/business' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
  ],
  Support: [
    { label: 'Help center', href: '/help' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookies', href: '/cookies' },
  ],
};

export function Footer() {
  return (
    <footer style={{ padding: '60px 60px 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 40 }}>
        <div style={{ maxWidth: 260 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>
            En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
          </span>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>
            Elite gourmet delivery. Royally crafted, impeccably delivered.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {['🍎', '🤖'].map((icon, i) => (
              <div key={i} style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>{icon}</div>
            ))}
          </div>
        </div>
        {Object.entries(sections).map(([title, links]) => (
          <div key={title}>
            <h4 style={{ color: 'white', fontWeight: 800, marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</h4>
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 10, textDecoration: 'none' }}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        © 2026 EnJoy. All rights reserved. Royal Delivery Worldwide.
      </div>
    </footer>
  );
}
