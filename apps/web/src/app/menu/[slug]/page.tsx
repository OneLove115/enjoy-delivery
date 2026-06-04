'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useCartStore } from '../../../store/cart';
import { MenuItemModal } from '../../../components/menu/MenuItemModal';
import type { MenuItemForModal, MenuModifierGroup } from '../../../components/menu/MenuItemModal';
import { GroupOrderModal } from '../../../components/menu/GroupOrderModal';

const ORANGE = '#FF7A00';
const NAV_H  = 60;

type DeliveryMode = 'bezorgen' | 'afhalen';

/* ─── Types ─── */
type MenuItem = {
  id: string; name: string; description: string;
  basePrice: string; imageUrl: string | null; category: string;
  modifierGroups?: MenuModifierGroup[];
  depositAmount?: number | string | null;
};
type MenuCategory = { id: string; name: string; items: MenuItem[] };
type BusinessHours = {
  [day: string]: { open: string; close: string; closed: boolean };
};
type Restaurant = {
  id: string; name: string; slug: string;
  address: string | null; phone: string | null;
  logo: string | null; heroImage: string | null; primaryColor: string | null;
  tagline: string | null; cuisineCategories: string[];
  contactEmail: string | null;
  deliveryTimeMin: number; deliveryTimeMax: number;
  businessHours: BusinessHours | null; timezone: string; currency: string; locale: string;
  acceptOrders?: boolean;
  averageRating?: number | null; reviewCount?: number; googlePlaceId?: string | null;
};

/* ─── Helpers ─── */
function fmt(amount: number, currency = 'EUR', locale = 'nl-NL') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

/* ─── Menu Hero ─── */
function MenuHero({ restaurant, accent, initials, currency, locale }: {
  restaurant: Restaurant; accent: string; initials: string;
  currency: string; locale: string;
}) {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 90]);
  const hasPhoto = !!restaurant.heroImage;

  const chipStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '5px 11px', borderRadius: 20,
    background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.92)', fontSize: 12, fontWeight: 600,
    whiteSpace: 'nowrap',
  };

  const infoChips = [
    restaurant.averageRating && restaurant.averageRating > 0
      ? { icon: '⭐', label: `${restaurant.averageRating.toFixed(1)}${restaurant.reviewCount ? ` (${restaurant.reviewCount})` : ''}` }
      : null,
    { icon: '🕐', label: `${restaurant.deliveryTimeMin}–${restaurant.deliveryTimeMax} min` },
    { icon: '🚴', label: 'Gratis bezorgd' },
    { icon: '🛍️', label: `Min. ${fmt(0, currency, locale)}` },
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <div style={{
      position: 'relative',
      height: 'clamp(360px, 65vh, 620px)',
      overflow: 'hidden',
      background: '#0d0008',
    }}>
      {hasPhoto ? (
        <motion.div style={{
          position: 'absolute', top: '-10%', left: 0, right: 0, bottom: '-10%',
          y: imgY,
        }}>
          <img
            src={restaurant.heroImage!}
            alt={restaurant.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        </motion.div>
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 75% 60% at 35% 40%, ${accent}28 0%, transparent 60%),
                       linear-gradient(160deg, #0d0010 0%, #1a0028 50%, #0d0010 100%)`,
        }} />
      )}

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hasPhoto
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.94) 100%)'
          : 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.78) 100%)',
      }} />

      {/* Bottom content overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 clamp(16px, 4vw, 32px) 28px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 14, overflow: 'hidden', flexShrink: 0,
            background: `linear-gradient(135deg, ${accent}, #cc5200)`,
            border: '2px solid rgba(255,255,255,0.18)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {restaurant.logo
              ? <img src={restaurant.logo} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>{initials}</span>
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontSize: 'clamp(20px, 4.5vw, 30px)', fontWeight: 900,
              color: 'white', margin: 0, lineHeight: 1.1,
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            }}>{restaurant.name}</h1>
            {restaurant.tagline && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '3px 0 0', fontWeight: 500 }}>
                {restaurant.tagline}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {infoChips.map((chip, i) => (
            <div key={i} style={chipStyle}>
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </div>
          ))}
        </div>

        {restaurant.cuisineCategories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {restaurant.cuisineCategories.slice(0, 5).map(cat => (
              <span key={cat} style={{
                padding: '4px 10px', borderRadius: 20,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600,
              }}>{cat}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Qty Control ─── */
function QtyControl({ qty, onAdd, onInc, onDec, small }: {
  qty: number; onAdd: () => void; onInc: () => void; onDec: () => void; small?: boolean;
}) {
  const dim = small ? 28 : 32;
  const fs  = small ? 15 : 17;
  if (qty === 0) {
    return (
      <button onClick={onAdd} style={{
        background: ORANGE, border: 'none', borderRadius: 20,
        padding: small ? '5px 14px' : '7px 18px',
        color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer',
        boxShadow: `0 4px 12px ${ORANGE}40`,
      }}>+</button>
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', background: ORANGE, borderRadius: 20 }}>
      <button onClick={onDec} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: dim, height: dim, color: 'white', fontSize: fs, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
      <span style={{ color: 'white', fontSize: 13, fontWeight: 900, minWidth: 20, textAlign: 'center' }}>{qty}</span>
      <button onClick={onInc} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: dim, height: dim, color: 'white', fontSize: fs, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
    </div>
  );
}

/* ─── Menu Item Card ─── */
function MenuItemCard({ item, qty, onAdd, onInc, onDec, onItemClick, currency, locale }: {
  item: MenuItem; qty: number; onAdd: () => void; onInc: () => void; onDec: () => void;
  onItemClick?: () => void; currency: string; locale: string;
}) {
  const hasModifiers = item.modifierGroups && item.modifierGroups.length > 0;
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasModifiers && onItemClick) onItemClick(); else onAdd();
  };
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgHover, setImgHover] = useState(false);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onItemClick?.()}
      whileHover={{ y: -1, boxShadow: '0 4px 20px rgba(0,0,0,0.18)' }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '18px 0', borderBottom: '1px solid var(--border)', gap: 16,
        cursor: 'pointer',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{item.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onItemClick?.(); }}
            title="Productinfo bekijken"
            style={{
              width: 22, height: 22, borderRadius: '50%', border: '1px solid var(--border)',
              background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', flexShrink: 0,
            }}
          >👁</button>
          {hasModifiers && (
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 8, background: `${ORANGE}20`, color: ORANGE, fontWeight: 700 }}>opties</span>
          )}
        </div>
        {item.description && (
          <div style={{
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          } as React.CSSProperties}>{item.description}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>{fmt(parseFloat(item.basePrice), currency, locale)}</span>
          <span className="show-mobile" style={{ display: 'none' }} onClick={e => e.stopPropagation()}>
            <QtyControl qty={qty} onAdd={() => handleQuickAdd({ stopPropagation: () => {} } as any)} onInc={onInc} onDec={onDec} small />
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
        <div
          style={{ position: 'relative', width: 92, height: 92, borderRadius: 14, overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0 }}
          onMouseEnter={() => setImgHover(true)}
          onMouseLeave={() => setImgHover(false)}
        >
          {item.imageUrl ? (
            <>
              {!imgLoaded && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, var(--bg-elevated) 25%, var(--border) 50%, var(--bg-elevated) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeletonPulse 1.4s ease-in-out infinite',
                }} />
              )}
              <img
                src={item.imageUrl}
                alt={item.name}
                onLoad={() => setImgLoaded(true)}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  opacity: imgLoaded ? 1 : 0,
                  transform: imgHover ? 'scale(1.08)' : 'scale(1)',
                  transition: 'opacity 0.3s ease, transform 0.4s ease',
                }}
              />
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🍽️</div>
          )}
        </div>
        <span className="hide-mobile" onClick={e => e.stopPropagation()}>
          <QtyControl qty={qty} onAdd={() => handleQuickAdd({ stopPropagation: () => {} } as any)} onInc={onInc} onDec={onDec} />
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Upsell Logic ─── */
function getUpsellItems(cart: any[], menu: MenuCategory[]): MenuItem[] {
  if (cart.length === 0 || menu.length === 0) return [];
  const cartIds = new Set(cart.map(c => c.id));
  const cartCategories = new Set<string>();
  for (const cat of menu) {
    for (const item of cat.items) {
      if (cartIds.has(item.id)) cartCategories.add(cat.id);
    }
  }
  const suggestions: MenuItem[] = [];
  const preferredCats = ['DRINKS', 'DESSERTS', 'SIDES', 'SALADS'];
  for (const catName of preferredCats) {
    const cat = menu.find(c => c.name.toUpperCase().includes(catName));
    if (cat && !cartCategories.has(cat.id)) {
      for (const item of cat.items.slice(0, 2)) {
        if (!cartIds.has(item.id) && suggestions.length < 3) suggestions.push(item);
      }
    }
  }
  if (suggestions.length < 2) {
    for (const cat of menu) {
      if (cartCategories.has(cat.id)) continue;
      for (const item of cat.items) {
        if (!cartIds.has(item.id) && suggestions.length < 3) suggestions.push(item);
      }
    }
  }
  return suggestions;
}

/* ─── Cart Panel ─── */
function CartContent({ cart, currency, locale, totalCart, onCheckout, menu, onAddUpsell }: {
  cart: ReturnType<typeof useCartStore.getState>['items'];
  currency: string; locale: string; totalCart: number;
  onCheckout?: () => void;
  menu?: MenuCategory[];
  onAddUpsell?: (item: MenuItem) => void;
}) {
  const { updateQty, removeItem } = useCartStore();

  if (cart.length === 0) {
    return (
      <div style={{ padding: '44px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 42, marginBottom: 14 }}>🧺</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Vul je mand</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Voeg gerechten toe om je<br />bestelling te starten
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 340, overflowY: 'auto', padding: '16px 20px' }}>
        {cart.map(c => {
          const modExtra = (c.modifiers || []).reduce((s, m) => s + m.priceAdjustment, 0);
          const unitPrice = parseFloat(c.basePrice) + modExtra;
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                {c.modifiers && c.modifiers.length > 0 && (
                  <div style={{ fontSize: 11, color: ORANGE, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.modifiers.map(m => m.name).join(', ')}
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{fmt(unitPrice, currency, locale)} / stuk</div>
              </div>
              <QtyControl
                qty={c.qty} small onAdd={() => {}}
                onInc={() => updateQty(c.id, c.qty + 1)}
                onDec={() => { if (c.qty <= 1) removeItem(c.id); else updateQty(c.id, c.qty - 1); }}
              />
              <span style={{ fontSize: 13, fontWeight: 800, minWidth: 52, textAlign: 'right' }}>
                {fmt(unitPrice * c.qty, currency, locale)}
              </span>
            </div>
          );
        })}
      </div>

      {menu && menu.length > 0 && (() => {
        const upsells = getUpsellItems(cart, menu);
        if (upsells.length === 0) return null;
        return (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Misschien ook lekker?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upsells.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-page)' }}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmt(parseFloat(item.basePrice), currency, locale)}</div>
                  </div>
                  <button onClick={() => onAddUpsell?.(item)} style={{
                    width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: ORANGE, color: 'white', fontSize: 16, fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 2px 8px ${ORANGE}40`, flexShrink: 0,
                  }}>+</button>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <span>Bezorgkosten</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Gratis</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, marginBottom: 16 }}>
          <span>Totaal</span><span>{fmt(totalCart, currency, locale)}</span>
        </div>
        <Link href="/checkout" onClick={onCheckout} style={{
          display: 'block', background: ORANGE,
          borderRadius: 12, padding: '14px', color: 'white', fontSize: 15, fontWeight: 900,
          textAlign: 'center', boxShadow: `0 8px 20px ${ORANGE}40`, textDecoration: 'none',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemForModal | null>(null);
  const [groupOrderOpen, setGroupOrderOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('bezorgen');

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { items: cart, addItem, updateQty, removeItem, total: cartTotal, itemCount } = useCartStore();
  const totalCart = cartTotal();

  const getQty = useCallback((id: string) => cart.find(c => c.id === id)?.qty ?? 0, [cart]);

  const handleAdd = useCallback((item: MenuItem) => {
    if (!restaurant) return;
    if (restaurant.acceptOrders === false) {
      alert(`${restaurant.name} is op dit moment gesloten en neemt geen bestellingen aan.`);
      return;
    }
    const rawDeposit = typeof item.depositAmount === 'string' ? parseFloat(item.depositAmount) : item.depositAmount;
    const depositAmount = Number.isFinite(rawDeposit as number) ? (rawDeposit as number) : 0;
    addItem(slug, restaurant.name, { id: item.id, name: item.name, basePrice: item.basePrice, imageUrl: item.imageUrl, depositAmount }, currency, locale);
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
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_H - 104;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const currency = restaurant?.currency || 'EUR';
  const locale   = restaurant?.locale   || 'nl-NL';

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes skeletonPulse{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${ORANGE}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ fontSize: 48 }}>😕</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Restaurant niet gevonden</div>
        <Link href="/discover" style={{ background: ORANGE, color: 'white', padding: '10px 24px', borderRadius: 12, fontWeight: 800 }}>← Terug naar overzicht</Link>
      </div>
    );
  }

  const accent   = restaurant.primaryColor || ORANGE;
  const initials = restaurant.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`@keyframes skeletonPulse{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* ─── Sticky Nav ─── */}
      <nav style={{
        position: 'sticky', top: 0, left: 0, right: 0, zIndex: 200,
        height: NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: 'rgba(var(--bg-page-rgb, 17,17,17),0.88)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link href="/discover" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          <span>←</span><span className="hide-mobile">Ontdekken</span>
        </Link>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/logo-enjoy.png" alt="EnJoy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </Link>
        <button onClick={() => setCartOpen(true)} style={{
          position: 'relative', width: 40, height: 40, borderRadius: 10,
          background: 'var(--b8)', border: '1px solid var(--border)', cursor: 'pointer',
          fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          🧺
          {itemCount() > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: ORANGE, color: 'white',
              borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{itemCount()}</span>
          )}
        </button>
      </nav>

      {/* ─── Closed banner ─── */}
      {restaurant.acceptOrders === false && (
        <div style={{
          background: 'linear-gradient(135deg, #dc2626, #991b1b)',
          color: 'white', padding: '12px 20px', textAlign: 'center',
          fontSize: 14, fontWeight: 700,
        }}>
          🔴 Dit restaurant is op dit moment gesloten — bestellingen zijn tijdelijk niet mogelijk
        </div>
      )}

      {/* ─── Hero ─── */}
      <MenuHero restaurant={restaurant} accent={accent} initials={initials} currency={currency} locale={locale} />

      {/* ─── Sticky Search + Category Tabs ─── */}
      <div style={{ position: 'sticky', top: NAV_H, zIndex: 100, background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px 0' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-muted)' }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Zoeken in ${restaurant.name}`}
              style={{
                width: '100%', padding: '12px 16px 12px 44px', boxSizing: 'border-box',
                borderRadius: 12, border: '1px solid var(--border)',
                background: 'var(--bg-elevated)', color: 'var(--text-primary)',
                fontSize: 14, fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>
        </div>
        <div className="scroll-x" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 0, padding: '0 24px', overflowX: 'auto' }}>
          {menu.map(cat => (
            <button key={cat.id} onClick={() => { setSearchQuery(''); scrollTo(cat.id); }} style={{
              padding: '12px 18px', border: 'none', background: 'transparent',
              color: activeCategory === cat.id ? ORANGE : 'var(--text-muted)',
              fontWeight: activeCategory === cat.id ? 800 : 500, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              borderBottom: activeCategory === cat.id ? `3px solid ${ORANGE}` : '3px solid transparent',
              transition: 'all 0.15s',
            }}>{cat.name}</button>
          ))}
        </div>
      </div>

      {/* ─── Body ─── */}
      <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', padding: '28px 24px 100px', gap: 28, alignItems: 'flex-start' }}>

        {/* ─── Menu Sections ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {menu.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Geen menu beschikbaar</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>Dit restaurant heeft nog geen menu opgezet.</div>
            </div>
          ) : (
            menu.map(cat => {
              const q = searchQuery.toLowerCase().trim();
              const filteredItems = q
                ? cat.items.filter(item =>
                    item.name.toLowerCase().includes(q) ||
                    (item.description || '').toLowerCase().includes(q)
                  )
                : cat.items;
              if (q && filteredItems.length === 0) return null;
              return (
                <div key={cat.id} ref={el => { sectionRefs.current[cat.id] = el; }} style={{ marginBottom: 44 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4, paddingTop: 4 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 900 }}>{cat.name}</h2>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filteredItems.length} gerecht{filteredItems.length !== 1 ? 'en' : ''}</span>
                  </div>
                  <div style={{ height: 1, background: 'var(--border)', marginBottom: 4 }} />
                  {filteredItems.length === 0 && !q ? (
                    <div style={{
                      padding: '36px 20px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                      background: `${ORANGE}08`,
                      borderRadius: 16, margin: '8px 0',
                    }}>
                      <div style={{ fontSize: 48, lineHeight: 1 }}>🍳</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: ORANGE }}>Komt binnenkort</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 200 }}>
                        We werken aan nieuwe gerechten voor deze categorie.
                      </div>
                    </div>
                  ) : (
                    filteredItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: idx * 0.03, ease: 'easeOut' }}
                      >
                        <MenuItemCard
                          item={item}
                          qty={getQty(item.id)}
                          onAdd={() => handleAdd(item)}
                          onInc={() => handleAdd(item)}
                          onDec={() => handleDec(item.id)}
                          onItemClick={() => {
                            const rawDeposit = typeof item.depositAmount === 'string' ? parseFloat(item.depositAmount) : item.depositAmount;
                            const depositAmount = Number.isFinite(rawDeposit as number) ? (rawDeposit as number) : 0;
                            setSelectedItem({
                              id: item.id, name: item.name, description: item.description,
                              basePrice: item.basePrice, imageUrl: item.imageUrl,
                              modifierGroups: item.modifierGroups || [],
                              depositAmount,
                            });
                          }}
                          currency={currency} locale={locale}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              );
            })
          )}

          {/* Bottom action row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 40, justifyContent: 'center' }}>
            <button onClick={() => setGroupOrderOpen(true)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 20,
              border: '1px solid var(--border)', background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>👥 Groepsbestelling</button>
            <Link href={`/reserve/${slug}`} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 20,
              border: '1px solid var(--border)', background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)', fontSize: 13, fontWeight: 700, textDecoration: 'none',
            }}>🍽️ Reserveer een tafel</Link>
            <button onClick={() => setInfoOpen(true)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 20,
              border: '1px solid var(--border)', background: 'var(--bg-elevated)',
              color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>ℹ️ Info</button>
          </div>
        </div>

        {/* ─── Winkelmandje Sidebar (desktop) ─── */}
        <div className="hide-mobile" style={{ width: 340, flexShrink: 0, position: 'sticky', top: NAV_H + 112 }}>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 20, border: '1px solid var(--border-strong)', overflow: 'hidden' }}>
            {/* Sidebar header */}
            <div style={{ padding: '18px 20px 14px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Winkelmandje</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{restaurant.name}</div>
              {/* Delivery / Pickup toggle */}
              <div style={{
                display: 'flex', marginTop: 14,
                background: 'var(--bg-page)', borderRadius: 12, padding: 3, gap: 2,
              }}>
                {(['bezorgen', 'afhalen'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setDeliveryMode(mode)}
                    style={{
                      flex: 1, padding: '8px 10px', borderRadius: 9, border: 'none',
                      background: deliveryMode === mode ? ORANGE : 'transparent',
                      color: deliveryMode === mode ? 'white' : 'var(--text-muted)',
                      fontWeight: deliveryMode === mode ? 700 : 500,
                      fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    {mode === 'bezorgen' ? '🚴 Bezorgen' : '🏃 Afhalen'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <CartContent
              cart={cart} currency={currency} locale={locale}
              totalCart={totalCart} menu={menu} onAddUpsell={handleAdd}
            />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px 10px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>Winkelmandje</h3>
                  <div style={{ display: 'flex', marginTop: 10, background: 'var(--bg-page)', borderRadius: 10, padding: 3, gap: 2 }}>
                    {(['bezorgen', 'afhalen'] as const).map(mode => (
                      <button key={mode} onClick={() => setDeliveryMode(mode)} style={{
                        flex: 1, padding: '7px 10px', borderRadius: 7, border: 'none',
                        background: deliveryMode === mode ? ORANGE : 'transparent',
                        color: deliveryMode === mode ? 'white' : 'var(--text-muted)',
                        fontWeight: deliveryMode === mode ? 700 : 500,
                        fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                      }}>
                        {mode === 'bezorgen' ? '🚴 Bezorgen' : '🏃 Afhalen'}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setCartOpen(false)} style={{ background: 'var(--b8)', border: 'none', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                <CartContent cart={cart} currency={currency} locale={locale} totalCart={totalCart} menu={menu} onAddUpsell={handleAdd} onCheckout={() => setCartOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Restaurant Info Modal ─── */}
      <AnimatePresence>
        {infoOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 500 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setInfoOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg-elevated)', borderRadius: '20px 20px 0 0',
                maxHeight: '85vh', overflowY: 'auto',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900 }}>{restaurant.name}</h3>
                  {restaurant.tagline && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{restaurant.tagline}</p>}
                </div>
                <button onClick={() => setInfoOpen(false)} style={{ background: 'var(--b8)', border: 'none', borderRadius: 10, width: 34, height: 34, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  restaurant.address     && { icon: '📍', label: 'Adres',    value: restaurant.address },
                  restaurant.phone       && { icon: '📞', label: 'Telefoon', value: restaurant.phone, href: `tel:${restaurant.phone}` },
                  restaurant.contactEmail && { icon: '✉️', label: 'Email',   value: restaurant.contactEmail, href: `mailto:${restaurant.contactEmail}` },
                ].filter(Boolean).map((row: any) => (
                  <div key={row.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--b8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{row.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{row.label}</div>
                      {row.href
                        ? <a href={row.href} style={{ fontSize: 14, fontWeight: 600, color: accent, textDecoration: 'none' }}>{row.value}</a>
                        : <div style={{ fontSize: 14, fontWeight: 600 }}>{row.value}</div>
                      }
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--b8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🚴</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Bezorging</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} minuten · Gratis bezorgd</div>
                  </div>
                </div>
                {restaurant.businessHours && Object.keys(restaurant.businessHours).length > 0 && (
                  <div style={{ padding: '14px 0' }}>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--b8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🕐</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 10 }}>Openingstijden</div>
                    </div>
                    <div style={{ display: 'grid', gap: 6, paddingLeft: 50 }}>
                      {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(day => {
                        const h = restaurant.businessHours?.[day];
                        if (!h) return null;
                        const labels: Record<string, string> = { monday:'Ma', tuesday:'Di', wednesday:'Wo', thursday:'Do', friday:'Vr', saturday:'Za', sunday:'Zo' };
                        const today = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];
                        const isToday = day === today;
                        return (
                          <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                            <span style={{ fontWeight: isToday ? 800 : 500, color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)', minWidth: 28 }}>{labels[day]}</span>
                            <span style={{ fontWeight: isToday ? 700 : 400, color: h.closed ? 'var(--text-muted)' : isToday ? accent : 'var(--text-secondary)' }}>
                              {h.closed ? 'Gesloten' : `${h.open} – ${h.close}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Mobile Floating Cart Bar ─── */}
      <AnimatePresence>
        {itemCount() > 0 && (
          <div className="show-mobile" style={{ display: 'none', position: 'fixed', bottom: 'max(20px, env(safe-area-inset-bottom, 20px))', left: 16, right: 16, zIndex: 300 }}>
            <motion.button
              key="floating-cart"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCartOpen(true)}
              style={{
                width: '100%', background: ORANGE,
                border: 'none', borderRadius: 16, padding: '14px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                color: 'white', fontSize: 15, fontWeight: 900, cursor: 'pointer',
                boxShadow: `0 12px 36px ${ORANGE}55`,
                minHeight: 56,
              }}
            >
              <span style={{
                background: 'rgba(255,255,255,0.22)', borderRadius: 8,
                padding: '4px 10px', fontSize: 13, fontWeight: 900, minWidth: 28, textAlign: 'center',
              }}>{itemCount()}</span>
              <span>Bestellen</span>
              <span style={{ fontWeight: 800 }}>{fmt(totalCart, currency, locale)}</span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Menu Item Options Modal ─── */}
      <MenuItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        restaurantSlug={slug}
        restaurantName={restaurant.name}
        currency={currency}
        locale={locale}
        upsellItems={(() => {
          const upsells: Array<{id: string; name: string; basePrice: string; imageUrl: string | null; depositAmount?: number}> = [];
          const drinkCats = ['DRINKS', 'DRANKEN', 'DRANKJES', 'DESSERTS', 'NAGERECHTEN'];
          for (const cat of menu) {
            if (drinkCats.some(d => cat.name.toUpperCase().includes(d))) {
              for (const item of cat.items.slice(0, 4)) {
                if (item.id !== selectedItem?.id && upsells.length < 5) {
                  const rawDeposit = typeof item.depositAmount === 'string' ? parseFloat(item.depositAmount) : item.depositAmount;
                  const depositAmount = Number.isFinite(rawDeposit as number) ? (rawDeposit as number) : 0;
                  upsells.push({ id: item.id, name: item.name, basePrice: item.basePrice, imageUrl: item.imageUrl, depositAmount });
                }
              }
            }
          }
          return upsells;
        })()}
      />

      {/* ─── Group Order Modal ─── */}
      <GroupOrderModal
        isOpen={groupOrderOpen}
        onClose={() => setGroupOrderOpen(false)}
        restaurantName={restaurant.name}
        restaurantSlug={slug}
        cartItemCount={itemCount()}
        cartTotal={cartTotal()}
      />
    </div>
  );
}
