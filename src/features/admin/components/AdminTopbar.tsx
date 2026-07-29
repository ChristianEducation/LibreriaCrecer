"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

const sectionTitles = [
  { match: "/admin/productos", title: "Catálogo de libros" },
  { match: "/admin/categorias", title: "Categorías" },
  { match: "/admin/pedidos", title: "Gestión de pedidos" },
  { match: "/admin/envios", title: "Envíos" },
  { match: "/admin/encuentros", title: "Encuentros" },
  { match: "/admin/nosotros", title: "Página Conócenos" },
  { match: "/admin/landing/hero-final", title: "Hero final" },
  { match: "/admin/landing/hero", title: "Editor del hero" },
  { match: "/admin/landing/top-banner", title: "Top banner" },
  { match: "/admin/landing/banners", title: "Banners del landing" },
  { match: "/admin/landing/seleccion", title: "Selección del mes" },
  { match: "/admin/landing/categorias", title: "Categorías del landing" },
  { match: "/admin/landing/footer", title: "Footer del sitio" },
  { match: "/admin/landing", title: "Página principal" },
  { match: "/admin", title: "Dashboard" },
] as const;

export interface AdminTopbarProps {
  onOpenMenu: () => void;
}

/**
 * Barra visible solo en mobile (<768px, ver .admin-mobile-topbar en globals.css).
 * En desktop la navegación vive únicamente en AdminSidebar.
 */
export function AdminTopbar({ onOpenMenu }: AdminTopbarProps) {
  const pathname = usePathname();

  const title = useMemo(() => {
    return sectionTitles.find((item) => pathname.startsWith(item.match))?.title ?? "Panel admin";
  }, [pathname]);

  return (
    <div className="admin-mobile-topbar">
      <button
        aria-label="Abrir menú"
        onClick={onOpenMenu}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: 8,
          border: "1px solid #ede9e2",
          background: "white",
          color: "var(--text)",
          cursor: "pointer",
        }}
        type="button"
      >
        <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 20 20" width="16">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {title}
      </p>
    </div>
  );
}
