"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { cx } from "class-variance-authority";

import { useCart, useCartSummary } from "@/features/carrito/hooks";
import { formatCLP } from "@/shared/utils/formatters";

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.75 4.75A2.75 2.75 0 0 1 9.5 2h8.75v17.25H9.5a2.75 2.75 0 0 0-2.75 2.75V4.75Zm0 0A2.75 2.75 0 0 0 4 7.5v12.75h5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { items, incrementQuantity, decrementQuantity, removeItem } = useCart();
  const { total, totalItems, isEmpty } = useCartSummary();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const itemLabel = useMemo(() => {
    if (isEmpty) {
      return "Vacio";
    }

    return `${totalItems} ${totalItems === 1 ? "producto" : "productos"}`;
  }, [isEmpty, totalItems]);

  return (
    <div
      aria-hidden={!isOpen}
      className={cx(
        "fixed right-6 top-[72px] z-[200] w-80 translate-y-[-8px] rounded border border-border bg-beige/95 opacity-0 shadow-[0_20px_48px_rgba(58,48,1,0.14)] backdrop-blur-xl transition-all duration-200 ease-out",
        isOpen ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible",
      )}
      ref={panelRef}
    >
      <div className="border-b border-border px-[18px] pb-[14px] pt-4">
        <h3 className="font-serif text-base font-medium text-moss">Mi carrito</h3>
        <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-text-light">{itemLabel}</p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center px-[18px] py-10 text-center">
          <BookIcon className="mb-3 size-8 text-moss opacity-15" />
          <p className="text-[13px] text-text-light">Tu carrito esta vacio</p>
        </div>
      ) : (
        <div className="max-h-[260px] overflow-y-auto">
          {items.map((item) => (
            <div
              className="flex items-center gap-3 px-[18px] py-[10px] transition-colors hover:bg-beige-warm"
              key={item.productId}
            >
              <div className="relative w-[34px] shrink-0 overflow-hidden rounded-[1px] bg-[linear-gradient(145deg,var(--beige-warm),var(--beige-mid))] aspect-[2/3]">
                {item.imageUrl ? (
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover"
                    src={item.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookIcon className="size-4 text-moss opacity-20" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-[13px] font-medium text-text">{item.title}</p>
                <p className="mt-px truncate text-[11px] text-text-light">{item.author ?? "Crecer Libreria"}</p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <p className="text-[13px] font-medium text-gold">{formatCLP(item.price * item.quantity)}</p>
                <div className="flex items-center gap-1">
                  <button
                    className="flex size-[18px] items-center justify-center rounded-[1px] border border-border text-[11px] text-text-mid transition-colors hover:border-moss hover:bg-moss hover:text-white"
                    onClick={() => decrementQuantity(item.productId)}
                    type="button"
                  >
                    -
                  </button>
                  <span className="min-w-4 text-center text-[11px] text-text-light">{item.quantity}</span>
                  <button
                    className="flex size-[18px] items-center justify-center rounded-[1px] border border-border text-[11px] text-text-mid transition-colors hover:border-moss hover:bg-moss hover:text-white"
                    onClick={() => incrementQuantity(item.productId)}
                    type="button"
                  >
                    +
                  </button>
                  <button
                    className="ml-1 text-[11px] text-text-light transition-colors hover:text-error"
                    onClick={() => removeItem(item.productId)}
                    type="button"
                  >
                    x
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border px-[18px] pb-4 pt-[14px]">
        <div className="mb-4 flex items-end justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-light">Total</span>
          <span className="font-serif text-[20px] font-medium text-moss">{formatCLP(total)}</span>
        </div>

        <Link
          aria-disabled={isEmpty}
          className={cx(
            "block w-full rounded border border-transparent bg-moss px-4 py-3 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-all duration-200",
            isEmpty
              ? "pointer-events-none cursor-not-allowed opacity-40"
              : "hover:-translate-y-px hover:bg-moss-mid",
          )}
          href="/checkout"
          onClick={() => {
            if (!isEmpty) {
              onClose();
            }
          }}
        >
          Ir al checkout
        </Link>
      </div>
    </div>
  );
}
