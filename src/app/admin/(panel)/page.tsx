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
  id: "pending" | "paid" | "preparing" | "shipped";
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
      color: "var(--warning)",
      tintBg: "rgba(230, 126, 34, 0.12)",
    },
    {
      id: "paid",
      label: "Pagados",
      count: stats.byStatus.paid,
      hint: "Listos para procesamiento",
      color: "var(--success)",
      tintBg: "rgba(39, 174, 96, 0.12)",
    },
    {
      id: "preparing",
      label: "Preparando",
      count: stats.byStatus.preparing,
      hint: "En armado y coordinación",
      color: "var(--info)",
      tintBg: "rgba(41, 128, 185, 0.12)",
    },
    {
      id: "shipped",
      label: "Enviados",
      count: stats.byStatus.shipped,
      hint: "En ruta al cliente",
      color: "var(--moss)",
      tintBg: "rgba(115, 96, 2, 0.12)",
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
      color: "var(--warning)",
      tintBg: "rgba(230, 126, 34, 0.12)",
    },
    {
      id: "paid",
      label: "Pagos confirmados",
      copy: stats.byStatus.paid > 0 ? "Listos para preparar." : "No hay pagos en espera.",
      value: String(stats.byStatus.paid),
      icon: "check",
      color: "var(--success)",
      tintBg: "rgba(39, 174, 96, 0.12)",
    },
    {
      id: "preparing",
      label: "En preparación",
      copy: stats.byStatus.preparing > 0 ? "En armado y coordinación logística." : "Sin pedidos en armado.",
      value: String(stats.byStatus.preparing),
      icon: "package",
      color: "var(--info)",
      tintBg: "rgba(41, 128, 185, 0.12)",
    },
    {
      id: "shipped",
      label: "Pedidos enviados",
      copy: stats.byStatus.shipped > 0 ? "En ruta hacia el cliente." : "Sin envíos activos.",
      value: String(stats.byStatus.shipped),
      icon: "truck",
      color: "var(--moss)",
      tintBg: "rgba(115, 96, 2, 0.12)",
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

  return (
    <section className="admin-page-shell">
      <div className="admin-page-container">
        <div className="admin-page-header">
          <div style={{ maxWidth: 640 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "var(--gold)",
                marginBottom: 6,
              }}
            >
              {dateLabel}
            </p>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: "var(--text)",
              }}
            >
              Bienvenido{session?.name ? `, ${session.name}` : ""}
              <span style={{ color: "var(--gold)" }}>.</span>
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--text-light)",
                marginTop: 6,
                fontWeight: 300,
              }}
            >
              Resumen rápido del estado de la tienda, pedidos activos y accesos principales.
            </p>
          </div>
          <Link
            href="/admin/pedidos"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 36,
              padding: "0 16px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "white",
              fontSize: 12.5,
              fontWeight: 600,
              color: "var(--moss)",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            Ver pedidos activos
            <DashboardIcon name="arrow" size={13} />
          </Link>
        </div>

        <div className="admin-grid-kpis">
          <AdminMetricCard
            delta={`${stats.paidTodayCount} pagos hoy`}
            deltaType="up"
            icon={<DashboardIcon name="money" size={18} strokeWidth={1.8} />}
            label="Ventas del día"
            value={formatCLP(stats.salesToday)}
            variant="gold"
          />
          <AdminMetricCard
            delta={`${stats.byStatus.pending} requieren atención`}
            icon={<DashboardIcon name="clock" size={18} strokeWidth={1.8} />}
            label="Pedidos pendientes"
            value={String(stats.byStatus.pending)}
            variant="green"
          />
          <AdminMetricCard
            delta={`${stats.ordersThisMonth} acumulados`}
            icon={<DashboardIcon name="calendar" size={18} strokeWidth={1.8} />}
            label="Pedidos del mes"
            value={String(stats.ordersThisMonth)}
            variant="blue"
          />
          <AdminMetricCard
            delta={`${stats.byStatus.delivered} entregados`}
            icon={<DashboardIcon name="check" size={18} strokeWidth={1.8} />}
            label="Pedidos cerrados"
            value={String(stats.byStatus.delivered)}
            variant="purple"
          />
        </div>

        <div className="admin-grid-main">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <section className="admin-card" style={{ padding: "22px 24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 6,
                }}
              >
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Estado de pedidos</h2>
                  <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 4, fontWeight: 300 }}>
                    Vista operacional del flujo actual.
                  </p>
                </div>
                <Link
                  href="/admin/pedidos"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--moss)",
                    background: "rgba(200, 168, 48, 0.1)",
                    border: "1px solid var(--border-gold)",
                    padding: "6px 14px",
                    borderRadius: 8,
                    transition: "background 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  Ver todos →
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  columnGap: 32,
                }}
              >
                {orderStatusRows.map((row) => {
                  const percent = trackedOrders > 0 ? Math.round((row.count / trackedOrders) * 100) : 0;
                  return (
                    <div
                      key={row.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "14px 0",
                        borderBottom: "1px solid #f2efe8",
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: row.tintBg,
                          color: row.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <DashboardIcon name="package" size={15} strokeWidth={1.6} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                            marginBottom: 6,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                            <span
                              aria-hidden="true"
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 999,
                                background: row.color,
                                flexShrink: 0,
                                display: "inline-block",
                              }}
                            />
                            <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text)" }}>{row.label}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{row.count}</span>
                        </div>
                        <div
                          style={{
                            height: 5,
                            borderRadius: 999,
                            background: "#f0ede8",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${percent}%`,
                              borderRadius: 999,
                              background: row.color,
                              transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-light)",
                            marginTop: 6,
                            fontWeight: 300,
                          }}
                        >
                          {row.hint}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="admin-card" style={{ padding: "22px 24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Resumen operativo</h2>
                  <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 4, fontWeight: 300 }}>
                    Lectura del flujo basada en estados reales de pedidos.
                  </p>
                </div>
              </div>

              <div>
                {summaryRows.map((row, idx) => (
                  <div
                    key={row.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "12px 0",
                      borderBottom: idx === summaryRows.length - 1 ? "none" : "1px solid #f2efe8",
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: row.tintBg,
                        color: row.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <DashboardIcon name={row.icon} size={14} strokeWidth={1.6} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{row.value}</span>
                      </div>
                      <p
                        style={{
                          fontSize: 11.5,
                          color: "var(--text-light)",
                          marginTop: 3,
                          fontWeight: 300,
                          lineHeight: 1.5,
                        }}
                      >
                        {row.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="admin-card" style={{ padding: "22px 24px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Accesos rápidos</h2>
            <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 4, marginBottom: 18, fontWeight: 300 }}>
              Atajos a las secciones principales del panel.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quickLinks.map((item) => (
                <Link
                  className="group transition-all duration-150 hover:translate-x-0.5 hover:border-[var(--border-gold)] hover:bg-[#faf8f4]"
                  href={item.href}
                  key={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "white",
                    border: "1px solid #ede9e2",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: "#f4f0e6",
                      color: "var(--moss)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.15s",
                    }}
                  >
                    <DashboardIcon name={item.icon} size={16} strokeWidth={1.7} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: "var(--text)",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 11.5,
                        color: "var(--text-light)",
                        marginTop: 2,
                        fontWeight: 300,
                      }}
                    >
                      {item.copy}
                    </span>
                  </span>
                  <span style={{ color: "#c0bbb4", flexShrink: 0 }}>
                    <DashboardIcon name="arrow" size={14} />
                  </span>
                </Link>
              ))}
            </div>

            <div
              style={{
                marginTop: 22,
                padding: 16,
                borderRadius: 12,
                background: "rgba(232, 208, 96, 0.1)",
                border: "1px solid var(--border-gold)",
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "var(--moss)",
                  marginBottom: 6,
                  letterSpacing: "0.02em",
                }}
              >
                Consejo
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-mid)",
                  lineHeight: 1.6,
                }}
              >
                {pendingTip}
              </div>
              <Link
                href="/admin/pedidos"
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--moss)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Ver pedidos activos
                <DashboardIcon name="arrow" size={13} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
