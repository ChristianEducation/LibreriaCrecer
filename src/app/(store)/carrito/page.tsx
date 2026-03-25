"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cx } from "class-variance-authority";

import { useCart, useCartSummary } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";
import { Button, Input } from "@/shared/ui";
import { formatCLP } from "@/shared/utils/formatters";

function CrossMark({ className }: { className?: string }) {
  return (
    <span className={cx("relative block", className)}>
      <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-[1px] bg-current" />
      <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-[1px] bg-current" />
    </span>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CartSkeleton() {
  return (
    <main className="min-h-[60vh] bg-beige px-5 py-12 md:px-10 lg:px-14 lg:py-16">
      <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="h-80 animate-pulse rounded-[2px] bg-white/60" />
        <div className="h-72 animate-pulse rounded-[2px] bg-white/60" />
      </div>
    </main>
  );
}

export default function CarritoPage() {
  const hydrated = useCartHydration();
  const {
    items,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    couponCode,
    couponDiscount,
  } = useCart();
  const { subtotal, total, isEmpty } = useCartSummary();
  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    setCouponInput(couponCode ?? "");
  }, [couponCode]);

  const itemCountLabel = useMemo(() => {
    const count = items.length;
    return `${count} ${count === 1 ? "titulo" : "titulos"}`;
  }, [items.length]);

  async function handleApplyCoupon() {
    const normalizedCode = couponInput.trim();

    if (!normalizedCode) {
      removeCoupon();
      setCouponError(null);
      setCouponFeedback(null);
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);
    setCouponFeedback(null);

    try {
      const response = await fetch("/api/cupones/validar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: normalizedCode,
          subtotal,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            data?: {
              valid?: boolean;
              discount?: number;
              couponCode?: string;
              error?: string | null;
            };
            message?: string;
          }
        | null;

      if (!response.ok) {
        setCouponError(payload?.message ?? "No se pudo validar el cupon.");
        return;
      }

      if (!payload?.data?.valid) {
        setCouponError(payload?.data?.error ?? "El cupon no es valido para este pedido.");
        return;
      }

      applyCoupon(payload.data.couponCode ?? normalizedCode.toUpperCase(), payload.data.discount ?? 0);
      setCouponFeedback(`Cupon aplicado: -${formatCLP(payload.data.discount ?? 0)}`);
    } catch {
      setCouponError("No se pudo validar el cupon.");
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  if (!hydrated) {
    return <CartSkeleton />;
  }

  return (
    <main className="min-h-[60vh] bg-beige px-5 py-12 md:px-10 lg:px-14 lg:py-16">
      <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-[28px] text-moss">Tu carrito</h1>
              <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-text-light">
                {itemCountLabel}
              </p>
            </div>
          </div>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <CrossMark className="mb-6 h-12 w-12 text-moss/15" />
              <h2 className="font-serif text-[28px] text-moss">Tu carrito esta vacio</h2>
              <Button as="a" className="mt-6" href="/productos" variant="ghost">
                Explorar coleccion →
              </Button>
            </div>
          ) : (
            <div className="border-t border-border/60">
              {items.map((item) => (
                <article
                  className="flex items-center gap-4 border-b border-border py-5 md:gap-5"
                  key={item.productId}
                >
                  <div className="relative aspect-[2/3] w-[72px] overflow-hidden rounded-[2px] bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))]">
                    {item.imageUrl ? (
                      <Image
                        alt={item.title}
                        className="object-cover"
                        fill
                        sizes="72px"
                        src={item.imageUrl}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-moss/20">
                        <BookIcon className="size-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-base font-medium text-text">{item.title}</h2>
                    <p className="mt-1 text-xs text-text-light">{item.author ?? "Crecer Libreria"}</p>
                    {item.sku ? (
                      <p className="mt-1 text-[10px] uppercase tracking-[0.06em] text-text-light">
                        Codigo {item.sku}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        className="flex size-6 items-center justify-center rounded-[1px] border border-border text-sm text-text-mid transition-colors hover:border-moss hover:bg-moss hover:text-white"
                        onClick={() => decrementQuantity(item.productId)}
                        type="button"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-sm text-text-mid">{item.quantity}</span>
                      <button
                        className="flex size-6 items-center justify-center rounded-[1px] border border-border text-sm text-text-mid transition-colors hover:border-moss hover:bg-moss hover:text-white"
                        onClick={() => incrementQuantity(item.productId)}
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <div className="min-w-[90px] text-right font-serif text-lg font-medium text-moss">
                      {formatCLP(item.price * item.quantity)}
                    </div>

                    <button
                      aria-label={`Eliminar ${item.title}`}
                      className="text-text-light transition-colors hover:text-error"
                      onClick={() => removeItem(item.productId)}
                      type="button"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="sticky top-20 rounded-[2px] border border-border bg-white p-5 lg:p-6">
          <h2 className="mb-5 font-serif text-lg text-moss">Resumen del pedido</h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-text-light">Subtotal</span>
              <span className="text-sm text-text-mid">{formatCLP(subtotal)}</span>
            </div>

            {couponDiscount > 0 ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-gold">Descuento</span>
                <span className="text-sm text-gold">-{formatCLP(couponDiscount)}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-text-light">Envio</span>
              <span className="text-xs text-text-light">Calculado al checkout</span>
            </div>
          </div>

          <div className="my-4 h-px w-full bg-border" />

          <div className="flex items-end justify-between gap-4">
            <span className="font-serif text-base text-moss">Total</span>
            <span className="font-serif text-[28px] font-medium text-moss">{formatCLP(total)}</span>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-start gap-2">
              <Input
                onChange={(event) => setCouponInput(event.target.value)}
                placeholder="Codigo de cupon"
                value={couponInput}
                wrapperClassName="flex-1"
              />
              <Button
                className="min-h-[42px] shrink-0 px-4"
                disabled={isEmpty}
                loading={isApplyingCoupon}
                onClick={handleApplyCoupon}
                size="sm"
                variant="outline"
              >
                Aplicar
              </Button>
            </div>

            {couponFeedback ? <p className="text-[11px] text-gold">{couponFeedback}</p> : null}
            {couponError ? <p className="text-[11px] text-error">{couponError}</p> : null}
          </div>

          <Button
            as="a"
            className="mt-6 w-full justify-center"
            disabled={isEmpty}
            href="/checkout"
            variant="moss"
          >
            Ir al checkout
          </Button>

          <p className="mt-3 text-center text-[10px] text-text-light">Compra segura · SSL</p>
          {!isEmpty ? (
            <p className="mt-2 text-center text-[10px] text-text-light">
              {items.length} {items.length === 1 ? "producto seleccionado" : "productos seleccionados"}
            </p>
          ) : null}

          <div className="mt-5 border-t border-border pt-4">
            <Link className="text-[11px] uppercase tracking-[0.08em] text-moss hover:text-moss-mid" href="/productos">
              Seguir comprando
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

