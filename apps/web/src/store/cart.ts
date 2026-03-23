import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  basePrice: string;
  imageUrl: string | null;
  qty: number;
};

type CartStore = {
  restaurantSlug: string | null;
  restaurantName: string;
  items: CartItem[];
  addItem: (restaurantSlug: string, restaurantName: string, item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      restaurantSlug: null,
      restaurantName: '',
      items: [],

      addItem: (restaurantSlug, restaurantName, item) => {
        const { restaurantSlug: current } = get();
        if (current && current !== restaurantSlug) {
          set({ restaurantSlug, restaurantName, items: [{ ...item, qty: 1 }] });
          return;
        }
        set(state => {
          const existing = state.items.find(i => i.id === item.id);
          if (existing) {
            return {
              restaurantSlug,
              restaurantName,
              items: state.items.map(i =>
                i.id === item.id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return {
            restaurantSlug,
            restaurantName,
            items: [...state.items, { ...item, qty: 1 }],
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
        get().items.reduce((sum, i) => sum + parseFloat(i.basePrice) * i.qty, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'enjoy-cart' }
  )
);
