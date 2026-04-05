import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItemModifier = {
  groupId: string;
  groupName: string;
  modifierId: string;
  name: string;
  priceAdjustment: number;
};

export type CartItem = {
  id: string;
  name: string;
  basePrice: string;
  imageUrl: string | null;
  qty: number;
  modifiers?: CartItemModifier[];
};

type CartStore = {
  restaurantSlug: string | null;
  restaurantName: string;
  currency: string;
  locale: string;
  items: CartItem[];
  addItem: (restaurantSlug: string, restaurantName: string, item: Omit<CartItem, 'qty'>, currency?: string, locale?: string) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
};

function calcItemPrice(item: CartItem): number {
  const base = parseFloat(item.basePrice);
  const modExtra = (item.modifiers || []).reduce((s, m) => s + m.priceAdjustment, 0);
  return (base + modExtra) * item.qty;
}

/** Generate a unique cart-line key: itemId + sorted modifier IDs */
function cartLineKey(item: Omit<CartItem, 'qty'>): string {
  const modKey = (item.modifiers || [])
    .map(m => m.modifierId)
    .sort()
    .join(',');
  return modKey ? `${item.id}::${modKey}` : item.id;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      restaurantSlug: null,
      restaurantName: '',
      currency: 'EUR',
      locale: 'nl-NL',
      items: [],

      addItem: (restaurantSlug, restaurantName, item, currency, locale) => {
        const { restaurantSlug: current } = get();
        const lineKey = cartLineKey(item);

        if (current && current !== restaurantSlug) {
          set({ restaurantSlug, restaurantName, currency: currency || 'EUR', locale: locale || 'nl-NL', items: [{ ...item, id: lineKey, qty: 1 }] });
          return;
        }
        set(state => {
          const existing = state.items.find(i => i.id === lineKey);
          if (existing) {
            return {
              restaurantSlug,
              restaurantName,
              items: state.items.map(i =>
                i.id === lineKey ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return {
            restaurantSlug,
            restaurantName,
            items: [...state.items, { ...item, id: lineKey, qty: 1 }],
          };
        });
      },

      removeItem: (id) =>
        set(state => ({ items: state.items.filter(i => i.id !== id) })),

      updateQty: (id, qty) =>
        set(state => ({
          items: qty <= 0
            ? state.items.filter(i => i.id !== id)
            : state.items.map(i => (i.id === id ? { ...i, qty } : i)),
        })),

      clearCart: () =>
        set({ restaurantSlug: null, restaurantName: '', items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + calcItemPrice(i), 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'enjoy-cart' }
  )
);
