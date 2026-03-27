'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const input: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-strong)',
    borderRadius: 12, padding: '14px 18px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
    fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(90,49,244,0.12) 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 440, background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 24, padding: '48px 40px', position: 'relative', zIndex: 1 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 32 }}>
          <span translate="no" style={{ fontSize: 28, fontWeight: 900 }}>En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span></span>
        </Link>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Check your email</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a reset link. Check your inbox.
            </p>
            <Link href="/login" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 26, fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>Forgot your password?</h1>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: 14, marginBottom: 32 }}>
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={input} />
              {error && <p style={{ color: '#FF4444', fontSize: 13, textAlign: 'center', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={loading}
                style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'var(--text-primary)', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8 }}>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginTop: 24 }}>
              <Link href="/login" style={{ color: PURPLE, fontWeight: 700, textDecoration: 'none' }}>Back to sign in</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
