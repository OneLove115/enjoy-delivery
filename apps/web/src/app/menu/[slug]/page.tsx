'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../../store/cart';

const PURPLE = '#5A31F4';
const PINK   = '#FF0080';
const NAV_H  = 60;

/* ─── Types ─── */
type MenuItem = {
  id: string; name: string; description: string;
  basePrice: string; imageUrl: string | null; category: string;
};
type MenuCategory = { id: string; name: string; items: MenuItem[] };
type Restaurant = {
  id: string; name: string; slug: string;
  address: string | null; phone: string | null;
  logo: string | null; primaryColor: string | null;
  tagline: string | null; cuisineCategories: string[];
  businessHours: unknown; timezone: string; currency: string; locale: string;
};

/* ─── Helpers ─── */
function fmt(amount: number, currency = 'EUR', locale = 'nl-NL') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

/* ─── Qty Control ─── */
function QtyControl({ qty, onAdd, onInc, onDec, small }: {
  qty: number; onAdd: () => void; onInc: () => void; onDec: () => void; small?: boolean;
}) {
  const dim = small ? 28 : 32;
  const fs  = small ? 16 : 18;
  if (qty === 0) {
    return (
      <button onClick={onAdd} style={{
        background: `linear-gradient(135deg,${PURPLE},${PINK})`,
        border: 'none', borderRadius: 20, padding: small ? '5px 14px' : '7px 18px',
        color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(90,49,244,0.25)',
      }}>+ Toevoegen</button>
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', background: `linear-gradient(135deg,${PURPLE},${PINK})`, borderRadius: 20 }}>
      <button onClick={onDec} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: dim, height: dim, color: 'white', fontSize: fs, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
      <span style={{ color: 'white', fontSize: 13, fontWeight: 900, minWidth: 20, textAlign: 'center' }}>{qty}</span>
      <button onClick={onInc} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: dim, height: dim, color: 'white', fontSize: fs, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
    </div>
  );
}

/* ─── Menu Item Card ─── */
function MenuItemCard({ item, qty, onAdd, onInc, onDec, currency, locale }: {
  item: MenuItem; qty: number; onAdd: () => void; onInc: () => void; onDec: () => void;
  currency: string; locale: string;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 0', borderBottom: '1px solid var(--border)', gap: 16 }}>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
        {item.description && (
          <div style={{
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          } as React.CSSProperties}>{item.description}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>{fmt(parseFloat(item.basePrice), currency, locale)}</span>
          {/* Mobile: qty inline with price */}
          <span className="show-mobile" style={{ display: 'none' }}>
            <QtyControl qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} small />
          </span>
        </div>
      </div>
      {/* Image + desktop qty */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 88, height: 88, borderRadius: 12, overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0 }}>
          {item.imageUrl
            ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🍽️</div>
          }
        </div>
        <span className="hide-mobile">
          <QtyControl qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} />
        </span>
      </div>
    </div>
  );
}

/* ─── Cart Panel (shared content, used by sidebar + drawer) ─── */
function CartContent({ cart, currency, locale, totalCart, onCheckout }: {
  cart: ReturnType<typeof useCartStore.getState>['items'];
  currency: string; locale: string; totalCart: number;
  onCheckout?: () => void;
}) {
  const { updateQty, removeItem } = useCartStore();
  if (cart.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🛒</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Je winkelwagen is leeg</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Voeg gerechten toe om te beginnen</div>
      </div>
    );
  }
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 360, overflowY: 'auto', padding: '16px 20px' }}>
        {cart.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{fmt(parseFloat(c.basePrice), currency, locale)} / stuk</div>
            </div>
            <QtyControl
              qty={c.qty} small onAdd={() => {}}
              onInc={() => updateQty(c.id, c.qty + 1)}
              onDec={() => { if (c.qty <= 1) removeItem(c.id); else updateQty(c.id, c.qty - 1); }}
            />
            <span style={{ fontSize: 13, fontWeight: 800, minWidth: 52, textAlign: 'right' }}>
              {fmt(parseFloat(c.basePrice) * c.qty, currency, locale)}
            </span>
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <span>Bezorgkosten</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Gratis</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, marginBottom: 16 }}>
          <span>Totaal</span><span>{fmt(totalCart, currency, locale)}</span>
        </div>
        <Link href="/checkout" onClick={onCheckout} style={{
          display: 'block', background: `linear-gradient(135deg,${PURPLE},${PINK})`,
          borderRadius: 12, padding: '14px', color: 'white', fontSize: 15, fontWeight: 900,
          textAlign: 'center', boxShadow: '0 8px 20px rgba(90,49,244,0.3)', textDecoration: 'none',
        }}>
          Bestellen · {fmt(totalCart, currency, locale)}
        </Link>
      </div>
    </>
  );
}

/* ─── Main Page ─── */
export default function MenuPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { items: cart, addItem, updateQty, removeItem, total: cartTotal, itemCount } = useCartStore();
  const totalCart = cartTotal();

  const getQty = useCallback((id: string) => cart.find(c => c.id === id)?.qty ?? 0, [cart]);

  const handleAdd = useCallback((item: MenuItem) => {
    if (!restaurant) return;
    addItem(slug, restaurant.name, { id: item.id, name: item.name, basePrice: item.basePrice, imageUrl: item.imageUrl });
  }, [restaurant, slug, addItem]);

  const handleDec = useCallback((id: string) => {
    const q = cart.find(c => c.id === id)?.qty ?? 0;
    if (q <= 1) removeItem(id); else updateQty(id, q - 1);
  }, [cart, removeItem, updateQty]);

  useEffect(() => { useCartStore.persist.rehydrate(); }, []);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch('/api/restaurants').then(r => r.json()),
      fetch(`/api/restaurants/${slug}/menu`).then(r => r.json()),
    ]).then(([rd, md]) => {
      const found = (rd.restaurants || []).find((r: Restaurant) => r.slug === slug) || null;
      setRestaurant(found);
      const categories: MenuCategory[] = md?.data?.menu || [];
      setMenu(categories);
      if (categories.length > 0) setActiveCategory(categories[0].id);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  /* Scroll-spy */
  useEffect(() => {
    if (!menu.length) return;
    const observers: IntersectionObserver[] = [];
    menu.forEach(cat => {
      const el = sectionRefs.current[cat.id];
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveCategory(cat.id);
      }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [menu]);

  const scrollTo = (catId: string) => {
    const el = sectionRefs.current[catId];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (NAV_H + 56);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const currency = restaurant?.currency || 'EUR';
  const locale   = restaurant?.locale   || 'nl-NL';

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${PURPLE}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  /* ─── Not found ─── */
  if (!restaurant) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ fontSize: 48 }}>😕</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Restaurant niet gevonden</div>
        <Link href="/discover" style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white', padding: '10px 24px', borderRadius: 12, fontWeight: 800 }}>← Terug naar overzicht</Link>
      </div>
    );
  }

  const accent  = restaurant.primaryColor || PURPLE;
  const initials = restaurant.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>

      {/* ─── Sticky Nav ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', background: 'var(--bg-nav)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link href="/discover" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          <span>←</span><span className="hide-mobile">Ontdekken</span>
        </Link>
        <Link href="/" style={{ fontSize: 18, fontWeight: 900, textDecoration: 'none' }}>
          En<span style={{ background: `linear-gradient(135deg,${PURPLE},${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
        </Link>
        <button onClick={() => setCartOpen(true)} style={{
          position: 'relative', width: 40, height: 40, borderRadius: 10,
          background: 'var(--b8)', border: '1px solid var(--border)', cursor: 'pointer',
          fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          🛒
          {itemCount() > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: `linear-gradient(135deg,${PURPLE},${PINK})`, color: 'white',
              borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{itemCount()}</span>
          )}
        </button>
      </nav>

      {/* ─── Hero ─── */}
      <div style={{ marginTop: NAV_H }}>
        <div style={{
          position: 'relative', padding: '40px 32px 32px',
          background: `linear-gradient(135deg, ${accent}28 0%, ${accent}18 50%, ${PINK}14 100%)`,
          borderBottom: '1px solid var(--border)',
        }}>
          {/* Subtle dot pattern */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '22px 22px', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 22 }}>
            {/* Logo */}
            <div style={{
              width: 88, height: 88, borderRadius: 18, flexShrink: 0, overflow: 'hidden',
              background: `linear-gradient(135deg,${accent},${PINK})`,
              border: '3px solid var(--bg-page)', boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {restaurant.logo
                ? <img src={restaurant.logo} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 30, fontWeight: 900, color: 'white' }}>{initials}</span>
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 26, fontWeight: 950, marginBottom: 4, lineHeight: 1.2 }}>{restaurant.name}</h1>
              {restaurant.tagline && (
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10 }}>{restaurant.tagline}</p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {restaurant.cuisineCategories.slice(0, 5).map(cat => (
                  <span key={cat} style={{
                    background: `${accent}1a`, border: `1px solid ${accent}40`,
                    color: 'var(--text-secondary)', padding: '3px 10px', borderRadius: 20,
                    fontSize: 12, fontWeight: 600,
                  }}>{cat}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Delivery Info Bar ─── */}
        <div style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', padding: '0 32px' }}>
          <div className="scroll-x" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0 }}>
            {[
              { icon: '🕐', label: '30–45 min' },
              { icon: '🚴', label: 'Gratis bezorgd' },
              { icon: '🛍️', label: `Min. ${fmt(0, currency, locale)}` },
              ...(restaurant.address ? [{ icon: '📍', label: restaurant.address }] : []),
            ].map((item, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 20px 13px 0', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  <span>{item.icon}</span>
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, height: 16, background: 'var(--border)', marginRight: 20, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Mobile Category Strip ─── */}
        <div className="show-mobile" style={{ display: 'none', position: 'sticky', top: NAV_H, zIndex: 100, background: 'var(--catstrip-bg)', borderBottom: '1px solid var(--border)' }}>
          <div className="scroll-x" style={{ display: 'flex', gap: 0, padding: '0 12px' }}>
            {menu.map(cat => (
              <button key={cat.id} onClick={() => scrollTo(cat.id)} style={{
                padding: '13px 14px', border: 'none', background: 'transparent',
                color: activeCategory === cat.id ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeCategory === cat.id ? 800 : 500, fontSize: 14,
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                borderBottom: activeCategory === cat.id ? `2px solid ${PURPLE}` : '2px solid transparent',
                transition: 'all 0.15s',
              }}>{cat.name}</button>
            ))}
          </div>
        </div>

        {/* ─── Body ─── */}
        <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', padding: '28px 24px 100px', gap: 28, alignItems: 'flex-start' }}>

          {/* ─── Category Sidebar (desktop) ─── */}
          <div className="hide-mobile" style={{ width: 220, flexShrink: 0, position: 'sticky', top: NAV_H + 20 }}>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px 10px', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Menu
              </div>
              {menu.map((cat, i) => (
                <button key={cat.id} onClick={() => scrollTo(cat.id)} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '12px 18px', border: 'none', cursor: 'pointer',
                  background: activeCategory === cat.id ? `${accent}18` : 'transparent',
                  color: activeCategory === cat.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeCategory === cat.id ? 800 : 500, fontSize: 14,
                  borderLeft: activeCategory === cat.id ? `3px solid ${accent}` : '3px solid transparent',
                  borderBottom: i < menu.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}>
                  <span>{cat.name}</span>
                  <span style={{ float: 'right', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{cat.items.length}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ─── Menu Sections ─── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {menu.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Geen menu beschikbaar</div>
                <div style={{ fontSize: 14, marginTop: 8 }}>Dit restaurant heeft nog geen menu opgezet.</div>
              </div>
            ) : (
              menu.map(cat => (
                <div key={cat.id} ref={el => { sectionRefs.current[cat.id] = el; }} style={{ marginBottom: 44 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4, paddingTop: 4 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 900 }}>{cat.name}</h2>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cat.items.length} gerecht{cat.items.length !== 1 ? 'en' : ''}</span>
                  </div>
                  <div style={{ height: 1, background: 'var(--border)', marginBottom: 4 }} />
                  {cat.items.map(item => (
                    <MenuItemCard
                      key={item.id} item={item}
                      qty={getQty(item.id)}
                      onAdd={() => handleAdd(item)}
                      onInc={() => handleAdd(item)}
                      onDec={() => handleDec(item.id)}
                      currency={currency} locale={locale}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* ─── Cart Sidebar (desktop) ─── */}
          <div className="hide-mobile" style={{ width: 300, flexShrink: 0, position: 'sticky', top: NAV_H + 20 }}>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border-strong)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 900 }}>Jouw bestelling</h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{restaurant.name}</div>
              </div>
              <CartContent cart={cart} currency={currency} locale={locale} totalCart={totalCart} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Cart Drawer ─── */}
      <AnimatePresence>
        {cartOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 400 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg-elevated)', borderRadius: '20px 20px 0 0',
                maxHeight: '88vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Jouw bestelling</h3>
                <button onClick={() => setCartOpen(false)} style={{ background: 'var(--b8)', border: 'none', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                <CartContent cart={cart} currency={currency} locale={locale} totalCart={totalCart} onCheckout={() => setCartOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Mobile Floating Cart Bar ─── */}
      {itemCount() > 0 && (
        <div className="show-mobile" style={{ display: 'none', position: 'fixed', bottom: 20, left: 16, right: 16, zIndex: 300 }}>
          <motion.button
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            onClick={() => setCartOpen(true)}
            style={{
              width: '100%', background: `linear-gradient(135deg,${PURPLE},${PINK})`,
              border: 'none', borderRadius: 16, padding: '16px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              color: 'white', fontSize: 15, fontWeight: 900, cursor: 'pointer',
              boxShadow: '0 12px 36px rgba(90,49,244,0.4)',
            }}
          >
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 900 }}>{itemCount()}</span>
            <span>Bekijk bestelling</span>
            <span>{fmt(totalCart, currency, locale)}</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
