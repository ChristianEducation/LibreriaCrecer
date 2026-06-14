"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  CreateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "../schemas/product-schemas";
import { AdminToggle, AdminUploadZone } from "./index";
import { useToast } from "@/shared/hooks";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductImage = {
  id: string;
  url: string;
  displayOrder: number;
};

type ProductData = {
  id: string;
  title?: string | null;
  author?: string | null;
  publisher?: string | null;
  description?: string | null;
  price?: number | null;
  salePrice?: number | null;
  code?: string | null;
  sku?: string | null;
  coverType?: string | null;
  pages?: number | null;
  inStock?: boolean | null;
  stockQuantity?: number | null;
  isFeatured?: boolean | null;
  isActive?: boolean | null;
  images?: ProductImage[];
  categories?: Array<{ id: string }>;
  mainImageUrl?: string | null;
};

type ProductAdminFormProps = {
  mode: "create" | "edit";
  productId?: string;
  initialData?: ProductData | null;
};

const schema = CreateProductSchema.extend({
  categoryIds: CreateProductSchema.shape.categoryIds.default([]),
});
type SchemaInput = z.input<typeof schema>;

export function ProductAdminForm({ mode, productId, initialData }: ProductAdminFormProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>(initialData?.images ?? []);
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverCandidates, setCoverCandidates] = useState<{ url: string; source: string }[]>([]);
  const [coverMessage, setCoverMessage] = useState<string | null>(null);

  const defaultValues = useMemo<SchemaInput>(
    () => ({
      title: initialData?.title ?? "",
      author: initialData?.author ?? undefined,
      publisher: initialData?.publisher ?? undefined,
      description: initialData?.description ?? undefined,
      price: initialData?.price ?? 1,
      salePrice: initialData?.salePrice ?? undefined,
      code: initialData?.code ?? undefined,
      sku: initialData?.sku ?? undefined,
      coverType: initialData?.coverType ?? undefined,
      pages: initialData?.pages ?? undefined,
      inStock: initialData?.inStock ?? true,
      stockQuantity: initialData?.stockQuantity ?? 0,
      isFeatured: initialData?.isFeatured ?? false,
      isActive: initialData?.isActive ?? true,
      categoryIds: initialData?.categories?.map((category) => category.id) ?? [],
    }),
    [initialData],
  );

  const form = useForm<SchemaInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const selectedCategoryIds = form.watch("categoryIds") ?? [];
  const inStock = form.watch("inStock") ?? false;
  const isFeatured = form.watch("isFeatured") ?? false;
  const isActive = form.watch("isActive") ?? true;
  const optionalNumber = (value: unknown) => {
    if (value === "" || value === null || typeof value === "undefined") {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  useEffect(() => {
    const categoryRequest = async () => {
      const response = await fetch("/api/admin/categorias", { cache: "no-store" });
      if (!response.ok) return;
      const payload = (await response.json()) as { data?: Array<{ id: string; name: string }> };
      setCategories((payload.data ?? []).map((item) => ({ id: item.id, name: item.name })));
    };

    void categoryRequest();
  }, []);

  const mainPreview = useMemo(
    () => (mainImageFile ? URL.createObjectURL(mainImageFile) : initialData?.mainImageUrl ?? null),
    [initialData?.mainImageUrl, mainImageFile],
  );
  const galleryPreview = useMemo(() => galleryFiles.map((file) => URL.createObjectURL(file)), [galleryFiles]);

  useEffect(() => {
    return () => {
      if (mainImageFile && mainPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(mainPreview);
      }

      for (const preview of galleryPreview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [galleryPreview, mainImageFile, mainPreview]);

  async function uploadImages(targetProductId: string) {
    if (mainImageFile) {
      const formData = new FormData();
      formData.append("file", mainImageFile);
      formData.append("isMain", "true");
      const res = await fetch(`/api/admin/productos/${targetProductId}/imagenes`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message || "Error al subir la imagen principal");
      }
    }

    for (const file of galleryFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("isMain", "false");
      const res = await fetch(`/api/admin/productos/${targetProductId}/imagenes`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error al subir una imagen de la galería");
    }
  }

  async function onSubmit(values: SchemaInput) {
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "create" ? "/api/admin/productos" : `/api/admin/productos/${productId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values as CreateProductInput | UpdateProductInput),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            data?: { id?: string };
            message?: string;
          }
        | null;

      if (!response.ok) {
        const message = payload?.message ?? "No se pudo guardar el producto.";
        setError(message);
        toast({ message, variant: "error" });
        return;
      }

      const targetProductId = mode === "create" ? payload?.data?.id : productId;
      if (targetProductId) {
        await uploadImages(targetProductId);
      }

      toast({ message: "Producto guardado correctamente." });
      window.location.href = "/admin/productos";
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Ocurrio un error inesperado al guardar.";
      setError(message);
      toast({ message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(imageId: string) {
    if (!productId) return;

    const response = await fetch(`/api/admin/productos/${productId}/imagenes/${imageId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("No se pudo eliminar la imagen.");
      toast({ message: "No se pudo eliminar la imagen.", variant: "error" });
      return;
    }

    setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
    toast({ message: "Imagen eliminada." });
  }

  async function buscarPortada() {
    setCoverLoading(true);
    setCoverMessage(null);
    setCoverCandidates([]);
    try {
      const sku = form.getValues("sku") ?? "";
      const title = form.getValues("title") ?? "";
      const author = form.getValues("author") ?? "";
      const params = new URLSearchParams();
      if (sku) params.set("isbn", sku);
      if (title) params.set("titulo", title);
      if (author) params.set("autor", author);
      const response = await fetch(`/api/admin/productos/buscar-portada?${params.toString()}`, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { data?: { url: string; source: string }[] } | null;
      const data = payload?.data ?? [];
      setCoverCandidates(data);
      if (data.length === 0) setCoverMessage("No se encontraron portadas. Sube una manualmente.");
    } catch {
      setCoverMessage("No se pudo buscar la portada.");
    } finally {
      setCoverLoading(false);
    }
  }

  async function usarPortada(url: string) {
    try {
      const response = await fetch(`/api/admin/productos/portada-proxy?url=${encodeURIComponent(url)}`);
      if (!response.ok) { toast({ message: "No se pudo cargar esa portada.", variant: "error" }); return; }
      const blob = await response.blob();
      const file = new File([blob], "portada.jpg", { type: blob.type || "image/jpeg" });
      setMainImageFile(file);
      setCoverCandidates([]);
      setCoverMessage(null);
      toast({ message: "Portada cargada. Recuerda guardar el producto." });
    } catch {
      toast({ message: "No se pudo cargar esa portada.", variant: "error" });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Informacion basica</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Titulo</span>
                <input className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("title")} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Autor</span>
                <input className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("author")} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Editorial</span>
                <input className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("publisher")} />
              </label>
            </div>
            <label className="mt-4 block space-y-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Descripcion</span>
              <textarea className="min-h-32 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("description")} />
            </label>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Codigo interno</span>
                <input className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("code")} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">SKU</span>
                <input className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("sku")} />
              </label>
            </div>
          </section>

          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Precio y ficha tecnica</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Precio</span>
                <input
                  type="number"
                  className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                  {...form.register("price", { setValueAs: optionalNumber })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Precio oferta</span>
                <input
                  type="number"
                  className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                  {...form.register("salePrice", { setValueAs: optionalNumber })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Stock</span>
                <input
                  type="number"
                  className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                  {...form.register("stockQuantity", { setValueAs: optionalNumber })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Tipo de tapa</span>
                <input className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("coverType")} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Paginas</span>
                <input
                  type="number"
                  className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                  {...form.register("pages", { setValueAs: optionalNumber })}
                />
              </label>
            </div>
          </section>

          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Categorias</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => {
                const selected = selectedCategoryIds.includes(category.id);
                return (
                  <label
                    key={category.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-[8px] border px-3 py-2 text-sm transition-colors ${
                      selected ? "border-gold bg-gold/5 text-text" : "border-border text-text-mid"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(event) => {
                        const current = form.getValues("categoryIds") ?? [];
                        if (event.target.checked) {
                          form.setValue("categoryIds", [...current, category.id]);
                        } else {
                          form.setValue(
                            "categoryIds",
                            current.filter((item) => item !== category.id),
                          );
                        }
                      }}
                    />
                    {category.name}
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Imagen principal</h2>
            <AdminUploadZone
              hint="PNG o JPG. Recomendado 400x600px."
              onFileSelect={setMainImageFile}
              previewUrl={mainPreview}
            />

            {/* Buscar portada online */}
            <div style={{ marginTop: "16px" }}>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={coverLoading}
                  onClick={buscarPortada}
                  className="flex-1 rounded-[8px] border border-dashed border-gold/40 text-[13px] text-moss transition-colors hover:border-gold hover:bg-gold/5 disabled:opacity-50"
                  style={{ padding: "8px 10px" }}
                >
                  {coverLoading ? "Buscando..." : "Búsqueda automática"}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const sku = form.getValues("sku") ?? "";
                    const title = form.getValues("title") ?? "";
                    const q = sku ? sku : title;
                    if (q) {
                      window.open(`https://www.google.com/search?udm=2&q=${encodeURIComponent(q)}`, "_blank");
                    } else {
                      toast({ message: "Ingresa el SKU o Título primero para buscar en Google." });
                    }
                  }}
                  className="flex-1 rounded-[8px] border border-border bg-white text-[13px] text-text-mid transition-colors hover:border-text-light hover:bg-gray-50"
                  style={{ padding: "8px 10px" }}
                >
                  Buscar en Google
                </button>
              </div>

              {coverMessage ? (
                <p className="text-[12px] text-text-mid" style={{ marginTop: "8px" }}>{coverMessage}</p>
              ) : null}

              {coverCandidates.length > 0 ? (
                <div style={{ marginTop: "12px" }}>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-text-light" style={{ marginBottom: "8px" }}>Resultados</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {coverCandidates.map((candidate) => (
                      <div key={candidate.url} className="group relative overflow-hidden rounded-[8px] border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt="Portada candidata"
                          className="w-full object-cover"
                          src={`/api/admin/productos/portada-proxy?url=${encodeURIComponent(candidate.url)}`}
                          style={{ aspectRatio: "2/3" }}
                        />
                        <div
                          className="absolute inset-0 flex items-end opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
                        >
                          <button
                            type="button"
                            onClick={() => usarPortada(candidate.url)}
                            className="w-full rounded-[6px] bg-white text-[12px] font-medium text-moss"
                            style={{ margin: "8px", padding: "6px 8px" }}
                          >
                            Usar esta
                          </button>
                        </div>
                        <span
                          className="absolute text-[9px] text-white"
                          style={{ right: "4px", top: "4px", borderRadius: "4px", background: "rgba(0,0,0,0.5)", padding: "2px 6px" }}
                        >
                          {candidate.source === "openlibrary" ? "Open Library" : "Google Books"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <h3 className="mb-3 text-[0.78rem] font-medium text-text">Galeria</h3>
              <label className="flex cursor-pointer items-center justify-center rounded-[8px] border border-dashed border-border px-4 py-3 text-sm text-text-mid hover:border-gold/50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(event) => setGalleryFiles(Array.from(event.target.files ?? []))}
                />
                Seleccionar imagenes adicionales
              </label>

              {galleryPreview.length > 0 ? (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {galleryPreview.map((preview) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={preview} alt="Vista previa galeria" className="aspect-square rounded-[8px] object-cover" src={preview} />
                  ))}
                </div>
              ) : null}

              {existingImages.length > 0 ? (
                <div className="mt-4 space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-text-light">Imagenes actuales</p>
                  {existingImages.map((image) => (
                    <div key={image.id} className="flex items-center justify-between rounded-[8px] border border-border px-3 py-2">
                      <a className="truncate text-sm text-text-mid underline" href={image.url} rel="noreferrer" target="_blank">
                        {image.url}
                      </a>
                      <button
                        className="rounded-[8px] border border-error/30 px-3 py-[6px] text-[12px] text-error"
                        onClick={() => deleteImage(image.id)}
                        type="button"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Estado editorial</h2>
            <div className="space-y-1">
              <AdminToggle
                checked={inStock}
                label="Disponible para venta"
                onChange={(checked) => form.setValue("inStock", checked)}
              />
              <AdminToggle
                checked={isFeatured}
                label="Destacar en colecciones"
                onChange={(checked) => form.setValue("isFeatured", checked)}
              />
              <AdminToggle
                checked={isActive}
                label="Visible en la tienda"
                onChange={(checked) => form.setValue("isActive", checked)}
              />
            </div>
          </section>
        </div>
      </div>

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar producto"}
        </button>
        <Link href="/admin/productos" className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
