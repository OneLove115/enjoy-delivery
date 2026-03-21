'use client';
import Link from 'next/link';

const S = { page: { background: '#0A0A0F', minHeight: '100vh', color: 'white', fontFamily: 'Outfit, sans-serif' } as const, container: { maxWidth: 900, margin: '0 auto', padding: '120px 40px 60px' } as const, h1: { fontSize: 42, fontWeight: 900, marginBottom: 16, background: 'linear-gradient(135deg,#5A31F4,#FF0080)', WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const } as const, p: { color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: 16, marginBottom: 16 } as const, back: { display: 'inline-block', marginBottom: 32, color: '#5A31F4', fontWeight: 700, fontSize: 14 } as const };

const jobs = [
  { dept: 'Engineering', title: 'Senior Full-Stack Developer', loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Build the next generation of food delivery with React, Next.js, and AI integrations.' },
  { dept: 'Engineering', title: 'AI / ML Engineer', loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Power Joya AI concierge with natural language understanding, voice recognition, and personalized recommendations.' },
  { dept: 'Engineering', title: 'Mobile Developer (React Native)', loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Craft a buttery-smooth mobile experience for iOS and Android with Expo and React Native.' },
  { dept: 'Design', title: 'Senior Product Designer', loc: 'Den Haag', type: 'Full-Time', desc: 'Design premium, crown-worthy interfaces that make ordering food feel like a royal experience.' },
  { dept: 'Operations', title: 'City Manager — Amsterdam', loc: 'Amsterdam', type: 'Full-Time', desc: 'Launch and manage EnJoy operations in Amsterdam. Own restaurant partnerships, courier fleet, and local growth.' },
  { dept: 'Marketing', title: 'Growth Marketing Manager', loc: 'Den Haag / Remote', type: 'Full-Time', desc: 'Drive user acquisition, SEO, and brand awareness across channels. Make EnJoy the household name for gourmet delivery.' },
];

export default function CareersPage() {
  return (
    <div style={S.page}><div style={S.container}>
      <Link href="/" style={S.back}>← Back to EnJoy</Link>
      <h1 style={S.h1}>Careers at EnJoy</h1>
      <p style={{ ...S.p, fontSize: 20, marginBottom: 48 }}>Join the royal court. Build the future of food delivery with a team that believes great technology serves great food.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {[{ icon: '🌍', title: 'Remote-First', text: 'Work from anywhere in the EU' }, { icon: '🍕', title: 'Free Meals', text: 'EnJoy credit every month' }, { icon: '📈', title: 'Equity', text: 'Stock options for every role' }].map((p, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '24px 16px', background: 'rgba(90,49,244,0.04)', borderRadius: 16 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
            <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{p.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{p.text}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Open Positions</h2>
      {jobs.map((j, i) => (
        <div key={i} style={{ padding: '24px 28px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>{j.title}</h3>
            <span style={{ background: 'rgba(90,49,244,0.15)', color: '#5A31F4', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{j.dept}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 8 }}>{j.desc}</p>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            <span>📍 {j.loc}</span>
            <span>⏰ {j.type}</span>
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link href="/contact" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg,#5A31F4,#FF0080)', borderRadius: 40, color: 'white', fontWeight: 800, fontSize: 16 }}>Apply Now</Link>
      </div>
    </div></div>
  );
}
