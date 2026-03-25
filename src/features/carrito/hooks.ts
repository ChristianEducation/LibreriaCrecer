"use client";

import { useCartStore } from "./store";
import type { CartSummary } from "./types";

const SHIPPING_DEFAULT_CLP = 0;

export function useCart() {
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const couponDiscount = useCartStore((state) => state.couponDiscount);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  return {
    items,
    couponCode,
    couponDiscount,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  };
}

export function useCartSummary(): CartSummary & { itemCount: number; isEmpty: boolean } {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const subtotal = useCartStore((state) => state.getSubtotal());
  const total = useCartStore((state) => state.getTotal());
  const itemCount = useCartStore((state) => state.getItemCount());
  const isEmpty = useCartStore((state) => state.isCartEmpty());
  const couponDiscount = useCartStore((state) => state.couponDiscount);

  return {
    totalItems,
    subtotal,
    discount: couponDiscount,
    shippingCost: SHIPPING_DEFAULT_CLP,
    total,
    itemCount,
    isEmpty,
  };
}

export function useCartItem(productId: string) {
  return useCartStore((state) => state.getItemByProductId(productId));
}
