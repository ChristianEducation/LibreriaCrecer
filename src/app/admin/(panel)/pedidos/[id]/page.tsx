"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminStatusPill, AdminTable } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";
import { formatCLP, formatDate } from "@/shared/utils";

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: "pending" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  deliveryMethod: "pickup" | "shipping";
  paymentMethod: string | null;
  paymentReference: string | null;
  chilexpressServiceTypeCode: string | null;
  chilexpressServiceDescription: string | null;
  chilexpressOriginCoverageCode: string | null;
  chilexpressDestinationCoverageCode: string | null;
  chilexpressTransportOrderNumber: string | null;
  chilexpressLabelUrl: string | null;
  adminNotes: string | null;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  } | null;
  address: {
    street: string;
    number: string;
    apartment: string | null;
    commune: string;
    city: string;
    region: string;
    zipCode: string | null;
    deliveryInstructions: string | null;
  } | null;
  items: Array<{
    id: string;
    productTitle: string;
    sku: string | null;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }>;
  coupon: {
    code: string;
  } | null;
  allowedTransitions: Array<"pending" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled">;
};

export default function AdminPedidoDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [notes, setNotes] = useState("");
  const [targetStatus, setTargetStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [generatingOt, setGeneratingOt] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/pedidos/${params.id}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as
        | { data?: OrderDetail; message?: string }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudo cargar el pedido.");
        setLoading(false);
        return;
      }

      setOrder(payload?.data ?? null);
      setNotes(payload?.data?.adminNotes ?? "");
      setLoading(false);
    };

    void fetchOrder();
  }, [params.id]);

  async function handleStatusUpdate() {
    if (!targetStatus || !order) return;

    const confirmed = window.confirm(`Cambiar estado de ${order.status} a ${targetStatus}?`);
    if (!confirmed) return;

    setSavingStatus(true);
    const response = await fetch(`/api/admin/pedidos/${order.id}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: targetStatus,
        adminNotes: notes,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { data?: OrderDetail; message?: string }
      | null;

    if (!response.ok) {
      toast({ message: payload?.message ?? "No se pudo actualizar el estado.", variant: "error" });
      setSavingStatus(false);
      return;
    }

    setOrder(payload?.data ?? null);
    setTargetStatus("");
    setSavingStatus(false);
    toast({ message: "Estado del pedido actualizado." });
    router.refresh();
  }

  async function handleGenerateOt() {
    if (!order) return;

    setGeneratingOt(true);
    setShippingError(null);

    try {
      const response = await fetch(`/api/admin/pedidos/${order.id}/generar-ot`, {
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            data?: {
              chilexpressTransportOrderNumber: string | null;
              chilexpressLabelUrl: string | null;
              shippingCost: number;
            };
            message?: string;
          }
        | null;

      if (!response.ok || !payload?.data) {
        const message = payload?.message ?? "No se pudo generar la etiqueta Chilexpress.";
        setShippingError(message);
        toast({ message, variant: "error" });
        return;
      }

      setOrder((current) =>
        current
          ? {
              ...current,
              chilexpressTransportOrderNumber: payload.data?.chilexpressTransportOrderNumber ?? null,
              chilexpressLabelUrl: payload.data?.chilexpressLabelUrl ?? null,
              shippingCost: payload.data?.shippingCost ?? current.shippingCost,
            }
          : current,
      );
      toast({ message: "Etiqueta Chilexpress generada." });
    } catch {
      const message = "Chilexpress no respondió correctamente.";
      setShippingError(message);
      toast({ message, variant: "error" });
    } finally {
      setGeneratingOt(false);
    }
  }

  function openChilexpressLabel() {
    if (!order?.chilexpressLabelUrl) return;

    if (order.chilexpressLabelUrl.startsWith("data:application/pdf;base64,")) {
      const base64 = order.chilexpressLabelUrl.replace("data:application/pdf;base64,", "");
      const binary = window.atob(base64);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
      return;
    }

    window.open(order.chilexpressLabelUrl, "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return <p className="text-sm text-text-light">Cargando pedido...</p>;
  }

  if (error || !order) {
    return (
      <section className="space-y-4">
        <p className="text-error">{error ?? "Pedido no encontrado."}</p>
        <Link href="/admin/pedidos" className="rounded-[8px] border border-border px-3 py-2 text-sm text-text-mid">
          Volver a pedidos
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">{order.orderNumber}</h1>
          <p className="mt-2 text-sm font-light text-text-light">Creado: {formatDate(order.createdAt)}</p>
        </div>
        <AdminStatusPill status={order.status} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[2px] border border-border bg-white p-5">
            <h2 className="text-[0.82rem] font-semibold text-text">Cliente</h2>
            <div className="mt-3 space-y-1 text-sm text-text-mid">
              <p className="font-medium text-text">{order.customer?.fullName ?? "-"}</p>
              <p>{order.customer?.email ?? "-"}</p>
              <p>{order.customer?.phone ?? "-"}</p>
            </div>
          </div>

          <div className="rounded-[2px] border border-border bg-white p-5">
            <h2 className="text-[0.82rem] font-semibold text-text">Pago</h2>
            <div className="mt-3 space-y-1 text-sm text-text-mid">
              <p>Metodo: {order.paymentMethod ?? "-"}</p>
              <p>Referencia: {order.paymentReference ?? "-"}</p>
              <p>Entrega: {order.deliveryMethod === "pickup" ? "Retiro en tienda" : "Despacho"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2px] border border-border bg-white p-5">
          <h2 className="text-[0.82rem] font-semibold text-text">Resumen financiero</h2>
          <div className="mt-4 space-y-3 text-sm text-text-mid">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCLP(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Descuento</span>
              <span>
                {formatCLP(order.discountAmount)}
                {order.coupon?.code ? ` · ${order.coupon.code}` : ""}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Envio</span>
              <span>{formatCLP(order.shippingCost)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 font-medium text-text">
              <span>Total</span>
              <span className="text-gold">{formatCLP(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <AdminTable
        columns={[
          {
            key: "titulo",
            header: "Titulo",
            render: (item) => <span className="font-medium text-text">{item.productTitle}</span>,
          },
          {
            key: "sku",
            header: "SKU",
            render: (item) => <span>{item.sku ?? "-"}</span>,
          },
          {
            key: "precio",
            header: "Precio",
            render: (item) => <span>{formatCLP(item.unitPrice)}</span>,
          },
          {
            key: "cantidad",
            header: "Cantidad",
            render: (item) => <span>{item.quantity}</span>,
          },
          {
            key: "subtotal",
            header: "Subtotal",
            render: (item) => <span className="font-medium text-gold">{formatCLP(item.subtotal)}</span>,
          },
        ]}
        data={order.items}
        rowKey={(item) => item.id}
        title="Items del pedido"
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2px] border border-border bg-white p-5">
          <h2 className="text-[0.82rem] font-semibold text-text">Entrega</h2>
          <div className="mt-3 text-sm leading-[1.7] text-text-mid">
            {order.address ? (
              <p>
                {order.address.street} {order.address.number}
                {order.address.apartment ? `, ${order.address.apartment}` : ""}
                <br />
                {order.address.commune}, {order.address.city}, {order.address.region}
                {order.address.zipCode ? ` · ${order.address.zipCode}` : ""}
                {order.address.deliveryInstructions ? (
                  <>
                    <br />
                    Indicaciones: {order.address.deliveryInstructions}
                  </>
                ) : null}
              </p>
            ) : (
              <p>Sin direccion registrada. Pedido configurado para retiro en tienda.</p>
            )}
          </div>
        </div>

        {order.deliveryMethod === "shipping" ? (
          <div className="rounded-[2px] border border-border bg-white p-5 space-y-3">
            <h2 className="text-[0.82rem] font-semibold text-text">Despacho Chilexpress</h2>
            {order.chilexpressTransportOrderNumber ? (
              <div className="space-y-2 text-sm text-text-mid">
                <p>
                  OT / Tracking:{" "}
                  <span className="font-medium text-text">{order.chilexpressTransportOrderNumber}</span>
                </p>
                <p>Servicio: {order.chilexpressServiceDescription ?? order.chilexpressServiceTypeCode ?? "-"}</p>
                <p>Origen: {order.chilexpressOriginCoverageCode ?? "-"}</p>
                <p>Destino: {order.chilexpressDestinationCoverageCode ?? "-"}</p>
                <button
                  className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  disabled={!order.chilexpressLabelUrl}
                  onClick={openChilexpressLabel}
                  type="button"
                >
                  Imprimir etiqueta PDF
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-text-mid">
                <p>Este pedido todavia no tiene etiqueta Chilexpress.</p>
                <button
                  className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  disabled={generatingOt || (order.status !== "paid" && order.status !== "preparing")}
                  onClick={handleGenerateOt}
                  type="button"
                >
                  {generatingOt ? "Generando..." : "Generar etiqueta Chilexpress"}
                </button>
                {order.status !== "paid" && order.status !== "preparing" ? (
                  <p className="text-[12px] text-text-light">Disponible solo para pedidos pagados o en preparacion.</p>
                ) : null}
              </div>
            )}
            {shippingError ? <p className="text-sm text-error">{shippingError}</p> : null}
          </div>
        ) : null}

        <div className="rounded-[2px] border border-border bg-white p-5 space-y-3">
          <h2 className="text-[0.82rem] font-semibold text-text">Gestion del pedido</h2>
        <label className="block text-sm">
          <span className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-text-light">
            Notas del admin
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 w-full rounded-[8px] border border-border px-3 py-2 text-text focus:border-gold focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={targetStatus}
            onChange={(event) => setTargetStatus(event.target.value)}
            className="rounded-[8px] border border-border px-3 py-2 text-sm text-text-mid focus:border-gold focus:outline-none"
          >
            <option value="">Seleccionar nuevo estado</option>
            {order.allowedTransitions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!targetStatus || savingStatus}
            onClick={handleStatusUpdate}
            className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {savingStatus ? "Actualizando..." : "Actualizar estado"}
          </button>

          <Link
            href="/admin/pedidos"
            className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid"
          >
            Volver al listado
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
}
