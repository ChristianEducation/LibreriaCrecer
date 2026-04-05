"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";
import { CheckoutForm } from "@/features/checkout/components";
import type { CreateOrderSchemaInput } from "@/features/checkout/schemas";

function CheckoutSkeleton() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 56px 80px", display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>
      <div className="animate-pulse rounded-[2px]" style={{ height: "720px", background: "rgba(255,255,255,0.6)" }} />
      <div className="animate-pulse rounded-[2px]" style={{ height: "420px", background: "rgba(255,255,255,0.6)" }} />
    </div>
  );
}

export default function CheckoutPage() {
  const hydrated = useCartHydration();
  const { items, clearCart, couponCode } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/carrito");
    }
  }, [hydrated, items.length, router]);

  async function handleSubmit(formData: CreateOrderSchemaInput) {
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

  if (!hydrated || items.length === 0) {
    return <CheckoutSkeleton />;
  }

  return <CheckoutForm onSubmit={handleSubmit} />;
}
