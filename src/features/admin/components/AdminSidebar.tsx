"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "class-variance-authority";

import { AdminLogoutButton } from "./admin-logout-button";

type SidebarItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: number;
};

const sections: { label: string; items: SidebarItem[] }[] = [
  {
    label: "Principal",
    items: [
      { href: "/admin", label: "Dashboard", icon: "▦", exact: true },
      { href: "/admin/pedidos", label: "Pedidos", icon: "◫" },
    ],
  },
  {
    label: "Catalogo",
    items: [
      { href: "/admin/productos", label: "Productos", icon: "▣" },
      { href: "/admin/categorias", label: "Categorias", icon: "◈" },
    ],
  },
  {
    label: "Pagina principal",
    items: [
      { href: "/admin/landing/hero", label: "Hero", icon: "◆" },
      { href: "/admin/landing/banners", label: "Banners", icon: "▤" },
      { href: "/admin/landing/seleccion", label: "Seleccion del mes", icon: "✦" },
      { href: "/admin/landing/footer", label: "Footer", icon: "—" },
    ],
  },
  {
    label: "Sistema",
    items: [{ href: "/admin/cupones", label: "Cupones", icon: "%" }],
  },
];

export interface AdminSidebarProps {
  adminName: string;
}

export function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [pendingOrders, setPendingOrders] = useState<number>(0);

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

  return (
    <aside className="relative flex h-screen w-[248px] shrink-0 flex-col overflow-hidden border-r border-r-[rgba(217,186,30,0.15)] bg-moss">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_38%)]" />

      <div className="relative border-b border-b-white/10 px-5 pb-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-[8px] bg-gold text-[15px] text-moss shadow-[0_8px_20px_rgba(217,186,30,0.22)]">
            ✝
          </div>
          <div>
            <p className="font-serif text-[1.35rem] text-white">Crecer</p>
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/45">Admin panel</p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-3 py-4">
        {itemsWithBadges.map((section) => (
          <div className="mb-4" key={section.label}>
            <p className="px-[10px] pb-[6px] pt-[14px] text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/35">
              {section.label}
            </p>
            <div>
              {section.items.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <Link
                    className={cx(
                      "mb-1 flex items-center gap-[10px] rounded-[10px] border px-3 py-[10px] transition-all duration-200 hover:bg-white/8",
                      isActive
                        ? "border-[rgba(217,186,30,0.25)] bg-[rgba(217,186,30,0.15)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                        : "border-transparent",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <span className={cx("w-[18px] text-[15px]", isActive ? "text-gold" : "text-white/55")}>
                      {item.icon}
                    </span>
                    <span className={cx("text-[0.81rem]", isActive ? "font-medium text-white" : "text-white/65")}>
                      {item.label}
                    </span>
                    {item.badge ? (
                      <span className="ml-auto rounded-[10px] bg-error px-[6px] py-[2px] text-[0.6rem] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="relative border-t border-t-white/10 px-[18px] py-[14px]">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gold),var(--gold-light))] text-xs font-semibold text-moss shadow-[0_8px_18px_rgba(217,186,30,0.18)]">
            {adminName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.78rem] font-medium text-white">{adminName}</p>
            <p className="text-[0.65rem] text-white/40">Administrador</p>
          </div>
          <AdminLogoutButton
            className="rounded-[8px] border border-white/10 px-2 py-1 text-[0.72rem] text-white/45 transition-colors hover:border-error/25 hover:text-error"
            label="Salir"
          />
        </div>
      </div>
    </aside>
  );
}
