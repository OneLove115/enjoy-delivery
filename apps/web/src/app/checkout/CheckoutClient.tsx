'use client';
import { useState, useEffect, useRef, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { analytics, type EcomItem } from '@/lib/analytics';
import { calculateServiceFee, calculateStatiegeld, SERVICE_FEE_CAP, SERVICE_FEE_PERCENT } from '@/lib/service-fee';
import { Check, Loader2, ChevronDown, ChevronUp, ArrowLeft, Tag, Clock, Bike } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'enjoy-checkout-details';
const ORANGE = '#FF6B35';
const PURPLE = '#5A31F4';

// Spring preset used throughout — honoured by useReducedMotion guard
const SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const;
// Shake keyframes for field errors
const SHAKE = { x: [-6, 6, -4, 4, 0] };

// ─── Types ───────────────────────────────────────────────────────────────────
interface CheckoutDetails {
  street: string; postcode: string; city: string;
  name: string; phone: string; email: string;
  notes: string; payment: string;
}

const EMPTY: CheckoutDetails = {
  street: '', postcode: '', city: '',
  name: '', phone: '', email: '', notes: '',
  payment: 'ideal',
};

type FieldErrors = Partial<Record<keyof CheckoutDetails, string>>;

// ─── Main component ───────────────────────────────────────────────────────────
export default function CheckoutClient() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const {
    items, restaurantName, restaurantSlug, total, itemCount, clearCart,
    currency, locale,
    orderType, deliveryTime, setDeliveryTime,
    tip, setTip,
    voucherCode, setVoucherCode,
    notes: cartNotes, setNotes: setCartNotes,
  } = useCartStore();

  const [form, setForm] = useState<CheckoutDetails>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [shakeField, setShakeField] = useState<keyof CheckoutDetails | null>(null);
  const [tipCustom, setTipCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [globalError, setGlobalError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [voucherInputOpen, setVoucherInputOpen] = useState(false);
  const [voucherDraft, setVoucherDraft] = useState('');
  const pendingRedirect = useRef<() => void>(() => {});
  // Idempotency key — generated once on mount and re-used across retries so
  // double-clicks / network retries don't create a second order on the VP
  // backend. Lazy init via useRef callback keeps the value stable for the
  // lifetime of the component.
  const idempotencyKeyRef = useRef<string>('');
  if (!idempotencyKeyRef.current) {
    idempotencyKeyRef.current =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  // Auth check
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { setIsLoggedIn(r.ok); setAuthChecked(true); })
      .catch(() => { setIsLoggedIn(false); setAuthChecked(true); });
  }, []);

  // Restore saved form
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CheckoutDetails>;
        setForm(prev => ({ ...prev, ...parsed }));
      }
    } catch {}
    setCartHydrated(true);
  }, []);

  // Derived totals
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

  const deliveryTimeLabel = (() => {
    if (deliveryTime.kind === 'asap')
      return orderType === 'pickup' ? 'Zo snel mogelijk afhalen' : 'Zo snel mogelijk bezorgen';
    try {
      const d = new Date(deliveryTime.isoTime);
      return `Om ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch { return 'Zo snel mogelijk bezorgen'; }
  })();

  // ─── Field update with persistence ─────────────────────────────────────────
  const set = (key: keyof CheckoutDetails, val: string) => {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    // Clear error on change
    if (fieldErrors[key]) setFieldErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (orderType === 'delivery') {
      if (!form.street.trim())   errs.street   = 'Vul je adres in';
      if (!form.postcode.trim()) errs.postcode = 'Vul je postcode in';
      if (!form.city.trim())     errs.city     = 'Vul je stad in';
    }
    // Always required — for guests these are the only identity fields;
    // for logged-in users they default from session if blank (see handleOrder).
    if (!form.name.trim())  errs.name  = 'Vul je naam in';
    if (!form.phone.trim()) errs.phone = 'Vul je telefoonnummer in';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Vul een geldig e-mailadres in';
    return errs;
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleOrder = async () => {
    if (items.length === 0) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      // Shake the first errored field
      const firstKey = Object.keys(errs)[0] as keyof CheckoutDetails;
      setShakeField(firstKey);
      setTimeout(() => setShakeField(null), 600);
      return;
    }

    setFieldErrors({});
    setGlobalError('');
    setSubmitting(true);
    setSubmitState('loading');

    const ecomItems: EcomItem[] = items.map(i => {
      const modTotal = (i.modifiers || []).reduce((s: number, m: any) => s + (m.priceAdjustment || 0), 0);
      return { item_id: i.id, item_name: i.name, price: parseFloat(i.basePrice) + modTotal, quantity: i.qty, affiliation: restaurantName };
    });
    analytics.beginCheckout(ecomItems, grandTotal, currency || 'EUR');

    try {
      const res = await fetch('/api/consumer/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Re-used across retries — prevents duplicate order creation if the
          // user double-clicks or the network retries the POST.
          'Idempotency-Key': idempotencyKeyRef.current,
        },
        body: JSON.stringify({
          items: items.map(i => ({
            menuItemId: i.id,
            quantity: i.qty,
            modifiers: (i.modifiers || [])
              .map((m: any) => m.modifierId)
              .filter((id: unknown): id is string => typeof id === 'string'),
          })),
          restaurantSlug: restaurantSlug || undefined,
          orderType,
          deliveryAddress: orderType === 'delivery' ? {
            street: form.street,
            zip: form.postcode,
            city: form.city,
          } : undefined,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          notes: cartNotes || form.notes || undefined,
          tip,
          voucherCode: voucherCode || undefined,
          scheduledFor: deliveryTime.kind === 'scheduled' ? deliveryTime.isoTime : undefined,
          paymentMethod: form.payment,
          // NOTE: `total`, `consumerId`, `tenantId`, `discountAmount` are
          // intentionally NOT sent — VP computes them server-side. The proxy
          // schema rejects these fields via Zod `.strict()` to block mass-assignment.
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || 'Bestelling mislukt');

      setSubmitState('success');
      clearCart();
      if (data.checkoutUrl) {
        pendingRedirect.current = () => { window.location.href = data.checkoutUrl; };
      } else {
        pendingRedirect.current = () => { router.push(`/order-success?order=${data.orderNumber || ''}`); };
      }
      setTimeout(() => { pendingRedirect.current(); }, 1400);
    } catch (e: any) {
      setGlobalError(e.message || 'Bestelling mislukt. Probeer opnieuw.');
      setSubmitState('idle');
    } finally {
      setSubmitting(false);
    }
  };

  // Motion variants — reduced motion collapses translate to opacity-only fades
  const slideUp = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

  const sheetVariants = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } };

  return (
    <div style={{
      background: 'var(--bg-page, #0A0A0F)',
      minHeight: '100dvh',
      color: 'var(--text-primary, #fff)',
      fontFamily: "'Outfit', system-ui, sans-serif",
      // Bottom padding accounts for sticky bar + iOS home indicator
      paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
    }}>

      {/* ── Success overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {submitState === 'success' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,10,15,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.1 }}
              style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${ORANGE}, #ff9548)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Check size={36} strokeWidth={3} color="#fff" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ fontSize: 20, fontWeight: 800 }}
            >
              Bestelling geplaatst!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))', position: 'sticky', top: 0, background: 'var(--bg-page, #0A0A0F)', zIndex: 40 }}>
        <motion.button
          onClick={() => router.back()}
          aria-label="Terug"
          whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
          style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} />
        </motion.button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Afrekenen</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* ── Optional sign-in CTA (guest only, unobtrusive) ─────────────── */}
      {authChecked && !isLoggedIn && (
        <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Inloggen om je bestelling op te slaan</span>
          <Link href="/login?next=/checkout" style={{ fontSize: 13, fontWeight: 700, color: ORANGE, textDecoration: 'none', flexShrink: 0 }}>Inloggen</Link>
        </div>
      )}

      {/* ── Order summary collapsible (mobile top / desktop right panel) ─ */}
      <div style={{ padding: '0 20px' }}>
        <motion.div
          layout
          style={{ margin: '16px 0', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}
        >
          <button
            onClick={() => setSummaryOpen(v => !v)}
            aria-expanded={summaryOpen}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>🍽️</div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              {!cartHydrated ? (
                <>
                  <div style={{ height: 14, width: 140, borderRadius: 6, background: 'rgba(255,255,255,0.08)', marginBottom: 6 }} />
                  <div style={{ height: 11, width: 80, borderRadius: 6, background: 'rgba(255,255,255,0.05)' }} />
                </>
              ) : (
                <>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{restaurantName || 'Restaurant'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted, rgba(255,255,255,0.4))' }}>{itemCount()} item{itemCount() !== 1 ? 's' : ''} · {fmt(grandTotal)}</div>
                </>
              )}
            </div>
            {summaryOpen ? <ChevronUp size={16} style={{ opacity: 0.5 }} /> : <ChevronDown size={16} style={{ opacity: 0.5 }} />}
          </button>

          <AnimatePresence initial={false}>
            {summaryOpen && (
              <motion.div
                key="summary-body"
                initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={shouldReduceMotion ? { duration: 0.15 } : { ...SPRING, mass: 0.8 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', padding: '0 16px' }}>
                  {items.map(item => {
                    const modExtra = (item.modifiers || []).reduce((s, m) => s + (m.priceAdjustment || 0), 0);
                    const linePrice = (parseFloat(item.basePrice) + modExtra) * item.qty;
                    return (
                      <div key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{item.qty}× {item.name}</div>
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div style={{ fontSize: 12, color: 'var(--text-muted, rgba(255,255,255,0.45))', marginTop: 2 }}>
                              {item.modifiers.map(m => m.name).join(', ')}
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{fmt(linePrice)}</span>
                      </div>
                    );
                  })}
                  {/* Price breakdown inside summary */}
                  <div style={{ paddingTop: 12, paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <PriceRow label="Subtotaal" value={fmt(subtotal)} />
                    {orderType === 'delivery' && <PriceRow label="Bezorgkosten" value={deliveryFee > 0 ? fmt(deliveryFee) : 'Gratis'} />}
                    <PriceRow label={serviceFeeLabel} value={fmt(serviceFee)} info />
                    {statiegeld > 0 && <PriceRow label="Statiegeld" value={fmt(statiegeld)} />}
                    {tip > 0 && <PriceRow label="Fooi" value={fmt(tip)} />}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: 15, fontWeight: 800 }}>Totaal</span>
                      <span style={{ fontSize: 15, fontWeight: 800 }}>{fmt(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Section 1: Contact ───────────────────────────────────────────── */}
      <Section title="Contactgegevens" icon={<span style={{ fontSize: 18 }}>👤</span>}>
        <div style={{ display: 'grid', gap: 10 }}>
          <Field
            id="field-name" label="Naam"
            value={form.name} onChange={v => set('name', v)}
            placeholder="Je volledige naam"
            autoComplete="name"
            error={fieldErrors.name}
            shake={shakeField === 'name'}
            shouldReduceMotion={!!shouldReduceMotion}
          />
          <Field
            id="field-phone" label="Telefoonnummer"
            value={form.phone} onChange={v => set('phone', v)}
            placeholder="+31 6 12345678"
            type="tel" autoComplete="tel"
            error={fieldErrors.phone}
            shake={shakeField === 'phone'}
            shouldReduceMotion={!!shouldReduceMotion}
          />
          <Field
            id="field-email" label="E-mailadres"
            value={form.email} onChange={v => set('email', v)}
            placeholder="naam@example.com"
            type="email" autoComplete="email"
            error={fieldErrors.email}
            shake={shakeField === 'email'}
            shouldReduceMotion={!!shouldReduceMotion}
          />
        </div>
      </Section>

      {/* ── Section 2: Address (delivery only) ──────────────────────────── */}
      <AnimatePresence initial={false}>
        {orderType === 'delivery' && (
          <motion.div
            key="address-section"
            {...slideUp}
            transition={SPRING}
          >
            <Section title="Bezorgadres" icon={<span style={{ fontSize: 18 }}>📍</span>}>
              <div style={{ display: 'grid', gap: 10 }}>
                <Field
                  id="field-street" label="Straat en huisnummer"
                  value={form.street} onChange={v => set('street', v)}
                  placeholder="Hoofdstraat 42"
                  autoComplete="shipping street-address"
                  error={fieldErrors.street}
                  shake={shakeField === 'street'}
                  shouldReduceMotion={!!shouldReduceMotion}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Field
                    id="field-postcode" label="Postcode"
                    value={form.postcode} onChange={v => set('postcode', v)}
                    placeholder="1234 AB"
                    inputMode="numeric"
                    autoComplete="shipping postal-code"
                    error={fieldErrors.postcode}
                    shake={shakeField === 'postcode'}
                    shouldReduceMotion={!!shouldReduceMotion}
                  />
                  <Field
                    id="field-city" label="Stad"
                    value={form.city} onChange={v => set('city', v)}
                    placeholder="Amsterdam"
                    autoComplete="shipping address-level2"
                    error={fieldErrors.city}
                    shake={shakeField === 'city'}
                    shouldReduceMotion={!!shouldReduceMotion}
                  />
                </div>
              </div>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Section 3: Delivery time ─────────────────────────────────────── */}
      <Section title="Bezorgtijd" icon={<Clock size={18} color={ORANGE} />}>
        <motion.button
          onClick={() => router.push('/checkout/delivery-time')}
          whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
        >
          <Bike size={20} color={ORANGE} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{deliveryTimeLabel}</div>
          </div>
          <span style={{ opacity: 0.4, fontSize: 18 }}>›</span>
        </motion.button>
      </Section>

      {/* ── Section 4: Notes ────────────────────────────────────────────── */}
      <Section title="Opmerkingen">
        <label htmlFor="field-notes" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
          {orderType === 'delivery' ? 'Bezorgnotitie' : 'Opmerking voor het restaurant'}
        </label>
        <FocusInput
          id="field-notes"
          as="textarea"
          value={cartNotes}
          onChange={(v) => setCartNotes(v)}
          placeholder={orderType === 'delivery' ? 'Bel aan bij de voordeur...' : 'Geen ui graag...'}
          rows={3}
          shouldReduceMotion={!!shouldReduceMotion}
        />
      </Section>

      {/* ── Section 5: Voucher ──────────────────────────────────────────── */}
      <Section title="Vouchers en kortingen" icon={<Tag size={18} color={ORANGE} />}>
        {voucherCode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 14 }}>
            <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>Voucher: {voucherCode}</span>
            <button onClick={() => setVoucherCode(null)} style={{ background: 'transparent', border: 'none', color: ORANGE, fontSize: 13, fontWeight: 700, cursor: 'pointer', minHeight: 44, minWidth: 44 }}>Verwijder</button>
          </div>
        ) : voucherInputOpen ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <FocusInput
              id="field-voucher"
              value={voucherDraft}
              onChange={(v) => setVoucherDraft(v.toUpperCase())}
              placeholder="Voucher code"
              autoFocus
              shouldReduceMotion={!!shouldReduceMotion}
              style={{ flex: 1 }}
            />
            <motion.button
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              onClick={() => { if (voucherDraft.trim()) { setVoucherCode(voucherDraft.trim()); setVoucherInputOpen(false); setVoucherDraft(''); } }}
              style={{ background: ORANGE, color: '#fff', border: 'none', padding: '0 18px', borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', minHeight: 44 }}
            >
              Toepassen
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={() => setVoucherInputOpen(true)}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 14, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, minHeight: 44 }}
          >
            <Tag size={16} color={ORANGE} />
            <span>Voucherkorting toevoegen</span>
          </motion.button>
        )}
      </Section>

      {/* ── Section 6: Tip ──────────────────────────────────────────────── */}
      <Section
        title="Fooi voor je bezorger"
        subtitle="Het hoeft niet, maar een fooi kan je bezorger heel blij maken"
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[1, 2, 3].map(v => (
            <TipPill key={v} selected={!tipCustom && tip === v} onClick={() => { setTipCustom(false); setTip(v); }} shouldReduceMotion={!!shouldReduceMotion}>
              € {v},00
            </TipPill>
          ))}
          <TipPill selected={tipCustom} onClick={() => setTipCustom(true)} shouldReduceMotion={!!shouldReduceMotion}>
            Overig
          </TipPill>
        </div>
        <AnimatePresence>
          {tipCustom && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={SPRING}
              style={{ marginTop: 12, overflow: 'hidden' }}
            >
              <FocusInput
                id="field-tip"
                type="number"
                inputMode="decimal"
                value={String(tip || '')}
                onChange={(v) => setTip(parseFloat(v) || 0)}
                placeholder="Fooi bedrag in €"
                shouldReduceMotion={!!shouldReduceMotion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* ── Section 7: Payment ──────────────────────────────────────────── */}
      <Section title="Betaalmethode">
        <motion.button
          whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', minHeight: 44 }}
        >
          <span style={{ width: 40, height: 26, borderRadius: 5, background: 'linear-gradient(90deg, #FF385C 0%, #FF9E00 25%, #00C16E 50%, #0079FF 75%, #B23CFF 100%)', flexShrink: 0 }} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>iDEAL</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted, rgba(255,255,255,0.4))' }}>Betaal via je bank</div>
          </div>
          <span style={{ opacity: 0.4 }}>›</span>
        </motion.button>
      </Section>

      {/* ── Global error ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            role="alert"
            style={{ margin: '0 20px 12px', padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, color: '#fc8181', fontSize: 13, fontWeight: 600 }}
          >
            {globalError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Legal footer ────────────────────────────────────────────────── */}
      <p style={{ padding: '4px 20px 24px', fontSize: 11, color: 'var(--text-muted, rgba(255,255,255,0.3))', lineHeight: 1.6, textAlign: 'center' }}>
        Door te bestellen ga je akkoord met onze <Link href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>voorwaarden</Link>.
      </p>

      {/* ── Sticky bottom CTA bar ────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg-page, #0A0A0F)',
        borderTop: '1px solid var(--border, rgba(255,255,255,0.06))',
        // Safe area for iOS home indicator
        paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
        paddingTop: 14, paddingLeft: 20, paddingRight: 20,
        zIndex: 50,
      }}>
        <motion.button
          onClick={handleOrder}
          disabled={submitting || items.length === 0}
          whileTap={shouldReduceMotion || submitting || items.length === 0 ? {} : { scale: 0.97 }}
          style={{
            width: '100%',
            padding: '16px 20px',
            background: submitting || items.length === 0 ? 'rgba(255,255,255,0.12)' : ORANGE,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontSize: 16,
            fontWeight: 800,
            cursor: submitting || items.length === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: submitting || items.length === 0 ? 'none' : '0 6px 18px rgba(255,107,53,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            minHeight: 52,
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {submitState === 'loading' ? (
              <motion.span key="loading" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} style={{ display: 'flex' }}>
                  <Loader2 size={20} />
                </motion.span>
                Bestelling plaatsen…
              </motion.span>
            ) : submitState === 'success' ? (
              <motion.span key="success" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={20} strokeWidth={3} />
                Geplaatst!
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {fmt(grandTotal)} · Bestel en betaal
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, subtitle, icon, children }: {
  title: React.ReactNode; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: subtitle ? 4 : 14 }}>
        {icon}
        <h2 style={{ fontSize: 17, fontWeight: 800 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--text-muted, rgba(255,255,255,0.5))', marginBottom: 14 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

// ─── Field with focus glow, error state, shake animation ────────────────────
function Field({
  id, label, value, onChange, error, shake, shouldReduceMotion, type = 'text',
  placeholder, autoComplete, inputMode, autoFocus,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; shake?: boolean; shouldReduceMotion: boolean;
  type?: string; placeholder?: string; autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; autoFocus?: boolean;
}) {
  const errorId = `${id}-error`;
  return (
    <motion.div
      animate={shake && !shouldReduceMotion ? SHAKE : { x: 0 }}
      transition={shake ? { type: 'spring', stiffness: 400, damping: 20 } : {}}
    >
      <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: error ? '#fc8181' : 'rgba(255,255,255,0.5)', marginBottom: 5 }}>
        {label}
      </label>
      <FocusInput
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        autoFocus={autoFocus}
        hasError={!!error}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        shouldReduceMotion={shouldReduceMotion}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ color: '#fc8181', fontSize: 12, fontWeight: 600, marginTop: 4, overflow: 'hidden' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── FocusInput — input/textarea with animated focus glow ────────────────────
function FocusInput({
  id, as, value, onChange, hasError, shouldReduceMotion, style: extraStyle, rows,
  'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedby,
  ...rest
}: {
  id?: string; as?: 'textarea'; value: string; onChange: (v: string) => void;
  hasError?: boolean; shouldReduceMotion: boolean; style?: React.CSSProperties;
  rows?: number; 'aria-invalid'?: 'true' | 'false'; 'aria-describedby'?: string;
  [key: string]: any;
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = hasError
    ? 'rgba(239,68,68,0.6)'
    : focused
    ? `${ORANGE}80`
    : 'rgba(255,255,255,0.08)';

  const boxShadow = focused && !shouldReduceMotion
    ? hasError
      ? '0 0 0 3px rgba(239,68,68,0.15)'
      : `0 0 0 3px rgba(255,107,53,0.12)`
    : 'none';

  const sharedStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${borderColor}`,
    borderRadius: 12,
    padding: '12px 14px',
    color: '#fff',
    fontSize: 16, // prevents iOS zoom
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow,
    ...extraStyle,
  };

  if (as === 'textarea') {
    return (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={rows ?? 3}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        style={{ ...sharedStyle, resize: 'vertical', minHeight: 80 }}
        {...rest}
      />
    );
  }

  return (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
      style={sharedStyle}
      {...rest}
    />
  );
}

// ─── TipPill ─────────────────────────────────────────────────────────────────
function TipPill({ selected, onClick, children, shouldReduceMotion }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; shouldReduceMotion: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={shouldReduceMotion ? {} : { scale: 0.93 }}
      style={{
        padding: '10px 22px',
        borderRadius: 999,
        border: selected ? `1.5px solid ${ORANGE}` : '1px solid rgba(255,255,255,0.18)',
        background: selected ? 'rgba(255,107,53,0.12)' : 'transparent',
        color: '#fff',
        fontWeight: 700,
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: 'inherit',
        minHeight: 44,
        minWidth: 44,
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── PriceRow ─────────────────────────────────────────────────────────────────
function PriceRow({ label, value, info }: { label: string; value: string; info?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        {label}
        {info && <span style={{ opacity: 0.4, fontSize: 11 }}>ⓘ</span>}
      </span>
      <span style={{ fontWeight: 700, color: '#fff' }}>{value}</span>
    </div>
  );
}
