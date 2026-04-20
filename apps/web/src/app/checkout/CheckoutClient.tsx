'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { AnimatePresence, motion } from 'framer-motion';
import { analytics, type EcomItem } from '@/lib/analytics';
import { calculateServiceFee, calculateStatiegeld, SERVICE_FEE_CAP, SERVICE_FEE_PERCENT } from '@/lib/service-fee';

const STORAGE_KEY = 'enjoy-checkout-details';
const ORANGE = '#FF6B35';

interface CheckoutDetails {
  street: string; postcode: string; city: string;
  name: string; phone: string; email: string;
  notes: string;
  payment: string;
}

const EMPTY: CheckoutDetails = {
  street: '', postcode: '', city: '',
  name: '', phone: '', email: '', notes: '',
  payment: 'ideal',
};

export default function CheckoutClient() {
  const router = useRouter();
  const {
    items, restaurantName, restaurantSlug, total, itemCount, clearCart,
    currency, locale,
    orderType, deliveryTime, setDeliveryTime,
    tip, setTip,
    voucherCode, setVoucherCode,
    notes: cartNotes, setNotes: setCartNotes,
  } = useCartStore();

  const [form, setForm] = useState<CheckoutDetails>(EMPTY);
  const [tipCustom, setTipCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [voucherInputOpen, setVoucherInputOpen] = useState(false);
  const [voucherDraft, setVoucherDraft] = useState('');
  const pendingRedirect = useRef<() => void>(() => {});

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { setIsLoggedIn(r.ok); setAuthChecked(true); })
      .catch(() => { setIsLoggedIn(false); setAuthChecked(true); });
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CheckoutDetails>;
        setForm(prev => ({ ...prev, ...parsed }));
      }
    } catch {}
  }, []);

  const subtotal = total();
  const serviceFee = calculateServiceFee(subtotal, currency || 'EUR');
  const statiegeld = calculateStatiegeld(items as Array<{ depositAmount?: number | string | null; qty?: number }>);
  const deliveryFee = orderType === 'delivery' ? 2.0 : 0;
  const grandTotal = subtotal + serviceFee + statiegeld + deliveryFee + (tip || 0);

  const serviceFeeCurrency = (currency || 'EUR').toUpperCase();
  const serviceFeeCap = SERVICE_FEE_CAP[serviceFeeCurrency] ?? 2.0;
  const serviceFeePercentLabel = String(SERVICE_FEE_PERCENT).replace('.', ',');
  const serviceFeeCapLabel = serviceFeeCap.toFixed(2).replace('.', ',');
  const serviceFeeLabel = `Servicekosten ${serviceFeePercentLabel}% (max €${serviceFeeCapLabel})`;

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale || 'nl-NL', { style: 'currency', currency: currency || 'EUR' }).format(n);

  const set = (key: keyof CheckoutDetails, val: string) => {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const deliveryTimeLabel = (() => {
    if (deliveryTime.kind === 'asap') {
      return orderType === 'pickup' ? 'Zo snel mogelijk afhalen' : 'Zo snel mogelijk bezorgen';
    }
    try {
      const d = new Date(deliveryTime.isoTime);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `Om ${hh}:${mm}`;
    } catch {
      return 'Zo snel mogelijk bezorgen';
    }
  })();

  const validate = (): string | null => {
    if (items.length === 0) return 'Je winkelmandje is leeg';
    if (orderType === 'delivery') {
      if (!form.street.trim()) return 'Vul je adres in';
      if (!form.postcode.trim()) return 'Vul je postcode in';
      if (!form.city.trim()) return 'Vul je stad in';
    }
    if (!form.name.trim()) return 'Vul je naam in';
    if (!form.phone.trim()) return 'Vul je telefoonnummer in';
    if (!form.email.trim() || !form.email.includes('@')) return 'Vul een geldig e-mailadres in';
    return null;
  };

  const handleOrder = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setSubmitting(true);

    const ecomItems: EcomItem[] = items.map(i => {
      const modTotal = (i.modifiers || []).reduce((s: number, m: any) => s + (m.priceAdjustment || 0), 0);
      return {
        item_id: i.id, item_name: i.name,
        price: parseFloat(i.basePrice) + modTotal, quantity: i.qty,
        affiliation: restaurantName,
      };
    });
    analytics.beginCheckout(ecomItems, grandTotal, currency || 'EUR');

    try {
      const res = await fetch('/api/consumer/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            menuItemId: i.id, name: i.name, quantity: i.qty,
            unitPrice: i.basePrice,
            price: (parseFloat(i.basePrice) + (i.modifiers || []).reduce((s: number, m: any) => s + (m.priceAdjustment || 0), 0)).toFixed(2),
            depositAmount: i.depositAmount ?? 0,
            note: i.note ?? '',
            modifiers: (i.modifiers || []).map(m => ({
              groupId: m.groupId, groupName: m.groupName,
              modifierId: m.modifierId, name: m.name,
              priceAdjustment: m.priceAdjustment,
            })),
          })),
          restaurantSlug: restaurantSlug || undefined,
          orderType,
          deliveryAddress: orderType === 'delivery' ? `${form.street}, ${form.postcode} ${form.city}` : undefined,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          notes: cartNotes || form.notes || undefined,
          tip,
          voucherCode: voucherCode || undefined,
          scheduledFor: deliveryTime.kind === 'scheduled' ? deliveryTime.isoTime : undefined,
          total: grandTotal.toFixed(2),
          paymentMethod: form.payment,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || 'Bestelling mislukt');

      if (data.checkoutUrl) {
        clearCart();
        pendingRedirect.current = () => { window.location.href = data.checkoutUrl; };
      } else {
        clearCart();
        pendingRedirect.current = () => { router.push(`/order-success?order=${data.orderNumber || ''}`); };
      }
      setShowSuccess(true);
      setTimeout(() => { pendingRedirect.current(); }, 1200);
    } catch (e: any) {
      setError(e.message || 'Bestelling mislukt. Probeer opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authChecked && !isLoggedIn) {
    return (
      <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Outfit', system-ui, sans-serif" }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '44px 36px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 10 }}>Log in om te bestellen</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            Je moet ingelogd zijn om een bestelling te plaatsen.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/login?next=/checkout" style={{ padding: '14px 22px', borderRadius: 14, background: ORANGE, color: '#fff', fontSize: 15, fontWeight: 800, textDecoration: 'none', textAlign: 'center' }}>Inloggen</Link>
            <Link href="/signup?next=/checkout" style={{ padding: '14px 22px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>Account aanmaken</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-page, #0A0A0F)', minHeight: '100vh', color: 'var(--text-primary, #fff)', fontFamily: "'Outfit', system-ui, sans-serif", paddingBottom: 120 }}>
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,10,15,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontSize: 64 }}>✅</div>
            <p style={{ fontSize: 18, fontWeight: 800 }}>Bestelling geplaatst!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))' }}>
        <button onClick={() => router.back()} aria-label="Terug" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}>‹</button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Afrekenen</h1>
        <div style={{ width: 38 }} />
      </div>

      {/* Section 1: Bestelgegevens */}
      <Section title="Bestelgegevens">
        <Row icon="👤" onClick={() => { /* edit name+phone inline below */ }}>
          <FieldStack label={form.name || 'Naam'} sub={form.phone || 'Telefoonnummer'} />
        </Row>
        <InlineFields form={form} set={set} />
        {orderType === 'delivery' && (
          <Row icon="📍">
            <FieldStack label={form.street || 'Straat en huisnummer'} sub={[form.postcode, form.city].filter(Boolean).join(', ') || 'Postcode, stad'} />
          </Row>
        )}
        <Row>
          <input
            placeholder={orderType === 'delivery' ? 'Voeg opmerkingen over de bezorging toe' : 'Opmerkingen voor het restaurant'}
            value={cartNotes}
            onChange={(e) => setCartNotes(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
          />
        </Row>
        <Row icon="🕐" onClick={() => router.push('/checkout/delivery-time')}>
          <FieldStack label={deliveryTimeLabel} />
          <span style={{ opacity: 0.5 }}>›</span>
        </Row>
      </Section>

      {/* Section 2: Vouchers */}
      <Section title="Vouchers en kortingen">
        {voucherCode ? (
          <Row>
            <span style={{ flex: 1, fontWeight: 700 }}>Voucher: {voucherCode}</span>
            <button onClick={() => setVoucherCode(null)} style={{ background: 'transparent', border: 'none', color: ORANGE, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Verwijder</button>
          </Row>
        ) : voucherInputOpen ? (
          <Row>
            <input
              autoFocus
              value={voucherDraft}
              onChange={(e) => setVoucherDraft(e.target.value.toUpperCase())}
              placeholder="Voucher code"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            />
            <button onClick={() => { if (voucherDraft.trim()) { setVoucherCode(voucherDraft.trim()); setVoucherInputOpen(false); setVoucherDraft(''); } }} style={{ background: ORANGE, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Toepassen</button>
          </Row>
        ) : (
          <Row icon="🎟️" accent onClick={() => setVoucherInputOpen(true)}>
            <FieldStack label="Voucherkorting toevoegen" />
            <span style={{ opacity: 0.6 }}>+</span>
          </Row>
        )}
      </Section>

      {/* Section 3: Tip */}
      <Section title={<span>Je bezorger een fooi geven? <span style={{ color: ORANGE, opacity: 0.8, fontSize: 12 }}>ⓘ</span></span>} subtitle="Het hoeft niet, maar een fooi kan je bezorger heel blij maken">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[1, 2, 3].map(v => (
            <TipPill key={v} selected={!tipCustom && tip === v} onClick={() => { setTipCustom(false); setTip(v); }}>€ {v},00</TipPill>
          ))}
          <TipPill selected={tipCustom} onClick={() => setTipCustom(true)}>Overig</TipPill>
        </div>
        {tipCustom && (
          <div style={{ marginTop: 12 }}>
            <input
              type="number"
              min={0}
              step={0.5}
              value={tip || ''}
              onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
              placeholder="Fooi bedrag in €"
              style={{ width: '100%', background: 'var(--bg-card, rgba(255,255,255,0.04))', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
        )}
      </Section>

      {/* Section 4: Payment */}
      <Section title="Hoe wil je betalen?">
        <button
          onClick={() => {/* future: open payment method picker */}}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--bg-card, rgba(255,255,255,0.04))', border: '1px solid var(--border, rgba(255,255,255,0.08))', borderRadius: 14, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <span style={{ width: 40, height: 28, borderRadius: 6, background: 'linear-gradient(90deg, #FF385C 0%, #FF9E00 25%, #00C16E 50%, #0079FF 75%, #B23CFF 100%)', flexShrink: 0 }} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>iDEAL</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted, rgba(255,255,255,0.4))' }}>Betaal via je bank</div>
          </div>
          <span style={{ opacity: 0.5 }}>›</span>
        </button>
      </Section>

      {/* Section 5: Bestelsamenvatting */}
      <Section title="Bestelsamenvatting">
        <button
          onClick={() => setSummaryOpen(true)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-card, rgba(255,255,255,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
            🍽️
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>{restaurantName || 'Restaurant'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted, rgba(255,255,255,0.4))' }}>{itemCount()} item{itemCount() !== 1 ? 's' : ''}</div>
          </div>
          <span style={{ opacity: 0.5 }}>›</span>
        </button>
      </Section>

      {/* Pricing */}
      <div style={{ padding: '8px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PriceRow label="Subtotaal" value={fmt(subtotal)} />
        {orderType === 'delivery' && <PriceRow label="Bezorgkosten" value={deliveryFee > 0 ? fmt(deliveryFee) : 'Gratis'} />}
        <PriceRow label={serviceFeeLabel} value={fmt(serviceFee)} info />
        {statiegeld > 0 && <PriceRow label="Statiegeld" value={fmt(statiegeld)} />}
        {tip > 0 && <PriceRow label="Fooi" value={fmt(tip)} />}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 800 }}>Totaal</span>
          <span style={{ fontSize: 16, fontWeight: 800 }}>{fmt(grandTotal)}</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ margin: '0 20px 12px', padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, color: '#fc8181', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Legal footer */}
      <p style={{ padding: '4px 20px 24px', fontSize: 11, color: 'var(--text-muted, rgba(255,255,255,0.3))', lineHeight: 1.6, textAlign: 'center' }}>
        Door te bestellen ga je akkoord met onze <Link href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>voorwaarden</Link>.
      </p>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg-page, #0A0A0F)', borderTop: '1px solid var(--border, rgba(255,255,255,0.06))', padding: '14px 20px 22px', zIndex: 50 }}>
        <button
          onClick={handleOrder}
          disabled={submitting || items.length === 0}
          style={{ width: '100%', padding: '16px 20px', background: submitting || items.length === 0 ? 'rgba(255,255,255,0.12)' : ORANGE, color: '#fff', border: 'none', borderRadius: 999, fontSize: 16, fontWeight: 800, cursor: submitting || items.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: submitting || items.length === 0 ? 'none' : '0 6px 18px rgba(255,107,53,0.28)' }}
        >
          {submitting ? 'Bestelling plaatsen…' : 'Bestel en betaal'}
        </button>
      </div>

      {/* Order summary bottom sheet */}
      <AnimatePresence>
        {summaryOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSummaryOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{ position: 'fixed', left: 0, right: 0, bottom: 0, background: 'var(--bg-page, #0A0A0F)', borderTopLeftRadius: 22, borderTopRightRadius: 22, zIndex: 201, paddingBottom: 28, maxHeight: '80vh', overflowY: 'auto' }}
            >
              <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'center' }}>
                <span style={{ width: 42, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.25)' }} />
              </div>
              <div style={{ padding: '0 20px 12px', fontSize: 20, fontWeight: 800 }}>Je items van</div>
              <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-card, rgba(255,255,255,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>🍽️</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{restaurantName || 'Restaurant'}</div>
                </div>
              </div>
              <div style={{ padding: '0 20px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                {items.map(item => {
                  const modExtra = (item.modifiers || []).reduce((s, m) => s + (m.priceAdjustment || 0), 0);
                  const linePrice = (parseFloat(item.basePrice) + modExtra) * item.qty;
                  return (
                    <div key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{item.qty} {item.name}</div>
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div style={{ fontSize: 12, color: 'var(--text-muted, rgba(255,255,255,0.45))', marginTop: 2 }}>
                              {item.modifiers.map(m => m.name).join(', ')}
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{fmt(linePrice)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── sub-components ─── */

function Section({ title, subtitle, children }: { title: React.ReactNode; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))' }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: subtitle ? 4 : 12 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--text-muted, rgba(255,255,255,0.5))', marginBottom: 14 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function Row({ icon, children, onClick, accent }: { icon?: string; children: React.ReactNode; onClick?: () => void; accent?: boolean }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', cursor: onClick ? 'pointer' : 'default', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      {icon && (
        <span style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: accent ? ORANGE : 'transparent', color: accent ? '#fff' : ORANGE, fontSize: 15 }}>
          {icon}
        </span>
      )}
      {children}
    </div>
  );
}

function FieldStack({ label, sub }: { label: string; sub?: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted, rgba(255,255,255,0.4))', marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function InlineFields({ form, set }: { form: CheckoutDetails; set: (k: any, v: string) => void }) {
  return (
    <div style={{ display: 'grid', gap: 8, padding: '6px 0' }}>
      <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Naam" style={inputStyle} />
      <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Telefoonnummer" type="tel" style={inputStyle} />
      <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="E-mail" type="email" style={inputStyle} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input value={form.street} onChange={(e) => set('street', e.target.value)} placeholder="Straat + huisnr." style={inputStyle} />
        <input value={form.postcode} onChange={(e) => set('postcode', e.target.value)} placeholder="Postcode" style={inputStyle} />
      </div>
      <input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Stad" style={inputStyle} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-card, rgba(255,255,255,0.04))',
  border: '1px solid var(--border, rgba(255,255,255,0.08))',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
};

function TipPill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 22px',
        borderRadius: 999,
        border: selected ? `1.5px solid ${ORANGE}` : '1px solid var(--border-strong, rgba(255,255,255,0.18))',
        background: selected ? 'rgba(255,107,53,0.12)' : 'transparent',
        color: '#fff',
        fontWeight: 700,
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

function PriceRow({ label, value, info }: { label: string; value: string; info?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary, rgba(255,255,255,0.75))' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {label}
        {info && <span style={{ opacity: 0.4, fontSize: 12 }}>ⓘ</span>}
      </span>
      <span style={{ fontWeight: 700, color: '#fff' }}>{value}</span>
    </div>
  );
}
