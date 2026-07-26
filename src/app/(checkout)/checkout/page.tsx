"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";
import { CheckoutForm } from "@/features/checkout/components";
import type { CreateOrderSchemaInput } from "@/features/checkout/schemas";
import { usePurchaseAvailability } from "@/shared/providers/PurchaseAvailabilityProvider";

function PurchasesPausedState() {
  return (
    <section className="page-px" style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "64px", paddingBottom: "64px" }}>
      <div style={{ maxWidth: "560px", textAlign: "center" }}>
        <p className="section-eyebrow" style={{ color: "var(--gold)", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.14em" }}>
          Inventario en actualización
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, color: "var(--moss)", lineHeight: 1.12, marginBottom: "18px" }}>
          Las compras están temporalmente pausadas
        </h1>
        <p style={{ fontSize: "14px", lineHeight: 1.8, color: "var(--text-light)", marginBottom: "28px" }}>
          Estamos confirmando la disponibilidad de nuestros libros para que cada pedido sea preciso. Tu carrito seguirá guardado mientras terminamos esta actualización.
        </p>
        <Link href="/productos" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "13px 26px", borderRadius: "var(--radius-xl)", background: "var(--moss)", color: "white", textDecoration: "none", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Seguir explorando
        </Link>
      </div>
    </section>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="checkout-form-padding cart-layout-grid">
      <div className="animate-pulse rounded-[2px]" style={{ height: "720px", background: "rgba(255,255,255,0.6)" }} />
      <div className="animate-pulse rounded-[2px]" style={{ height: "420px", background: "rgba(255,255,255,0.6)" }} />
    </div>
  );
}

export default function CheckoutPage() {
  const hydrated = useCartHydration();
  const { items, clearCart, couponCode } = useCart();
  const router = useRouter();
  const { purchasesEnabled } = usePurchaseAvailability();

  useEffect(() => {
    if (purchasesEnabled && hydrated && items.length === 0) {
      router.replace("/carrito");
    }
  }, [hydrated, items.length, purchasesEnabled, router]);

  async function handleSubmit(formData: CreateOrderSchemaInput) {
    if (!purchasesEnabled) {
      return "Las compras están temporalmente pausadas mientras actualizamos el inventario.";
    }

    try {
      const orderBody = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        customer: formData.customer,
        deliveryMethod: formData.deliveryMethod,
        address: formData.deliveryMethod === "shipping" ? formData.address : undefined,
        couponCode: couponCode ?? undefined,
        notes: formData.notes || undefined,
      };

      const orderRes = await fetch("/api/ordenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderBody),
      });

      const orderPayload = (await orderRes.json().catch(() => null)) as
        | {
            error?: string;
            message?: string;
            details?: unknown;
            data?: {
              orderId: string;
              orderNumber: string;
            };
          }
        | null;

      if (!orderRes.ok) {
        if (orderPayload?.error === "stock_insufficient") {
          return "Uno o mas productos ya no tienen stock suficiente. Revisa tu carrito antes de continuar.";
        }

        return orderPayload?.message ?? "No se pudo crear la orden.";
      }

      const order = orderPayload?.data;

      if (!order?.orderId || !order.orderNumber) {
        return "La orden se creo con un formato inesperado.";
      }

      const payRes = await fetch("/api/pagos/crear-sesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order.orderId }),
      });

      const payPayload = (await payRes.json().catch(() => null)) as
        | {
            message?: string;
            data?: {
              processUrl?: string;
            };
          }
        | null;

      if (!payRes.ok || !payPayload?.data?.processUrl) {
        return payPayload?.message ?? "No se pudo iniciar la sesion de pago.";
      }

      clearCart();
      window.location.href = payPayload.data.processUrl;
    } catch {
      return "Ocurrio un error inesperado al procesar tu pedido.";
    }
  }

  if (!purchasesEnabled) {
    return <PurchasesPausedState />;
  }

  if (!hydrated || items.length === 0) {
    return <CheckoutSkeleton />;
  }

  return <CheckoutForm onSubmit={handleSubmit} />;
}
