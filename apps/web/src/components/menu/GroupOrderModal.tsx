'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Copy, Share2, Check, Lock } from 'lucide-react';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

function fmt(amount: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
}

interface GroupMember {
  id: string;
  name: string;
  itemCount: number;
  total: number;
  isHost: boolean;
}

interface GroupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantSlug: string;
  cartItemCount?: number;
  cartTotal?: number;
}

const DEMO_NAMES = ['Sophie', 'Daan', 'Emma', 'Liam', 'Julia', 'Noah', 'Tess', 'Sem'];

export function GroupOrderModal({ isOpen, onClose, restaurantName, restaurantSlug, cartItemCount = 0, cartTotal = 0 }: GroupOrderModalProps) {
  const router = useRouter();

  const [step, setStep] = useState<'intro' | 'active' | 'locked'>('intro');
  const [hostName, setHostName] = useState('');
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [splitPayment, setSplitPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep('intro');
        setHostName('');
        setShareCode(null);
        setMembers([]);
        setSplitPayment(false);
        setCopied(false);
        setApiAvailable(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const startGroupOrder = async () => {
    if (!hostName.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/consumer/group-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantSlug, hostName: hostName.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setShareCode(data.shareCode);
        setMembers([{ id: 'host', name: hostName.trim(), itemCount: cartItemCount, total: cartTotal, isHost: true }]);
        setStep('active');
        setApiAvailable(true);
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      // Fallback to demo mode
      setApiAvailable(false);
      setShareCode('demo-' + Math.random().toString(36).slice(2, 8));
      setMembers([{ id: 'host', name: hostName.trim(), itemCount: cartItemCount, total: cartTotal, isHost: true }]);
      setStep('active');
    } finally {
      setLoading(false);
    }
  };

  const addDemoMember = () => {
    const available = DEMO_NAMES.filter(n => !members.some(m => m.name === n));
    const name = available[Math.floor(Math.random() * available.length)] || `Gast ${members.length}`;
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const total = parseFloat((Math.random() * 20 + 5).toFixed(2));
    setMembers(prev => [...prev, {
      id: `member-${Date.now()}`,
      name,
      itemCount,
      total,
      isHost: false,
    }]);
  };

  const copyLink = () => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/group/${shareCode}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const link = `${window.location.origin}/group/${shareCode}`;
    const text = `Bestel mee! 🍕 ${restaurantName} groepsbestelling: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareEmail = () => {
    const link = `${window.location.origin}/group/${shareCode}`;
    const subject = `Groepsbestelling bij ${restaurantName}`;
    const body = `Hoi!\n\nIk heb een groepsbestelling gestart bij ${restaurantName}. Kies je favoriete gerechten via deze link:\n${link}\n\nTot zo!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const groupTotal = members.reduce((s, m) => s + m.total, 0);

  const initials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '5vh' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'tween', duration: 0.2 }}
            style={{
              position: 'relative',
              width: 'calc(100% - 32px)', maxWidth: 440, maxHeight: '85vh',
              background: '#1A1A2E', borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
              color: 'white',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto', overscrollBehavior: 'contain',
              zIndex: 1,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Users size={20} color="white" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Groepsbestelling</h3>
              </div>
              <button onClick={onClose} style={{
                width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.08)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)',
              }}>
                <X size={16} />
              </button>
            </div>

            {/* ─── INTRO STEP ─── */}
            {step === 'intro' && (
              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 20, lineHeight: 1.6 }}>
                  Start een groepsbestelling en bestel samen met vrienden bij <strong style={{ color: 'white' }}>{restaurantName}</strong>!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {[
                    { emoji: '🔗', text: 'Deel een link met je vrienden' },
                    { emoji: '🍕', text: 'Iedereen kiest zijn eigen items' },
                    { emoji: '📦', text: 'Bestel alles in één keer' },
                  ].map(item => (
                    <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{item.emoji}</span>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Jouw naam
                  </label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={e => setHostName(e.target.value)}
                    placeholder="Bijv. Jan"
                    onKeyDown={e => { if (e.key === 'Enter' && hostName.trim()) startGroupOrder(); }}
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: 12,
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      color: 'white', fontSize: 16, fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  onClick={startGroupOrder}
                  disabled={!hostName.trim() || loading}
                  style={{
                    width: '100%', padding: '16px',
                    background: hostName.trim() ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.1)',
                    border: 'none', borderRadius: 14, color: hostName.trim() ? 'white' : 'var(--text-muted)',
                    fontSize: 16, fontWeight: 900, cursor: hostName.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: hostName.trim() ? '0 8px 20px rgba(90,49,244,0.3)' : 'none',
                    minHeight: 52,
                  }}
                >
                  {loading ? 'Starten...' : 'Start groepsbestelling'}
                </button>
              </div>
            )}

            {/* ─── ACTIVE / LOCKED STEP ─── */}
            {(step === 'active' || step === 'locked') && (
              <div style={{ padding: '20px 24px' }}>
                {/* API mode indicator */}
                {!apiAvailable && (
                  <div style={{
                    background: `${PURPLE}15`, border: `1px solid ${PURPLE}30`,
                    borderRadius: 10, padding: '8px 12px', marginBottom: 16,
                    fontSize: 12, color: PURPLE, fontWeight: 600,
                  }}>
                    Demo modus — API niet beschikbaar
                  </div>
                )}

                {/* Share link */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Deel deze link
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{
                      flex: 1, padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: 13, color: 'rgba(255,255,255,0.7)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      /menu/{restaurantSlug}?group={shareCode}
                    </div>
                    <button onClick={copyLink} style={{
                      width: 44, height: 44, borderRadius: 10, border: 'none',
                      background: copied ? '#00C37A' : `linear-gradient(135deg,${PURPLE},${PINK})`,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', flexShrink: 0, transition: 'background 0.2s',
                    }}>
                      {copied ? <Check size={18} /> : <Copy size={16} />}
                    </button>
                  </div>
                  {copied && <div style={{ fontSize: 12, color: '#00C37A', fontWeight: 600, marginTop: 6 }}>Gekopieerd!</div>}
                </div>

                {/* Share buttons */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                  <button onClick={shareWhatsApp} style={{
                    flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                    background: '#25D366', color: 'white', fontWeight: 800, fontSize: 14,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    minHeight: 48,
                  }}>
                    <Share2 size={16} /> WhatsApp
                  </button>
                  <button onClick={shareEmail} style={{
                    flex: 1, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.08)', color: 'white', fontWeight: 800, fontSize: 14,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    minHeight: 48,
                  }}>
                    ✉️ Email
                  </button>
                </div>

                {/* Members */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                    Deelnemers ({members.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {members.map(member => (
                      <div key={member.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: member.isHost ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 900, color: member.isHost ? 'white' : 'var(--text-secondary)',
                          flexShrink: 0,
                        }}>
                          {initials(member.name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>
                            {member.name}
                            {member.isHost && (
                              <span style={{ fontSize: 11, color: PURPLE, fontWeight: 700, marginLeft: 6 }}>(host)</span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                            {member.itemCount} item{member.itemCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                          {fmt(member.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo button */}
                {step === 'active' && (
                  <button onClick={addDemoMember} style={{
                    width: '100%', padding: '10px', marginBottom: 16,
                    borderRadius: 10, border: '1px dashed var(--border-strong)',
                    background: 'transparent', color: 'rgba(255,255,255,0.45)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    minHeight: 44,
                  }}>
                    + Demo: voeg iemand toe
                  </button>
                )}

                {/* Split payment toggle */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: 16,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Betaling splitsen</span>
                  <button
                    onClick={() => setSplitPayment(!splitPayment)}
                    style={{
                      width: 48, height: 28, borderRadius: 14, border: 'none',
                      background: splitPayment ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'rgba(255,255,255,0.15)',
                      cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: 11, background: 'white',
                      position: 'absolute', top: 3,
                      left: splitPayment ? 23 : 3,
                      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }} />
                  </button>
                </div>

                {/* Totals */}
                <div style={{
                  padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: 16,
                }}>
                  {splitPayment ? (
                    <>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginBottom: 8 }}>Ieder betaalt:</div>
                      {members.map(m => (
                        <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)' }}>{m.name}</span>
                          <span style={{ fontWeight: 700 }}>{fmt(m.total)}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 900 }}>
                      <span>Groepstotaal</span>
                      <span>{fmt(groupTotal)}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                {step === 'active' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button
                      onClick={() => setStep('locked')}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)',
                        color: 'white', fontSize: 14, fontWeight: 800,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        minHeight: 48,
                      }}
                    >
                      <Lock size={16} /> Vergrendel bestelling
                    </button>
                    <button
                      onClick={() => { onClose(); router.push('/checkout'); }}
                      style={{
                        width: '100%', padding: '16px',
                        background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                        border: 'none', borderRadius: 14, color: 'white',
                        fontSize: 16, fontWeight: 900, cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(90,49,244,0.3)',
                        minHeight: 52,
                      }}
                    >
                      {splitPayment ? 'Betaalverzoeken versturen' : 'Bestelling afronden'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onClose(); router.push('/checkout'); }}
                    style={{
                      width: '100%', padding: '16px',
                      background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                      border: 'none', borderRadius: 14, color: 'white',
                      fontSize: 16, fontWeight: 900, cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(90,49,244,0.3)',
                      minHeight: 52,
                    }}
                  >
                    Bestelling afronden & betalen
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
