"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminLogoutButton } from "./admin-logout-button";

const sectionTitles = [
  { match: "/admin/productos", title: "Catalogo de libros" },
  { match: "/admin/categorias", title: "Categorias" },
  { match: "/admin/pedidos", title: "Gestion de pedidos" },
  { match: "/admin/landing/hero", title: "Editor del hero" },
  { match: "/admin/landing/banners", title: "Banners del landing" },
  { match: "/admin/landing/seleccion", title: "Seleccion del mes" },
  { match: "/admin/landing/footer", title: "Footer del sitio" },
  { match: "/admin/cupones", title: "Cupones" },
  { match: "/admin/landing", title: "Pagina principal" },
  { match: "/admin", title: "Dashboard" },
] as const;

export interface AdminTopbarProps {
  initialAdminName?: string;
}

export function AdminTopbar({ initialAdminName }: AdminTopbarProps) {
  const pathname = usePathname();
  const [adminName, setAdminName] = useState(initialAdminName ?? "");

  useEffect(() => {
    let cancelled = false;

    async function loadAdmin() {
      try {
        const response = await fetch("/api/admin/auth/me", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { data?: { admin?: { name?: string } } };
        if (!cancelled && payload.data?.admin?.name) {
          setAdminName(payload.data.admin.name);
        }
      } catch {
        // Best effort only.
      }
    }

    void loadAdmin();
    return () => {
      cancelled = true;
    };
  }, []);

  const title = useMemo(() => {
    return sectionTitles.find((item) => pathname.startsWith(item.match))?.title ?? "Panel admin";
  }, [pathname]);

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-[color-mix(in_srgb,var(--beige)_95%,transparent)] px-7 backdrop-blur-[12px]">
      <div>
        <p className="text-[0.9rem] font-semibold text-text">{title}</p>
        {adminName ? <p className="mt-1 text-[0.68rem] text-text-light">Sesion activa: {adminName}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <input
            className="h-10 min-w-60 rounded-[8px] border border-border bg-white px-4 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none"
            placeholder="Buscar en admin..."
            type="search"
          />
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <span className="relative flex size-10 items-center justify-center rounded-[8px] border border-border bg-white text-text-mid">
            🔔
            <span className="absolute right-2 top-2 size-2 rounded-full bg-error" />
          </span>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-[8px] bg-moss px-4 text-[0.78rem] font-semibold text-white transition-colors hover:bg-moss-mid"
            href="/admin/productos/nuevo"
          >
            + Nuevo producto
          </Link>
        </div>
        <AdminLogoutButton
          className="rounded-[8px] border border-border px-3 py-2 text-sm text-text-mid transition-colors hover:border-moss hover:text-moss"
        />
      </div>
    </div>
  );
}
