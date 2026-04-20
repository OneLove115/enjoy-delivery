'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { calculateServiceFee, calculateStatiegeld, SERVICE_FEE_CAP, SERVICE_FEE_PERCENT } from '@/lib/service-fee';

const ORANGE = '#FF6B35';
const DELIVERY_FEE = 2.0; // Gratis for now in some accounts; kept visible per screenshot

export default function CartClient() {
  const router = useRouter();
  const {
    items, restaurantSlug, restaurantName, currency, locale,
    orderType, setOrderType,
    updateQty, removeItem, updateNote,
    total, itemCount,
  } = useCartStore();

  const subtotal = total();
  const serviceFee = calculateServiceFee(subtotal, currency || 'EUR');
  const statiegeld = calculateStatiegeld(items as Array<{ depositAmount?: number | string | null; qty?: number }>);
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const grandTotal = subtotal + serviceFee + statiegeld + deliveryFee;

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale || 'nl-NL', { style: 'currency', currency: currency || 'EUR' }).format(n);

  const serviceFeeCurrency = (currency || 'EUR').toUpperCase();
  const serviceFeeCap = SERVICE_FEE_CAP[serviceFeeCurrency] ?? 2.0;
  const serviceFeePercentLabel = String(SERVICE_FEE_PERCENT).replace('.', ',');
  const serviceFeeCapLabel = serviceFeeCap.toFixed(2).replace('.', ',');
  const serviceFeeLabel = `Servicekosten ${serviceFeePercentLabel}% (max €${serviceFeeCapLabel})`;

  if (!items.length) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, color: 'var(--text-primary)' }}>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Je winkelmandje is leeg</p>
        <Link href="/discover" style={{ color: ORANGE, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>← Terug naar restaurants</Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-page, #0A0A0F)', minHeight: '100vh', color: 'var(--text-primary, #fff)', fontFamily: "'Outfit', system-ui, sans-serif", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))' }}>
        <button
          onClick={() => router.back()}
          aria-label="Terug"
          style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
        >‹</button>
        <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>Je winkelmandje</h1>
        <div style={{ width: 38 }} />
      </div>

      {/* Bezorging / Afhalen toggle */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: 'var(--bg-card, rgba(255,255,255,0.04))', border: '1px solid var(--border, rgba(255,255,255,0.08))', borderRadius: 999, padding: 4 }}>
          <ToggleButton
            active={orderType === 'delivery'}
            onClick={() => setOrderType('delivery')}
            icon="🛵"
            label="Bezorging"
            sub="45-70 minuten"
          />
          <ToggleButton
            active={orderType === 'pickup'}
            onClick={() => setOrderType('pickup')}
            icon="🛍️"
            label="Afhalen"
            sub="15 minuten"
          />
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map(item => {
          const modExtra = (item.modifiers || []).reduce((s, m) => s + (m.priceAdjustment || 0), 0);
          const linePrice = (parseFloat(item.basePrice) + modExtra) * item.qty;
          const modSummary = (item.modifiers || []).map(m => m.name).join(', ');
          return (
            <div key={item.id} style={{ paddingBottom: 14, borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, flex: 1, paddingRight: 12 }}>{item.name}</h3>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{fmt(linePrice)}</span>
              </div>
              {modSummary && (
                <p style={{ fontSize: 13, color: 'var(--text-muted, rgba(255,255,255,0.45))', lineHeight: 1.5, marginBottom: 12 }}>
                  {modSummary}
                </p>
              )}

              {/* Note input + qty stepper row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <button
                  onClick={() => {
                    const newNote = prompt('Voeg een opmerking toe', item.note || '');
                    if (newNote !== null) updateNote(item.id, newNote);
                  }}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: 999, padding: '8px 14px', color: 'var(--text-secondary, rgba(255,255,255,0.7))', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <span>📝</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.note ? item.note : 'Voeg een opmerking toe'}
                  </span>
                </button>
                <QtyStepper qty={item.qty} onDec={() => item.qty <= 1 ? removeItem(item.id) : updateQty(item.id, item.qty - 1)} onInc={() => updateQty(item.id, item.qty + 1)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Price breakdown */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PriceRow label="Subtotaal" value={fmt(subtotal)} />
        <PriceRow label={serviceFeeLabel} value={fmt(serviceFee)} info />
        {orderType === 'delivery' && (
          <PriceRow label="Bezorgkosten" value={deliveryFee > 0 ? fmt(deliveryFee) : 'Gratis'} valueColor={deliveryFee > 0 ? undefined : '#4ade80'} info />
        )}
        {statiegeld > 0 && <PriceRow label="Statiegeld" value={fmt(statiegeld)} />}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <span style={{ fontSize: 17, fontWeight: 800 }}>Totaal</span>
          <span style={{ fontSize: 17, fontWeight: 800 }}>{fmt(grandTotal)}</span>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg-page, #0A0A0F)', borderTop: '1px solid var(--border, rgba(255,255,255,0.06))', padding: '14px 20px 22px', zIndex: 50 }}>
        <button
          onClick={() => router.push('/checkout')}
          disabled={!items.length}
          style={{ width: '100%', padding: '16px 20px', background: ORANGE, color: '#fff', border: 'none', borderRadius: 999, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em', boxShadow: '0 6px 18px rgba(255,107,53,0.28)' }}
        >
          Naar afrekenen
        </button>
      </div>

      {/* Tiny branding footer for context */}
      {restaurantName && (
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted, rgba(255,255,255,0.3))', marginTop: -4 }}>
          {itemCount()} product{itemCount() !== 1 ? 'en' : ''} bij {restaurantName}
          {restaurantSlug && <> · <Link href={`/menu/${restaurantSlug}`} style={{ color: 'inherit', textDecoration: 'underline' }}>wijzigen</Link></>}
        </p>
      )}
    </div>
  );
}

/* ─── sub-components ─── */

function ToggleButton({ active, onClick, icon, label, sub }: { active: boolean; onClick: () => void; icon: string; label: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 14px',
        borderRadius: 999,
        background: active ? '#fff' : 'transparent',
        color: active ? '#0A0A0F' : 'var(--text-secondary, rgba(255,255,255,0.7))',
        border: 'none',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'inherit',
        transition: 'all 0.2s',
      }}
    >
      <span style={{ color: active ? ORANGE : 'inherit', fontSize: 16 }}>{icon}</span>
      <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
        <div style={{ fontSize: 14, fontWeight: 800 }}>{label}</div>
        <div style={{ fontSize: 10, opacity: 0.6, marginTop: 1 }}>{sub}</div>
      </div>
    </button>
  );
}

function QtyStepper({ qty, onDec, onInc }: { qty: number; onDec: () => void; onInc: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card, rgba(255,255,255,0.05))', border: '1px solid var(--border, rgba(255,255,255,0.1)', borderRadius: 999, padding: '4px 6px' }}>
      <button onClick={onDec} aria-label="Minder" style={{ width: 30, height: 30, borderRadius: '50%', background: 'transparent', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer' }}>🗑</button>
      <span style={{ minWidth: 20, textAlign: 'center', fontSize: 14, fontWeight: 800 }}>{qty}</span>
      <button onClick={onInc} aria-label="Meer" style={{ width: 30, height: 30, borderRadius: '50%', background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>+</button>
    </div>
  );
}

function PriceRow({ label, value, info, valueColor }: { label: string; value: string; info?: boolean; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary, rgba(255,255,255,0.75))' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {label}
        {info && <span style={{ opacity: 0.4, fontSize: 12 }}>ⓘ</span>}
      </span>
      <span style={{ fontWeight: 700, color: valueColor ?? 'var(--text-primary, #fff)' }}>{value}</span>
    </div>
  );
}
