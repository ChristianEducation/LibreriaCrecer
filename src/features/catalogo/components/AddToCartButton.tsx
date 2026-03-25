"use client";

import { useEffect, useState } from "react";
import { cx } from "class-variance-authority";

import { useCart } from "@/features/carrito/hooks";

export interface AddToCartButtonProps {
  product: {
    id: string;
    slug: string;
    title: string;
    author: string | null;
    price: number;
    salePrice?: number | null;
    mainImageUrl?: string | null;
    sku?: string | null;
    stockQuantity: number;
    inStock: boolean;
  };
}

function CartIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M3.75 5.25h1.7c.39 0 .73.27.82.65l1.48 6.35c.09.38.43.65.82.65h7.82c.39 0 .73-.26.82-.63l1.35-5.41H7.06"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="9.75" cy="18.25" r="1.25" fill="currentColor" />
      <circle cx="17.25" cy="18.25" r="1.25" fill="currentColor" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" className="size-[17px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" className="size-[17px]" fill="none" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg aria-hidden="true" className="size-[15px]" fill="none" viewBox="0 0 24 24">
      <rect
        height="13"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        width="15"
        x="1"
        y="3"
      />
      <path d="M16 8h4l3 5v3h-7V8Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="size-[15px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="size-[15px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function clampQuantity(value: number, max: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(Math.max(Math.trunc(value), 1), Math.max(max, 1));
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, updateQuantity } = useCart();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const maxStock = Math.max(product.stockQuantity, 1);
  const isDisabled = !product.inStock || product.stockQuantity <= 0;

  useEffect(() => {
    if (!isAdded) {
      return;
    }

    const timeoutId = window.setTimeout(() => setIsAdded(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [isAdded]);

  function handleSetQuantity(nextValue: number) {
    setQty(clampQuantity(nextValue, maxStock));
  }

  async function handleShare() {
    const targetUrl = `${window.location.origin}/productos/${product.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.author ?? product.title,
          url: targetUrl,
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(targetUrl);
    } catch {
      // Ignore clipboard failures because this action is purely auxiliary.
    }
  }

  function handleAddToCart() {
    if (isDisabled) {
      return;
    }

    const effectivePrice = product.salePrice ?? product.price;

    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      author: product.author,
      price: effectivePrice,
      originalPrice: product.salePrice ? product.price : null,
      imageUrl: product.mainImageUrl ?? null,
      sku: product.sku ?? null,
    });

    if (qty > 1) {
      updateQuantity(product.id, qty);
    }

    setIsAdded(true);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-[2px] border border-border">
          <button
            className="flex h-12 w-9 items-center justify-center bg-beige-warm text-base text-text-mid transition-colors hover:bg-beige-mid hover:text-moss"
            disabled={isDisabled}
            onClick={() => handleSetQuantity(qty - 1)}
            type="button"
          >
            −
          </button>
          <input
            className="h-12 w-11 border-x border-border bg-white text-center text-sm font-medium text-text outline-none [appearance:textfield]"
            disabled={isDisabled}
            inputMode="numeric"
            max={product.stockQuantity}
            min={1}
            onChange={(event) => handleSetQuantity(Number(event.target.value))}
            type="number"
            value={qty}
          />
          <button
            className="flex h-12 w-9 items-center justify-center bg-beige-warm text-base text-text-mid transition-colors hover:bg-beige-mid hover:text-moss"
            disabled={isDisabled}
            onClick={() => handleSetQuantity(qty + 1)}
            type="button"
          >
            +
          </button>
        </div>

        <button
          className={cx(
            "flex h-12 flex-1 items-center justify-center gap-2.5 rounded-[2px] bg-moss px-5 text-[12px] font-medium uppercase tracking-[0.1em] text-white transition-all duration-200",
            isDisabled ? "cursor-not-allowed opacity-50" : "hover:-translate-y-px hover:bg-moss-mid",
            isAdded ? "bg-moss-mid hover:bg-moss-mid" : "",
          )}
          disabled={isDisabled}
          onClick={handleAddToCart}
          type="button"
        >
          <CartIcon />
          <span>{isAdded ? "✓ Agregado" : "Anadir al carrito"}</span>
        </button>

        <button
          aria-label="Guardar en favoritos"
          className="flex size-12 items-center justify-center rounded-[2px] border border-border bg-transparent text-text-light transition-colors hover:border-moss hover:text-moss"
          type="button"
        >
          <HeartIcon />
        </button>

        <button
          aria-label="Compartir producto"
          className="flex size-12 items-center justify-center rounded-[2px] border border-border bg-transparent text-text-light transition-colors hover:border-moss hover:text-moss"
          onClick={() => void handleShare()}
          type="button"
        >
          <ShareIcon />
        </button>
      </div>

      <div className="flex flex-wrap gap-5 border-t border-border pt-5">
        <div className="flex items-center gap-[7px] text-[11px] text-text-light">
          <span className="text-gold">
            <TruckIcon />
          </span>
          <span>Envio a todo Chile</span>
        </div>
        <div className="flex items-center gap-[7px] text-[11px] text-text-light">
          <span className="text-gold">
            <ShieldIcon />
          </span>
          <span>Compra segura</span>
        </div>
        <div className="flex items-center gap-[7px] text-[11px] text-text-light">
          <span className="text-gold">
            <LocationIcon />
          </span>
          <span>Retiro en tienda · Antofagasta</span>
        </div>
      </div>
    </div>
  );
}
