"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  CreateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "../schemas/product-schemas";
import { AdminToggle } from "./index";
import { ProductTemplatePicker } from "./ProductTemplatePicker";
import { GIFT_OCCASIONS } from "@/shared/config/regalos";
import { useToast } from "@/shared/hooks";
import { formatCLP } from "@/shared/utils/formatters";

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
  onlineSaleEnabled?: boolean | null;
  images?: ProductImage[];
  categories?: Array<{ id: string }>;
  giftOccasions?: string[];
  mainImageUrl?: string | null;
  studioImageUrl?: string | null;
  studioLibroUrl?: string | null;
  studioPiedraUrl?: string | null;
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

// Con muchas categorías se muestran las primeras y las ya elegidas; el resto queda tras "Ver todas".
const CATEGORY_PREVIEW_COUNT = 12;

function autoGrow(element: HTMLTextAreaElement) {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
}

export function ProductAdminForm({ mode, productId, initialData }: ProductAdminFormProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>(initialData?.images ?? []);
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverCandidates, setCoverCandidates] = useState<{ url: string; source: string }[]>([]);
  const [coverMessage, setCoverMessage] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

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
      onlineSaleEnabled: initialData?.onlineSaleEnabled ?? false,
      categoryIds: initialData?.categories?.map((category) => category.id) ?? [],
      giftOccasions: initialData?.giftOccasions ?? [],
    }),
    [initialData],
  );

  const form = useForm<SchemaInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const selectedCategoryIds = form.watch("categoryIds") ?? [];
  const selectedGiftOccasions = form.watch("giftOccasions") ?? [];
  const inStock = form.watch("inStock") ?? false;
  const isFeatured = form.watch("isFeatured") ?? false;
  const isActive = form.watch("isActive") ?? true;
  const onlineSaleEnabled = form.watch("onlineSaleEnabled") ?? false;
  const watchedTitle = form.watch("title");
  const watchedPrice = form.watch("price");
  const watchedSalePrice = form.watch("salePrice");
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

  function toggleCategory(categoryId: string) {
    const current = form.getValues("categoryIds") ?? [];
    form.setValue(
      "categoryIds",
      current.includes(categoryId) ? current.filter((item) => item !== categoryId) : [...current, categoryId],
      { shouldDirty: true },
    );
  }

  function toggleGiftOccasion(slug: string) {
    const current = form.getValues("giftOccasions") ?? [];
    form.setValue(
      "giftOccasions",
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
      { shouldDirty: true },
    );
  }

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
    if (!window.confirm("¿Eliminar esta imagen de la galería?")) return;

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

  const visibleCategories =
    showAllCategories || categories.length <= CATEGORY_PREVIEW_COUNT
      ? categories
      : categories.filter(
          (category, index) => index < CATEGORY_PREVIEW_COUNT || selectedCategoryIds.includes(category.id),
        );

  const price = typeof watchedPrice === "number" ? watchedPrice : undefined;
  const salePrice = typeof watchedSalePrice === "number" ? watchedSalePrice : undefined;
  const hasSale = Boolean(price && salePrice);
  const saleIsValid = Boolean(price && salePrice && salePrice < price);

  const descriptionField = form.register("description");

  // La descripción crece con el texto. Se mide ya montada (y al cambiar el ancho de la
  // ventana), porque antes del primer pintado el ancho del campo aún no es el real.
  useEffect(() => {
    const resize = () => {
      if (descriptionRef.current) autoGrow(descriptionRef.current);
    };
    const frame = requestAnimationFrame(resize);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);
  const headerTitle = watchedTitle?.trim() || (mode === "create" ? "Nuevo producto" : "Editar producto");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="pf-header">
        <Link className="pf-back" href="/admin/productos">
          ← Productos
        </Link>
        <h1 className="pf-title">{headerTitle}</h1>
        <span className={`admin-badge ${isActive ? "admin-badge--active" : "admin-badge--inactive"}`}>
          <span className="admin-badge-dot" />
          {isActive ? "Visible en la tienda" : "Oculto"}
        </span>
        <Link className="admin-btn-secondary" href="/admin/productos">
          Cancelar
        </Link>
        <button className="admin-btn-primary" disabled={loading} type="submit">
          {loading ? "Guardando..." : "Guardar producto"}
        </button>
      </div>

      {error ? <p className="admin-error-block" style={{ marginBottom: 14 }}>{error}</p> : null}

      <div className="pf-body">
        <div className="pf-grid">
          {/* ───────── Izquierda: información, categorías y regalos ───────── */}
          <div className="pf-col">
            <section className="pf-card">
              <div className="pf-card-h">
                <h2>Información del producto</h2>
              </div>
              <div className="pf-card-b">
                <div className="pf-fields">
                  <div className="pf-f pf-w-full">
                    <label className="admin-field-label" htmlFor="pf-title">Título</label>
                    <input className="admin-input" id="pf-title" {...form.register("title")} />
                  </div>
                  <div className="pf-f pf-w-half">
                    <label className="admin-field-label" htmlFor="pf-author">Autor</label>
                    <input className="admin-input" id="pf-author" {...form.register("author")} />
                  </div>
                  <div className="pf-f pf-w-half">
                    <label className="admin-field-label" htmlFor="pf-publisher">Editorial</label>
                    <input className="admin-input" id="pf-publisher" {...form.register("publisher")} />
                  </div>
                  <div className="pf-f pf-w-full">
                    <label className="admin-field-label" htmlFor="pf-description">Descripción</label>
                    <textarea
                      className="admin-input pf-textarea"
                      id="pf-description"
                      rows={3}
                      {...descriptionField}
                      onInput={(event) => autoGrow(event.currentTarget)}
                      ref={(element) => {
                        descriptionField.ref(element);
                        descriptionRef.current = element;
                      }}
                    />
                  </div>
                </div>

                <div className="pf-sep" />

                <div className="pf-fields">
                  <div className="pf-f pf-w-sku">
                    <label className="admin-field-label" htmlFor="pf-sku">SKU</label>
                    <input className="admin-input" id="pf-sku" {...form.register("sku")} />
                  </div>
                  <div className="pf-f pf-w-cod">
                    <label className="admin-field-label" htmlFor="pf-code">Código interno</label>
                    <input className="admin-input" id="pf-code" {...form.register("code")} />
                  </div>
                  <div className="pf-f pf-w-tapa">
                    <label className="admin-field-label" htmlFor="pf-cover-type">Tipo de tapa</label>
                    <input className="admin-input" id="pf-cover-type" {...form.register("coverType")} />
                  </div>
                  <div className="pf-f pf-w-short">
                    <label className="admin-field-label" htmlFor="pf-pages">Páginas</label>
                    <input
                      className="admin-input"
                      id="pf-pages"
                      type="number"
                      {...form.register("pages", { setValueAs: optionalNumber })}
                    />
                  </div>
                </div>

                <div className="pf-fields">
                  <div className="pf-f pf-w-money">
                    <label className="admin-field-label" htmlFor="pf-price">Precio</label>
                    <div className="pf-money">
                      <span>$</span>
                      <input
                        className="admin-input"
                        id="pf-price"
                        type="number"
                        {...form.register("price", { setValueAs: optionalNumber })}
                      />
                    </div>
                  </div>
                  <div className="pf-f pf-w-money">
                    <label className="admin-field-label" htmlFor="pf-sale-price">Precio oferta</label>
                    <div className="pf-money">
                      <span>$</span>
                      <input
                        className="admin-input"
                        id="pf-sale-price"
                        type="number"
                        {...form.register("salePrice", { setValueAs: optionalNumber })}
                      />
                    </div>
                  </div>
                  <div className="pf-f pf-w-short">
                    <label className="admin-field-label" htmlFor="pf-stock">Stock</label>
                    <input
                      className="admin-input"
                      id="pf-stock"
                      style={{ fontWeight: 600 }}
                      type="number"
                      {...form.register("stockQuantity", { setValueAs: optionalNumber })}
                    />
                  </div>
                  {hasSale ? (
                    saleIsValid ? (
                      <div className="pf-disc">
                        Descuento <b>-{Math.round((1 - (salePrice as number) / (price as number)) * 100)}%</b> · paga
                        <b>{formatCLP(salePrice as number)}</b>
                      </div>
                    ) : (
                      <div className="pf-disc pf-disc--warn">El precio oferta debe ser menor que el precio.</div>
                    )
                  ) : null}
                </div>
              </div>
            </section>

            <section className="pf-card">
              <div className="pf-card-h">
                <h2>Categorías y regalos</h2>
                <p>Toca para activar o quitar. Se guarda junto con el producto.</p>
              </div>
              <div className="pf-card-b">
                <div className="pf-two">
                  <div>
                    <p className="pf-group-label">Categorías</p>
                    {categories.length === 0 ? (
                      <p style={{ fontSize: 13, color: "var(--text-light)" }}>Cargando categorías...</p>
                    ) : (
                      <>
                        <div className="pf-chips">
                          {visibleCategories.map((category) => {
                            const selected = selectedCategoryIds.includes(category.id);
                            return (
                              <button
                                key={category.id}
                                aria-pressed={selected}
                                className={`pf-chip${selected ? " pf-chip--on" : ""}`}
                                onClick={() => toggleCategory(category.id)}
                                type="button"
                              >
                                {category.name}
                              </button>
                            );
                          })}
                        </div>
                        {categories.length > CATEGORY_PREVIEW_COUNT ? (
                          <button
                            className="pf-more"
                            onClick={() => setShowAllCategories((value) => !value)}
                            type="button"
                          >
                            {showAllCategories ? "Ver menos" : `Ver todas (${categories.length})`}
                          </button>
                        ) : null}
                      </>
                    )}
                  </div>
                  <div>
                    <p className="pf-group-label">Regalos con intención</p>
                    <div className="pf-chips">
                      {GIFT_OCCASIONS.map((occasion) => {
                        const selected = selectedGiftOccasions.includes(occasion.slug);
                        return (
                          <button
                            key={occasion.slug}
                            aria-pressed={selected}
                            className={`pf-chip${selected ? " pf-chip--on" : ""}`}
                            onClick={() => toggleGiftOccasion(occasion.slug)}
                            type="button"
                          >
                            {occasion.label}
                            {occasion.seasonal ? <small> · temporada</small> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ───────── Derecha: imágenes y estado ───────── */}
          <div className="pf-col">
            <section className="pf-card">
              <div className="pf-card-h">
                <h2>Imágenes</h2>
              </div>
              <div className="pf-card-b">
                <input
                  ref={coverInputRef}
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setMainImageFile(file);
                    event.target.value = "";
                  }}
                  type="file"
                />

                <div className="pf-cover">
                  <div className="pf-cover-img">
                    {mainPreview ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="Portada del producto" src={mainPreview} />
                        <button
                          className="pf-cover-change"
                          onClick={() => coverInputRef.current?.click()}
                          type="button"
                        >
                          Cambiar
                        </button>
                      </>
                    ) : (
                      <button className="pf-cover-empty" onClick={() => coverInputRef.current?.click()} type="button">
                        <b>+</b>
                        Subir portada
                      </button>
                    )}
                  </div>
                  <div className="pf-cover-side">
                    <p className="pf-group-label" style={{ margin: 0 }}>Portada</p>
                    <button
                      className="admin-btn-secondary"
                      disabled={coverLoading}
                      onClick={buscarPortada}
                      style={{ height: 34 }}
                      type="button"
                    >
                      {coverLoading ? "Buscando..." : "Búsqueda automática"}
                    </button>
                    <button
                      className="admin-btn-secondary"
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
                      style={{ height: 34 }}
                      type="button"
                    >
                      Buscar en Google
                    </button>
                    {mainImageFile ? (
                      <p>
                        Portada nueva sin guardar.{" "}
                        <button
                          className="pf-more"
                          onClick={() => setMainImageFile(null)}
                          style={{ marginTop: 0 }}
                          type="button"
                        >
                          Deshacer
                        </button>
                      </p>
                    ) : (
                      <p>400×600 px, PNG o JPG.</p>
                    )}
                  </div>
                </div>

                {coverMessage ? <p style={{ fontSize: 12, color: "var(--text-mid)" }}>{coverMessage}</p> : null}

                {mode === "edit" && productId && !mainImageFile ? (
                  <ProductTemplatePicker
                    currentUrl={initialData?.studioImageUrl ?? null}
                    libroUrl={initialData?.studioLibroUrl ?? null}
                    originalUrl={initialData?.mainImageUrl ?? null}
                    piedraUrl={initialData?.studioPiedraUrl ?? null}
                    productId={productId}
                  />
                ) : null}

                {coverCandidates.length > 0 ? (
                  <div>
                    <p className="pf-group-label">Resultados</p>
                    <div className="pf-gal">
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
                            {candidate.source === "serper" ? "Google Imágenes" : "Otra fuente"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="pf-sep" />

                <div>
                  <p className="pf-group-label">Galería</p>
                  <input
                    ref={galleryInputRef}
                    accept="image/*"
                    className="sr-only"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.target.files ?? []);
                      if (files.length > 0) setGalleryFiles((prev) => [...prev, ...files]);
                      event.target.value = "";
                    }}
                    type="file"
                  />
                  <div className="pf-gal">
                    {existingImages.map((image) => (
                      <div key={image.id} className="pf-th">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="Imagen de la galería" src={image.url} />
                        <button
                          aria-label="Eliminar imagen"
                          className="pf-th-x"
                          onClick={() => { void deleteImage(image.id); }}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {galleryPreview.map((preview, index) => (
                      <div key={preview} className="pf-th">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="Vista previa de la galería" src={preview} />
                        <button
                          aria-label="Quitar imagen"
                          className="pf-th-x"
                          onClick={() => setGalleryFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))}
                          type="button"
                        >
                          ×
                        </button>
                        <span className="pf-th-tag">Nueva</span>
                      </div>
                    ))}
                    <button
                      className="pf-th pf-th-add"
                      onClick={() => galleryInputRef.current?.click()}
                      type="button"
                    >
                      <b>+</b>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="pf-card">
              <div className="pf-card-h">
                <h2>Estado y venta</h2>
              </div>
              <div className="pf-card-b" style={{ paddingTop: 4 }}>
                <div className="pf-toggles">
                  <AdminToggle
                    checked={isActive}
                    label="Visible en la tienda"
                    onChange={(checked) => form.setValue("isActive", checked, { shouldDirty: true })}
                  />
                  <AdminToggle
                    checked={inStock}
                    label="Disponible para venta"
                    onChange={(checked) => form.setValue("inStock", checked, { shouldDirty: true })}
                  />
                  <AdminToggle
                    checked={isFeatured}
                    label="Destacar en colecciones"
                    onChange={(checked) => form.setValue("isFeatured", checked, { shouldDirty: true })}
                  />
                  <AdminToggle
                    checked={onlineSaleEnabled}
                    description="Si está apagado, el producto muestra 'Consultar stock por WhatsApp' en vez del carrito."
                    label="Habilitar venta web"
                    onChange={(checked) => form.setValue("onlineSaleEnabled", checked, { shouldDirty: true })}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </form>
  );
}
