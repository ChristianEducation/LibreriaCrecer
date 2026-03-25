"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem, CartItemInput } from "./types";

type CartStoreState = {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
};

type CartStoreActions = {
  addItem: (item: CartItemInput) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
};

type CartStoreGetters = {
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  isCartEmpty: () => boolean;
  getItemByProductId: (productId: string) => CartItem | undefined;
};

export type CartStore = CartStoreState & CartStoreActions & CartStoreGetters;

const initialState: CartStoreState = {
  items: [],
  couponCode: null,
  couponDiscount: 0,
};

const sumLineItems = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

const toValidMoneyInteger = (amount: number) => Math.max(0, Math.trunc(amount));

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((storedItem) => storedItem.productId === item.productId);

          if (existingItem) {
            return {
              items: state.items.map((storedItem) =>
                storedItem.productId === item.productId
                  ? { ...storedItem, quantity: storedItem.quantity + 1 }
                  : storedItem,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const normalizedQuantity = Math.trunc(quantity);

          if (normalizedQuantity <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity: normalizedQuantity } : item,
            ),
          };
        }),
      incrementQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        })),
      decrementQuantity: (productId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set(initialState),
      applyCoupon: (code, discount) =>
        set({
          couponCode: code.trim() || null,
          couponDiscount: toValidMoneyInteger(discount),
        }),
      removeCoupon: () =>
        set({
          couponCode: null,
          couponDiscount: 0,
        }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotal: () => sumLineItems(get().items),
      getTotal: () => {
        const subtotal = sumLineItems(get().items);
        const discount = toValidMoneyInteger(get().couponDiscount);
        return Math.max(0, subtotal - discount);
      },
      getItemCount: () => get().items.length,
      isCartEmpty: () => get().items.length === 0,
      getItemByProductId: (productId) =>
        get().items.find((item) => item.productId === productId),
    }),
    {
      name: "crecer-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    },
  ),
);
