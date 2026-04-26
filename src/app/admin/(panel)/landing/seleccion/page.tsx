"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminToggle } from "@/features/admin/components";
import { MONTHLY_SELECTION_SECTION } from "@/shared/config/landing";
import { useToast } from "@/shared/hooks";
import { formatCLP } from "@/shared/utils/formatters";

type CuratedRow = {
  id: string;
  productId: string;
  section: string;
  description: string | null;
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
  price: number;
  salePrice: number | null;
  effectivePrice: number;
};

type SectionCopyState = {
  title: string;
  body: string;
};

type CuratedFormState = {
  id?: string;
  product_id: string;
  description: string;
  display_order: number;
  is_active: boolean;
};

const initialForm: CuratedFormState = {
  product_id: "",
  description: "",
  display_order: 0,
  is_active: true,
};

const initialSectionCopy: SectionCopyState = {
  title: "",
  body: "",
};

function SpinnerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="animate-spin"
      fill="none"
      height="14"
      viewBox="0 0 20 20"
      width="14"
    >
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2.4"
      />
      <path
        d="M17 10a7 7 0 00-7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export default function AdminLandingSeleccionPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<CuratedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CuratedFormState>(initialForm);
  const [productSearch, setProductSearch] = useState("");
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [sectionCopy, setSectionCopy] = useState<SectionCopyState>(initialSectionCopy);
  const [sectionCopySaving, setSectionCopySaving] = useState(false);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const query = `?section=${encodeURIComponent(MONTHLY_SELECTION_SECTION)}`;
      const response = await fetch(`/api/admin/landing/seleccion${query}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        data?: CuratedRow[];
        message?: string;
      } | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudo cargar la selección.");
        return;
      }

      setItems(payload?.data ?? []);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchSectionCopy() {
    try {
      const response = await fetch("/api/admin/landing/section-copy/libros_mes", {
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as {
        data?: {
          title: string | null;
          body: string | null;
        } | null;
        message?: string;
      } | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudo cargar el copy de la sección.");
        return;
      }

      setSectionCopy({
        title: payload?.data?.title ?? "",
        body: payload?.data?.body ?? "",
      });
    } catch {
      setError("No se pudo cargar el copy de la sección.");
    }
  }

  useEffect(() => {
    void fetchItems();
    void fetchSectionCopy();
  }, []);

  useEffect(() => {
    if (!productSearch.trim()) {
      setProductOptions([]);
      setProductSearchLoading(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setProductSearchLoading(true);
      try {
        const response = await fetch(
          `/api/admin/productos?page=1&limit=8&search=${encodeURIComponent(productSearch.trim())}`,
          { cache: "no-store" },
        );
        const payload = (await response.json().catch(() => null)) as
          | { data?: ProductOption[]; message?: string }
          | null;
        if (!response.ok) return;
        setProductOptions(payload?.data ?? []);
      } finally {
        setProductSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [productSearch]);

  async function submitSectionCopy(event: React.FormEvent) {
    event.preventDefault();
    setSectionCopySaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/landing/section-copy/libros_mes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sectionCopy.title,
          body: sectionCopy.body,
          is_active: true,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        const message = data?.message ?? "No se pudo guardar el copy de la sección.";
        setError(message);
        toast({ message, variant: "error" });
        return;
      }

      toast({ message: "Copy de Selección del mes actualizado." });
      await fetchSectionCopy();
    } finally {
      setSectionCopySaving(false);
    }
  }

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        product_id: form.product_id,
        section: MONTHLY_SELECTION_SECTION,
        description: form.description || undefined,
        display_order: form.id ? Number(form.display_order || 0) : items.length,
        is_active: form.is_active,
      };

      const endpoint = form.id
        ? `/api/admin/landing/seleccion/${form.id}`
        : "/api/admin/landing/seleccion";
      const method = form.id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        const message = data?.message ?? "No se pudo guardar el item curado.";
        setError(message);
        toast({ message, variant: "error" });
        setSaving(false);
        return;
      }

      setForm(initialForm);
      setProductSearch("");
      setProductOptions([]);
      toast({ message: "Selección del mes actualizada." });
      await fetchItems();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: CuratedRow) {
    setForm({
      id: item.id,
      product_id: item.productId,
      description: item.description ?? "",
      display_order: item.displayOrder,
      is_active: item.isActive,
    });
    setProductSearch(item.productTitle);
    setProductOptions([]);
  }

  function cancelEdit() {
    setForm(initialForm);
    setProductSearch("");
    setProductOptions([]);
  }

  async function removeItem(id: string) {
    if (!window.confirm("¿Quitar este producto de la selección del mes?")) return;

    const response = await fetch(`/api/admin/landing/seleccion/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const message = "No se pudo eliminar el item.";
      setError(message);
      toast({ message, variant: "error" });
      return;
    }

    toast({ message: "Producto quitado de la selección del mes." });
    await fetchItems();
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const sectionItems = [...items];
    const currentIndex = sectionItems.findIndex((item) => item.id === id);
    if (currentIndex < 0) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sectionItems.length) return;

    const reordered = [...sectionItems];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    await fetch("/api/admin/landing/seleccion/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section: MONTHLY_SELECTION_SECTION,
        productIds: reordered.map((item) => item.id),
      }),
    });

    await fetchItems();
  }

  const showDropdown = productSearch.trim().length > 0 && !form.product_id;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Selección del mes</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Colección editorial curada. El orden manual se replica en el home y en el filtro del
            catálogo.
          </p>
        </div>
        <Link
          className="text-sm text-text-mid transition-colors hover:text-text"
          href="/admin/landing"
        >
          ← Volver a Landing
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-text-light">Cargando...</p>
      ) : (
        <>
          <form className="editor-card" onSubmit={(event) => { void submitSectionCopy(event); }}>
            <div className="editor-card-header flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-text">Copy del bloque</h2>
                <p className="mt-0.5 text-[12px] text-text-light">
                  Edita el título y la introducción general que aparecen en el home.
                </p>
              </div>
              <span className="admin-badge admin-badge--active">
                <span className="admin-badge-dot" />
                landing_section_copy
              </span>
            </div>

            <div className="editor-card-body">
              <section className="admin-fieldset">
                <p className="admin-section-label">Texto editorial</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="admin-field-label" htmlFor="section-title">
                      Título de la sección
                    </label>
                    <input
                      id="section-title"
                      className="admin-input"
                      placeholder="Selección del mes"
                      value={sectionCopy.title}
                      onChange={(event) =>
                        setSectionCopy((prev) => ({ ...prev, title: event.target.value }))
                      }
                    />
                    <p className="admin-field-help">
                      Si queda vacío, el home usa el título por defecto.
                    </p>
                  </div>
                  <div>
                    <label className="admin-field-label" htmlFor="section-body">
                      Descripción/intro de la sección
                    </label>
                    <textarea
                      id="section-body"
                      className="admin-input"
                      placeholder="Una selección de obras particularmente relevantes e inspiradoras..."
                      value={sectionCopy.body}
                      onChange={(event) =>
                        setSectionCopy((prev) => ({ ...prev, body: event.target.value }))
                      }
                      style={{
                        height: "auto",
                        minHeight: 96,
                        resize: "vertical",
                        paddingTop: 9,
                        paddingBottom: 9,
                      }}
                    />
                    <p className="admin-field-help">
                      Este texto es del bloque completo, no de un producto individual.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="editor-card-footer">
              <button type="submit" disabled={sectionCopySaving} className="admin-btn-primary">
                {sectionCopySaving ? (
                  <>
                    <SpinnerIcon />
                    Guardando...
                  </>
                ) : (
                  "Guardar copy"
                )}
              </button>
            </div>
          </form>

          {/* ── Formulario ── */}
          <form className="editor-card" onSubmit={(e) => { void submitForm(e); }}>
            <div className="editor-card-header flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-text">
                  {form.id ? "Editar producto en selección" : "Agregar producto"}
                </h2>
                <p className="mt-0.5 text-[12px] text-text-light">
                  {form.id
                    ? "Modifica los datos del producto seleccionado."
                    : "Busca un producto y agrégalo a la selección del mes."}
                </p>
              </div>
              {form.id ? (
                <span
                  className={`admin-badge ${form.is_active ? "admin-badge--active" : "admin-badge--inactive"}`}
                >
                  <span className="admin-badge-dot" />
                  {form.is_active ? "Activo" : "Inactivo"}
                </span>
              ) : null}
            </div>

            <div className="editor-card-body">
              <section className="admin-fieldset">
                <p className="admin-section-label">Producto</p>
                <div>
                  <label className="admin-field-label" htmlFor="sel-search">
                    Buscar por título
                  </label>
                  <input
                    id="sel-search"
                    className="admin-input"
                    placeholder="Ej: Biblia de Jerusalem, Camino de perfección…"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setForm((prev) => ({ ...prev, product_id: "" }));
                    }}
                  />
                </div>

                {form.product_id ? (
                  <div className="flex items-center justify-between gap-3 rounded border border-border bg-[#faf9f6] px-3 py-2">
                    <p className="text-[12px] text-text-mid">Producto seleccionado: {productSearch}</p>
                    <button
                      className="text-[12px] font-medium text-error transition-colors hover:text-text"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, product_id: "" }));
                        setProductSearch("");
                        setProductOptions([]);
                      }}
                      type="button"
                    >
                      Limpiar selección
                    </button>
                  </div>
                ) : null}

                {showDropdown ? (
                  <div
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "white",
                    }}
                  >
                    {productSearchLoading ? (
                      <p
                        style={{
                          alignItems: "center",
                          display: "flex",
                          gap: 8,
                          padding: "10px 14px",
                          fontSize: 13,
                          color: "var(--text-light)",
                        }}
                      >
                        <SpinnerIcon />
                        Buscando productos...
                      </p>
                    ) : null}
                    {!productSearchLoading && productOptions.length === 0 ? (
                      <p
                        style={{
                          padding: "10px 14px",
                          fontSize: 13,
                          color: "var(--text-light)",
                        }}
                      >
                        Sin resultados
                      </p>
                    ) : null}
                    {productOptions.map((option, i) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, product_id: option.id }));
                          setProductSearch(option.title);
                          setProductOptions([]);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          padding: "9px 14px",
                          background:
                            form.product_id === option.id
                              ? "rgba(200,168,48,0.07)"
                              : "transparent",
                          border: "none",
                          borderTop: i > 0 ? "1px solid var(--border)" : "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        {option.mainImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={option.mainImageUrl}
                            alt=""
                            style={{
                              width: 28,
                              height: 38,
                              objectFit: "cover",
                              borderRadius: 3,
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 28,
                              height: 38,
                              borderRadius: 3,
                              background: "var(--beige-warm)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: form.product_id === option.id ? 600 : 400,
                              color: "var(--text)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {option.title}
                          </p>
                          {option.author ? (
                            <p
                              style={{
                                fontSize: 11.5,
                                color: "var(--text-light)",
                                marginTop: 1,
                              }}
                            >
                              {option.author}
                            </p>
                          ) : null}
                        </div>
                        {form.product_id === option.id ? (
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--moss)",
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            Seleccionado
                          </span>
                        ) : null}
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--gold)",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {formatCLP(option.effectivePrice)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {form.product_id && !showDropdown ? (
                  <p className="admin-field-help">
                    Producto seleccionado. Escribe en el campo para buscar otro.
                  </p>
                ) : null}
              </section>

              <section className="hidden">
                <p className="admin-section-label">Detalles</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="admin-field-label" htmlFor="sel-desc">
                      Descripción editorial (opcional)
                    </label>
                    <textarea
                      id="sel-desc"
                      className="admin-input"
                      placeholder="Texto que acompaña al libro en la sección del landing"
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      style={{
                        height: "auto",
                        minHeight: 80,
                        resize: "vertical",
                        paddingTop: 9,
                        paddingBottom: 9,
                      }}
                    />
                  </div>
                  <div>
                    <label className="admin-field-label" htmlFor="sel-order">
                      Orden manual
                    </label>
                    <input
                      id="sel-order"
                      type="number"
                      className="admin-input"
                      value={form.display_order}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          display_order: Number(e.target.value || 0),
                        }))
                      }
                    />
                    <p className="admin-field-help">Números menores aparecen primero.</p>
                  </div>
                </div>
              </section>

              <section className="admin-fieldset">
                <p className="admin-section-label">Visibilidad</p>
                <div className="rounded-[10px] border border-border bg-[#faf9f6] px-4">
                  <AdminToggle
                    checked={form.is_active}
                    description="Si está activo, aparece en el landing y en el filtro del catálogo."
                    label="Item activo"
                    onChange={(checked) =>
                      setForm((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>
              </section>

              {error ? <div className="admin-error-block">{error}</div> : null}
            </div>

            <div className="editor-card-footer">
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={saving} className="admin-btn-primary">
                  {saving ? (
                    <>
                      <SpinnerIcon />
                      Guardando...
                    </>
                  ) : form.id ? (
                    "Actualizar"
                  ) : (
                    "Agregar"
                  )}
                </button>
                {form.id ? (
                  <button type="button" className="admin-btn-secondary" onClick={cancelEdit}>
                    Cancelar
                  </button>
                ) : null}
              </div>
            </div>
          </form>

          {/* ── Lista de productos ── */}
          <div className="editor-card">
            <div className="editor-card-header flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-text">Productos en selección</h2>
                <p className="mt-0.5 text-[12px] text-text-light">
                  {items.length > 0
                    ? `${items.length} producto${items.length !== 1 ? "s" : ""} · orden manual activo`
                    : "Aún no hay productos en la selección del mes."}
                </p>
              </div>
              {items.length > 0 ? (
                <span className="admin-badge admin-badge--active">
                  <span className="admin-badge-dot" />
                  {items.filter((i) => i.isActive).length} activo
                  {items.filter((i) => i.isActive).length !== 1 ? "s" : ""}
                </span>
              ) : null}
            </div>

            {items.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "var(--beige-warm)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <svg
                    fill="none"
                    height="22"
                    stroke="var(--text-light)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="22"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
                  Sin productos aún
                </p>
                <p style={{ fontSize: 12.5, color: "var(--text-light)", marginTop: 4 }}>
                  Usa el formulario de arriba para agregar libros a la selección.
                </p>
              </div>
            ) : (
              <div>
                {items.map((item, index) => (
                  <article
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 20px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    {/* Portada */}
                    {item.productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={item.productTitle}
                        src={item.productImage}
                        style={{
                          width: 34,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 34,
                          height: 48,
                          borderRadius: 4,
                          background: "var(--beige-warm)",
                          flexShrink: 0,
                        }}
                      />
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "var(--text)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.productTitle}
                      </p>
                      {item.productAuthor ? (
                        <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 1 }}>
                          {item.productAuthor}
                        </p>
                      ) : null}
                    </div>

                    {/* Badges */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        className={`admin-badge ${item.isActive ? "admin-badge--active" : "admin-badge--inactive"}`}
                      >
                        <span className="admin-badge-dot" />
                        {item.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexShrink: 0,
                      }}
                    >
                      <button
                        disabled={index === 0}
                        onClick={() => { void moveItem(item.id, "up"); }}
                        style={{
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          background: "transparent",
                          cursor: index === 0 ? "not-allowed" : "pointer",
                          opacity: index === 0 ? 0.35 : 1,
                          color: "var(--text-mid)",
                          fontSize: 13,
                        }}
                        title="Mover arriba"
                        type="button"
                      >
                        ↑
                      </button>
                      <button
                        disabled={index === items.length - 1}
                        onClick={() => { void moveItem(item.id, "down"); }}
                        style={{
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          background: "transparent",
                          cursor: index === items.length - 1 ? "not-allowed" : "pointer",
                          opacity: index === items.length - 1 ? 0.35 : 1,
                          color: "var(--text-mid)",
                          fontSize: 13,
                        }}
                        title="Mover abajo"
                        type="button"
                      >
                        ↓
                      </button>
                      <button
                        className="admin-btn-secondary"
                        onClick={() => startEdit(item)}
                        style={{ padding: "4px 12px", fontSize: 12 }}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => { void removeItem(item.id); }}
                        style={{
                          padding: "4px 12px",
                          fontSize: 12,
                          border: "1px solid rgba(192, 57, 43, 0.25)",
                          borderRadius: 6,
                          background: "transparent",
                          color: "var(--error)",
                          cursor: "pointer",
                        }}
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
        </>
      )}
    </section>
  );
}
