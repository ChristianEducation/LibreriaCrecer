"use client";

import Link from "next/link";

import { useCartSummary } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";

function ShoppingBagIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <line stroke="white" strokeLinecap="round" strokeWidth="1.5" x1="3" x2="21" y1="6" y2="6" />
      <path
        d="M16 10a4 4 0 01-8 0"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function FloatingCartButton() {
  const hydrated = useCartHydration();
  const { totalItems } = useCartSummary();

  if (!hydrated || totalItems <= 0) {
    return null;
  }

  return (
    <Link
      aria-label={`Ver carrito (${totalItems} ${totalItems === 1 ? "producto" : "productos"})`}
      className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-gold shadow-[0_0_6px_rgba(0,0,0,0.18),_0_8px_12px_rgba(0,0,0,0.12)] transition-all duration-200 hover:scale-105 hover:bg-gold-light active:scale-[0.95]"
      href="/carrito"
      style={{
        opacity: totalItems > 0 ? 1 : 0,
        transform: totalItems > 0 ? "translateY(0)" : "translateY(1rem)",
      }}
    >
      <ShoppingBagIcon />
      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-moss text-[10px] font-semibold text-white">
        {totalItems}
      </span>
    </Link>
  );
}
