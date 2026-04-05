'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const PURPLE = '#5A31F4';
const PINK = '#FF0080';
const VP_URL = process.env.NEXT_PUBLIC_VP_DOMAIN || 'https://www.veloci.online';

type GroupMember = { id: string; name: string; itemCount: number; total: number; isHost: boolean; items: any[] };
type GroupData = { id: string; shareCode: string; status: string; restaurantSlug: string; hostName: string; members: GroupMember[]; groupTotal: number };
type MenuItem = { id: string; name: string; description: string | null; basePrice: string; imageUrl: string | null; category: string };
type MenuCategory = { id: string; name: string; items: MenuItem[] };

function fmt(n: number) { return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n); }

export default function GroupOrderPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [group, setGroup] = useState<GroupData | null>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [myName, setMyName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [myItems, setMyItems] = useState<Array<{ menuItemId: string; name: string; quantity: number; basePrice: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load group data
  const loadGroup = useCallback(() => {
    fetch(`${VP_URL}/api/consumer/group-orders/${code}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setGroup(d); else setError('Groepsbestelling niet gevonden'); })
      .catch(() => setError('Kan groepsbestelling niet laden'))
      .finally(() => setLoading(false));
  }, [code]);

  useEffect(() => { loadGroup(); }, [loadGroup]);

  // Load menu when we know the restaurant
  useEffect(() => {
    if (!group?.restaurantSlug) return;
    fetch(`/api/restaurants/${group.restaurantSlug}/menu`)
      .then(r => r.json())
      .then(d => {
        const cats = d?.data?.menu || [];
        setMenu(cats.map((c: any) => ({
          id: c.id, name: c.name,
          items: (c.items || []).map((i: any) => ({ id: i.id, name: i.name, description: i.description, basePrice: i.basePrice, imageUrl: i.imageUrl, category: c.name })),
        })));
      })
      .catch(() => {});
  }, [group?.restaurantSlug]);

  // Check if already joined (stored in localStorage)
  useEffect(() => {
    const saved = localStorage.getItem(`group-${code}`);
    if (saved) {
      try {
        const { memberId: mid, name } = JSON.parse(saved);
        setMemberId(mid);
        setMyName(name);
      } catch {}
    }
  }, [code]);

  // Load my items from group
  useEffect(() => {
    if (!group || !memberId) return;
    const me = group.members.find(m => m.id === memberId);
    if (me?.items) {
      setMyItems(me.items.map((i: any) => ({ menuItemId: i.menuItemId || i.id, name: i.name, quantity: i.quantity || 1, basePrice: i.basePrice || i.unitPrice || '0' })));
    }
  }, [group, memberId]);

  const joinGroup = async () => {
    if (!nameInput.trim()) return;
    setJoining(true);
    try {
      const res = await fetch(`${VP_URL}/api/consumer/group-orders/${code}/join`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      if (!res.ok) throw new Error('Kan niet deelnemen');
      const data = await res.json();
      setMemberId(data.memberId);
      setMyName(nameInput.trim());
      localStorage.setItem(`group-${code}`, JSON.stringify({ memberId: data.memberId, name: nameInput.trim() }));
      loadGroup();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setJoining(false);
    }
  };

  const addItem = (item: MenuItem) => {
    setMyItems(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, basePrice: item.basePrice }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setMyItems(prev => {
      const existing = prev.find(i => i.menuItemId === menuItemId);
      if (existing && existing.quantity > 1) return prev.map(i => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter(i => i.menuItemId !== menuItemId);
    });
  };

  const saveItems = async () => {
    if (!memberId) return;
    setSaving(true);
    try {
      await fetch(`${VP_URL}/api/consumer/group-orders/${code}/items`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          items: myItems.map(i => ({ ...i, totalPrice: parseFloat(i.basePrice) * i.quantity })),
        }),
      });
      loadGroup();
    } catch {} finally { setSaving(false); }
  };

  // Auto-save when items change
  useEffect(() => {
    if (!memberId || myItems.length === 0) return;
    const timer = setTimeout(saveItems, 1000);
    return () => clearTimeout(timer);
  }, [myItems, memberId]);

  const myTotal = myItems.reduce((s, i) => s + parseFloat(i.basePrice) * i.quantity, 0);
  const getQty = (id: string) => myItems.find(i => i.menuItemId === id)?.quantity || 0;

  if (loading) return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton-line {
          background: linear-gradient(90deg, var(--bg-elevated) 25%, rgba(255,255,255,0.08) 50%, var(--bg-elevated) 75%);
          background-size: 800px 100%;
          animation: shimmer 1.6s ease-in-out infinite;
          border-radius: 8px;
        }
      `}</style>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div className="skeleton-line" style={{ width: 180, height: 22, marginBottom: 8 }} />
        <div className="skeleton-line" style={{ width: 120, height: 14 }} />
      </div>
      <div style={{ padding: '12px 24px', display: 'flex', gap: 8, borderBottom: '1px solid var(--border)' }}>
        {[80, 100, 90].map((w, i) => <div key={i} className="skeleton-line" style={{ width: w, height: 32, borderRadius: 20, flexShrink: 0 }} />)}
      </div>
      <div style={{ padding: '20px 24px', maxWidth: 800, margin: '0 auto' }}>
        <div className="skeleton-line" style={{ width: 140, height: 20, marginBottom: 16 }} />
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div className="skeleton-line" style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton-line" style={{ width: '60%', height: 14, marginBottom: 6 }} />
              <div className="skeleton-line" style={{ width: '40%', height: 12, marginBottom: 4 }} />
              <div className="skeleton-line" style={{ width: 50, height: 13 }} />
            </div>
            <div className="skeleton-line" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          </div>
        ))}
      </div>
    </div>
  );
  if (error) return <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', gap: 16 }}><div style={{ fontSize: 48 }}>😕</div><div style={{ fontSize: 20, fontWeight: 800 }}>{error}</div><Link href="/discover" style={{ color: PURPLE, fontWeight: 700 }}>← Terug</Link></div>;
  if (!group) return null;

  // Not yet joined — show join form
  if (!memberId) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ maxWidth: 400, width: '100%', padding: '40px 24px', textAlign: 'center' }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <h1 style={{ fontSize: 28, fontWeight: 950, marginBottom: 8 }}>Groepsbestelling</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{group.hostName} nodigt je uit om samen te bestellen bij</p>
          <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 32 }}>{group.restaurantSlug}</p>

          <div style={{ marginBottom: 16 }}>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Je naam"
              className="group-input"
              style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 16, fontFamily: 'inherit', outline: 'none', textAlign: 'center', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
              onKeyDown={e => e.key === 'Enter' && joinGroup()}
            />
          </div>
          <style>{`
            .group-input:focus { box-shadow: 0 0 0 2px ${PURPLE}; border-color: ${PURPLE} !important; outline: none; }
          `}</style>
          <button onClick={joinGroup} disabled={joining || !nameInput.trim()} style={{
            width: '100%', padding: '16px', background: `linear-gradient(135deg,${PURPLE},${PINK})`,
            border: 'none', borderRadius: 14, color: 'white', fontSize: 16, fontWeight: 900,
            cursor: joining ? 'not-allowed' : 'pointer', opacity: joining ? 0.7 : 1,
          }}>
            {joining ? 'Deelnemen...' : 'Doe mee'}
          </button>

          <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Al {group.members.length} deelnemer{group.members.length !== 1 ? 's' : ''}</p>
            <AnimatePresence>
              {group.members.map((m, i) => (
                <motion.span
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ display: 'inline-block', background: m.isHost ? `${PURPLE}25` : 'var(--bg-elevated)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginRight: 6, marginBottom: 4, color: m.isHost ? PURPLE : 'var(--text-muted)' }}
                >
                  {m.name}{m.isHost ? ' (host)' : ''}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  // Joined — show menu + my selections
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Groepsbestelling</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Welkom {myName} — kies je items</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 900, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{fmt(myTotal)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{myItems.reduce((s, i) => s + i.quantity, 0)} items</div>
        </div>
      </motion.div>

      {/* Members bar */}
      <div style={{ padding: '12px 24px', overflowX: 'auto', display: 'flex', gap: 8, borderBottom: '1px solid var(--border)' }}>
        <AnimatePresence>
          {group.members.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                padding: '6px 14px', borderRadius: 20, flexShrink: 0, fontSize: 12, fontWeight: 700,
                background: m.id === memberId ? `${PURPLE}25` : 'var(--bg-elevated)',
                border: `1px solid ${m.id === memberId ? PURPLE + '50' : 'var(--border)'}`,
                color: m.id === memberId ? PURPLE : 'var(--text-muted)',
              }}
            >
              {m.name} · {m.itemCount} items · {fmt(m.total)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ padding: '20px 24px 120px', maxWidth: 800, margin: '0 auto' }}
      >
        {group.status === 'locked' && (
          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.3)', color: '#FF6B00', fontWeight: 700, marginBottom: 20 }}>
            De bestelling is vergrendeld — je kunt geen items meer toevoegen.
          </div>
        )}

        {menu.map(cat => (
          <div key={cat.id} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>{cat.name}</h2>
            {cat.items.map(item => {
              const qty = getQty(item.id);
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>}
                    <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2 }}>{fmt(parseFloat(item.basePrice))}</div>
                  </div>
                  {group.status !== 'locked' && (
                    qty === 0 ? (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addItem(item)}
                        style={{
                          width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                          background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white',
                          fontSize: 20, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >+</motion.button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: `linear-gradient(135deg,${PURPLE},${PINK})`, borderRadius: 20 }}>
                        <button onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: 32, height: 32, color: 'white', fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <motion.span
                          key={qty}
                          initial={{ scale: 1.4 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          style={{ color: 'white', fontSize: 13, fontWeight: 900, minWidth: 20, textAlign: 'center', display: 'inline-block' }}
                        >{qty}</motion.span>
                        <button onClick={() => addItem(item)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: 32, height: 32, color: 'white', fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>

      {/* Bottom bar */}
      <AnimatePresence>
        {myItems.length > 0 && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 24px',
              paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
              background: 'var(--bg-page)', backdropFilter: 'blur(20px)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900 }}>Mijn items: {myItems.reduce((s, i) => s + i.quantity, 0)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {saving ? 'Opslaan...' : 'Automatisch opgeslagen'}
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 950, background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {fmt(myTotal)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
