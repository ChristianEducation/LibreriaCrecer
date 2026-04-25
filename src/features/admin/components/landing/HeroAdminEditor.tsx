"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { HeroPreview } from "@/features/catalogo/components";
import type {
  HeroOverlayVariantViewModel,
  HeroSlideViewModel,
  HeroViewModel,
} from "@/features/catalogo/view-models/hero-view-model";
import { useToast } from "@/shared/hooks";
import {
  HERO_CONTENT_THEME_DEFAULT,
  HERO_OVERLAY_OPACITY_DEFAULT,
  HERO_OVERLAY_OPACITY_MAX,
  HERO_OVERLAY_OPACITY_MIN,
  HERO_OVERLAY_VARIANT_DEFAULT,
  HERO_TEXT_ALIGN_DEFAULT,
  HERO_TEXT_POSITION_DEFAULT,
  type HeroContentTheme,
  type HeroOverlayVariant,
  type HeroTextAlign,
  type HeroTextPosition,
} from "@/shared/config/landing";

type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  ctaText: string | null;
  showContent: boolean;
  textPosition: HeroTextPosition;
  textAlign: HeroTextAlign;
  overlayVariant: HeroOverlayVariant;
  overlayOpacity: number;
  contentTheme: HeroContentTheme;
  displayOrder: number;
  isActive: boolean;
};

type HeroFormState = {
  id?: string;
  existingImageUrl: string | null;
  title: string;
  subtitle: string;
  cta_text: string;
  link_url: string;
  show_content: boolean;
  text_position: HeroTextPosition;
  text_align: HeroTextAlign;
  overlay_variant: HeroOverlayVariant;
  overlay_opacity: number;
  content_theme: HeroContentTheme;
  display_order: number;
  is_active: boolean;
  imageFile: File | null;
};

const initialForm: HeroFormState = {
  existingImageUrl: null,
  title: "",
  subtitle: "",
  cta_text: "",
  link_url: "",
  show_content: true,
  text_position: HERO_TEXT_POSITION_DEFAULT,
  text_align: HERO_TEXT_ALIGN_DEFAULT,
  overlay_variant: HERO_OVERLAY_VARIANT_DEFAULT,
  overlay_opacity: HERO_OVERLAY_OPACITY_DEFAULT,
  content_theme: HERO_CONTENT_THEME_DEFAULT,
  display_order: 0,
  is_active: true,
  imageFile: null,
};

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

const POSITION_OPTIONS: SegmentedOption<HeroTextPosition>[] = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

const ALIGN_OPTIONS: SegmentedOption<HeroTextAlign>[] = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

const OVERLAY_OPTIONS: SegmentedOption<HeroOverlayVariant>[] = [
  { value: "gradient", label: "Degradado" },
  { value: "solid", label: "Sólido" },
  { value: "none", label: "Ninguno" },
];

const THEME_OPTIONS: SegmentedOption<HeroContentTheme>[] = [
  { value: "light", label: "Texto claro" },
  { value: "dark", label: "Texto oscuro" },
];

function Segmented<T extends string>({
  value,
  options,
  onChange,
  full = false,
  ariaLabel,
}: {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (next: T) => void;
  full?: boolean;
  ariaLabel?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={full ? "admin-segmented admin-segmented--full" : "admin-segmented"}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`admin-segmented-option${isActive ? " admin-segmented-option--active" : ""}`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

type HeroAdminEditorProps = {
  initialData?: HeroViewModel;
};

function mapOverlayVariant(v: HeroOverlayVariant): HeroOverlayVariantViewModel {
  return v === "solid" ? "dark" : v;
}

export function HeroAdminEditor({ initialData }: HeroAdminEditorProps = {}) {
  const router = useRouter();
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<HeroFormState>(initialForm);

  const previewUrl = useMemo(() => (form.imageFile ? URL.createObjectURL(form.imageFile) : null), [form.imageFile]);

  const liveViewModel = useMemo((): HeroViewModel => {
    const imageUrl = previewUrl ?? form.existingImageUrl ?? "";
    if (imageUrl) {
      const liveSlide: HeroSlideViewModel = {
        id: form.id ?? "preview",
        imageUrl,
        title: form.title || null,
        subtitle: form.subtitle || null,
        ctaText: form.cta_text || null,
        linkUrl: form.link_url || null,
        showContent: form.show_content,
        textPosition: form.text_position,
        textAlign: form.text_align,
        overlayVariant: mapOverlayVariant(form.overlay_variant),
        overlayOpacity: form.overlay_opacity,
        contentTheme: form.content_theme,
      };
      return {
        eyebrow: initialData?.eyebrow ?? null,
        title: initialData?.title ?? null,
        body: initialData?.body ?? null,
        slides: [liveSlide],
      };
    }
    return initialData ?? { eyebrow: null, title: null, body: null, slides: [] };
  }, [form, previewUrl, initialData]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function fetchSlides() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/landing/hero", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { data?: HeroSlide[]; message?: string } | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudieron cargar los slides.");
        return;
      }

      setSlides(payload?.data ?? []);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchSlides();
  }, []);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (form.id) {
        const updatePayload = {
          title: form.title || undefined,
          subtitle: form.subtitle || undefined,
          link_url: form.link_url || undefined,
          cta_text: form.cta_text || undefined,
          show_content: form.show_content,
          text_position: form.text_position,
          text_align: form.text_align,
          overlay_variant: form.overlay_variant,
          overlay_opacity: form.overlay_opacity,
          content_theme: form.content_theme,
          display_order: Number(form.display_order || 0),
          is_active: form.is_active,
        };

        const response = await fetch(`/api/admin/landing/hero/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo actualizar el slide.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }

        if (form.imageFile) {
          const uploadData = new FormData();
          uploadData.append("file", form.imageFile);
          await fetch(`/api/admin/landing/hero/${form.id}/imagen`, { method: "POST", body: uploadData });
        }
      } else {
        if (!form.imageFile) {
          const message = "La imagen es obligatoria para crear un slide.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }

        const createData = new FormData();
        createData.append("title", form.title);
        createData.append("subtitle", form.subtitle);
        createData.append("link_url", form.link_url);
        createData.append("cta_text", form.cta_text);
        createData.append("show_content", String(form.show_content));
        createData.append("text_position", form.text_position);
        createData.append("text_align", form.text_align);
        createData.append("overlay_variant", form.overlay_variant);
        createData.append("overlay_opacity", String(form.overlay_opacity));
        createData.append("content_theme", form.content_theme);
        createData.append("display_order", String(form.display_order ?? 0));
        createData.append("is_active", String(form.is_active));
        createData.append("file", form.imageFile);

        const response = await fetch("/api/admin/landing/hero", {
          method: "POST",
          body: createData,
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo crear el slide.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }
      }

      setForm(initialForm);
      toast({ message: "Hero actualizado correctamente." });
      await fetchSlides();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(slide: HeroSlide) {
    setForm({
      id: slide.id,
      existingImageUrl: slide.imageUrl,
      title: slide.title ?? "",
      subtitle: slide.subtitle ?? "",
      cta_text: slide.ctaText ?? "",
      link_url: slide.linkUrl ?? "",
      show_content: slide.showContent,
      text_position: slide.textPosition,
      text_align: slide.textAlign,
      overlay_variant: slide.overlayVariant,
      overlay_opacity: slide.overlayOpacity,
      content_theme: slide.contentTheme,
      display_order: slide.displayOrder,
      is_active: slide.isActive,
      imageFile: null,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function removeSlide(id: string) {
    if (!window.confirm("Eliminar este slide?")) return;

    const response = await fetch(`/api/admin/landing/hero/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const message = "No se pudo eliminar el slide.";
      setError(message);
      toast({ message, variant: "error" });
      return;
    }

    toast({ message: "Slide eliminado." });
    await fetchSlides();
    router.refresh();
  }

  async function moveSlide(id: string, direction: "up" | "down") {
    const currentIndex = slides.findIndex((item) => item.id === id);
    if (currentIndex < 0) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    setSlides(reordered);
    await fetch("/api/admin/landing/hero/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slideIds: reordered.map((item) => item.id) }),
    });
    await fetchSlides();
    router.refresh();
  }

  const overlayDisabled = form.overlay_variant === "none";
  const sliderStyle = { "--value": `${form.overlay_opacity}%` } as CSSProperties;
  const dropzonePreview = previewUrl ?? form.existingImageUrl;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Link
          href="/admin/landing"
          className="inline-flex items-center gap-1.5 text-sm text-text-mid transition-colors hover:text-text"
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 20 20"
            width="14"
          >
            <path d="M12 4l-6 6 6 6" />
          </svg>
          Volver a Landing
        </Link>
      </div>

      <div className="hero-editor-grid">
        {liveViewModel.slides.length > 0 ? (
          <div className="hero-editor-grid-preview">
            <div className="hero-editor-preview-sticky">
              <HeroPreview data={liveViewModel} />
            </div>
          </div>
        ) : null}

        <div className="hero-editor-grid-form">
      <form onSubmit={submitForm} className="editor-card">
        <div className="editor-card-header flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-text">{form.id ? "Editar slide" : "Nuevo slide"}</h2>
            <p className="mt-0.5 text-[12px] text-text-light">
              {form.id ? "Aplica cambios al slide seleccionado." : "Completa los campos para crear un nuevo slide."}
            </p>
          </div>
          {form.id ? (
            <span className="admin-badge admin-badge--active">
              <span className="admin-badge-dot" />
              Editando
            </span>
          ) : null}
        </div>

        <div className="editor-card-body">
          {/* ─── Contenido ─── */}
          <section className="admin-fieldset">
            <p className="admin-section-label">Contenido</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-field-label" htmlFor="hero-title">
                  Título
                </label>
                <input
                  id="hero-title"
                  className="admin-input"
                  placeholder="Ej: Lecturas para esta cuaresma"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label" htmlFor="hero-subtitle">
                  Subtítulo
                </label>
                <input
                  id="hero-subtitle"
                  className="admin-input"
                  placeholder="Texto breve de apoyo"
                  value={form.subtitle}
                  onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section className="admin-fieldset">
            <p className="admin-section-label">Llamado a la acción (CTA)</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-field-label" htmlFor="hero-cta-text">
                  Texto del botón
                </label>
                <input
                  id="hero-cta-text"
                  className="admin-input"
                  placeholder="Ej: Ver colección"
                  value={form.cta_text}
                  onChange={(event) => setForm((prev) => ({ ...prev, cta_text: event.target.value }))}
                />
              </div>
              <div>
                <label className="admin-field-label" htmlFor="hero-link">
                  URL de destino
                </label>
                <input
                  id="hero-link"
                  className="admin-input"
                  placeholder="https://..."
                  value={form.link_url}
                  onChange={(event) => setForm((prev) => ({ ...prev, link_url: event.target.value }))}
                />
              </div>
            </div>
            <p className="admin-field-help">
              El botón solo aparece si completas <strong>texto</strong> y <strong>URL</strong>.
            </p>
          </section>

          {/* ─── Imagen ─── */}
          <section className="admin-fieldset">
            <p className="admin-section-label">Imagen de fondo</p>
            <AdminUploadZone
              hint="Recomendado: 1920×900 px. JPG o PNG."
              onFileSelect={(file) => setForm((prev) => ({ ...prev, imageFile: file }))}
              previewUrl={dropzonePreview}
            />
            {form.id && form.existingImageUrl && !form.imageFile ? (
              <p className="admin-field-help">
                Imagen actual del slide. Sube una nueva para reemplazarla.
              </p>
            ) : null}
          </section>

          {/* ─── Configuración visual ─── */}
          <section className="admin-fieldset">
            <p className="admin-section-label">Configuración visual</p>

            <div className="rounded-[10px] border border-border bg-[#faf9f6] px-4">
              <AdminToggle
                checked={form.show_content}
                label="Mostrar contenido sobre la imagen"
                description="Si está apagado, solo se muestra la imagen sin título ni botón."
                onChange={(checked) => setForm((prev) => ({ ...prev, show_content: checked }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-field-label">Posición del contenido</label>
                <Segmented
                  value={form.text_position}
                  options={POSITION_OPTIONS}
                  onChange={(value) => setForm((prev) => ({ ...prev, text_position: value }))}
                  full
                  ariaLabel="Posición del contenido"
                />
                <p className="admin-field-help">Dónde se ancla el bloque de texto sobre la imagen.</p>
              </div>
              <div>
                <label className="admin-field-label">Alineación del texto</label>
                <Segmented
                  value={form.text_align}
                  options={ALIGN_OPTIONS}
                  onChange={(value) => setForm((prev) => ({ ...prev, text_align: value }))}
                  full
                  ariaLabel="Alineación del texto"
                />
                <p className="admin-field-help">Cómo se alinean las líneas dentro del bloque.</p>
              </div>
            </div>

            <div>
              <label className="admin-field-label">Tema del texto</label>
              <Segmented
                value={form.content_theme}
                options={THEME_OPTIONS}
                onChange={(value) => setForm((prev) => ({ ...prev, content_theme: value }))}
                ariaLabel="Tema del texto"
              />
              <p className="admin-field-help">
                Usa <strong>texto claro</strong> sobre imágenes oscuras y <strong>texto oscuro</strong> sobre claras.
              </p>
            </div>

            <div>
              <label className="admin-field-label">Tipo de overlay</label>
              <Segmented
                value={form.overlay_variant}
                options={OVERLAY_OPTIONS}
                onChange={(value) => setForm((prev) => ({ ...prev, overlay_variant: value }))}
                ariaLabel="Tipo de overlay"
              />
              <p className="admin-field-help">El overlay oscurece la imagen para que el texto sea legible.</p>
            </div>

            <div>
              <label className="admin-field-label" htmlFor="hero-overlay-opacity">
                Opacidad del overlay
              </label>
              <div className="admin-slider-row">
                <input
                  id="hero-overlay-opacity"
                  type="range"
                  min={HERO_OVERLAY_OPACITY_MIN}
                  max={HERO_OVERLAY_OPACITY_MAX}
                  step={1}
                  disabled={overlayDisabled}
                  className="admin-slider"
                  style={sliderStyle}
                  value={form.overlay_opacity}
                  onChange={(event) => setForm((prev) => ({ ...prev, overlay_opacity: Number(event.target.value) }))}
                />
                <span className="admin-slider-value">{form.overlay_opacity}%</span>
              </div>
              {overlayDisabled ? (
                <p className="admin-field-help">Selecciona un tipo de overlay para ajustar la opacidad.</p>
              ) : (
                <p className="admin-field-help">0% es transparente, 100% es completamente opaco.</p>
              )}
            </div>
          </section>

          {/* ─── Publicación ─── */}
          <section className="admin-fieldset">
            <p className="admin-section-label">Publicación</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="admin-field-label" htmlFor="hero-order">
                  Orden de aparición
                </label>
                <input
                  id="hero-order"
                  type="number"
                  className="admin-input"
                  value={form.display_order}
                  onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value || 0) }))}
                />
                <p className="admin-field-help">Menor número aparece primero.</p>
              </div>
              <div className="flex items-end">
                <div className="w-full rounded-[10px] border border-border bg-[#faf9f6] px-4">
                  <AdminToggle
                    checked={form.is_active}
                    label="Slide activo"
                    description="Visible en la portada del sitio."
                    onChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
                  />
                </div>
              </div>
            </div>
          </section>

          {error ? <div className="admin-error-block">{error}</div> : null}
        </div>

        <div className="editor-card-footer">
          {form.id ? (
            <button type="button" onClick={() => setForm(initialForm)} className="admin-btn-secondary">
              Cancelar edición
            </button>
          ) : null}
          <button type="submit" disabled={saving} className="admin-btn-primary">
            {saving ? (
              <>
                <svg
                  aria-hidden="true"
                  className="animate-spin"
                  fill="none"
                  height="14"
                  viewBox="0 0 20 20"
                  width="14"
                >
                  <circle cx="10" cy="10" r="7" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.4" />
                  <path
                    d="M17 10a7 7 0 00-7-7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.4"
                  />
                </svg>
                Guardando...
              </>
            ) : form.id ? (
              "Actualizar slide"
            ) : (
              "Crear slide"
            )}
          </button>
        </div>
      </form>
        </div>
      </div>

      <div className="editor-card">
        <div className="editor-card-header flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-text">Slides existentes</h3>
            <p className="mt-0.5 text-[12px] text-text-light">
              {slides.length} {slides.length === 1 ? "slide" : "slides"} configurado
              {slides.length === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <div className="editor-card-body">
          {loading ? (
            <p className="text-sm text-text-light">Cargando slides...</p>
          ) : slides.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-border bg-[#faf9f6] px-6 py-10 text-center">
              <p className="text-sm text-text-mid">Aún no hay slides creados.</p>
              <p className="mt-1 text-[12px] text-text-light">Usa el formulario de arriba para añadir el primero.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {slides.map((slide, index) => {
                const isEditing = form.id === slide.id;
                return (
                  <article
                    key={slide.id}
                    className="admin-slide-card"
                    style={isEditing ? { borderColor: "rgba(200, 168, 48, 0.55)", background: "#fdfbef" } : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.imageUrl} alt={slide.title ?? "Hero"} className="admin-slide-thumb" />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[14px] font-medium text-text">
                          {slide.title ?? "(Sin título)"}
                        </p>
                        <span
                          className={`admin-badge ${slide.isActive ? "admin-badge--active" : "admin-badge--inactive"}`}
                        >
                          <span className="admin-badge-dot" />
                          {slide.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      {slide.subtitle ? (
                        <p className="mt-0.5 truncate text-[12.5px] text-text-mid">{slide.subtitle}</p>
                      ) : null}
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-text-light">
                        <span className="inline-flex items-center gap-1">
                          <svg
                            aria-hidden="true"
                            fill="none"
                            height="11"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.6"
                            viewBox="0 0 20 20"
                            width="11"
                          >
                            <path d="M3 6h14M3 10h14M3 14h14" />
                          </svg>
                          Orden {slide.displayOrder}
                        </span>
                        <span className="truncate">
                          {slide.linkUrl ? (
                            <span className="inline-flex items-center gap-1">
                              <svg
                                aria-hidden="true"
                                fill="none"
                                height="11"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.6"
                                viewBox="0 0 20 20"
                                width="11"
                              >
                                <path d="M8.5 11.5a3 3 0 004.5 0l3-3a3 3 0 00-4.5-4.5l-1 1M11.5 8.5a3 3 0 00-4.5 0l-3 3a3 3 0 004.5 4.5l1-1" />
                              </svg>
                              {slide.linkUrl}
                            </span>
                          ) : (
                            "Sin enlace"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveSlide(slide.id, "up")}
                        disabled={index === 0}
                        className="admin-icon-btn"
                        aria-label="Subir"
                        title="Subir"
                      >
                        <svg
                          aria-hidden="true"
                          fill="none"
                          height="15"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          viewBox="0 0 20 20"
                          width="15"
                        >
                          <path d="M5 12l5-5 5 5" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSlide(slide.id, "down")}
                        disabled={index === slides.length - 1}
                        className="admin-icon-btn"
                        aria-label="Bajar"
                        title="Bajar"
                      >
                        <svg
                          aria-hidden="true"
                          fill="none"
                          height="15"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          viewBox="0 0 20 20"
                          width="15"
                        >
                          <path d="M5 8l5 5 5-5" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(slide)}
                        className="admin-icon-btn"
                        aria-label="Editar"
                        title="Editar"
                      >
                        <svg
                          aria-hidden="true"
                          fill="none"
                          height="15"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          viewBox="0 0 20 20"
                          width="15"
                        >
                          <path d="M14 3l3 3-9.5 9.5L4 16l.5-3.5L14 3z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSlide(slide.id)}
                        className="admin-icon-btn admin-icon-btn--danger"
                        aria-label="Eliminar"
                        title="Eliminar"
                      >
                        <svg
                          aria-hidden="true"
                          fill="none"
                          height="15"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          viewBox="0 0 20 20"
                          width="15"
                        >
                          <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
                        </svg>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
