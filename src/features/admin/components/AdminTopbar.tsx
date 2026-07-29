"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { toCleanAdminPath } from "../routing";

// Paths "limpios" (sin prefijo /admin) — el mas generico ("") va al final para actuar como catch-all.
const sectionTitles = [
  { match: "/productos", title: "Catálogo de libros" },
  { match: "/categorias", title: "Categorías" },
  { match: "/pedidos", title: "Gestión de pedidos" },
  { match: "/envios", title: "Envíos" },
  { match: "/encuentros", title: "Encuentros" },
  { match: "/nosotros", title: "Página Conócenos" },
  { match: "/landing/hero-final", title: "Hero final" },
  { match: "/landing/hero", title: "Editor del hero" },
  { match: "/landing/top-banner", title: "Top banner" },
  { match: "/landing/banners", title: "Banners del landing" },
  { match: "/landing/seleccion", title: "Selección del mes" },
  { match: "/landing/categorias", title: "Categorías del landing" },
  { match: "/landing/footer", title: "Footer del sitio" },
  { match: "/landing", title: "Página principal" },
  { match: "", title: "Dashboard" },
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
    const cleanPathname = toCleanAdminPath(pathname);
    return sectionTitles.find((item) => cleanPathname.startsWith(item.match))?.title ?? "Panel admin";
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
