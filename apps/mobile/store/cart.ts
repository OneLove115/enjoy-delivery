import { create } from 'zustand';

export type CartItem = {
  id: string;
  name: string;
  basePrice: string;
  imageUrl: string | null;
  qty: number;
};

type CartStore = {
  restaurantId: string | null;
  restaurantName: string;
  items: CartItem[];
  addItem: (restaurantId: string, restaurantName: string, item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  restaurantId: null,
  restaurantName: '',
  items: [],

  addItem: (restaurantId, restaurantName, item) => {
    const { restaurantId: current } = get();
    if (current && current !== restaurantId) {
      set({ restaurantId, restaurantName, items: [{ ...item, qty: 1 }] });
      return;
    }
    set(state => {
      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        return {
          restaurantId,
          restaurantName,
          items: state.items.map(i =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return {
        restaurantId,
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

  clearCart: () => set({ restaurantId: null, restaurantName: '', items: [] }),

  total: () =>
    get().items.reduce((sum, i) => sum + parseFloat(i.basePrice) * i.qty, 0),

  itemCount: () =>
    get().items.reduce((sum, i) => sum + i.qty, 0),
}));
