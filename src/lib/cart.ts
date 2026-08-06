import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  restoreItems: (items: CartItem[]) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item: CartItem) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item: CartItem) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
          items: [
            ...currentItems,
            {
              id: product.id,
              name: product.name,
              description: product.description ?? "",
              price: product.price,
              image_url: product.image_url,
              quantity: 1,
            },
          ],
          });
        }
      },
      removeItem: (id: string) => {
        set({
          items: get().items.filter((item: CartItem) => item.id !== id),
        });
      },
      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item: CartItem) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      restoreItems: (items: CartItem[]) => set({ items }),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
