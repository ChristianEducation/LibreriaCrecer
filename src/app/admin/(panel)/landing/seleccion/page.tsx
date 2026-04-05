"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminToggle } from "@/features/admin/components";
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
  section: string;
  description: string;
  display_order: number;
  is_active: boolean;
};

const PRESET_SECTIONS = ["monthly_selection", "liturgical_reading"];

const initialForm: CuratedFormState = {
  product_id: "",
  section: "monthly_selection",
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
  const [selectedSection, setSelectedSection] = useState<string>("monthly_selection");
  const [form, setForm] = useState<CuratedFormState>(initialForm);
  const [productSearch, setProductSearch] = useState("");
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  const sections = useMemo(() => {
    const dynamic = Array.from(new Set(items.map((item) => item.section)));
    return Array.from(new Set([...PRESET_SECTIONS, ...dynamic]));
  }, [items]);

  const visibleItems = useMemo(
    () => items.filter((item) => item.section === selectedSection),
    [items, selectedSection],
  );

  async function fetchItems(section?: string) {
    setLoading(true);
    try {
      const query = section ? `?section=${encodeURIComponent(section)}` : "";
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
        section: form.section,
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
      toast({ message: "Seleccion curada actualizada." });
      await fetchItems();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: CuratedRow) {
    setForm({
      id: item.id,
      product_id: item.productId,
      section: item.section,
      description: item.description ?? "",
      display_order: item.displayOrder,
      is_active: item.isActive,
    });
    setSelectedSection(item.section);
  }

  async function removeItem(id: string) {
    if (!window.confirm("Eliminar este producto curado?")) return;

    const response = await fetch(`/api/admin/landing/seleccion/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const message = "No se pudo eliminar el item.";
      setError(message);
      toast({ message, variant: "error" });
      return;
    }

    toast({ message: "Producto removido de la seleccion." });
    await fetchItems();
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const sectionItems = [...visibleItems];
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
        section: selectedSection,
        productIds: reordered.map((item) => item.id),
      }),
    });

    await fetchItems();
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Seleccion curada</h1>
          <p className="mt-2 text-sm font-light text-text-light">Arma colecciones editoriales para el home.</p>
        </div>
        <Link href="/admin/landing" className="rounded-[8px] border border-border px-3 py-2 text-sm text-text-mid">
          Volver a Landing
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => setSelectedSection(section)}
            className={`rounded-[8px] border px-3 py-1.5 text-sm ${
              selectedSection === section ? "border-gold bg-gold/10 text-moss" : "border-border bg-white text-text-mid"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <form onSubmit={submitForm} className="space-y-4 rounded-[2px] border border-border bg-white p-6">
        <h2 className="text-[0.82rem] font-semibold text-text">{form.id ? "Editar seleccion" : "Agregar producto"}</h2>

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
            <input
              value={form.section}
              onChange={(event) => setForm((prev) => ({ ...prev, section: event.target.value }))}
              placeholder="Seccion (ej: monthly_selection)"
              className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
            <input
              type="number"
              value={form.display_order}
              onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value || 0) }))}
              className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
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
              Cancelar edicion
            </button>
          ) : null}
        </div>
      </form>

      {loading ? <p className="text-sm text-text-light">Cargando seleccion...</p> : null}
      {!loading ? (
        <div className="space-y-2 rounded-[2px] border border-border bg-white p-4">
          {visibleItems.length === 0 ? <p className="text-sm text-text-light">No hay productos en esta seccion.</p> : null}
          {visibleItems.map((item, index) => (
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
                  disabled={index === visibleItems.length - 1}
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
