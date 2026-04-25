"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminLogoutButton } from "./admin-logout-button";

const sectionTitles = [
  { match: "/admin/productos", title: "Catálogo de libros" },
  { match: "/admin/categorias", title: "Categorías" },
  { match: "/admin/pedidos", title: "Gestión de pedidos" },
  { match: "/admin/landing/hero", title: "Editor del hero" },
  { match: "/admin/landing/banners", title: "Banners del landing" },
  { match: "/admin/landing/seleccion", title: "Selección del mes" },
  { match: "/admin/landing/categorias", title: "Categorías del landing" },
  { match: "/admin/landing/footer", title: "Footer del sitio" },
  { match: "/admin/nosotros", title: "Página Conócenos" },
  { match: "/admin/cupones", title: "Cupones" },
  { match: "/admin/landing", title: "Página principal" },
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
    <div className="h-[60px] shrink-0 border-b border-[#ede9e2] bg-white">
      <div className="mx-auto flex h-full w-[min(100%,1440px)] items-center justify-between" style={{ paddingInline: "clamp(16px, 2vw, 28px)" }}>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium leading-none text-text">{title}</p>
          {adminName ? (
            <p className="mt-1 text-[10.5px] uppercase tracking-[0.09em] text-text-light">
              Sesión activa · {adminName}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <div className="hidden md:block">
            <input
              className="h-9 w-60 rounded-[10px] border border-border bg-[#faf9f7] px-3.5 text-[13px] text-text placeholder:text-text-light transition-colors focus:border-gold focus:bg-white focus:outline-none"
              placeholder="Buscar en admin..."
              type="search"
            />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="relative flex size-9 items-center justify-center rounded-[10px] border border-border bg-white text-[13px] text-text-mid">
              🔔
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-gold ring-2 ring-white" />
            </span>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-[10px] border border-transparent bg-moss px-4 text-[13px] font-semibold text-white transition-colors hover:bg-moss-mid"
              href="/admin/productos/nuevo"
            >
              + Nuevo producto
            </Link>
          </div>
          <AdminLogoutButton
            className="rounded-[10px] border border-border bg-white px-3 py-2 text-[13px] text-text-mid transition-colors hover:border-moss/40 hover:bg-white hover:text-moss"
          />
        </div>
      </div>
    </div>
  );
}
