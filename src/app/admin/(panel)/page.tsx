import Link from "next/link";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";
import { AdminMetricCard } from "@/features/admin/components";
import { getOrderStats } from "@/features/admin/services/order-admin-service";
import { verifyToken } from "@/features/admin/services/auth-service";
import { formatCLP } from "@/shared/utils";

type DashboardIconName =
  | "money"
  | "clock"
  | "calendar"
  | "check"
  | "box"
  | "tag"
  | "layout"
  | "info"
  | "arrow"
  | "package"
  | "truck"
  | "book";

function DashboardIcon({ name, size = 16, strokeWidth = 1.7 }: { name: DashboardIconName; size?: number; strokeWidth?: number }) {
  const paths: Record<DashboardIconName, string> = {
    money: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM10 6v8M7.5 8.5c0-1 1-1.8 2.5-1.8s2.5.8 2.5 1.8-1 1.6-2.5 1.6-2.5.7-2.5 1.7 1 1.8 2.5 1.8 2.5-.8 2.5-1.8",
    clock: "M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM10 6v4l3 2",
    calendar: "M3 5h14v12H3zM3 9h14M7 3v4M13 3v4",
    check: "M4 10.5 8 14l8-8",
    box: "M10 2 18 6.5v7L10 18l-8-4.5v-7L10 2ZM10 2v16M2 6.5l8 4.5 8-4.5",
    tag: "M3 3h6l8 8-6 6-8-8V3ZM7 7h.01",
    layout: "M2 3h16v5H2zM2 11h7v6H2zM12 11h6v6h-6z",
    info: "M10 9v5M10 6h.01M3 10a7 7 0 1 0 14 0 7 7 0 0 0-14 0Z",
    arrow: "M4 10h12M12 6l4 4-4 4",
    package: "M10 2l8 4.5v7L10 18l-8-4.5v-7zM2 6.5l8 4.5M18 6.5l-8 4.5M10 11v7",
    truck: "M1 8h10v9H1zM11 11h4l3 3v3h-7zM4 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    book: "M4 2h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM9 2v16",
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 20 20"
      width={size}
    >
      <path d={paths[name]} />
    </svg>
  );
}

type OrderStatusRow = {
  id: "pending" | "paid" | "shipped" | "delivered";
  label: string;
  count: number;
  hint: string;
  color: string;
  tintBg: string;
};

type SummaryRow = {
  id: string;
  label: string;
  copy: string;
  value: string;
  icon: DashboardIconName;
  color: string;
  tintBg: string;
};

type QuickLink = {
  href: string;
  label: string;
  copy: string;
  icon: DashboardIconName;
};

export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  const stats = await getOrderStats();

  const formattedDate = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const dateLabel = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const orderStatusRows: OrderStatusRow[] = [
    {
      id: "pending",
      label: "Pendientes",
      count: stats.byStatus.pending,
      hint: "Esperando pago o revisión",
      color: "var(--adm-warning)",
      tintBg: "rgba(201, 138, 43, 0.14)",
    },
    {
      id: "paid",
      label: "Pagados",
      count: stats.byStatus.paid,
      hint: "Listos para procesamiento",
      color: "var(--adm-success)",
      tintBg: "rgba(63, 143, 107, 0.14)",
    },
    {
      id: "shipped",
      label: "Enviados",
      count: stats.byStatus.shipped,
      hint: "En ruta al cliente (despacho)",
      color: "var(--adm-info)",
      tintBg: "rgba(79, 127, 168, 0.14)",
    },
    {
      id: "delivered",
      label: "Entregados",
      count: stats.byStatus.delivered,
      hint: "Retirados en tienda o recibidos",
      color: "var(--adm-gold-deep)",
      tintBg: "rgba(197, 160, 77, 0.17)",
    },
  ];
  const trackedOrders = orderStatusRows.reduce((sum, row) => sum + row.count, 0);

  const summaryRows: SummaryRow[] = [
    {
      id: "pending",
      label: "Pedidos pendientes",
      copy: stats.byStatus.pending > 0 ? "Requieren revisión o confirmación de pago." : "Sin pendientes críticos.",
      value: String(stats.byStatus.pending),
      icon: "clock",
      color: "var(--adm-warning)",
      tintBg: "rgba(201, 138, 43, 0.14)",
    },
    {
      id: "paid",
      label: "Pagos confirmados",
      copy: stats.byStatus.paid > 0 ? "Listos para preparar." : "No hay pagos en espera.",
      value: String(stats.byStatus.paid),
      icon: "check",
      color: "var(--adm-success)",
      tintBg: "rgba(63, 143, 107, 0.14)",
    },
    {
      id: "shipped",
      label: "Pedidos enviados",
      copy: stats.byStatus.shipped > 0 ? "En ruta hacia el cliente (despacho)." : "Sin envíos activos.",
      value: String(stats.byStatus.shipped),
      icon: "truck",
      color: "var(--adm-info)",
      tintBg: "rgba(79, 127, 168, 0.14)",
    },
    {
      id: "delivered",
      label: "Pedidos entregados",
      copy: stats.byStatus.delivered > 0 ? "Retirados en tienda o ya recibidos." : "Sin entregas registradas.",
      value: String(stats.byStatus.delivered),
      icon: "check",
      color: "var(--adm-gold-deep)",
      tintBg: "rgba(197, 160, 77, 0.17)",
    },
  ];

  const quickLinks: QuickLink[] = [
    { href: "/admin/productos", label: "Gestionar productos", copy: "Catálogo, stock e imágenes", icon: "book" },
    { href: "/admin/categorias", label: "Gestionar categorías", copy: "Orden, visibilidad y hero", icon: "tag" },
    { href: "/admin/pedidos", label: "Gestionar pedidos", copy: "Seguimiento y estados", icon: "box" },
    { href: "/admin/landing", label: "Gestionar landing", copy: "Hero, banners y footer", icon: "layout" },
    { href: "/admin/nosotros", label: "Página Conócenos", copy: "Secciones de texto e imagen", icon: "info" },
  ];

  const pendingTip = stats.byStatus.pending > 0
    ? `Hay ${stats.byStatus.pending} pedido${stats.byStatus.pending === 1 ? "" : "s"} pendiente${stats.byStatus.pending === 1 ? "" : "s"} que requieren revisión.`
    : "No hay pedidos pendientes en este momento.";

  const statusIcons: Record<OrderStatusRow["id"], DashboardIconName> = {
    pending: "package",
    paid: "package",
    shipped: "truck",
    delivered: "check",
  };

  return (
    <section className="admin-page-shell">
      <div className="admin-page-container adm-dash">
        <header className="adm-dash-head">
          <div className="adm-dash-head-copy">
            <p className="adm-dash-date">{dateLabel}</p>
            <h1 className="adm-dash-title">
              Bienvenido{session?.name ? `, ${session.name}` : ""}
              <span>.</span>
            </h1>
            <p className="adm-dash-sub">
              Resumen rápido del estado de la tienda, pedidos activos y accesos principales.
            </p>
            <div aria-hidden="true" className="adm-dash-rule" />
          </div>
          <Link className="adm-outline-btn" href="/admin/pedidos">
            Ver pedidos activos
            <DashboardIcon name="arrow" size={13} strokeWidth={1.9} />
          </Link>
        </header>

        <div className="admin-grid-kpis">
          <AdminMetricCard
            delta={`${stats.paidTodayCount} pagos hoy`}
            deltaType="up"
            icon={<DashboardIcon name="money" size={18} strokeWidth={1.7} />}
            label="Ventas del día"
            value={formatCLP(stats.salesToday)}
            variant="gold"
          />
          <AdminMetricCard
            delta={`${stats.paidShippingCount} despacho, ${stats.paidPickupCount} retiro`}
            icon={<DashboardIcon name="package" size={18} strokeWidth={1.7} />}
            label="Por preparar"
            value={String(stats.byStatus.paid)}
            variant="green"
          />
          <AdminMetricCard
            delta={`${stats.ordersThisMonth} acumulados`}
            icon={<DashboardIcon name="calendar" size={18} strokeWidth={1.7} />}
            label="Pedidos del mes"
            value={String(stats.ordersThisMonth)}
            variant="blue"
          />
          <AdminMetricCard
            delta={`${stats.closedShippingThisMonth} despacho, ${stats.closedPickupThisMonth} retiro`}
            icon={<DashboardIcon name="check" size={18} strokeWidth={1.7} />}
            label="Cerrados del mes"
            value={String(stats.closedShippingThisMonth + stats.closedPickupThisMonth)}
            variant="purple"
          />
        </div>

        <div className="admin-grid-main">
          <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
            <section className="admin-card adm-card-pad">
              <div className="adm-card-head">
                <div>
                  <h2 className="adm-card-title">Estado de pedidos</h2>
                  <p className="adm-card-sub">Vista operacional del flujo actual.</p>
                </div>
                <Link className="adm-chip-btn" href="/admin/pedidos">
                  Ver todos
                  <DashboardIcon name="arrow" size={14} strokeWidth={1.9} />
                </Link>
              </div>

              <div className="adm-status-grid">
                {orderStatusRows.map((row) => {
                  const percent = trackedOrders > 0 ? Math.round((row.count / trackedOrders) * 100) : 0;
                  return (
                    <div className="adm-status-item" key={row.id}>
                      <div className="adm-status-icon" style={{ background: row.tintBg, color: row.color }}>
                        <DashboardIcon name={statusIcons[row.id]} size={17} strokeWidth={1.7} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="adm-status-top">
                          <span className="adm-status-name">{row.label}</span>
                          <span className="adm-status-count">{row.count}</span>
                        </div>
                        <div className="adm-status-bar">
                          <span style={{ width: `${percent}%`, background: row.color }} />
                        </div>
                        <div className="adm-status-hint">{row.hint}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="admin-card adm-card-pad adm-summary">
              <div className="adm-card-head" style={{ marginBottom: 12, position: "relative" }}>
                <div>
                  <h2 className="adm-card-title">Resumen operativo</h2>
                  <p className="adm-card-sub">Lectura del flujo basada en estados reales de pedidos.</p>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                {summaryRows.map((row) => (
                  <div className="adm-summary-row" key={row.id}>
                    <div className="adm-summary-icon" style={{ background: row.tintBg, color: row.color }}>
                      <DashboardIcon name={row.icon} size={15} strokeWidth={1.7} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <span className="adm-status-name">{row.label}</span>
                        <span className="adm-status-count">{row.value}</span>
                      </div>
                      <p className="adm-status-hint" style={{ marginTop: 4 }}>
                        {row.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="admin-card adm-card-pad">
            <h2 className="adm-card-title">Accesos rápidos</h2>
            <p className="adm-card-sub" style={{ marginBottom: 16 }}>
              Atajos a las secciones principales del panel.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quickLinks.map((item) => (
                <Link className="adm-quick" href={item.href} key={item.href}>
                  <span className="adm-quick-icon">
                    <DashboardIcon name={item.icon} size={16} strokeWidth={1.7} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="adm-quick-title">{item.label}</span>
                    <span className="adm-quick-copy">{item.copy}</span>
                  </span>
                  <span className="adm-quick-arrow">
                    <DashboardIcon name="arrow" size={14} strokeWidth={1.9} />
                  </span>
                </Link>
              ))}
            </div>

            <div className="adm-tip">
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--adm-gold-deep)",
                  marginBottom: 6,
                }}
              >
                Consejo
              </div>
              <div style={{ fontSize: 12, color: "var(--adm-ink)", lineHeight: 1.55 }}>{pendingTip}</div>
              <Link
                href="/admin/pedidos"
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--adm-ink-strong)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Ver pedidos activos
                <DashboardIcon name="arrow" size={14} strokeWidth={1.9} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
