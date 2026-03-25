"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/features/carrito/hooks";
import { useCartHydration } from "@/features/carrito/useCartHydration";
import { CheckoutForm } from "@/features/checkout/components";
import type { CreateOrderSchemaInput } from "@/features/checkout/schemas";

type PaymentMethod = "tarjeta" | "transferencia" | "efectivo";

function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12 md:px-10 lg:px-14 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="h-[720px] animate-pulse rounded-[2px] bg-white/60" />
        <div className="h-[420px] animate-pulse rounded-[2px] bg-white/60" />
      </div>
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

  async function handleSubmit(formData: CreateOrderSchemaInput, selectedPaymentMethod: PaymentMethod) {
    try {
      if (selectedPaymentMethod === "efectivo" && formData.deliveryMethod !== "pickup") {
        return "El pago en efectivo solo esta disponible para retiro en tienda.";
      }

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

      if (selectedPaymentMethod === "tarjeta") {
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
        return;
      }

      clearCart();
      router.push(`/checkout/confirmacion?order=${encodeURIComponent(order.orderNumber)}&status=pending`);
      return;
    } catch {
      return "Ocurrio un error inesperado al procesar tu pedido.";
    }
  }

  if (!hydrated || items.length === 0) {
    return <CheckoutSkeleton />;
  }

  return <CheckoutForm onSubmit={handleSubmit} />;
}
