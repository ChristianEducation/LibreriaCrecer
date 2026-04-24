"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";

import { useCart, useCartSummary } from "@/features/carrito/hooks";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
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

function CartEmptyIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
      style={{ width: "32px", height: "32px", color: "var(--moss)", opacity: 0.15 }}
      viewBox="0 0 24 24"
    >
      <path
        d="M3.75 5.25h1.7c.39 0 .73.27.82.65l1.48 6.35c.09.38.43.65.82.65h7.82c.39 0 .73-.26.82-.63l1.35-5.41H7.06"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="9.75" cy="18.25" fill="currentColor" r="1.25" />
      <circle cx="17.25" cy="18.25" fill="currentColor" r="1.25" />
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
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const itemLabel = useMemo(() => {
    if (isEmpty) return "Vacío";
    return `${totalItems} ${totalItems === 1 ? "producto" : "productos"}`;
  }, [isEmpty, totalItems]);

  return (
    <div
      aria-hidden={!isOpen}
      ref={panelRef}
      style={{
        position: "fixed",
        zIndex: 200,
        top: "80px",
        right: isMobile ? 0 : "24px",
        left: isMobile ? 0 : "auto",
        width: isMobile ? "100vw" : "340px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        boxShadow: "0 20px 48px rgba(58,48,1,0.14)",
        background: "rgba(245,243,232,0.97)",
        backdropFilter: "blur(20px)",
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-8px)",
        visibility: isOpen ? "visible" : "hidden",
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.2s ease-out, transform 0.2s ease-out, visibility 0.2s ease-out",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          Mi carrito
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--gold)",
          }}
        >
          {itemLabel}
        </p>
      </div>

      {/* Body */}
      {isEmpty ? (
        <div
          style={{
            height: "182px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <CartEmptyIcon />
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--text-light)" }}>
            Tu carrito está vacío
          </p>
        </div>
      ) : (
        <div style={{ height: "182px", overflowY: "auto" }}>
          {items.map((item) => (
            <div
              key={item.productId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 24px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  position: "relative",
                  width: "36px",
                  aspectRatio: "2/3",
                  flexShrink: 0,
                  overflow: "hidden",
                  borderRadius: "2px",
                  background: "linear-gradient(145deg, var(--beige-warm), var(--beige-mid))",
                }}
              >
                {item.imageUrl ? (
                  <img
                    alt={item.title}
                    src={item.imageUrl}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                    <BookIcon className="size-4 text-moss opacity-20" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text)",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "12px",
                    color: "var(--text-light)",
                    marginTop: "2px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.author ?? "Crecer Libreria"}
                </p>
              </div>

              {/* Price + controls */}
              <div style={{ display: "flex", flexShrink: 0, flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--gold-light)",
                  }}
                >
                  {formatCLP(item.price * item.quantity)}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button
                    onClick={() => decrementQuantity(item.productId)}
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--text)",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>
                  <span
                    style={{
                      minWidth: "20px",
                      textAlign: "center",
                      fontFamily: "var(--font-inter)",
                      fontSize: "13px",
                      color: "var(--text)",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementQuantity(item.productId)}
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--text)",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    type="button"
                    style={{
                      marginLeft: "4px",
                      fontFamily: "var(--font-inter)",
                      fontSize: "11px",
                      color: "var(--text-light)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "16px 24px 20px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "16px" }}>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-light)",
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            {formatCLP(total)}
          </span>
        </div>

        <Link
          aria-disabled={isEmpty}
          href="/checkout"
          onClick={() => { if (!isEmpty) onClose(); }}
          style={{
            display: "block",
            width: "100%",
            paddingTop: "14px",
            paddingBottom: "14px",
            borderRadius: "var(--radius-xl)",
            background: isEmpty ? "var(--border)" : "var(--gold)",
            color: "white",
            fontFamily: "var(--font-inter)",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textAlign: "center",
            textDecoration: "none",
            pointerEvents: isEmpty ? "none" : "auto",
            opacity: isEmpty ? 0.5 : 1,
            transition: "background 0.2s, opacity 0.2s",
          }}
        >
          Ir al checkout
        </Link>
      </div>
    </div>
  );
}
