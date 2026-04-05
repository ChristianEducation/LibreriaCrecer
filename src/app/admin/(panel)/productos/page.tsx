"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminStatusPill, AdminTable } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";
import { formatCLP } from "@/shared/utils";

type ProductListItem = {
  id: string;
  title: string;
  author: string | null;
  price: number;
  effectivePrice: number;
  stockQuantity: number;
  inStock: boolean;
  isActive: boolean;
  mainImageUrl: string | null;
  categories: Array<{ id: string; name: string }>;
};

type CategoryOption = {
  id: string;
  name: string;
};

export default function AdminProductosPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categorias", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { data?: CategoryOption[] };
        setCategories(payload.data ?? []);
      } catch {
        // best-effort, no bloquea la UI
      }
    };

    void fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "20",
        });
        if (search.trim()) query.set("search", search.trim());
        if (categoryId) query.set("categoryId", categoryId);
        if (isActive) query.set("isActive", isActive);

        const response = await fetch(`/api/admin/productos?${query.toString()}`, { cache: "no-store" });
        const payload = (await response.json().catch(() => null)) as
          | { data?: ProductListItem[]; pagination?: { totalPages?: number }; message?: string }
          | null;

        if (!response.ok) {
          setError(payload?.message ?? "No se pudieron cargar los productos.");
          return;
        }

        setProducts(payload?.data ?? []);
        setTotalPages(payload?.pagination?.totalPages ?? 1);
      } catch {
        setError("Error de red. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [page, search, categoryId, isActive]);

  async function handleDelete(productId: string) {
    const confirmed = window.confirm("Desactivar este producto?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/productos/${productId}`, { method: "DELETE" });
    if (!response.ok) {
      toast({ message: "No se pudo desactivar el producto.", variant: "error" });
      return;
    }

    setProducts((prev) => prev.filter((item) => item.id !== productId));
    toast({ message: "Producto desactivado correctamente." });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Catalogo de libros</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Filtra, revisa stock y administra rapidamente el estado del catalogo.
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex min-h-10 items-center justify-center rounded-[8px] bg-moss px-4 text-[0.78rem] font-semibold text-white transition-colors hover:bg-moss-mid"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="grid gap-3 rounded-[2px] border border-border bg-white p-4 md:grid-cols-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por titulo o autor"
          className="rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none"
        />
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-mid focus:border-gold focus:outline-none"
        >
          <option value="">Todas las categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={isActive}
          onChange={(event) => setIsActive(event.target.value)}
          className="rounded-[8px] border border-border bg-white px-3 py-2 text-sm text-text-mid focus:border-gold focus:outline-none"
        >
          <option value="">Estado: todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <div className="flex items-center justify-end">
          <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">
            {products.length} resultados
          </span>
        </div>
      </div>

      {loading ? <p className="text-sm text-text-light">Cargando productos...</p> : null}
      {error ? <p className="text-sm text-error">{error}</p> : null}

      {!loading ? (
        <AdminTable
          columns={[
            {
              key: "producto",
              header: "Producto",
              render: (product) => (
                <div className="flex items-center gap-3">
                  {product.mainImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={product.title}
                      className="h-14 w-10 rounded-[4px] object-cover"
                      src={product.mainImageUrl}
                    />
                  ) : (
                    <div className="flex h-14 w-10 items-center justify-center rounded-[4px] bg-beige-warm text-[10px] text-text-light">
                      Sin img
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-text">{product.title}</p>
                    <p className="text-[11px] text-text-light">{product.author ?? "Autor no informado"}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "precio",
              header: "Precio",
              render: (product) => (
                <div>
                  <p className="font-medium text-gold">{formatCLP(product.effectivePrice)}</p>
                  {product.effectivePrice !== product.price ? (
                    <p className="text-[11px] text-text-light line-through">{formatCLP(product.price)}</p>
                  ) : null}
                </div>
              ),
            },
            {
              key: "stock",
              header: "Stock",
              render: (product) => (
                <div>
                  <p className="font-medium text-text">{product.stockQuantity}</p>
                  <p className="text-[11px] text-text-light">
                    {product.inStock ? "Disponible" : "Sin stock"}
                  </p>
                </div>
              ),
            },
            {
              key: "categorias",
              header: "Categorias",
              render: (product) => (
                <span>{product.categories.map((category) => category.name).join(", ") || "-"}</span>
              ),
            },
            {
              key: "estado",
              header: "Estado",
              render: (product) => (
                <AdminStatusPill status={product.isActive ? "active" : "inactive"}>
                  {product.isActive ? "Activo" : "Inactivo"}
                </AdminStatusPill>
              ),
            },
            {
              key: "acciones",
              header: "Acciones",
              render: (product) => (
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="rounded-[8px] border border-border px-3 py-[6px] text-[12px] text-text-mid transition-colors hover:border-gold hover:text-moss"
                    href={`/admin/productos/${product.id}/editar`}
                  >
                    Editar
                  </Link>
                  <button
                    className="rounded-[8px] border border-error/30 px-3 py-[6px] text-[12px] text-error transition-colors hover:bg-error/8"
                    onClick={() => handleDelete(product.id)}
                    type="button"
                  >
                    Desactivar
                  </button>
                </div>
              ),
            },
          ]}
          data={products}
          description="Listado principal del catalogo con estado, precio y stock."
          emptyState="No hay productos que coincidan con los filtros."
          rowKey={(product) => product.id}
          title="Productos"
        />
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="rounded-[8px] border border-border bg-white px-3 py-1.5 text-sm text-text-mid disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-text-mid">
          Pagina {page} de {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          className="rounded-[8px] border border-border bg-white px-3 py-1.5 text-sm text-text-mid disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}

