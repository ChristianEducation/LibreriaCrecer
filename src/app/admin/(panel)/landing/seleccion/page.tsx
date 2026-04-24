"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminToggle } from "@/features/admin/components";
import { MONTHLY_SELECTION_SECTION } from "@/shared/config/landing";
import { useToast } from "@/shared/hooks";

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

export default function AdminLandingSeleccionPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<CuratedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CuratedFormState>(initialForm);
  const [productSearch, setProductSearch] = useState("");
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const query = `?section=${encodeURIComponent(MONTHLY_SELECTION_SECTION)}`;
      const response = await fetch(`/api/admin/landing/seleccion${query}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { data?: CuratedRow[]; message?: string } | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudo cargar la seleccion.");
        return;
      }

      setItems(payload?.data ?? []);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchItems();
  }, []);

  useEffect(() => {
    if (!productSearch.trim()) {
      setProductOptions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const response = await fetch(
        `/api/admin/productos?page=1&limit=8&search=${encodeURIComponent(productSearch.trim())}`,
        { cache: "no-store" },
      );
      const payload = (await response.json().catch(() => null)) as
        | { data?: ProductOption[]; message?: string }
        | null;
      if (!response.ok) return;
      setProductOptions(payload?.data ?? []);
    }, 300);

    return () => clearTimeout(timeout);
  }, [productSearch]);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        product_id: form.product_id,
        section: MONTHLY_SELECTION_SECTION,
        description: form.description || undefined,
        display_order: Number(form.display_order || 0),
        is_active: form.is_active,
      };

      const endpoint = form.id ? `/api/admin/landing/seleccion/${form.id}` : "/api/admin/landing/seleccion";
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
  }

  async function removeItem(id: string) {
    if (!window.confirm("Quitar este producto de la selección del mes?")) return;

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

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Selección del mes</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Esta es la única selección editorial del sitio. El orden manual se replica en el home y en el filtro del catálogo.
          </p>
        </div>
        <Link href="/admin/landing" className="rounded-[8px] border border-border px-3 py-2 text-sm text-text-mid">
          Volver a Landing
        </Link>
      </div>

      <div className="rounded-[2px] border border-border bg-beige/50 px-4 py-3 text-sm text-text-light">
        La sección técnica usada internamente es <span className="font-medium text-text">{MONTHLY_SELECTION_SECTION}</span>.
        No se crean colecciones paralelas desde esta pantalla.
      </div>

      <form onSubmit={submitForm} className="space-y-4 rounded-[2px] border border-border bg-white p-6">
        <h2 className="text-[0.82rem] font-semibold text-text">
          {form.id ? "Editar producto en selección" : "Agregar producto a selección"}
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Buscar producto por titulo"
              className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
            <div className="max-h-36 space-y-1 overflow-auto rounded-[8px] border border-border p-2">
              {productOptions.length === 0 ? <p className="text-xs text-text-light">Sin resultados</p> : null}
              {productOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, product_id: option.id }))}
                  className={`block w-full rounded-[8px] px-2 py-1.5 text-left text-sm ${
                    form.product_id === option.id ? "bg-gold/10 text-moss" : "text-text-mid hover:bg-beige"
                  }`}
                >
                  {option.title} {option.author ? `- ${option.author}` : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-[0.08em] text-text-light">
              Orden manual
            </label>
            <input
              type="number"
              value={form.display_order}
              onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value || 0) }))}
              className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
            <p className="text-xs text-text-light">Usa números pequeños para destacar primero los libros principales.</p>
          </div>
        </div>

        <textarea
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Descripcion editorial"
          className="min-h-24 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
        />

        <AdminToggle
          checked={form.is_active}
          label="Item activo"
          onChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
        />

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white">
            {saving ? "Guardando..." : form.id ? "Actualizar" : "Agregar"}
          </button>
          {form.id ? (
            <button type="button" onClick={() => setForm(initialForm)} className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid">
              Cancelar edición
            </button>
          ) : null}
        </div>
      </form>

      {loading ? <p className="text-sm text-text-light">Cargando selección...</p> : null}
      {!loading ? (
        <div className="space-y-2 rounded-[2px] border border-border bg-white p-4">
          {items.length === 0 ? <p className="text-sm text-text-light">No hay productos en la selección del mes.</p> : null}
          {items.map((item, index) => (
            <article key={item.id} className="flex items-center justify-between rounded-[10px] border border-border p-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.productImage ?? "https://placehold.co/96x56?text=Sin+Imagen"}
                  alt={item.productTitle}
                  className="h-14 w-24 rounded-[8px] object-cover"
                />
                <div>
                  <p className="font-medium text-text">{item.productTitle}</p>
                  <p className="text-xs text-text-light">{item.productAuthor ?? "-"}</p>
                  <p className="text-xs text-text-light">{item.description ?? "Sin descripcion"}</p>
                  <p className="text-xs text-text-light">
                    Orden: {item.displayOrder} | {item.isActive ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveItem(item.id, "up")}
                  disabled={index === 0}
                  className="rounded-[8px] border border-border px-2 py-1 text-sm text-text-mid disabled:opacity-50"
                >
                  Arriba
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(item.id, "down")}
                  disabled={index === items.length - 1}
                  className="rounded-[8px] border border-border px-2 py-1 text-sm text-text-mid disabled:opacity-50"
                >
                  Abajo
                </button>
                <button type="button" onClick={() => startEdit(item)} className="rounded-[8px] border border-border px-2 py-1 text-sm text-text-mid">
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-[8px] border border-error/30 px-2 py-1 text-sm text-error"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
