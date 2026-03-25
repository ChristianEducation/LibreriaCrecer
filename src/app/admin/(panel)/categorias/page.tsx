"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminStatusPill, AdminTable } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";

type CategoryRow = {
  id: string;
  name: string;
  imageUrl: string | null;
  headerImageUrl?: string | null;
  featured: boolean;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
};

export default function AdminCategoriasPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/categorias", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as
        | { data?: CategoryRow[]; message?: string }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudieron cargar las categorias.");
        setLoading(false);
        return;
      }

      setCategories(payload?.data ?? []);
      setLoading(false);
    };

    void fetchCategories();
  }, []);

  async function handleDelete(categoryId: string) {
    const target = categories.find((item) => item.id === categoryId);
    if (!target) return;

    if (!target.isActive) {
      toast({ message: "La categoria ya esta inactiva.", variant: "info" });
      return;
    }

    const confirmed = window.confirm("Desactivar esta categoria?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/categorias/${categoryId}`, { method: "DELETE" });
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    if (!response.ok) {
      toast({ message: payload?.message ?? "No se pudo desactivar la categoria.", variant: "error" });
      return;
    }

    setCategories((prev) =>
      prev.map((item) => (item.id === categoryId ? { ...item, isActive: false } : item)),
    );
    toast({ message: "Categoria desactivada." });
  }

  async function handleActivate(categoryId: string) {
    const target = categories.find((item) => item.id === categoryId);
    if (!target) return;

    if (target.isActive) {
      toast({ message: "La categoria ya esta activa.", variant: "info" });
      return;
    }

    const response = await fetch(`/api/admin/categorias/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    if (!response.ok) {
      toast({ message: payload?.message ?? "No se pudo activar la categoria.", variant: "error" });
      return;
    }

    setCategories((prev) =>
      prev.map((item) => (item.id === categoryId ? { ...item, isActive: true } : item)),
    );
    toast({ message: "Categoria activada." });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Categorias</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Ordena la navegacion de la tienda y define imagenes de portada y header.
          </p>
        </div>
        <Link
          href="/admin/categorias/nuevo"
          className="inline-flex min-h-10 items-center justify-center rounded-[8px] bg-moss px-4 text-[0.78rem] font-semibold text-white transition-colors hover:bg-moss-mid"
        >
          Nueva categoria
        </Link>
      </div>

      {loading ? <p className="text-sm text-text-light">Cargando categorias...</p> : null}
      {error ? <p className="text-sm text-error">{error}</p> : null}

      {!loading ? (
        <AdminTable
          columns={[
            {
              key: "nombre",
              header: "Categoria",
              render: (category) => (
                <div className="flex items-center gap-3">
                  {category.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={category.name}
                      className="h-12 w-12 rounded-[8px] object-cover"
                      src={category.imageUrl}
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-beige-warm text-[10px] text-text-light">
                      Sin img
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-text">{category.name}</p>
                    <p className="text-[11px] text-text-light">
                      {category.headerImageUrl ? "Con header visual" : "Sin header configurado"}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              key: "productos",
              header: "Productos",
              render: (category) => <span className="font-medium text-text">{category.productCount}</span>,
            },
            {
              key: "destacada",
              header: "Destacada",
              render: (category) => (
                <AdminStatusPill status={category.featured ? "active" : "inactive"}>
                  {category.featured ? "Destacada" : "Normal"}
                </AdminStatusPill>
              ),
            },
            {
              key: "orden",
              header: "Orden",
              render: (category) => <span>{category.displayOrder}</span>,
            },
            {
              key: "estado",
              header: "Estado",
              render: (category) => (
                <AdminStatusPill status={category.isActive ? "active" : "inactive"}>
                  {category.isActive ? "Activa" : "Inactiva"}
                </AdminStatusPill>
              ),
            },
            {
              key: "acciones",
              header: "Acciones",
              render: (category) => (
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="rounded-[8px] border border-border px-3 py-[6px] text-[12px] text-text-mid transition-colors hover:border-gold hover:text-moss"
                    href={`/admin/categorias/${category.id}/editar`}
                  >
                    Editar
                  </Link>
                  <button
                    className={`rounded-[8px] border px-3 py-[6px] text-[12px] transition-colors ${
                      category.isActive
                        ? "border-error/30 text-error hover:bg-error/8"
                        : "border-[#27AE60]/30 text-[#27AE60] hover:bg-[#27AE60]/8"
                    }`}
                    onClick={() =>
                      category.isActive ? handleDelete(category.id) : handleActivate(category.id)
                    }
                    type="button"
                  >
                    {category.isActive ? "Desactivar" : "Activar"}
                  </button>
                </div>
              ),
            },
          ]}
          data={categories}
          description="Listado editorial con visibilidad y soporte para imagen de header."
          rowKey={(category) => category.id}
          title="Categorias activas"
        />
      ) : null}
    </section>
  );
}

