"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useToast } from "@/shared/hooks";
import { formatCLP, formatDate } from "@/shared/utils/formatters";

type ItemView = {
  productId: string;
  description: string | null;
  title: string | null;
  author: string | null;
  imageUrl: string | null;
  price: number | null;
  salePrice: number | null;
  isActive: boolean;
  inStock: boolean;
  missing: boolean;
};

type Detail = {
  id: string;
  status: "draft" | "archived";
  periodLabel: string | null;
  title: string | null;
  body: string | null;
  autoSaved: boolean;
  createdAt: string;
  updatedAt: string;
  items: ItemView[];
};

type ProductOption = {
  id: string;
  title: string;
  author: string | null;
  mainImageUrl: string | null;
  price: number;
  salePrice: number | null;
  effectivePrice: number;
  isActive?: boolean;
  inStock?: boolean;
};

type PublishPayload = {
  data?: { published: number; skipped: string[]; backedUp: boolean };
  message?: string;
};

function Thumb({ src }: { src: string | null }) {
  if (!src) {
    return <div style={{ width: 34, height: 48, borderRadius: 4, background: "var(--beige-warm)", flexShrink: 0 }} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt="" src={src} style={{ width: 34, height: 48, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
  );
}

export default function AdminSeleccionHistorialDetailPage() {
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [periodLabel, setPeriodLabel] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [items, setItems] = useState<ItemView[]>([]);

  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [searching, setSearching] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/landing/seleccion/historial/${id}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { data?: Detail; message?: string } | null;

      if (!response.ok || !payload?.data) {
        setError(payload?.message ?? "No se pudo cargar la selección.");
        return;
      }

      setDetail(payload.data);
      setPeriodLabel(payload.data.periodLabel ?? "");
      setTitle(payload.data.title ?? "");
      setBody(payload.data.body ?? "");
      setItems(payload.data.items);
      setDirty(false);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

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

  const isDraft = detail?.status === "draft";

  function markDirty<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
    };
  }

  function addProduct(option: ProductOption) {
    if (items.some((item) => item.productId === option.id)) {
      toast({ message: "Ese libro ya está en la selección.", variant: "error" });
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        productId: option.id,
        description: null,
        title: option.title,
        author: option.author,
        imageUrl: option.mainImageUrl,
        price: option.price,
        salePrice: option.salePrice,
        isActive: true,
        inStock: true,
        missing: false,
      },
    ]);
    setDirty(true);
    setSearch("");
    setOptions([]);
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    setDirty(true);
  }

  function moveItem(productId: string, direction: "up" | "down") {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.productId === productId);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
    setDirty(true);
  }

  /** Guarda los cambios. Devuelve true si quedó guardado. */
  async function save(): Promise<boolean> {
    if (!id || !detail) return false;

    const payload =
      detail.status === "draft"
        ? {
            periodLabel,
            title,
            body,
            items: items.map((item) => ({ productId: item.productId, description: item.description })),
          }
        : { periodLabel };

    try {
      const response = await fetch(`/api/admin/landing/seleccion/historial/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        toast({ message: data?.message ?? "No se pudo guardar.", variant: "error" });
        return false;
      }

      setDirty(false);
      return true;
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
      return false;
    }
  }

  async function handleSave() {
    setBusy(true);
    try {
      if (await save()) {
        toast({ message: isDraft ? "Borrador guardado." : "Nombre guardado." });
        await fetchDetail();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    if (!id || !detail) return;

    const name = periodLabel || title || "esta selección";
    const ok = window.confirm(
      `¿Publicar «${name}» en la tienda?\n\nReemplaza la selección que se ve hoy. La actual se guarda sola en el historial.`,
    );
    if (!ok) return;

    setBusy(true);
    try {
      if (isDraft && dirty && !(await save())) return;

      const response = await fetch(`/api/admin/landing/seleccion/historial/${id}/publicar`, { method: "POST" });
      const payload = (await response.json().catch(() => null)) as PublishPayload | null;

      if (!response.ok || !payload?.data) {
        toast({ message: payload?.message ?? "No se pudo publicar la selección.", variant: "error" });
        return;
      }

      const { published, skipped, backedUp } = payload.data;
      const parts = [`Selección publicada (${published} libro${published !== 1 ? "s" : ""}).`];
      if (backedUp) parts.push("La anterior quedó en el historial.");
      if (skipped.length > 0) parts.push(`No se incluyeron ${skipped.length} libro(s) que ya no están activos.`);
      toast({ message: parts.join(" "), variant: skipped.length > 0 ? "error" : "success" });

      window.location.href = "/admin/landing/seleccion";
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleDuplicate() {
    if (!id) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/landing/seleccion/historial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", sourceId: id }),
      });
      const payload = (await response.json().catch(() => null)) as { data?: { id: string }; message?: string } | null;

      if (!response.ok || !payload?.data) {
        toast({ message: payload?.message ?? "No se pudo copiar la selección.", variant: "error" });
        return;
      }

      window.location.href = `/admin/landing/seleccion/historial/${payload.data.id}`;
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm("¿Eliminar esta selección? No se puede deshacer.")) return;

    setBusy(true);
    try {
      const response = await fetch(`/api/admin/landing/seleccion/historial/${id}`, { method: "DELETE" });
      if (!response.ok) {
        toast({ message: "No se pudo eliminar.", variant: "error" });
        return;
      }
      window.location.href = "/admin/landing/seleccion/historial";
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  const heading = detail
    ? periodLabel || (detail.autoSaved ? "Respaldo automático" : isDraft ? "Borrador sin nombre" : "Selección guardada")
    : "Selección";

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">{heading}</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            {isDraft
              ? "Borrador: no se ve en la tienda hasta que lo publiques."
              : detail
                ? `Guardada el ${formatDate(detail.createdAt)}. Para modificarla, cópiala como borrador.`
                : ""}
          </p>
        </div>
        <Link
          className="text-sm text-text-mid transition-colors hover:text-text"
          href="/admin/landing/seleccion/historial"
        >
          ← Historial y borradores
        </Link>
      </div>

      {error ? <div className="admin-error-block">{error}</div> : null}

      {loading ? (
        <p className="text-sm text-text-light">Cargando...</p>
      ) : detail ? (
        <>
          <div className="editor-card">
            <div className="editor-card-header flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-text">Datos de la selección</h2>
                <p className="mt-0.5 text-[12px] text-text-light">
                  El título y la descripción son los que se muestran en el inicio al publicarla.
                </p>
              </div>
              <span className={`admin-badge ${isDraft ? "admin-badge--inactive" : "admin-badge--active"}`}>
                <span className="admin-badge-dot" />
                {isDraft ? "Borrador" : "En el historial"}
              </span>
            </div>
            <div className="editor-card-body">
              <div>
                <label className="admin-field-label" htmlFor="snap-label">Nombre interno</label>
                <input
                  className="admin-input"
                  id="snap-label"
                  onChange={(event) => markDirty(setPeriodLabel)(event.target.value)}
                  placeholder="Ej: Noviembre 2026"
                  style={{ maxWidth: 360 }}
                  value={periodLabel}
                />
                <p className="admin-field-help">Solo para reconocerla en el historial; no se muestra a los clientes.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="admin-field-label" htmlFor="snap-title">Título en la tienda</label>
                  <input
                    className="admin-input"
                    disabled={!isDraft}
                    id="snap-title"
                    onChange={(event) => markDirty(setTitle)(event.target.value)}
                    placeholder="Ej: Libros para educar"
                    value={title}
                  />
                </div>
                <div>
                  <label className="admin-field-label" htmlFor="snap-body">Descripción en la tienda</label>
                  <textarea
                    className="admin-input"
                    disabled={!isDraft}
                    id="snap-body"
                    onChange={(event) => markDirty(setBody)(event.target.value)}
                    style={{ height: "auto", minHeight: 84, resize: "vertical", paddingTop: 9, paddingBottom: 9 }}
                    value={body}
                  />
                </div>
              </div>
            </div>
          </div>

          {isDraft ? (
            <div className="editor-card">
              <div className="editor-card-header">
                <h2 className="text-[15px] font-semibold text-text">Agregar libro</h2>
                <p className="mt-0.5 text-[12px] text-text-light">Busca por título y agrégalo con un clic.</p>
              </div>
              <div className="editor-card-body">
                <input
                  className="admin-input"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ej: Biblia, rosario, autor…"
                  value={search}
                />
                {search.trim() ? (
                  <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", background: "white" }}>
                    {searching ? (
                      <p style={{ padding: "10px 14px", fontSize: 13, color: "var(--text-light)" }}>Buscando libros...</p>
                    ) : null}
                    {!searching && options.length === 0 ? (
                      <p style={{ padding: "10px 14px", fontSize: 13, color: "var(--text-light)" }}>Sin resultados</p>
                    ) : null}
                    {options.map((option, index) => (
                      <button
                        key={option.id}
                        onClick={() => addProduct(option)}
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
                        <Thumb src={option.mainImageUrl} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {option.title}
                          </p>
                          {option.author ? (
                            <p style={{ fontSize: 11.5, color: "var(--text-light)" }}>{option.author}</p>
                          ) : null}
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
          ) : null}

          <div className="editor-card">
            <div className="editor-card-header">
              <h2 className="text-[15px] font-semibold text-text">Libros de la selección</h2>
              <p className="mt-0.5 text-[12px] text-text-light">
                {items.length > 0
                  ? `${items.length} libro${items.length !== 1 ? "s" : ""} · el orden de aquí es el de la tienda`
                  : "Aún no hay libros."}
              </p>
            </div>
            {items.length === 0 ? (
              <p style={{ padding: "24px 20px", textAlign: "center", fontSize: 13, color: "var(--text-light)" }}>
                {isDraft ? "Usa el buscador de arriba para agregar el primer libro." : "Esta selección no tiene libros."}
              </p>
            ) : (
              <div>
                {items.map((item, index) => {
                  const note = item.missing
                    ? "Ya no existe en el catálogo"
                    : !item.isActive
                      ? "Oculto en la tienda"
                      : !item.inStock
                        ? "Sin stock"
                        : null;

                  return (
                    <article
                      key={item.productId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "12px 20px",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <Thumb src={item.imageUrl} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.title ?? "Libro eliminado"}
                        </p>
                        {item.author ? (
                          <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 1 }}>{item.author}</p>
                        ) : null}
                        {note ? (
                          <p style={{ fontSize: 11.5, color: "var(--error)", marginTop: 2 }}>
                            {note}
                            {item.missing || !item.isActive ? " · no se publicará" : " · el inicio lo oculta mientras no haya stock"}
                          </p>
                        ) : null}
                      </div>
                      {isDraft ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                          <button
                            aria-label="Mover arriba"
                            className="admin-icon-btn"
                            disabled={index === 0}
                            onClick={() => moveItem(item.productId, "up")}
                            type="button"
                          >
                            ↑
                          </button>
                          <button
                            aria-label="Mover abajo"
                            className="admin-icon-btn"
                            disabled={index === items.length - 1}
                            onClick={() => moveItem(item.productId, "down")}
                            type="button"
                          >
                            ↓
                          </button>
                          <button
                            className="admin-btn-secondary"
                            onClick={() => removeItem(item.productId)}
                            style={{ height: 30, color: "var(--error)" }}
                            type="button"
                          >
                            Quitar
                          </button>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}
            <div className="editor-card-footer" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <button
                className="admin-btn-secondary"
                disabled={busy}
                onClick={() => { void handleDelete(); }}
                style={{ color: "var(--error)" }}
                type="button"
              >
                Eliminar
              </button>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {!isDraft ? (
                  <button className="admin-btn-secondary" disabled={busy} onClick={() => { void handleDuplicate(); }} type="button">
                    Copiar como borrador
                  </button>
                ) : null}
                <button
                  className="admin-btn-secondary"
                  disabled={busy || !dirty}
                  onClick={() => { void handleSave(); }}
                  type="button"
                >
                  {isDraft ? "Guardar borrador" : "Guardar nombre"}
                </button>
                <button className="admin-btn-primary" disabled={busy} onClick={() => { void handlePublish(); }} type="button">
                  {isDraft ? "Publicar ahora" : "Publicar de nuevo"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
