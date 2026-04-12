/**
 * Service fee calculator — Thuisbezorgd-style flat-capped model.
 * Mirrors the authoritative server-side calculation in VelociPizza.
 *
 * Rules:
 *  - Fee = 2.5% of subtotal, capped at a per-currency maximum.
 *  - Menu prices are treated as tax-inclusive (no separate BTW line shown).
 *  - Statiegeld (EU beverage deposit) is passed through when present on items.
 */

export const SERVICE_FEE_PERCENT = 2.5;

export const SERVICE_FEE_CAP: Record<string, number> = {
  EUR: 1.99,
  GBP: 1.70,
  USD: 2.20,
  DKK: 15,
  SEK: 22,
  NOK: 22,
  CHF: 1.90,
  TRY: 70,
  GHS: 2.00,
  NGN: 2000,
  XOF: 1200,
  XAF: 1200,
  ZAR: 40,
  KES: 250,
};

export function calculateServiceFee(subtotal: number, currencyCode: string = 'EUR'): number {
  const raw = subtotal * (SERVICE_FEE_PERCENT / 100);
  const cap = SERVICE_FEE_CAP[currencyCode.toUpperCase()] ?? 2.0;
  return Math.round(Math.min(raw, cap) * 100) / 100;
}

/**
 * Sum statiegeld across cart items. Items without a depositAmount contribute 0.
 * The shape is loose so this works even before the menu API exposes the field.
 */
export function calculateStatiegeld(
  items: Array<{ depositAmount?: number | string | null; qty?: number }>
): number {
  const total = items.reduce((sum, it) => {
    const raw = typeof it.depositAmount === 'string' ? parseFloat(it.depositAmount) : it.depositAmount;
    const deposit = Number.isFinite(raw as number) ? (raw as number) : 0;
    const qty = it.qty ?? 1;
    return sum + deposit * qty;
  }, 0);
  return Math.round(total * 100) / 100;
}
