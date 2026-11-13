"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AdminToggle } from "@/features/admin/components";
import { GIFT_OCCASIONS, giftSection } from "@/shared/config/regalos";
import { useToast } from "@/shared/hooks";
import { formatCLP } from "@/shared/utils/formatters";

type CuratedRow = {
  id: string;
  productId: string;
  displayOrder: number;
  isActive: boolean;
  productTitle: string;
  productAuthor: string | null;
  productImage: string | null;
};

type ProductOption = {
  id: string;
  title: string;
  author: string | null;
  mainImageUrl: string | null;
  effectivePrice: number;
};

const NAVIDAD_KEY = "regalos.navidad";

function Thumb({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return <div style={{ width: 34, height: 48, borderRadius: 4, background: "var(--beige-warm)", flexShrink: 0 }} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} style={{ width: 34, height: 48, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
  );
}

export default function AdminLandingRegalosPage() {
  const { toast } = useToast();
  const [occasionSlug, setOccasionSlug] = useState<string>(GIFT_OCCASIONS[0].slug);
  const [items, setItems] = useState<CuratedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [navidadActive, setNavidadActive] = useState(false);
  const [navidadSaving, setNavidadSaving] = useState(false);

  const occasion = GIFT_OCCASIONS.find((entry) => entry.slug === occasionSlug) ?? GIFT_OCCASIONS[0];
  const section = giftSection(occasion.slug);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/landing/seleccion?section=${encodeURIComponent(section)}`, {
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as { data?: CuratedRow[]; message?: string } | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudieron cargar los productos.");
        return;
      }

      setItems(payload?.data ?? []);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [section]);

  const fetchNavidad = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/landing/section-copy/${NAVIDAD_KEY}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { data?: { isActive: boolean } | null } | null;
      setNavidadActive(Boolean(response.ok && payload?.data?.isActive));
    } catch {
      setNavidadActive(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    void fetchNavidad();
  }, [fetchNavidad]);

  useEffect(() => {
    setSearch("");
    setOptions([]);
  }, [occasionSlug]);

  useEffect(() => {
    if (!search.trim()) {
      setOptions([]);
      setSearching(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `/api/admin/productos?page=1&limit=8&search=${encodeURIComponent(search.trim())}`,
          { cache: "no-store" },
        );
        const payload = (await response.json().catch(() => null)) as { data?: ProductOption[] } | null;
        if (response.ok) setOptions(payload?.data ?? []);
      } catch {
        setOptions([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  async function toggleNavidad(next: boolean) {
    setNavidadSaving(true);
    try {
      const response = await fetch(`/api/admin/landing/section-copy/${NAVIDAD_KEY}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: next }),
      });

      if (!response.ok) {
        toast({ message: "No se pudo cambiar el estado de Navidad.", variant: "error" });
        return;
      }

      setNavidadActive(next);
      toast({ message: next ? "Navidad aparece ahora en la tienda." : "Navidad oculta de la tienda." });
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setNavidadSaving(false);
    }
  }

  async function addProduct(option: ProductOption) {
    if (items.some((item) => item.productId === option.id)) {
      toast({ message: "Ese producto ya está en esta ocasión.", variant: "error" });
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/admin/landing/seleccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: option.id,
          section,
          display_order: items.length,
          is_active: true,
        }),
      });

      if (!response.ok) {
        toast({ message: "No se pudo agregar el producto.", variant: "error" });
        return;
      }

      setSearch("");
      setOptions([]);
      toast({ message: `Agregado a "${occasion.label}".` });
      await fetchItems();
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(id: string) {
    if (!window.confirm(`¿Quitar este producto de "${occasion.label}"?`)) return;

    setBusy(true);
    try {
      const response = await fetch(`/api/admin/landing/seleccion/${id}`, { method: "DELETE" });
      if (!response.ok) {
        toast({ message: "No se pudo quitar el producto.", variant: "error" });
        return;
      }

      toast({ message: "Producto quitado." });
      await fetchItems();
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const index = items.findIndex((item) => item.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= items.length) return;

    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    setItems(reordered);

    try {
      const response = await fetch("/api/admin/landing/seleccion/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, productIds: reordered.map((item) => item.id) }),
      });

      if (!response.ok) {
        toast({ message: "No se pudo guardar el orden.", variant: "error" });
        await fetchItems();
      }
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
      await fetchItems();
    }
  }

  const showDropdown = search.trim().length > 0;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Regalos con intención</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Elige qué productos aparecen en cada ocasión de la página de regalos. El orden se replica en la tienda.
          </p>
        </div>
        <Link className="text-sm text-text-mid transition-colors hover:text-text" href="/admin/landing">
          ← Volver a Landing
        </Link>
      </div>

      <div className="editor-card">
        <div className="editor-card-body">
          <p className="admin-section-label">Ocasión</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GIFT_OCCASIONS.map((entry) => (
              <button
                key={entry.slug}
                className={entry.slug === occasionSlug ? "admin-btn-primary" : "admin-btn-secondary"}
                onClick={() => setOccasionSlug(entry.slug)}
                style={{ padding: "6px 14px", fontSize: 13 }}
                type="button"
              >
                {entry.label}
                {entry.seasonal ? " (temporada)" : ""}
              </button>
            ))}
          </div>

          {occasion.seasonal ? (
            <div className="mt-4 rounded-[10px] border border-border bg-[#faf9f6] px-4">
              <AdminToggle
                checked={navidadActive}
                description="Encendida: Navidad aparece en el home y en la página de regalos. Apagada: queda oculta, sin perder los productos asignados."
                disabled={navidadSaving}
                label="Mostrar Navidad en la tienda"
                onChange={(checked) => { void toggleNavidad(checked); }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="editor-card">
        <div className="editor-card-header">
          <h2 className="text-[15px] font-semibold text-text">Agregar producto a «{occasion.label}»</h2>
          <p className="mt-0.5 text-[12px] text-text-light">Busca por título y agrégalo con un clic.</p>
        </div>
        <div className="editor-card-body">
          <input
            className="admin-input"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ej: rosario, medalla, Biblia…"
            value={search}
          />

          {showDropdown ? (
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", background: "white", marginTop: 8 }}>
              {searching ? (
                <p style={{ padding: "10px 14px", fontSize: 13, color: "var(--text-light)" }}>Buscando productos...</p>
              ) : null}
              {!searching && options.length === 0 ? (
                <p style={{ padding: "10px 14px", fontSize: 13, color: "var(--text-light)" }}>Sin resultados</p>
              ) : null}
              {options.map((option, index) => (
                <button
                  key={option.id}
                  disabled={busy}
                  onClick={() => { void addProduct(option); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "9px 14px",
                    background: "transparent",
                    border: "none",
                    borderTop: index > 0 ? "1px solid var(--border)" : "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  type="button"
                >
                  <Thumb alt="" src={option.mainImageUrl} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {option.title}
                    </p>
                    {option.author ? <p style={{ fontSize: 11.5, color: "var(--text-light)" }}>{option.author}</p> : null}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600, flexShrink: 0 }}>
                    {formatCLP(option.effectivePrice)}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="editor-card">
        <div className="editor-card-header">
          <h2 className="text-[15px] font-semibold text-text">Productos en «{occasion.label}»</h2>
          <p className="mt-0.5 text-[12px] text-text-light">
            {items.length > 0
              ? `${items.length} producto${items.length !== 1 ? "s" : ""} · orden manual activo`
              : "Aún no hay productos en esta ocasión."}
          </p>
        </div>

        {error ? <div className="admin-error-block" style={{ margin: 16 }}>{error}</div> : null}

        {loading ? (
          <p style={{ padding: 20, fontSize: 13, color: "var(--text-light)" }}>Cargando...</p>
        ) : items.length === 0 ? (
          <p style={{ padding: "32px 20px", textAlign: "center", fontSize: 13, color: "var(--text-light)" }}>
            Usa el buscador de arriba para agregar el primer producto.
          </p>
        ) : (
          <div>
            {items.map((item, index) => (
              <article
                key={item.id}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderTop: "1px solid var(--border)" }}
              >
                <Thumb alt={item.productTitle} src={item.productImage} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.productTitle}
                  </p>
                  {item.productAuthor ? (
                    <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 1 }}>{item.productAuthor}</p>
                  ) : null}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <button
                    aria-label="Mover arriba"
                    disabled={index === 0}
                    onClick={() => { void moveItem(item.id, "up"); }}
                    style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "transparent", opacity: index === 0 ? 0.35 : 1, cursor: index === 0 ? "not-allowed" : "pointer" }}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    aria-label="Mover abajo"
                    disabled={index === items.length - 1}
                    onClick={() => { void moveItem(item.id, "down"); }}
                    style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "transparent", opacity: index === items.length - 1 ? 0.35 : 1, cursor: index === items.length - 1 ? "not-allowed" : "pointer" }}
                    type="button"
                  >
                    ↓
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => { void removeItem(item.id); }}
                    style={{ padding: "4px 12px", fontSize: 12, border: "1px solid rgba(185,74,72, 0.25)", borderRadius: 6, background: "transparent", color: "var(--error)", cursor: "pointer" }}
                    type="button"
                  >
                    Quitar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
