"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EncounterSchema } from "../schemas/encounter-schemas";
import { AdminToggle, AdminUploadZone } from "./index";
import { useToast } from "@/shared/hooks";

type EncounterImage = {
  id: string;
  url: string;
  displayOrder: number;
};

type EncounterData = {
  id: string;
  title: string;
  eventDate: string;
  excerpt?: string | null;
  description?: string | null;
  videoUrl?: string | null;
  location?: string | null;
  coverImageUrl: string;
  displayOrder: number;
  isActive: boolean;
  images?: EncounterImage[];
};

type EncounterAdminFormProps = {
  mode: "create" | "edit";
  encounterId?: string;
  initialData?: EncounterData | null;
};

const schema = EncounterSchema;
type SchemaInput = z.input<typeof schema>;

export function EncounterAdminForm({ mode, encounterId, initialData }: EncounterAdminFormProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<EncounterImage[]>(initialData?.images ?? []);

  const defaultValues = useMemo<SchemaInput>(
    () => ({
      title: initialData?.title ?? "",
      event_date: initialData?.eventDate ? initialData.eventDate.split("T")[0] : "",
      excerpt: initialData?.excerpt ?? undefined,
      description: initialData?.description ?? undefined,
      video_url: initialData?.videoUrl ?? undefined,
      location: initialData?.location ?? undefined,
      display_order: initialData?.displayOrder ?? 0,
      is_active: initialData?.isActive ?? true,
    }),
    [initialData],
  );

  const form = useForm<SchemaInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const isActive = form.watch("is_active") ?? true;

  const coverPreview = useMemo(
    () => (coverImageFile ? URL.createObjectURL(coverImageFile) : initialData?.coverImageUrl ?? null),
    [initialData?.coverImageUrl, coverImageFile],
  );
  const galleryPreview = useMemo(() => galleryFiles.map((file) => URL.createObjectURL(file)), [galleryFiles]);

  useEffect(() => {
    return () => {
      if (coverImageFile && coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
      for (const preview of galleryPreview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [galleryPreview, coverImageFile, coverPreview]);

  async function uploadGalleryImages(targetEncounterId: string) {
    for (const file of galleryFiles) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/admin/encuentros/${targetEncounterId}/imagenes`, {
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
      const endpoint = mode === "create" ? "/api/admin/encuentros" : `/api/admin/encuentros/${encounterId}`;
      const method = mode === "create" ? "POST" : "PUT";

      if (mode === "create" && !coverImageFile) {
        throw new Error("La portada es obligatoria al crear un encuentro.");
      }

      const formData = new FormData();
      if (values.title) formData.append("title", values.title);
      if (values.event_date) formData.append("event_date", values.event_date);
      if (values.excerpt) formData.append("excerpt", values.excerpt);
      if (values.description) formData.append("description", values.description);
      if (values.video_url) formData.append("video_url", values.video_url);
      if (values.location) formData.append("location", values.location);
      formData.append("display_order", String(values.display_order ?? 0));
      formData.append("is_active", String(values.is_active));
      
      if (coverImageFile) {
        formData.append("file", coverImageFile);
      }

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            data?: { id?: string };
            message?: string;
          }
        | null;

      if (!response.ok) {
        const message = payload?.message ?? "No se pudo guardar el encuentro.";
        setError(message);
        toast({ message, variant: "error" });
        return;
      }

      const targetEncounterId = mode === "create" ? payload?.data?.id : encounterId;
      if (targetEncounterId && galleryFiles.length > 0) {
        await uploadGalleryImages(targetEncounterId);
      }

      toast({ message: "Encuentro guardado correctamente." });
      window.location.href = "/admin/encuentros";
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Ocurrio un error inesperado al guardar.";
      setError(message);
      toast({ message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(imageId: string) {
    if (!encounterId) return;

    const response = await fetch(`/api/admin/encuentros/${encounterId}/imagenes/${imageId}`, {
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Información principal</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Título</span>
                <input className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("title")} />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Fecha del evento</span>
                <input type="date" className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("event_date")} />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Lugar / Ubicación</span>
                <input className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("location")} />
              </label>
            </div>
            
            <label className="mt-4 block space-y-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Extracto (Resumen corto)</span>
              <textarea className="min-h-20 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("excerpt")} />
            </label>

            <label className="mt-4 block space-y-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Descripción (Crónica)</span>
              <textarea className="min-h-32 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("description")} />
            </label>
            
            <label className="mt-4 block space-y-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">URL del Video (Youtube/Instagram)</span>
              <input type="url" placeholder="https://..." className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none" {...form.register("video_url")} />
            </label>
          </section>

          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Estado y Visibilidad</h2>
            <div className="space-y-1">
              <AdminToggle
                checked={isActive}
                label="Visible en la galería de encuentros"
                onChange={(checked) => form.setValue("is_active", checked)}
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2px] border border-border bg-white p-6">
            <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Portada (Cover)</h2>
            <AdminUploadZone
              hint="PNG o JPG. Recomendado 800x600px."
              onFileSelect={setCoverImageFile}
              previewUrl={coverPreview}
            />

            <div className="mt-5 border-t border-border pt-4">
              <h3 className="mb-3 text-[0.78rem] font-medium text-text">Galería de fotos</h3>
              <label className="flex cursor-pointer items-center justify-center rounded-[8px] border border-dashed border-border px-4 py-3 text-sm text-text-mid hover:border-gold/50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(event) => setGalleryFiles(Array.from(event.target.files ?? []))}
                />
                Seleccionar múltiples imágenes
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
                  <p className="text-[11px] uppercase tracking-[0.12em] text-text-light">Imágenes actuales</p>
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
        </div>
      </div>

      {error ? <p className="text-sm text-error">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar encuentro"}
        </button>
        <Link href="/admin/encuentros" className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
