"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  CreateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "../schemas/category-schemas";
import { AdminToggle, AdminUploadZone } from "./index";
import { useToast } from "@/shared/hooks";

type CategoryData = {
  id: string;
  name?: string | null;
  description?: string | null;
  parentId?: string | null;
  featured?: boolean | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
  imageUrl?: string | null;
  headerImageUrl?: string | null;
};

type CategoryOption = {
  id: string;
  name: string;
};

type CategoryAdminFormProps = {
  mode: "create" | "edit";
  categoryId?: string;
  initialData?: CategoryData | null;
};

const schema = CreateCategorySchema;
type SchemaInput = z.input<typeof schema>;

export function CategoryAdminForm({ mode, categoryId, initialData }: CategoryAdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryOption[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [headerImageFile, setHeaderImageFile] = useState<File | null>(null);

  const defaultValues = useMemo<SchemaInput>(
    () => ({
      name: initialData?.name ?? "",
      description: initialData?.description ?? undefined,
      parentId: initialData?.parentId ?? undefined,
      featured: initialData?.featured ?? false,
      displayOrder: initialData?.displayOrder ?? 0,
      isActive: initialData?.isActive ?? true,
    }),
    [initialData],
  );

  const form = useForm<SchemaInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const featured = form.watch("featured") ?? false;
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
      setAllCategories(payload.data ?? []);
    };

    void categoryRequest();
  }, []);

  const coverPreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : initialData?.imageUrl ?? null),
    [imageFile, initialData?.imageUrl],
  );
  const headerPreview = useMemo(
    () => (headerImageFile ? URL.createObjectURL(headerImageFile) : initialData?.headerImageUrl ?? null),
    [headerImageFile, initialData?.headerImageUrl],
  );

  useEffect(() => {
    return () => {
      if (imageFile && coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
      if (headerImageFile && headerPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(headerPreview);
      }
    };
  }, [coverPreview, headerImageFile, headerPreview, imageFile]);

  async function onSubmit(values: SchemaInput) {
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "create" ? "/api/admin/categorias" : `/api/admin/categorias/${categoryId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values as CreateCategoryInput | UpdateCategoryInput),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            data?: { id?: string };
            message?: string;
          }
        | null;

      if (!response.ok) {
        const message = payload?.message ?? "No se pudo guardar la categoria.";
        setError(message);
        toast({ message, variant: "error" });
        return;
      }

      const targetCategoryId = mode === "create" ? payload?.data?.id : categoryId;
      if (targetCategoryId && imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("target", "cover");
        await fetch(`/api/admin/categorias/${targetCategoryId}/imagen`, { method: "POST", body: formData });
      }

      if (targetCategoryId && headerImageFile) {
        const formData = new FormData();
        formData.append("file", headerImageFile);
        formData.append("target", "header");
        await fetch(`/api/admin/categorias/${targetCategoryId}/imagen`, { method: "POST", body: formData });
      }

      toast({ message: "Categoria guardada correctamente." });
      router.push("/admin/categorias");
      router.refresh();
    } catch {
      const message = "Ocurrio un error inesperado.";
      setError(message);
      toast({ message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Configuracion basica</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Nombre</span>
                <input className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("name")} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Categoria padre</span>
                <select
                  className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                  {...form.register("parentId", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                >
                  <option value="">Sin categoria padre</option>
                  {allCategories
                    .filter((category) => category.id !== categoryId)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <label className="mt-4 block space-y-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Descripcion</span>
              <textarea className="min-h-32 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("description")} />
            </label>

            <label className="mt-4 block space-y-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Orden</span>
              <input
                type="number"
                className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                {...form.register("displayOrder", { setValueAs: optionalNumber })}
              />
            </label>
          </section>

          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Estado editorial</h2>
            <div className="space-y-1">
              <AdminToggle
                checked={featured}
                label="Categoria destacada"
                onChange={(checked) => form.setValue("featured", checked)}
              />
              <AdminToggle
                checked={isActive}
                label="Visible en la tienda"
                onChange={(checked) => form.setValue("isActive", checked)}
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Imagen principal</h2>
            <AdminUploadZone
              hint="Miniatura usada en tarjetas y listado."
              onFileSelect={setImageFile}
              previewUrl={coverPreview}
            />
          </section>

          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Header de categoria</h2>
            <AdminUploadZone
              hint="Imagen horizontal para cabecera de pagina."
              onFileSelect={setHeaderImageFile}
              previewUrl={headerPreview}
            />
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
          {loading ? "Guardando..." : "Guardar categoria"}
        </button>
        <Link href="/admin/categorias" className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
