"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { BrandLoader } from "@/shared/ui/BrandLoader";

import { useCart } from "@/features/carrito/hooks";

type OrderStatus = "paid" | "pending" | "cancelled";

type OrderItemData = {
  productId: string | null;
  productTitle: string;
  unitPrice: number;
  quantity: number;
  sku: string | null;
  slug: string | null;
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 28px",
  background: "var(--color-moss)",
  color: "white",
  textDecoration: "none",
  borderRadius: "2px",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  transition: "background 0.22s",
};

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const rawStatus = searchParams.get("status") ?? "pending";
  const initialStatus: OrderStatus =
    rawStatus === "paid" || rawStatus === "cancelled" ? rawStatus : "pending";

  const router = useRouter();
  const { addItem, updateQuantity } = useCart();

  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [timedOut, setTimedOut] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);
  const MAX_ATTEMPTS = 10;

  const [retryLoading, setRetryLoading] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  async function handleRetry() {
    if (!orderNumber || retryLoading) return;
    setRetryLoading(true);
    setRetryError(null);

    try {
      const res = await fetch(`/api/ordenes/${orderNumber}`);
      const data = (await res.json().catch(() => null)) as
        | { data?: { items?: OrderItemData[] } }
        | null;

      if (!res.ok || !data?.data?.items) {
        setRetryError("No se pudieron cargar los productos del pedido.");
        return;
      }

      const validItems = data.data.items.filter(
        (item): item is OrderItemData & { productId: string; slug: string | null } => item.productId !== null,
      );

      if (validItems.length === 0) {
        setRetryError("Los productos de este pedido ya no están disponibles.");
        return;
      }

      for (const item of validItems) {
        addItem({
          productId: item.productId,
          title: item.productTitle,
          slug: item.slug ?? "",
          author: null,
          price: item.unitPrice,
          originalPrice: null,
          imageUrl: null,
          sku: item.sku,
        });
        if (item.quantity > 1) {
          updateQuantity(item.productId, item.quantity);
        }
      }

      router.push("/checkout");
    } catch {
      setRetryError("Ocurrió un error al cargar el pedido. Intenta nuevamente.");
    } finally {
      setRetryLoading(false);
    }
  }

  useEffect(() => {
    if (initialStatus !== "pending" || !orderNumber) return;

    intervalRef.current = setInterval(async () => {
      attemptsRef.current += 1;

      if (attemptsRef.current > MAX_ATTEMPTS) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimedOut(true);
        return;
      }

      try {
        const res = await fetch(`/api/ordenes/${orderNumber}`);
        if (!res.ok) return;
        const data = (await res.json()) as { data?: { status?: string } };
        const newStatus = data.data?.status;

        if (newStatus === "paid" || newStatus === "cancelled") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setStatus(newStatus as OrderStatus);
        }
      } catch {
        // ignorar, reintentar en próximo tick
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initialStatus, orderNumber]);

  // Durante el polling mostramos BrandLoader a pantalla completa
  if (status === "pending" && !timedOut) {
    return <BrandLoader />;
  }

  return (
    <main
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        background: "var(--color-beige)",
      }}
    >
      <div style={{ maxWidth: "560px", width: "100%", textAlign: "center" }}>
        {status === "paid" && (
          <>
            {/* Cruz dorada */}
            <div style={{ width: "60px", height: "60px", position: "relative", margin: "0 auto 28px" }}>
              <div style={{ position: "absolute", width: "2px", height: "100%", background: "var(--color-gold)", borderRadius: "1px", left: "50%", transform: "translateX(-50%)" }} />
              <div style={{ position: "absolute", height: "2px", width: "100%", background: "var(--color-gold)", borderRadius: "1px", top: "50%", transform: "translateY(-50%)" }} />
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 400, color: "var(--color-moss)", marginBottom: "12px" }}>
              ¡Pedido confirmado!
            </h1>
            <p style={{ fontSize: "14px", color: "var(--color-text-light)", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto 24px", fontWeight: 300 }}>
              Gracias por tu compra. Te enviaremos un correo con los detalles de tu pedido a la brevedad.
            </p>
            {orderNumber && (
              <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "32px" }}>
                Pedido #{orderNumber}
              </p>
            )}
            <Link href="/productos" style={primaryButtonStyle}>
              Seguir explorando
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </>
        )}

        {status === "pending" && timedOut && (
          <>
            <div style={{ width: "60px", height: "60px", margin: "0 auto 28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" width="48" height="48">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 400, color: "var(--color-moss)", marginBottom: "12px" }}>
              Pago en proceso
            </h1>
            <p style={{ fontSize: "14px", color: "var(--color-text-light)", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto 24px", fontWeight: 300 }}>
              No pudimos confirmar tu pago. Revisa tu email o contáctanos si el problema persiste.
            </p>
            {orderNumber && (
              <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "32px" }}>
                Pedido #{orderNumber}
              </p>
            )}
            <Link href="/productos" style={primaryButtonStyle}>
              Volver a la tienda
            </Link>
          </>
        )}

        {status === "cancelled" && (
          <>
            <div style={{ width: "60px", height: "60px", margin: "0 auto 28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-text-light)" strokeWidth="1.2" width="48" height="48">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 400, color: "var(--color-moss)", marginBottom: "12px" }}>
              Pago no procesado
            </h1>
            <p style={{ fontSize: "14px", color: "var(--color-text-light)", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto 24px", fontWeight: 300 }}>
              El pago no pudo completarse. Puedes intentarlo nuevamente o contactarnos si el problema persiste.
            </p>
            {orderNumber && (
              <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "32px" }}>
                Pedido #{orderNumber}
              </p>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              {orderNumber && (
                <button
                  disabled={retryLoading}
                  onClick={() => { void handleRetry(); }}
                  style={{
                    ...primaryButtonStyle,
                    border: "none",
                    cursor: retryLoading ? "not-allowed" : "pointer",
                    opacity: retryLoading ? 0.7 : 1,
                  }}
                  type="button"
                >
                  {retryLoading ? "Cargando..." : "Agregar al carrito y reintentar"}
                </button>
              )}
              <Link href="/productos" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 28px", background: "transparent",
                color: "var(--color-moss)", border: "1px solid var(--color-moss)",
                textDecoration: "none", borderRadius: "2px", fontSize: "11px",
                fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                Volver a la tienda
              </Link>
            </div>
            {retryError && (
              <p style={{ marginTop: "16px", fontSize: "12px", color: "var(--color-error, #c0392b)" }}>
                {retryError}
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <ConfirmacionContent />
    </Suspense>
  );
}
