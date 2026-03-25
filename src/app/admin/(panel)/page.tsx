import Link from "next/link";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";
import { AdminMetricCard, AdminStatusPill } from "@/features/admin/components";
import { getOrderStats } from "@/features/admin/services/order-admin-service";
import { verifyToken } from "@/features/admin/services/auth-service";
import { formatCLP } from "@/shared/utils";

export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  const stats = await getOrderStats();
  const orderStatusRows: Array<{
    id: string;
    label: string;
    status: "pending" | "paid" | "preparing" | "shipped";
    count: number;
    hint: string;
  }> = [
    { id: "pending", label: "Pendientes", status: "pending", count: stats.byStatus.pending, hint: "Esperando pago o revision" },
    { id: "paid", label: "Pagados", status: "paid", count: stats.byStatus.paid, hint: "Listos para procesamiento" },
    { id: "preparing", label: "Preparando", status: "preparing", count: stats.byStatus.preparing, hint: "En armado y coordinacion" },
    { id: "shipped", label: "Enviados", status: "shipped", count: stats.byStatus.shipped, hint: "En ruta al cliente" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">
            Bienvenido{session?.name ? `, ${session.name}` : ""} .
          </h1>
          <p className="mt-2 max-w-[520px] text-sm font-light leading-[1.7] text-text-light">
            Resumen rapido del estado de la tienda, pedidos activos y accesos principales del panel.
          </p>
        </div>
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-border bg-white px-4 text-[0.78rem] font-medium text-text-mid transition-colors hover:border-gold hover:text-moss"
          href="/admin/pedidos"
        >
          Ver pedidos activos
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          delta={`+${stats.paidTodayCount} pagos hoy`}
          deltaType="up"
          icon="💰"
          label="Ventas del dia"
          value={formatCLP(stats.salesToday)}
          variant="gold"
        />
        <AdminMetricCard
          delta={`${stats.byStatus.pending} requieren atencion`}
          icon="📦"
          label="Pedidos pendientes"
          value={String(stats.byStatus.pending)}
          variant="green"
        />
        <AdminMetricCard
          delta={`${stats.ordersThisMonth} acumulados`}
          icon="🗂"
          label="Pedidos del mes"
          value={String(stats.ordersThisMonth)}
          variant="blue"
        />
        <AdminMetricCard
          delta={`${stats.byStatus.delivered} entregados`}
          icon="✓"
          label="Pedidos cerrados"
          value={String(stats.byStatus.delivered)}
          variant="purple"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[2px] border border-border bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <h3 className="text-[0.82rem] font-semibold text-text">Estado de pedidos</h3>
              <p className="mt-1 text-[11px] text-text-light">
                Vista operacional del flujo actual de pedidos.
              </p>
            </div>
            <Link
              className="text-[11px] uppercase tracking-[0.12em] text-gold transition-colors hover:text-moss"
              href="/admin/pedidos"
            >
              Ver todos
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-beige-warm">
                <tr>
                  <th className="border-b border-border px-4 py-[11px] text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-text-light">
                    Estado
                  </th>
                  <th className="border-b border-border px-4 py-[11px] text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-text-light">
                    Total
                  </th>
                  <th className="border-b border-border px-4 py-[11px] text-left text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-text-light">
                    Lectura
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderStatusRows.map((item) => (
                  <tr className="transition-colors hover:bg-beige/40" key={item.id}>
                    <td className="border-b border-border px-4 py-[13px] align-middle text-[0.8rem] text-text-mid">
                      <div className="flex items-center gap-3">
                        <AdminStatusPill status={item.status} />
                        <span className="font-medium text-text">{item.label}</span>
                      </div>
                    </td>
                    <td className="border-b border-border px-4 py-[13px] align-middle text-[0.8rem] text-text-mid">
                      <span className="font-medium text-text">{item.count}</span>
                    </td>
                    <td className="border-b border-border px-4 py-[13px] align-middle text-[0.8rem] text-text-mid">
                      <span>{item.hint}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[2px] border border-border bg-white p-5">
          <h2 className="text-[0.82rem] font-semibold text-text">Accesos rapidos</h2>
          <p className="mt-1 text-[11px] text-text-light">Atajos a las secciones principales del panel.</p>

          <div className="mt-5 grid gap-3">
            {[
              { href: "/admin/productos", label: "Gestionar productos", copy: "Catálogo, stock e imagenes" },
              { href: "/admin/categorias", label: "Gestionar categorias", copy: "Orden, visibilidad y hero" },
              { href: "/admin/pedidos", label: "Gestionar pedidos", copy: "Seguimiento y estados" },
              { href: "/admin/landing", label: "Gestionar landing", copy: "Hero, banners y footer" },
            ].map((item) => (
              <Link
                className="rounded-[10px] border border-border bg-beige/40 px-4 py-4 transition-colors hover:border-gold/40 hover:bg-gold/5"
                href={item.href}
                key={item.href}
              >
                <p className="font-medium text-text">{item.label}</p>
                <p className="mt-1 text-[12px] font-light text-text-light">{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

