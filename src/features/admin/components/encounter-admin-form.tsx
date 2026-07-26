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
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

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
    if (!window.confirm("¿Eliminar esta imagen de la galería? Esta acción no se puede deshacer.")) return;

    setDeletingImageId(imageId);
    try {
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
    } finally {
      setDeletingImageId(null);
    }
  }

  function removePendingGalleryFile(index: number) {
    setGalleryFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <form className="encounter-admin-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="encounter-form-actions encounter-form-actions--top">
        <Link className="encounter-button encounter-button--secondary" href="/admin/encuentros">
          Cancelar
        </Link>
        <button className="encounter-button encounter-button--primary" disabled={loading} type="submit">
          {loading ? "Guardando..." : mode === "create" ? "Crear encuentro" : "Guardar cambios"}
        </button>
      </div>

      <section className="editor-card encounter-form-section">
        <div className="editor-card-header encounter-section-header">
          <div>
            <p className="encounter-section-kicker">Contenido</p>
            <h2>Información principal</h2>
            <p>Datos que se mostrarán en la crónica pública del encuentro.</p>
          </div>
        </div>

        <div className="editor-card-body encounter-information-grid">
          <label className="encounter-field encounter-field--title">
            <span>Título</span>
            <input {...form.register("title")} />
          </label>

          <label className="encounter-field encounter-field--location">
            <span>Lugar / ubicación</span>
            <input {...form.register("location")} />
          </label>

          <label className="encounter-field encounter-field--date">
            <span>Fecha del evento</span>
            <input type="date" {...form.register("event_date")} />
          </label>

          <label className="encounter-field encounter-field--video">
            <span>URL del video</span>
            <input placeholder="https://youtube.com/..." type="url" {...form.register("video_url")} />
          </label>

          <label className="encounter-field encounter-field--order">
            <span>Orden de aparición</span>
            <input min={0} type="number" {...form.register("display_order", { valueAsNumber: true })} />
          </label>

          <label className="encounter-field encounter-field--visibility">
            <span>Visible</span>
            <div className="encounter-switch-control">
              <AdminToggle
                ariaLabel="Visible en la galería de encuentros"
                checked={isActive}
                onChange={(checked) => form.setValue("is_active", checked)}
              />
            </div>
          </label>

          <label className="encounter-field encounter-field--full">
            <span>Extracto</span>
            <textarea className="encounter-textarea--excerpt" {...form.register("excerpt")} />
            <small>Resumen breve que introduce el encuentro en su tarjeta y página pública.</small>
          </label>

          <label className="encounter-field encounter-field--full">
            <span>Descripción / crónica</span>
            <textarea className="encounter-textarea--description" {...form.register("description")} />
          </label>
        </div>
      </section>

      <section className="editor-card encounter-form-section">
        <div className="editor-card-header encounter-section-header encounter-media-header">
          <div>
            <p className="encounter-section-kicker">Multimedia</p>
            <h2>Imágenes del encuentro</h2>
            <p>Administra la portada principal y las fotografías de la galería.</p>
          </div>
          <span className="encounter-image-count">
            {existingImages.length + galleryFiles.length} {existingImages.length + galleryFiles.length === 1 ? "imagen" : "imágenes"}
          </span>
        </div>

        <div className="editor-card-body encounter-media-body">
          <div className="encounter-cover-section">
            <div>
              <h3>Portada</h3>
              <p>Imagen principal de la tarjeta y del encabezado del encuentro.</p>
            </div>

            <div className="encounter-cover-layout">
              <div className="encounter-cover-preview">
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="Portada actual del encuentro" src={coverPreview} />
                ) : (
                  <div className="encounter-cover-empty">Sin portada seleccionada</div>
                )}
              </div>

              <AdminUploadZone
                className="encounter-cover-upload"
                hint="JPG, PNG o WebP. Recomendado 1200 × 800 px."
                label={coverPreview ? "Reemplazar portada" : "Seleccionar portada"}
                onClearSelection={() => setCoverImageFile(null)}
                onFileSelect={setCoverImageFile}
                selectedFileName={coverImageFile?.name ?? null}
                variant="compact"
              />
            </div>
          </div>

          <div className="encounter-gallery-section">
            <div className="encounter-gallery-heading">
              <div>
                <h3>Galería de fotos</h3>
                <p>Selecciona varias imágenes para incorporarlas al encuentro.</p>
              </div>
            </div>

            <label className="encounter-gallery-upload">
              <input
                accept="image/*"
                className="sr-only"
                multiple
                onChange={(event) => setGalleryFiles(Array.from(event.target.files ?? []))}
                type="file"
              />
              <span className="encounter-gallery-upload-icon" aria-hidden="true">+</span>
              <span>
                <strong>Seleccionar múltiples imágenes</strong>
                <small>JPG, PNG o WebP. Puedes seleccionar varias fotografías a la vez.</small>
              </span>
            </label>

            {existingImages.length > 0 || galleryPreview.length > 0 ? (
              <div className="encounter-gallery-grid">
                {existingImages.map((image, index) => (
                  <figure className="encounter-gallery-item" key={image.id}>
                    <a href={image.url} rel="noreferrer" target="_blank" title="Abrir imagen en tamaño completo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt={`Fotografía ${index + 1} del encuentro`} src={image.url} />
                    </a>
                    <span className="encounter-gallery-index">{index + 1}</span>
                    <button
                      aria-label={`Eliminar fotografía ${index + 1}`}
                      className="encounter-gallery-remove"
                      disabled={deletingImageId === image.id}
                      onClick={() => deleteImage(image.id)}
                      title="Eliminar imagen"
                      type="button"
                    >
                      {deletingImageId === image.id ? "…" : "×"}
                    </button>
                  </figure>
                ))}

                {galleryPreview.map((preview, index) => (
                  <figure className="encounter-gallery-item encounter-gallery-item--pending" key={preview}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={`Nueva fotografía ${index + 1}`} src={preview} />
                    <span className="encounter-gallery-index">Nueva</span>
                    <button
                      aria-label={`Quitar nueva fotografía ${index + 1}`}
                      className="encounter-gallery-remove"
                      onClick={() => removePendingGalleryFile(index)}
                      title="Quitar de la selección"
                      type="button"
                    >
                      ×
                    </button>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="encounter-gallery-empty">
                La galería está vacía. Selecciona fotografías para comenzar.
              </div>
            )}
          </div>
        </div>
      </section>

      {error ? <p className="encounter-form-error" role="alert">{error}</p> : null}

      <div className="encounter-form-actions encounter-form-actions--bottom">
        <Link className="encounter-button encounter-button--secondary" href="/admin/encuentros">
          Cancelar
        </Link>
        <button className="encounter-button encounter-button--primary" disabled={loading} type="submit">
          {loading ? "Guardando..." : mode === "create" ? "Crear encuentro" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}