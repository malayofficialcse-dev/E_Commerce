import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Product ID
  variantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  stock?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId: string) => void;
  updateQuantity: (id: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        // Ensure price is a number, handling string inputs like "$100" or "100"
        let safePrice = newItem.price;
        if (typeof newItem.price === 'string') {
           safePrice = parseFloat(String(newItem.price).replace(/[^0-9.]/g, '')) || 0;
           console.log("Sanitized price:", newItem.price, "to", safePrice);
        }
        
        const itemToAdd = { ...newItem, price: safePrice };

        const existingItem = get().items.find(
          (item) => item.id === newItem.id && item.variantId === newItem.variantId
        );

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.id === newItem.id && item.variantId === newItem.variantId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          set({ items: [...get().items, itemToAdd] });
        }
      },
      removeItem: (id, variantId) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.variantId === variantId)
          ),
        });
      },
      updateQuantity: (id, variantId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === id && item.variantId === variantId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
