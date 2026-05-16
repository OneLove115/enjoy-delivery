'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../../components/Nav';
import { Footer } from '../../components/Footer';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const ORANGE = '#FF6B35';
const GOLD   = '#F59E0B';
const SILVER = '#94A3B8';
const BRONZE = '#CD7F32';

type Transaction = {
  id: string;
  type: string;
  stampsDelta: number;
  description: string;
  restaurantName: string | null;
  createdAt: string;
};

type Voucher = {
  id: string;
  code: string;
  description: string | null;
  discountType: string | null;
  discountValue: string | null;
  status: string;
  expiresAt: string | null;
  createdAt: string;
};

type CommunityPerk = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  perkType: string;
  discountType: string | null;
  discountValue: string | null;
  validUntil: string | null;
  city: string | null;
};

type LoyaltyData = {
  stampCount: number;
  lifetimeStamps: number;
  tier: 'bronze' | 'silver' | 'gold';
  stampsPerReward: number;
  stampsUntilReward: number;
  rewardAmount: number;
  birthdayWeek: boolean;
  dateOfBirth: string | null;
  transactions: Transaction[];
  communityPerks: CommunityPerk[];
};

const TIER_META = {
  bronze: { label: 'Bronze', emoji: '🥉', color: BRONZE, nextAt: 50, nextLabel: 'Silver bij 50 lifetime stempels' },
  silver: { label: 'Silver', emoji: '🥈', color: SILVER, nextAt: 150, nextLabel: 'Gold bij 150 lifetime stempels' },
  gold:   { label: 'Gold',   emoji: '🥇', color: GOLD,   nextAt: null, nextLabel: 'Hoogste tier — welkom bij de elite!' },
};

function StampCell({ index, earned }: { index: number; earned: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 220, damping: 18 }}
      style={{
        aspectRatio: '1',
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
        background: earned
          ? `linear-gradient(135deg,${PURPLE},${PINK})`
          : 'rgba(255,255,255,0.04)',
        border: earned ? 'none' : '1.5px dashed rgba(255,255,255,0.12)',
        boxShadow: earned ? `0 4px 16px rgba(90,49,244,0.45)` : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {earned ? (
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.05 + 0.1, type: 'spring', stiffness: 260 }}
          style={{ fontSize: 18 }}
        >⭐</motion.span>
      ) : (
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.15)', fontWeight: 700 }}>{index + 1}</span>
      )}
    </motion.div>
  );
}

function StampGrid({ earned, total }: { earned: number; total: number }) {
  const cols = Math.min(total, 5);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <StampCell key={i} index={i} earned={i < earned} />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

export default function StampCardPage() {
  const router = useRouter();
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{ voucherCode: string; rewardAmount: number; expiresAt: string } | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const loadVouchers = async () => {
    const res = await fetch('/api/account/vouchers');
    const json = res.ok ? await res.json() : [];
    if (Array.isArray(json)) setVouchers(json);
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.push('/login?next=/account/stamp-card'); return false; } return true; })
      .then(ok => {
        if (!ok) return;
        Promise.all([
          fetch('/api/account/loyalty').then(r => r.ok ? r.json() : null),
          fetch('/api/account/vouchers').then(r => r.ok ? r.json() : []),
        ]).then(([loyalty, voucherData]) => {
          if (loyalty && !loyalty.error) setData(loyalty);
          if (Array.isArray(voucherData)) setVouchers(voucherData);
        }).finally(() => setLoading(false));
      });
  }, [router]);

  const handleRedeem = async () => {
    if (!data || data.stampCount < data.stampsPerReward) return;
    setRedeeming(true);
    setRedeemError(null);
    try {
      const res = await fetch('/api/account/loyalty/redeem', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) { setRedeemError(json.error ?? 'Inwisselen mislukt'); return; }
      setRedeemResult(json);
      // Refresh loyalty data + vouchers
      const [updated, voucherData] = await Promise.all([
        fetch('/api/account/loyalty').then(r => r.json()),
        fetch('/api/account/vouchers').then(r => r.ok ? r.json() : []),
      ]);
      if (!updated.error) setData(updated);
      if (Array.isArray(voucherData)) setVouchers(voucherData);
    } finally {
      setRedeeming(false);
    }
  };

  const stamps = data?.stampCount ?? 0;
  const stampsPerReward = data?.stampsPerReward ?? 10;
  const progress = Math.min((stamps / stampsPerReward) * 100, 100);
  const canRedeem = stamps >= stampsPerReward;
  const tier = data?.tier ?? 'bronze';
  const tierMeta = TIER_META[tier];
  const rewardAmount = data?.rewardAmount ?? 15;

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 8px ${PURPLE}60; }
          50%       { box-shadow: 0 0 20px ${PINK}80; }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <Nav />
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* Back */}
        <Link
          href="/account"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, marginBottom: 24, textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Account
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 36, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px',
            background: `linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6))`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          Stempelkaart
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 36 }}
        >
          Spaar stempels en win gratis maaltijden!
        </motion.p>

        {/* Birthday week banner */}
        {data?.birthdayWeek && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: 20, padding: '14px 20px', borderRadius: 16,
              background: `linear-gradient(135deg, rgba(245,158,11,0.18), rgba(255,0,128,0.12))`,
              border: '1px solid rgba(245,158,11,0.35)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <span style={{ fontSize: 28 }}>🎂</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: GOLD, marginBottom: 2 }}>Gefeliciteerd! Verjaardagsweek!</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Je verdient 2× stempels op al je bestellingen deze week!</div>
            </div>
          </motion.div>
        )}

        {/* Tier badge */}
        {!loading && data && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            style={{
              marginBottom: 20, padding: '14px 20px', borderRadius: 16,
              background: `${tierMeta.color}15`,
              border: `1px solid ${tierMeta.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{tierMeta.emoji}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: 15, color: tierMeta.color }}>{tierMeta.label} Lid</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{data.lifetimeStamps} lifetime stempels</div>
              </div>
            </div>
            {tierMeta.nextAt !== null && (
              <div style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.4)', maxWidth: 120 }}>
                {tierMeta.nextLabel}
              </div>
            )}
            {tierMeta.nextAt === null && (
              <div style={{ fontSize: 20 }}>👑</div>
            )}
          </motion.div>
        )}

        {/* Main stamp card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            padding: '32px 28px', borderRadius: 24,
            background: `linear-gradient(135deg, rgba(90,49,244,0.18), rgba(255,0,128,0.10), rgba(255,107,53,0.07))`,
            backgroundSize: '200% 200%',
            animation: 'gradientShift 6s ease infinite',
            border: '1px solid rgba(90,49,244,0.28)',
            marginBottom: 24,
            boxShadow: '0 20px 60px rgba(90,49,244,0.18)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: `radial-gradient(circle, ${PINK}20 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontWeight: 900, fontSize: 16 }}>Jouw voortgang</span>
            <div style={{ textAlign: 'right' }}>
              {loading ? (
                <div style={{ width: 60, height: 28, background: 'rgba(255,255,255,0.08)', borderRadius: 8, animation: 'shimmer 1.8s ease-in-out infinite' }} />
              ) : (
                <>
                  <span style={{ fontWeight: 900, fontSize: 22, color: PINK }}>{stamps}</span>
                  <span style={{ fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>/{stampsPerReward}</span>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>stempels</div>
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 10, borderRadius: 10, background: 'rgba(255,255,255,0.08)', marginBottom: 28, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
              style={{
                height: '100%', borderRadius: 10,
                background: `linear-gradient(90deg,${PURPLE},${PINK})`,
                animation: 'progressGlow 2.5s ease-in-out infinite',
              }}
            />
          </div>

          {/* Stamp grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 14, background: 'rgba(255,255,255,0.06)', animation: 'shimmer 1.8s ease-in-out infinite' }} />
              ))}
            </div>
          ) : (
            <StampGrid earned={stamps} total={stampsPerReward} />
          )}

          {/* Reward teaser / redeem */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: 24, padding: '16px 20px', borderRadius: 16,
              background: 'rgba(0,0,0,0.2)',
              border: `1px solid ${canRedeem ? `${PINK}50` : 'rgba(255,255,255,0.10)'}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 28 }}
            >🎁</motion.span>
            <div style={{ flex: 1 }}>
              {canRedeem ? (
                <>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 3, color: PINK }}>
                    Je hebt genoeg stempels! Wissel in voor €{rewardAmount} korting!
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                    Beloningsvoucher geldig 30 dagen na inwisselen
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 3 }}>
                    Nog <span style={{ color: PINK }}>{data?.stampsUntilReward ?? stampsPerReward}</span> stempel{(data?.stampsUntilReward ?? stampsPerReward) !== 1 ? 's' : ''} tot €{rewardAmount} korting!
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                    Bestel voor €10 of meer om een stempel te verdienen
                  </div>
                </>
              )}
            </div>
            {canRedeem && !loading && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.04 }}
                onClick={handleRedeem}
                disabled={redeeming}
                style={{
                  padding: '10px 18px', borderRadius: 12, border: 'none',
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                  color: '#fff', fontWeight: 800, fontSize: 13,
                  cursor: redeeming ? 'not-allowed' : 'pointer',
                  opacity: redeeming ? 0.7 : 1,
                  whiteSpace: 'nowrap',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {redeeming ? 'Even...' : 'Inwisselen'}
              </motion.button>
            )}
          </motion.div>

          {redeemError && (
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: 13, color: '#EF4444' }}>
              {redeemError}
            </div>
          )}
        </motion.div>

        {/* Redeem success modal */}
        <AnimatePresence>
          {redeemResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              style={{
                marginBottom: 24, padding: '28px 24px', borderRadius: 20,
                background: `linear-gradient(135deg, rgba(34,197,94,0.14), rgba(90,49,244,0.10))`,
                border: '1px solid rgba(34,197,94,0.35)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6, color: '#22C55E' }}>Beloning verzilverd!</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
                Gebruik deze code bij je volgende bestelling:
              </div>
              <div style={{
                display: 'inline-block', padding: '12px 28px', borderRadius: 12,
                background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(34,197,94,0.4)',
                fontFamily: 'monospace', fontSize: 20, fontWeight: 900, letterSpacing: '2px', color: '#22C55E',
                marginBottom: 12,
              }}>
                {redeemResult.voucherCode}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                €{redeemResult.rewardAmount} korting · Geldig tot {new Date(redeemResult.expiresAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
              </div>
              <button
                onClick={() => setRedeemResult(null)}
                style={{ marginTop: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
              >
                Sluiten
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active vouchers */}
        {vouchers.filter(v => v.status === 'active').length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 }}
            style={{ marginBottom: 24 }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 900, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.6)' }}>
              Mijn kortingscodes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {vouchers.filter(v => v.status === 'active').map(v => (
                <div
                  key={v.id}
                  style={{
                    padding: '16px 20px', borderRadius: 16,
                    background: `linear-gradient(135deg, rgba(34,197,94,0.10), rgba(90,49,244,0.07))`,
                    border: '1px solid rgba(34,197,94,0.28)',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  <span style={{ fontSize: 24 }}>🎟️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'monospace', fontSize: 18, fontWeight: 900,
                      letterSpacing: '2px', color: '#22C55E', marginBottom: 4,
                    }}>
                      {v.code}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                      {v.discountType === 'percentage' ? `${v.discountValue}% korting` : `€${v.discountValue} korting`}
                      {v.expiresAt && ` · geldig tot ${new Date(v.expiresAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Progress to next reward */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{ marginBottom: 24, padding: '18px 22px', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Volgende beloning</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: PURPLE }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ height: '100%', borderRadius: 6, background: `linear-gradient(90deg,${PURPLE},${ORANGE})` }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>0 stempels</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>€{rewardAmount} beloning bij {stampsPerReward}</span>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ padding: '24px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 900, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.7)' }}>Hoe werkt het?</h2>
          {[
            { icon: '🛍️', title: 'Bestel', text: 'Bestel bij een deelnemend restaurant voor minimaal €10', accent: PURPLE },
            { icon: '⭐', title: 'Verdien', text: 'Ontvang 1 stempel (€10+) of 2 stempels (€25+) — 2× in je verjaardagsweek!', accent: PINK },
            { icon: '🎁', title: 'Win',    text: `Verzamel ${stampsPerReward} stempels en win €${rewardAmount} kortingscode`, accent: ORANGE },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < 2 ? 18 : 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${step.accent}15`, border: `1px solid ${step.accent}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>
                {step.icon}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4, color: step.accent }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.text}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent activity */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.6)' }}>
            Recente activiteit
          </h2>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ height: 64, borderRadius: 14, background: 'rgba(255,255,255,0.04)', animation: 'shimmer 1.8s ease-in-out infinite' }} />
              ))}
            </div>
          ) : !data?.transactions?.length ? (
            <div style={{ padding: '24px', textAlign: 'center', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: 14 }}>
              Nog geen activiteit. Doe je eerste bestelling om stempels te verdienen!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.transactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 + i * 0.06 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', borderRadius: 14,
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: tx.type === 'redeem' ? `${ORANGE}15` : `${PINK}15`,
                      border: `1px solid ${tx.type === 'redeem' ? ORANGE : PINK}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>
                      {tx.type === 'redeem' ? '🎁' : '⭐'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {tx.restaurantName || tx.description}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(tx.createdAt)}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 800,
                    color: tx.stampsDelta > 0 ? PINK : ORANGE,
                  }}>
                    {tx.stampsDelta > 0 ? '+' : ''}{tx.stampsDelta} stempel{Math.abs(tx.stampsDelta) !== 1 ? 's' : ''}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Community perks */}
        {!loading && !!data?.communityPerks?.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: 32 }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 900, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.6)' }}>
              Community voordelen
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.communityPerks.map((perk, i) => (
                <motion.div
                  key={perk.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52 + i * 0.07 }}
                  style={{
                    padding: '18px 20px', borderRadius: 16,
                    background: `linear-gradient(135deg, rgba(90,49,244,0.12), rgba(255,0,128,0.06))`,
                    border: '1px solid rgba(90,49,244,0.22)',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                    background: `${PURPLE}20`, border: `1px solid ${PURPLE}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    {perk.icon || '🎟️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{perk.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: perk.discountValue ? 8 : 0 }}>
                      {perk.description}
                    </div>
                    {perk.discountValue && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 20,
                          background: `${PINK}18`, border: `1px solid ${PINK}35`, color: PINK,
                        }}>
                          {perk.discountType === 'percentage' ? `${perk.discountValue}% korting` : `€${perk.discountValue} korting`}
                        </span>
                        {perk.city && (
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>📍 {perk.city}</span>
                        )}
                      </div>
                    )}
                    {perk.validUntil && (
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
                        Geldig tot {new Date(perk.validUntil).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ marginTop: 36, textAlign: 'center' }}
        >
          <Link
            href="/discover"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 40px', borderRadius: 50,
              background: `linear-gradient(135deg,${ORANGE},${PINK})`,
              color: '#fff', fontWeight: 900, fontSize: 16,
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(255,107,53,0.40)',
            }}
          >
            Bestel nu & verdien stempels
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
