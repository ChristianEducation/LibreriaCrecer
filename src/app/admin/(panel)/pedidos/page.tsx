"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminStatusPill, AdminTable } from "@/features/admin/components";
import { formatCLP, formatDate } from "@/shared/utils";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: "pending" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled";
  total: number;
  createdAt: string;
  deliveryMethod: "pickup" | "shipping";
  customerName: string;
  customerEmail: string;
};

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [includePending, setIncludePending] = useState(false);

  const queryString = useMemo(() => {
    const query = new URLSearchParams({
      page: String(page),
      limit: "20",
      sortBy,
    });

    if (status) query.set("status", status);
    if (deliveryMethod) query.set("deliveryMethod", deliveryMethod);
    if (search.trim()) query.set("search", search.trim());
    if (dateFrom) query.set("dateFrom", dateFrom);
    if (dateTo) query.set("dateTo", dateTo);
    if (includePending) query.set("includePending", "true");

    return query.toString();
  }, [page, sortBy, status, deliveryMethod, search, dateFrom, dateTo, includePending]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/pedidos?${queryString}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as
        | {
            data?: OrderRow[];
            pagination?: { totalPages?: number };
            message?: string;
          }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudieron cargar los pedidos.");
        setLoading(false);
        return;
      }

      setOrders(payload?.data ?? []);
      setTotalPages(payload?.pagination?.totalPages ?? 1);
      setLoading(false);
    };

    void fetchOrders();
  }, [queryString]);

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-serif text-[2rem] leading-none text-text">Pedidos</h1>
        <p className="mt-2 text-sm font-light text-text-light">
          Revisa el flujo operativo, filtra por estado y entra al detalle de cada compra.
        </p>
      </div>

      <div className="grid gap-3 rounded-[2px] border border-border bg-white p-4 md:grid-cols-6">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar Nº orden o email"
          className="rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-mid focus:border-gold focus:outline-none"
        >
          <option value="">Estado: todos</option>
          <option value="pending">Pendiente</option>
          <option value="paid">Pagado</option>
          <option value="preparing">Preparando</option>
          <option value="shipped">Despachado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <select
          value={deliveryMethod}
          onChange={(event) => setDeliveryMethod(event.target.value)}
          className="rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-mid focus:border-gold focus:outline-none"
        >
          <option value="">Entrega: todos</option>
          <option value="pickup">Retiro</option>
          <option value="shipping">Despacho</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(event) => setDateFrom(event.target.value)}
          className="rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-mid focus:border-gold focus:outline-none"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(event) => setDateTo(event.target.value)}
          className="rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-mid focus:border-gold focus:outline-none"
        />
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-mid focus:border-gold focus:outline-none"
        >
          <option value="newest">Mas recientes</option>
          <option value="oldest">Mas antiguos</option>
          <option value="total_desc">Total mayor</option>
          <option value="total_asc">Total menor</option>
        </select>
      </div>

      <label
        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        className="text-sm text-text-mid"
      >
        <input
          type="checkbox"
          checked={includePending}
          onChange={(e) => { setIncludePending(e.target.checked); setPage(1); }}
          className="accent-gold"
          style={{ width: "14px", height: "14px" }}
        />
        Mostrar pedidos pendientes
      </label>

      {loading ? <p className="text-sm text-text-light">Cargando pedidos...</p> : null}
      {error ? <p className="text-sm text-error">{error}</p> : null}

      {!loading ? (
        <AdminTable
          columns={[
            {
              key: "pedido",
              header: "Pedido",
              render: (order) => (
                <div>
                  <p className="font-medium text-text">{order.orderNumber}</p>
                  <p className="text-[11px] text-text-light">{formatDate(order.createdAt)}</p>
                </div>
              ),
            },
            {
              key: "cliente",
              header: "Cliente",
              render: (order) => (
                <div>
                  <p className="font-medium text-text">{order.customerName}</p>
                  <p className="text-[11px] text-text-light">{order.customerEmail}</p>
                </div>
              ),
            },
            {
              key: "entrega",
              header: "Entrega",
              render: (order) => <span>{order.deliveryMethod === "pickup" ? "Retiro" : "Despacho"}</span>,
            },
            {
              key: "total",
              header: "Total",
              render: (order) => <span className="font-medium text-gold">{formatCLP(order.total)}</span>,
            },
            {
              key: "estado",
              header: "Estado",
              render: (order) => <AdminStatusPill status={order.status} />,
            },
            {
              key: "acciones",
              header: "Acciones",
              render: (order) => (
                <Link
                  className="rounded-[8px] border border-border px-3 py-[6px] text-[12px] text-text-mid transition-colors hover:border-gold hover:text-moss"
                  href={`/admin/pedidos/${order.id}`}
                >
                  Ver detalle
                </Link>
              ),
            },
          ]}
          data={orders}
          description="Listado operativo con filtros por estado, fecha y metodo de entrega."
          rowKey={(order) => order.id}
          title="Pedidos recientes"
        />
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="rounded-[8px] border border-border bg-white px-3 py-1.5 text-sm text-text-mid disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-text-mid">
          Pagina {page} de {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          className="rounded-[8px] border border-border bg-white px-3 py-1.5 text-sm text-text-mid disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}

