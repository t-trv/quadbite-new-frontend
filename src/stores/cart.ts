import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  variant?: {
    id: string;
    name: string;
    price_adjust: number;
  };
  preparation_time?: number;
  short_description?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any, variant?: any) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant) => {
        const currentItems = get().items;
        // Search by both ID and variant ID to allow multiple variants of the same product
        const existingItem = currentItems.find(
          (item) => item.id === Number(product.id) && item.variant?.id === variant?.id
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === Number(product.id) && item.variant?.id === variant?.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: Number(product.id),
                name: product.name,
                price: Number(product.price),
                image_url: product.image_url,
                quantity: 1,
                variant: variant ? {
                  ...variant,
                  price_adjust: Number(variant.price_adjust)
                } : undefined,
                preparation_time: product.preparation_time,
                short_description: product.short_description
              },
            ],
          });
        }
      },
      removeItem: (id) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === id);

        if (existingItem && existingItem.quantity > 1) {
          set({
            items: currentItems.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            ),
          });
        } else {
          set({
            items: currentItems.filter((item) => item.id !== id),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      totalPrice: () => {
        return get().items.reduce(
          (total, item) => {
            const itemBasePrice = Number(item.price);
            const variantPriceAdjust = Number(item.variant?.price_adjust || 0);
            return total + (itemBasePrice + variantPriceAdjust) * item.quantity;
          },
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
