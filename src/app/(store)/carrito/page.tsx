"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

import { useCart, useCartSummary } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";
import { formatCLP } from "@/shared/utils/formatters";

function BookIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden="true" className={className} style={style} fill="none" viewBox="0 0 24 24">
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


function CartSkeleton() {
  return (
    <main style={{ minHeight: "60vh", background: "var(--color-beige)" }}>
      <div className="page-px" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "48px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              height: "320px",
              borderRadius: "2px",
              background: "rgba(255,255,255,0.6)",
              animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          />
          <div
            style={{
              height: "288px",
              borderRadius: "2px",
              background: "rgba(255,255,255,0.6)",
              animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          />
        </div>
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
    <main style={{ minHeight: "60vh", background: "var(--color-beige)" }}>
      <div className="page-px" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px,3vw,38px)",
            fontWeight: 400,
            color: "var(--color-moss)",
            marginBottom: "32px",
          }}
        >
          Mi carrito
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "48px",
            alignItems: "start",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* Left: items + coupon */}
          <section>
            {isEmpty ? (
              /* Empty state */
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <BookIcon
                  style={{
                    width: 40,
                    height: 40,
                    opacity: 0.1,
                    color: "var(--color-moss)",
                    margin: "0 auto 16px",
                    display: "block",
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "22px",
                    color: "var(--color-moss)",
                    marginBottom: "8px",
                  }}
                >
                  Tu carrito está vacío
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--color-text-light)",
                    marginBottom: "24px",
                  }}
                >
                  Explora nuestra colección y encuentra algo especial
                </p>
                <Link
                  href="/productos"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 24px",
                    background: "var(--color-moss)",
                    color: "white",
                    borderRadius: "2px",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Ver colección →
                </Link>
              </div>
            ) : (
              /* Item list */
              <div style={{ borderTop: "1px solid var(--color-border)" }}>
                {items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      paddingBottom: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      {/* Image */}
                      <div
                        style={{
                          width: "72px",
                          flexShrink: 0,
                          aspectRatio: "2/3",
                          background:
                            "linear-gradient(145deg, var(--color-beige-warm), var(--color-beige-mid))",
                          borderRadius: "2px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="72px"
                          />
                        ) : (
                          <BookIcon
                            style={{
                              width: 20,
                              height: 20,
                              opacity: 0.15,
                              color: "var(--color-moss)",
                            }}
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link href={`/productos/${item.slug}`} style={{ textDecoration: "none" }}>
                          <p
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "16px",
                              fontWeight: 500,
                              color: "var(--color-moss)",
                              lineHeight: 1.3,
                              marginBottom: "4px",
                            }}
                          >
                            {item.title}
                          </p>
                        </Link>
                        {item.author && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-light)",
                              marginBottom: "12px",
                            }}
                          >
                            {item.author}
                          </p>
                        )}

                        {/* Quantity controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid var(--color-border)",
                              borderRadius: "2px",
                              overflow: "hidden",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => decrementQuantity(item.productId)}
                              style={{
                                width: "32px",
                                height: "36px",
                                background: "var(--color-beige)",
                                border: "none",
                                fontSize: "16px",
                                color: "var(--color-moss)",
                                cursor: "pointer",
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderLeft: "1px solid var(--color-border)",
                                borderRight: "1px solid var(--color-border)",
                                fontSize: "14px",
                                fontWeight: 500,
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => incrementQuantity(item.productId)}
                              style={{
                                width: "32px",
                                height: "36px",
                                background: "var(--color-beige)",
                                border: "none",
                                fontSize: "16px",
                                color: "var(--color-moss)",
                                cursor: "pointer",
                              }}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            style={{
                              fontSize: "11px",
                              color: "var(--color-text-light)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div style={{ flexShrink: 0, textAlign: "right" }}>
                        <p
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "18px",
                            fontWeight: 500,
                            color: "var(--color-moss)",
                          }}
                        >
                          {formatCLP(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p
                            style={{
                              fontSize: "11px",
                              color: "var(--color-text-light)",
                              marginTop: "2px",
                            }}
                          >
                            {formatCLP(item.price)} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coupon field — always rendered below items/empty state */}
            <div
              style={{
                marginTop: "8px",
                paddingTop: "24px",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--color-text-light)",
                  marginBottom: "8px",
                }}
              >
                Código de descuento
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="CRECER10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    fontSize: "13px",
                    background: "var(--color-white)",
                    outline: "none",
                    fontFamily: "var(--font-sans)",
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                  style={{
                    padding: "10px 20px",
                    background: "var(--color-moss)",
                    color: "white",
                    border: "none",
                    borderRadius: "2px",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: isApplyingCoupon ? "not-allowed" : "pointer",
                    opacity: isApplyingCoupon ? 0.6 : 1,
                  }}
                >
                  {isApplyingCoupon ? "..." : "Aplicar"}
                </button>
              </div>
              {couponError && (
                <p style={{ fontSize: "11px", color: "#C0392B", marginTop: "6px" }}>
                  {couponError}
                </p>
              )}
              {couponFeedback && (
                <p style={{ fontSize: "11px", color: "var(--color-gold)", marginTop: "6px" }}>
                  {couponFeedback}
                </p>
              )}
            </div>
          </section>

          {/* Right: summary */}
          <aside
            style={{
              background: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
              position: "sticky",
              top: "80px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "18px",
                  fontWeight: 400,
                  color: "var(--color-moss)",
                }}
              >
                Resumen
              </span>
            </div>

            {/* Totals */}
            <div style={{ padding: "16px 24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "12px", color: "var(--color-text-light)" }}>Subtotal</span>
                <span style={{ fontSize: "13px", color: "var(--color-text)" }}>
                  {formatCLP(subtotal)}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "var(--color-gold)" }}>Descuento</span>
                  <span style={{ fontSize: "13px", color: "var(--color-gold)" }}>
                    -{formatCLP(couponDiscount)}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "12px", color: "var(--color-text-light)" }}>Envío</span>
                <span style={{ fontSize: "12px", color: "var(--color-text-light)" }}>
                  Se calcula al checkout
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--color-border)",
                  marginTop: "12px",
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-moss)" }}>
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "var(--color-moss)",
                  }}
                >
                  {formatCLP(total)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div
              style={{ padding: "16px 24px", borderTop: "1px solid var(--color-border)" }}
            >
              <Link
                href="/checkout"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "var(--color-moss)",
                  color: "white",
                  border: "none",
                  borderRadius: "2px",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  textDecoration: "none",
                  opacity: isEmpty ? 0.4 : 1,
                  pointerEvents: isEmpty ? "none" : "auto",
                }}
              >
                Ir al checkout
              </Link>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "10px",
                  color: "var(--color-text-light)",
                  marginTop: "12px",
                  letterSpacing: "0.04em",
                }}
              >
                Compra 100% segura · SSL
              </div>
              <div
                style={{
                  marginTop: "16px",
                  borderTop: "1px solid var(--color-border)",
                  paddingTop: "14px",
                }}
              >
                <Link
                  href="/productos"
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--color-moss)",
                    textDecoration: "none",
                  }}
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
