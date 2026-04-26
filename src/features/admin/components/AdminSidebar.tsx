"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminLogoutButton } from "./admin-logout-button";

type SidebarIconName =
  | "grid"
  | "book"
  | "tag"
  | "box"
  | "layout"
  | "image"
  | "banner"
  | "star"
  | "list"
  | "footer"
  | "info"
  | "logout"
  | "chev-left"
  | "chev-right";

type SidebarItem = {
  href: string;
  label: string;
  icon: SidebarIconName;
  exact?: boolean;
  badge?: number;
};

const sections: { label: string; items: SidebarItem[] }[] = [
  {
    label: "Dashboard",
    items: [
      { href: "/admin", label: "Panel principal", icon: "grid", exact: true },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Productos", icon: "book" },
      { href: "/admin/categorias", label: "Categorías", icon: "tag" },
    ],
  },
  {
    label: "Pedidos",
    items: [
      { href: "/admin/pedidos", label: "Pedidos", icon: "box" },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/landing", label: "Landing", icon: "layout", exact: true },
      { href: "/admin/landing/top-banner", label: "Top Banner", icon: "banner" },
      { href: "/admin/landing/hero", label: "Hero principal", icon: "image" },
      { href: "/admin/landing/seleccion", label: "Selección del mes", icon: "star" },
      { href: "/admin/landing/categorias", label: "Categorías del landing", icon: "list" },
      { href: "/admin/landing/hero-final", label: "Hero final", icon: "image" },
      { href: "/admin/landing/footer", label: "Footer", icon: "footer" },
      { href: "/admin/nosotros", label: "Página Conócenos", icon: "info" },
    ],
  },
];

function SidebarIcon({ name, size = 16, strokeWidth = 1.6 }: { name: SidebarIconName; size?: number; strokeWidth?: number }) {
  const paths: Record<SidebarIconName, string> = {
    grid: "M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z",
    book: "M4 2h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM9 2v16",
    tag: "M3 3h6l8 8-6 6-8-8V3zM7 7h.01",
    box: "M10 2l8 4.5v7L10 18l-8-4.5v-7L10 2zM10 2v16M2 6.5l8 4.5 8-4.5",
    layout: "M2 3h16v5H2zM2 11h7v7H2zM12 11h6v7h-6z",
    image: "M2 4h16v12H2zM2 13l5-5 4 4 3-3 4 4",
    banner: "M2 6h16v8H2zM6 6v8M14 6v8",
    star: "M10 2l2.4 5.2 5.6.8-4 4 .9 5.6L10 15l-4.9 2.6.9-5.6-4-4 5.6-.8z",
    list: "M3 5h14M3 10h14M3 15h10",
    footer: "M2 14h16M2 17h10",
    info: "M10 9v6M10 6h.01M3 10a7 7 0 1 0 14 0 7 7 0 0 0-14 0z",
    logout: "M13 5l5 5-5 5M7 10h11M7 3H3v14h4",
    "chev-left": "M12 4l-6 6 6 6",
    "chev-right": "M8 4l6 6-6 6",
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

export interface AdminSidebarProps {
  adminName: string;
}

export function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await fetch("/api/admin/pedidos/stats", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          data?: { byStatus?: { pending?: number } };
        };

        if (!cancelled) {
          setPendingOrders(payload.data?.byStatus?.pending ?? 0);
        }
      } catch {
        if (!cancelled) {
          setPendingOrders(0);
        }
      }
    }

    void loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const itemsWithBadges = useMemo(() => {
    return sections.map((section) => ({
      ...section,
      items: section.items.map((item) =>
        item.href === "/admin/pedidos" ? { ...item, badge: pendingOrders || undefined } : item,
      ),
    }));
  }, [pendingOrders]);

  const width = collapsed ? 60 : 220;
  const initials = adminName.slice(0, 1).toUpperCase();

  return (
    <aside
      style={{
        width,
        flexShrink: 0,
        height: "100vh",
        background: "#17140f",
        color: "white",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "width 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "width",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(circle at top left, rgba(232, 208, 96, 0.10), transparent 34%)",
        }}
      />

      <div
        style={{
          position: "relative",
          padding: collapsed ? "20px 0 16px" : "22px 20px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "linear-gradient(135deg, var(--gold), var(--moss-mid))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          C
        </div>
        <div
          style={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : "auto",
            overflow: "hidden",
            transition: "opacity 150ms ease",
            whiteSpace: "nowrap",
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 700, color: "#f5f0e8", letterSpacing: "-0.02em", lineHeight: 1 }}>
            Crecer
          </p>
          <p
            style={{
              marginTop: 4,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.35)",
            }}
          >
            Admin panel
          </p>
        </div>
      </div>

      <nav
        style={{
          position: "relative",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "12px 0",
        }}
      >
        {itemsWithBadges.filter((section) => section.items.length > 0).map((section) => (
          <div key={section.label} style={{ marginBottom: 4 }}>
            <p
              style={{
                padding: "12px 20px 6px",
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.22)",
                opacity: collapsed ? 0 : 1,
                height: collapsed ? 0 : "auto",
                overflow: "hidden",
                transition: "opacity 150ms ease",
                whiteSpace: "nowrap",
              }}
            >
              {section.label}
            </p>
            <div>
              {section.items.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <Link
                    className="admin-sidebar-link"
                    href={item.href}
                    key={item.href}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      minHeight: 36,
                      padding: collapsed ? "9px 0" : "9px 20px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      background: isActive ? "rgba(255, 255, 255, 0.07)" : "transparent",
                      borderLeft: `2px solid ${isActive ? "var(--gold)" : "transparent"}`,
                      color: isActive ? "#f5f0e8" : "rgba(255, 255, 255, 0.55)",
                      textDecoration: "none",
                      transition: "background-color 150ms ease, color 150ms ease",
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: isActive ? "var(--gold)" : "rgba(255, 255, 255, 0.55)",
                        position: "relative",
                      }}
                    >
                      <SidebarIcon name={item.icon} size={16} />
                      {item.badge && collapsed ? (
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            top: -3,
                            right: -4,
                            width: 7,
                            height: 7,
                            borderRadius: 999,
                            background: "var(--gold)",
                            border: "1.5px solid #17140f",
                          }}
                        />
                      ) : null}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: 13.5,
                        fontWeight: isActive ? 600 : 400,
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : "auto",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        transition: "opacity 150ms ease",
                      }}
                    >
                      {item.label}
                    </span>
                    {item.badge && !collapsed ? (
                      <span
                        style={{
                          marginLeft: "auto",
                          background: "var(--gold)",
                          color: "var(--moss)",
                          fontSize: 10.5,
                          fontWeight: 700,
                          lineHeight: 1,
                          padding: "3px 8px",
                          borderRadius: 999,
                          flexShrink: 0,
                        }}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
        style={{
          position: "relative",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "12px 0" : "12px 20px",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: "rgba(200, 168, 48, 0.35)",
              color: "#f5e8c8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
            title={collapsed ? adminName : undefined}
          >
            {initials}
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              overflow: "hidden",
              transition: "opacity 150ms ease",
              whiteSpace: "nowrap",
            }}
          >
            <p
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#f5f0e8",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {adminName}
            </p>
            <p
              style={{
                marginTop: 2,
                fontSize: 10.5,
                color: "rgba(255, 255, 255, 0.35)",
              }}
            >
              Administrador
            </p>
          </div>
          <AdminLogoutButton
            className="admin-sidebar-logout"
            icon={<SidebarIcon name="logout" size={15} />}
            label="Cerrar sesión"
            showLabel={false}
            title="Cerrar sesión"
          />
        </div>

        <button
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          onClick={() => setCollapsed((value) => !value)}
          style={{
            width: "100%",
            padding: "10px 0",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255, 255, 255, 0.32)",
            borderTop: "1px solid rgba(255, 255, 255, 0.04)",
            transition: "color 150ms ease",
          }}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          type="button"
        >
          <SidebarIcon name={collapsed ? "chev-right" : "chev-left"} size={16} strokeWidth={1.8} />
        </button>
      </div>

      <style jsx>{`
        .admin-sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.85);
        }
        :global(.admin-sidebar-logout) {
          background: transparent;
          border: none;
          padding: 6px;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.45);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: color 150ms ease, background-color 150ms ease;
          flex-shrink: 0;
        }
        :global(.admin-sidebar-logout:hover) {
          color: var(--gold);
          background-color: rgba(255, 255, 255, 0.06);
        }
      `}</style>
    </aside>
  );
}
