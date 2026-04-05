'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

/* ---------- CSS-based confetti (no external deps) ---------- */
function Confetti() {
  const pieces = useMemo(() => {
    const colors = [PURPLE, PINK, '#FFD600', '#00E5FF', '#76FF03', '#FF6D00', '#E040FB'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.2}s`,
      duration: `${2 + Math.random() * 2}s`,
      size: 6 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 720,
    }));
  }, []);

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) translateX(0px) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(100vh) translateX(var(--drift)) rotate(var(--rot)) scale(0.4); opacity: 0; }
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
        {pieces.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: -10,
              left: p.left,
              width: p.size,
              height: p.size * 1.4,
              background: p.color,
              borderRadius: p.id % 3 === 0 ? '50%' : '2px',
              animation: `confetti-fall ${p.duration} ${p.delay} ease-in forwards`,
              ['--drift' as string]: `${p.drift}px`,
              ['--rot' as string]: `${p.rotation}deg`,
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ---------- Animated SVG checkmark ---------- */
function AnimatedCheck() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 28px' }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: -16,
        background: `radial-gradient(circle, ${PURPLE}30 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(12px)',
      }} />
      <svg viewBox="0 0 96 96" width={96} height={96} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="check-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={PURPLE} />
            <stop offset="100%" stopColor={PINK} />
          </linearGradient>
        </defs>
        {/* Circle */}
        <circle
          cx={48} cy={48} r={42}
          fill="none"
          stroke="url(#check-grad)"
          strokeWidth={4}
          strokeLinecap="round"
          style={{
            strokeDasharray: 264,
            strokeDashoffset: animate ? 0 : 264,
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.65,0,0.35,1)',
          }}
        />
        {/* Checkmark */}
        <path
          d="M30 50 L43 63 L66 36"
          fill="none"
          stroke="url(#check-grad)"
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 60,
            strokeDashoffset: animate ? 0 : 60,
            transition: 'stroke-dashoffset 0.5s cubic-bezier(0.65,0,0.35,1) 0.7s',
          }}
        />
      </svg>
    </div>
  );
}

/* ---------- Main content ---------- */
function OrderSuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');
  const orderId = params.get('session_id') || params.get('orderId');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)',
      fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', maxWidth: 500, padding: '40px 24px', position: 'relative', zIndex: 10 }}
      >
        <AnimatedCheck />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ fontSize: 32, fontWeight: 950, marginBottom: 12 }}
        >
          Bestelling geplaatst!
        </motion.h1>

        {orderNumber && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 8 }}
          >
            Bestelnummer: <strong style={{ color: 'var(--text-primary)' }}>{orderNumber}</strong>
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 32 }}
        >
          Je bestelling is ontvangen en wordt bereid. Je ontvangt een bevestiging per e-mail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          {orderId && (
            <Link href={`/order/${orderId}`} style={{
              background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              color: 'white', padding: '14px 28px', borderRadius: 12,
              fontWeight: 800, fontSize: 16, textDecoration: 'none',
              boxShadow: `0 4px 16px ${PURPLE}40`,
            }}>
              Volg je bestelling 🚲
            </Link>
          )}
          <Link href="/discover" style={{
            background: orderId ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${PURPLE},${PINK})`,
            border: orderId ? '1px solid rgba(255,255,255,0.15)' : 'none',
            color: 'white', padding: '14px 28px', borderRadius: 12,
            fontWeight: 800, fontSize: 16, textDecoration: 'none',
            boxShadow: orderId ? 'none' : `0 4px 16px ${PURPLE}40`,
          }}>
            Terug naar restaurants
          </Link>
          {orderNumber && (
            <Link href={`/account/orders`} style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', padding: '14px 28px', borderRadius: 12,
              fontWeight: 800, fontSize: 16, textDecoration: 'none',
            }}>
              Mijn bestellingen
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--bg-page)', minHeight: '100vh' }} />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
