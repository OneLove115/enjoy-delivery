'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Signup failed'); return; }
      router.push('/discover');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const input: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '14px 18px', color: 'white', fontSize: 15, outline: 'none',
    fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', color: 'white' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,0,128,0.08) 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 440, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '48px 40px', position: 'relative', zIndex: 1 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 28, fontWeight: 900 }}>En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span></span>
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>Start your royal journey</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontSize: 14, marginBottom: 32 }}>Create your free EnJoy account</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required style={input} />
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={input} />
          <input type="password" placeholder="Password (min 8 characters)" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} style={input} />
          {error && <p style={{ color: '#FF4444', fontSize: 13, textAlign: 'center', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create account — it\'s free'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 16 }}>
          By signing up you agree to our{' '}
          <Link href="/terms" style={{ color: PURPLE, textDecoration: 'none' }}>Terms</Link> and{' '}
          <Link href="/privacy" style={{ color: PURPLE, textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 16 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
