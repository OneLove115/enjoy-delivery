'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore } from '../../../store/cart';

/* ─── Types ─── */
type MenuItem = {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  imageUrl: string | null;
  category: string;
};

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  imageUrl: string | null;
  slug?: string;
};

/* ─── Helpers ─── */
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}


/* ─── Menu Item Card ─── */
function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        gap: 16,
        padding: 20,
        borderRadius: 16,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>{item.name}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>{item.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>{formatPrice(parseFloat(item.basePrice))}</span>
          <button
            onClick={onAdd}
            style={{
              background: 'linear-gradient(135deg, #5A31F4, #FF0080)',
              border: 'none',
              borderRadius: 10,
              padding: '8px 20px',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(90,49,244,0.3)',
            }}
          >
            + Add
          </button>
        </div>
      </div>
      {item.imageUrl && (
        <div style={{ width: 90, height: 90, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
          <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
    </motion.div>
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

  const { items: cart, addItem, total: cartTotal, itemCount } = useCartStore();
  const totalCart = cartTotal();

  const addToCart = (item: MenuItem) => {
    if (!restaurant) return;
    addItem(slug, restaurant.name, {
      id: item.id,
      name: item.name,
      basePrice: item.basePrice,
      imageUrl: item.imageUrl,
    });
  };

  useEffect(() => { useCartStore.persist.rehydrate(); }, []);

  useEffect(() => {
    if (!slug) return;

    Promise.all([
      fetch('/api/restaurants').then(r => r.json()),
      fetch(`/api/restaurants/${slug}/menu`).then(r => r.json()),
    ])
      .then(([restaurantData, menuData]) => {
        const found = (restaurantData.restaurants || []).find((r: Restaurant) => r.slug === slug);
        setRestaurant(found || null);

        const categories: MenuCategory[] = menuData?.data?.menu || [];
        setMenu(categories);
        if (categories.length > 0) setActiveCategory(categories[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const activeMenuCategory = menu.find(c => c.id === activeCategory);
  const filteredItems: MenuItem[] = activeMenuCategory?.items || [];

  if (loading || !restaurant) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/discover" style={{ fontSize: 24, fontWeight: 900, textDecoration: 'none', color: 'var(--text-primary)' }}>
          En<span style={{ background: 'linear-gradient(135deg, #5A31F4, #FF0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joy</span>
        </Link>
        <button
          onClick={() => setCartOpen(true)}
          style={{ position: 'relative', width: 44, height: 44, borderRadius: 12, background: 'var(--b8)', border: 'none', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}
        >
          🛒
          {itemCount() > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: 'linear-gradient(135deg, #5A31F4, #FF0080)', color: 'var(--text-primary)', borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {itemCount()}
            </span>
          )}
        </button>
      </nav>

      {/* Restaurant Header */}
      <div style={{ paddingTop: 70 }}>
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          {restaurant.imageUrl && (
            <img src={restaurant.imageUrl} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,15,0.95) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 24, left: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 950, marginBottom: 6 }}>{restaurant.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{restaurant.cuisine}</span>
              <span style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', padding: '3px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>⭐ {restaurant.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>🕐 {restaurant.deliveryTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Strip */}
      <div style={{ position: 'sticky', top: 70, zIndex: 50, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 1 }}>
          {menu.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '16px 20px',
                border: 'none',
                background: 'transparent',
                color: activeCategory === cat.id ? 'white' : 'rgba(255,255,255,0.4)',
                fontWeight: activeCategory === cat.id ? 800 : 500,
                fontSize: 14,
                cursor: 'pointer',
                borderBottom: activeCategory === cat.id ? '2px solid #5A31F4' : '2px solid transparent',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '32px 24px', gap: 32 }}>
        {/* Menu Items */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>{activeMenuCategory?.name ?? ''}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAdd={() => addToCart(item)}
              />
            ))}
          </div>
        </div>

        {/* Cart Sidebar (desktop) */}
        <div style={{ width: 320, flexShrink: 0, display: 'none' }} className="cart-sidebar-desktop">
          <div style={{ position: 'sticky', top: 130, background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>Your Order</h3>
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>Your cart is empty</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {cart.map((c) => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: 14 }}>
                      <div style={{ display: 'flex', gap: 12, fontWeight: 700 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{c.qty}x</span>
                        <span>{c.name}</span>
                      </div>
                      <span style={{ fontWeight: 800 }}>{formatPrice(parseFloat(c.basePrice) * c.qty)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 16 }}>
                    <span>Total</span>
                    <span>{formatPrice(totalCart)}</span>
                  </div>
                </div>
                <button style={{ width: '100%', background: 'linear-gradient(135deg, #5A31F4, #FF0080)', border: 'none', borderRadius: 12, padding: '16px', color: 'var(--text-primary)', fontSize: 16, fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 20px rgba(90,49,244,0.3)' }}>
                  Checkout · {formatPrice(totalCart)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer (mobile/overlay) */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 340, background: '#111118', borderLeft: '1px solid rgba(255,255,255,0.08)', padding: 28, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900 }}>Your Order</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: 'var(--b8)', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 18, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '40px 0', flex: 1 }}>Your cart is empty</p>
            ) : (
              <>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {cart.map((c) => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: 14 }}>
                      <div style={{ display: 'flex', gap: 12, fontWeight: 700 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{c.qty}x</span>
                        <span>{c.name}</span>
                      </div>
                      <span style={{ fontWeight: 800 }}>{formatPrice(parseFloat(c.basePrice) * c.qty)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 16, marginBottom: 16 }}>
                    <span>Total</span>
                    <span>{formatPrice(totalCart)}</span>
                  </div>
                  <button style={{ width: '100%', background: 'linear-gradient(135deg, #5A31F4, #FF0080)', border: 'none', borderRadius: 12, padding: '16px', color: 'var(--text-primary)', fontSize: 16, fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 20px rgba(90,49,244,0.3)' }}>
                    Checkout · {formatPrice(totalCart)}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Mobile Cart Bar */}
      {itemCount() > 0 && (
        <div style={{ position: 'fixed', bottom: 24, left: 24, right: 24, zIndex: 100 }}>
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => setCartOpen(true)}
            style={{ width: '100%', background: 'linear-gradient(135deg, #5A31F4, #FF0080)', border: 'none', borderRadius: 16, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-primary)', fontSize: 16, fontWeight: 900, cursor: 'pointer', boxShadow: '0 16px 40px rgba(90,49,244,0.4)' }}
          >
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '4px 10px', fontSize: 14, fontWeight: 900 }}>
              {itemCount()}
            </span>
            <span>View Cart</span>
            <span>{formatPrice(totalCart)}</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
