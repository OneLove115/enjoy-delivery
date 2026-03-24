import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ fontSize: 80, marginBottom: 24 }}>👑</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Page not found</h1>
      <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 32 }}>This page does not exist — but the royal kitchen is open.</p>
      <Link href="/" style={{ background: 'linear-gradient(135deg,#5A31F4,#FF0080)', color: 'white', padding: '14px 32px', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>
        Back to EnJoy
      </Link>
    </div>
  );
}
