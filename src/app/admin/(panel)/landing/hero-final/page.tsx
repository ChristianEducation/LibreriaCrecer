"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { QuoteSection } from "@/features/catalogo/components";
import { useToast } from "@/shared/hooks";

type BannerRow = {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
  isActive: boolean;
  metadata?: { imageOnly?: boolean; overlay?: number; brightness?: number } | null;
};

type FormState = {
  id?: string;
  existingImageUrl: string | null;
  title: string;
  description: string;
  link_url: string;
  is_active: boolean;
  imageFile: File | null;
  imageOnly: boolean;
  overlay: number;
  brightness: number;
};

const TEXT_OVERLAY_DEFAULT = 62;

const initialForm: FormState = {
  existingImageUrl: null,
  title: "",
  description: "",
  link_url: "",
  is_active: true,
  imageFile: null,
  imageOnly: false,
  overlay: TEXT_OVERLAY_DEFAULT,
  brightness: 100,
};

function Slider({
  label,
  help,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  help: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <label className="block rounded-[10px] border border-border bg-[#faf9f6] p-4">
      <span className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-text-mid">{label}</span>
        <span className="admin-slider-value">{value}%</span>
      </span>
      <input
        className="admin-slider mt-4"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        style={{ "--value": `${percentage}%` } as CSSProperties}
        type="range"
        value={value}
      />
      <span className="admin-field-help mt-2 block">{help}</span>
    </label>
  );
}

export default function AdminHeroFinalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const previewUrl = useMemo(
    () => (form.imageFile ? URL.createObjectURL(form.imageFile) : null),
    [form.imageFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function fetchRecord() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/landing/banners", { cache: "no-store" });
      const payload = (await res.json().catch(() => null)) as {
        data?: BannerRow[];
        message?: string;
      } | null;

      if (!res.ok) {
        setError(payload?.message ?? "No se pudo cargar el Hero final.");
        return;
      }

      const row =
        (payload?.data ?? []).find((b) => b.position === "hero_intermedio") ?? null;

      if (row) {
        setForm({
          id: row.id,
          existingImageUrl: row.imageUrl || null,
          title: row.title ?? "",
          description: row.description ?? "",
          link_url: row.linkUrl ?? "",
          is_active: row.isActive,
          imageFile: null,
          imageOnly: row.metadata?.imageOnly ?? false,
          overlay: row.metadata?.overlay ?? (row.metadata?.imageOnly ? 0 : TEXT_OVERLAY_DEFAULT),
          brightness: row.metadata?.brightness ?? 100,
        });
      }
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchRecord();
  }, []);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const heroMetadata = { imageOnly: form.imageOnly, overlay: form.overlay, brightness: form.brightness };

    try {
      if (form.id) {
        const res = await fetch(`/api/admin/landing/banners/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title || undefined,
            description: form.description || undefined,
            link_url: form.link_url || undefined,
            is_active: form.is_active,
            metadata: heroMetadata,
          }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { message?: string } | null;
          const message = data?.message ?? "No se pudo actualizar.";
          setError(message);
          toast({ message, variant: "error" });
          return;
        }

        if (form.imageFile) {
          const uploadData = new FormData();
          uploadData.append("file", form.imageFile);
          await fetch(`/api/admin/landing/banners/${form.id}/imagen`, {
            method: "POST",
            body: uploadData,
          });
        }
      } else {
        if (!form.imageFile) {
          const message = "La imagen es obligatoria para crear el Hero final.";
          setError(message);
          toast({ message, variant: "error" });
          return;
        }

        const createData = new FormData();
        createData.append("title", form.title);
        createData.append("description", form.description);
        createData.append("link_url", form.link_url);
        createData.append("position", "hero_intermedio");
        createData.append("is_active", String(form.is_active));
        createData.append("metadata", JSON.stringify(heroMetadata));
        createData.append("file", form.imageFile);

        const res = await fetch("/api/admin/landing/banners", {
          method: "POST",
          body: createData,
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { message?: string } | null;
          const message = data?.message ?? "No se pudo crear.";
          setError(message);
          toast({ message, variant: "error" });
          return;
        }
      }

      toast({ message: "Hero final guardado correctamente." });
      await fetchRecord();
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setSaving(false);
    }
  }

  const previewImageUrl = previewUrl ?? form.existingImageUrl ?? null;
  const previewQuote =
    form.title ||
    "Creemos en libros que no solo informan, sino que acompañan.";
  const previewAuthor = form.description || "Crecer Librería Católica";
  const dropzonePreview = previewUrl ?? form.existingImageUrl;

  function toggleImageOnly(checked: boolean) {
    // Al cambiar de modo se propone el velo habitual de cada uno (solo imagen: sin velo).
    setForm((prev) => ({
      ...prev,
      imageOnly: checked,
      overlay: checked ? 0 : TEXT_OVERLAY_DEFAULT,
    }));
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Hero final</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Imagen al final del landing, antes de Instagram. Puede llevar una frase encima o ser solo la imagen.
          </p>
        </div>
        <Link
          className="text-sm text-text-mid transition-colors hover:text-text"
          href="/admin/landing"
        >
          ← Volver a Landing
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-text-light">Cargando...</p>
      ) : (
        <>
          <form onSubmit={submitForm} className="editor-card">
            <div className="editor-card-header flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-text">
                  {form.id ? "Editar Hero final" : "Crear Hero final"}
                </h2>
                <p className="mt-0.5 text-[12px] text-text-light">
                  {form.id
                    ? "Actualiza la imagen y cómo se ve."
                    : "El Hero final aún no existe. Sube una imagen para crearlo."}
                </p>
              </div>
              {form.id ? (
                <span
                  className={`admin-badge ${form.is_active ? "admin-badge--active" : "admin-badge--inactive"}`}
                >
                  <span className="admin-badge-dot" />
                  {form.is_active ? "Activo" : "Inactivo"}
                </span>
              ) : null}
            </div>

            <div className="editor-card-body">
              <section className="admin-fieldset">
                <p className="admin-section-label">Apariencia</p>
                <div className="rounded-[10px] border border-border bg-[#faf9f6] px-4">
                  <AdminToggle
                    checked={form.imageOnly}
                    label="Solo la imagen (sin texto)"
                    description="Úsalo si tu imagen ya trae su propio texto. Se muestra completa, sin recortar ni agregar frase."
                    onChange={toggleImageOnly}
                  />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Slider
                    help="0% = imagen limpia. Súbelo solo si necesitas oscurecerla."
                    label="Oscurecer imagen"
                    max={90}
                    min={0}
                    onChange={(overlay) => setForm((prev) => ({ ...prev, overlay }))}
                    step={5}
                    value={form.overlay}
                  />
                  <Slider
                    help="100% = sin cambio. Más de 100% la aclara."
                    label="Brillo"
                    max={140}
                    min={60}
                    onChange={(brightness) => setForm((prev) => ({ ...prev, brightness }))}
                    step={5}
                    value={form.brightness}
                  />
                </div>
              </section>

              {form.imageOnly ? null : (
              <section className="admin-fieldset">
                <p className="admin-section-label">Contenido</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="admin-field-label" htmlFor="hf-title">
                      Frase principal
                    </label>
                    <input
                      id="hf-title"
                      className="admin-input"
                      placeholder="Ej: Creemos en libros que no solo informan, sino que acompañan."
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="admin-field-label" htmlFor="hf-description">
                      Autor / subtexto
                    </label>
                    <input
                      id="hf-description"
                      className="admin-input"
                      placeholder="Ej: Crecer Librería Católica"
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="admin-field-label" htmlFor="hf-link">
                      URL de destino (opcional)
                    </label>
                    <input
                      id="hf-link"
                      className="admin-input"
                      placeholder="https://..."
                      value={form.link_url}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, link_url: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </section>
              )}

              <section className="admin-fieldset">
                <p className="admin-section-label">Imagen</p>
                <AdminUploadZone
                  hint={
                    form.imageOnly
                      ? "Se muestra completa, a todo el ancho de la página. Recomendado: 1920 px de ancho. JPG o PNG."
                      : "Recomendado: 1920×600 px. JPG o PNG."
                  }
                  onFileSelect={(file) => setForm((prev) => ({ ...prev, imageFile: file }))}
                  previewUrl={dropzonePreview}
                />
                {form.id && form.existingImageUrl && !form.imageFile ? (
                  <p className="admin-field-help">
                    Imagen actual. Sube una nueva para reemplazarla.
                  </p>
                ) : null}
              </section>

              <section className="admin-fieldset">
                <p className="admin-section-label">Visibilidad</p>
                <div className="rounded-[10px] border border-border bg-[#faf9f6] px-4">
                  <AdminToggle
                    checked={form.is_active}
                    label="Sección activa"
                    description="Si está activa, se muestra en la portada del sitio."
                    onChange={(checked) =>
                      setForm((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>
              </section>

              {error ? <div className="admin-error-block">{error}</div> : null}
            </div>

            <div className="editor-card-footer">
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
                      <circle
                        cx="10"
                        cy="10"
                        r="7"
                        stroke="currentColor"
                        strokeOpacity="0.25"
                        strokeWidth="2.4"
                      />
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
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </button>
            </div>
          </form>

          {/* Preview a ancho completo — usa el componente público real QuoteSection */}
          <div className="editor-card" style={{ overflow: "hidden" }}>
            <div className="editor-card-header">
              <h3 className="text-[14px] font-semibold text-text">Preview en vivo</h3>
              <p className="mt-0.5 text-[12px] text-text-light">
                Así se ve el bloque en el landing público.
              </p>
            </div>
            <QuoteSection
              author={previewAuthor}
              backgroundImageUrl={previewImageUrl}
              brightness={form.brightness}
              imageOnly={form.imageOnly && Boolean(previewImageUrl)}
              overlayOpacity={form.overlay}
              quote={previewQuote}
            />
          </div>
        </>
      )}
    </section>
  );
}
