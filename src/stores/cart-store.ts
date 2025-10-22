import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, productsService } from "@/services/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productSku: string) => void;
  updateQuantity: (productSku: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getUniqueItemsCount: () => number;
  getTotalPrice: () => number;
  getTotalOriginalPrice: () => number;
  getTotalDiscount: () => number;
  getTotalDiscountPercent: () => number;
  getItemQuantity: (productSku: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.sku === product.sku
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.sku === product.sku
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      removeItem: (productSku) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.sku !== productSku),
        }));
      },

      updateQuantity: (productSku, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productSku);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.sku === productSku ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getUniqueItemsCount: () => {
        return get().items.length;
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => {
            const { price } = productsService.getDisplayPrice(item.product);
            return total + price * item.quantity;
          },
          0
        );
      },

      getTotalOriginalPrice: () => {
        return get().items.reduce(
          (total, item) => {
            const { originalPrice, price } = productsService.getDisplayPrice(item.product);
            return total + (originalPrice || price) * item.quantity;
          },
          0
        );
      },

      getTotalDiscount: () => {
        return get().getTotalOriginalPrice() - get().getTotalPrice();
      },

      getTotalDiscountPercent: () => {
        const originalPrice = get().getTotalOriginalPrice();
        const discount = get().getTotalDiscount();
        return originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;
      },

      getItemQuantity: (productSku) => {
        const item = get().items.find((item) => item.product.sku === productSku);
        return item?.quantity || 0;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        // Fallback для SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

