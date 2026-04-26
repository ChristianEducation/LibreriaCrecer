"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { CategoryCard } from "@/features/catalogo/components";
import { useToast } from "@/shared/hooks";

type PanoramaBanner = {
  id: string;
  title: string | null;
  imageUrl: string;
  position: string;
  isActive: boolean;
};

type PreviewCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
};

const MOCK_CATEGORIES: PreviewCategory[] = [
  { id: "m1", name: "Biblias", slug: "biblias" },
  { id: "m2", name: "Espiritualidad", slug: "espiritualidad" },
  { id: "m3", name: "Catequesis", slug: "catequesis" },
  { id: "m4", name: "Liturgia", slug: "liturgia" },
  { id: "m5", name: "Formación", slug: "formacion" },
  { id: "m6", name: "Infantil", slug: "infantil" },
];

export default function AdminLandingCategoriasPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewCategories, setPreviewCategories] = useState<PreviewCategory[]>(MOCK_CATEGORIES);

  const blobPreviewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );

  const panoramaPreviewUrl = blobPreviewUrl ?? currentImageUrl ?? null;
  const dropzonePreview = panoramaPreviewUrl;

  useEffect(() => {
    return () => {
      if (blobPreviewUrl) URL.revokeObjectURL(blobPreviewUrl);
    };
  }, [blobPreviewUrl]);

  async function loadBanner() {
    setLoading(true);
    setError(null);

    try {
      const [bannersRes, catsRes] = await Promise.all([
        fetch("/api/admin/landing/banners", { cache: "no-store" }),
        fetch("/api/categorias", { cache: "no-store" }),
      ]);

      const bannersPayload = (await bannersRes.json().catch(() => null)) as {
        data?: PanoramaBanner[];
        message?: string;
      } | null;

      if (!bannersRes.ok) {
        setError(bannersPayload?.message ?? "No se pudo cargar la imagen panorámica.");
        return;
      }

      const banner =
        (bannersPayload?.data ?? []).find((item) => item.position === "categories_panorama") ??
        null;

      if (banner) {
        setBannerId(banner.id);
        setTitle(banner.title ?? "");
        setIsActive(banner.isActive);
        setCurrentImageUrl(banner.imageUrl || null);
      }

      if (catsRes.ok) {
        const catsPayload = (await catsRes.json().catch(() => null)) as {
          data?: PreviewCategory[];
        } | null;
        const cats = catsPayload?.data ?? [];
        if (cats.length > 0) setPreviewCategories(cats);
      }
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBanner();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!bannerId && !imageFile) {
        const message = "Debes subir una imagen para crear la panorámica.";
        setError(message);
        toast({ message, variant: "error" });
        return;
      }

      if (bannerId) {
        const res = await fetch(`/api/admin/landing/banners/${bannerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title || undefined,
            position: "categories_panorama",
            is_active: isActive,
          }),
        });

        if (!res.ok) {
          const payload = (await res.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo actualizar la imagen.";
          setError(message);
          toast({ message, variant: "error" });
          return;
        }

        if (imageFile) {
          const uploadData = new FormData();
          uploadData.append("file", imageFile);
          await fetch(`/api/admin/landing/banners/${bannerId}/imagen`, {
            method: "POST",
            body: uploadData,
          });
        }
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("position", "categories_panorama");
        formData.append("is_active", String(isActive));
        formData.append("file", imageFile as File);

        const res = await fetch("/api/admin/landing/banners", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const payload = (await res.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo crear la imagen.";
          setError(message);
          toast({ message, variant: "error" });
          return;
        }
      }

      toast({ message: "Imagen panorámica guardada correctamente." });
      setImageFile(null);
      await loadBanner();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Imagen de categorías</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Imagen panorámica que se divide entre las tarjetas de categorías del landing.
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
          <form className="editor-card" onSubmit={(e) => { void handleSubmit(e); }}>
            <div className="editor-card-header flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-text">
                  {bannerId ? "Editar imagen panorámica" : "Crear imagen panorámica"}
                </h2>
                <p className="mt-0.5 text-[12px] text-text-light">
                  {bannerId
                    ? "Actualiza la imagen que divide la sección de categorías."
                    : "Aún no hay imagen configurada. Sube una para activar la sección."}
                </p>
              </div>
              {bannerId ? (
                <span
                  className={`admin-badge ${isActive ? "admin-badge--active" : "admin-badge--inactive"}`}
                >
                  <span className="admin-badge-dot" />
                  {isActive ? "Activa" : "Inactiva"}
                </span>
              ) : null}
            </div>

            <div className="editor-card-body">
              <section className="admin-fieldset">
                <p className="admin-section-label">Imagen</p>
                <AdminUploadZone
                  hint="Recomendado: imagen horizontal amplia, mínimo 1600 × 600 px. JPG o PNG."
                  onFileSelect={setImageFile}
                  previewUrl={dropzonePreview}
                />
                {bannerId && currentImageUrl && !imageFile ? (
                  <p className="admin-field-help">Imagen actual. Sube una nueva para reemplazarla.</p>
                ) : null}
              </section>

              <section className="admin-fieldset">
                <p className="admin-section-label">Opciones</p>
                <div>
                  <label className="admin-field-label" htmlFor="cat-pano-title">
                    Etiqueta interna (opcional)
                  </label>
                  <input
                    id="cat-pano-title"
                    className="admin-input"
                    placeholder="Ej: Panorámica primavera 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="admin-field-help">Solo para identificación interna, no se muestra en el sitio.</p>
                </div>
                <div className="rounded-[10px] border border-border bg-[#faf9f6] px-4">
                  <AdminToggle
                    checked={isActive}
                    label="Panorámica activa"
                    description="Si está activa, la imagen se divide entre las tarjetas de categorías."
                    onChange={setIsActive}
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
                ) : bannerId ? (
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </button>
            </div>
          </form>

          {/* Preview a ancho completo */}
          <div className="editor-card" style={{ overflow: "hidden" }}>
            <div className="editor-card-header flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[14px] font-semibold text-text">Preview en vivo</h3>
                <p className="mt-0.5 text-[12px] text-text-light">
                  Así se distribuye la panorámica entre las tarjetas de categorías del landing.
                  {previewCategories === MOCK_CATEGORIES
                    ? " (categorías de ejemplo — se usarán las reales al publicar)"
                    : null}
                </p>
              </div>
              {!isActive ? (
                <span className="admin-badge admin-badge--inactive">
                  <span className="admin-badge-dot" />
                  No visible en el landing
                </span>
              ) : null}
            </div>

            <div
              style={{
                padding: "24px 20px",
                opacity: isActive ? 1 : 0.4,
                transition: "opacity 0.2s ease",
              }}
            >
              {!isActive ? (
                <div
                  style={{
                    marginBottom: 16,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(200,168,48,0.08)",
                    border: "1px solid rgba(200,168,48,0.3)",
                    fontSize: 12,
                    color: "var(--moss)",
                  }}
                >
                  La imagen panorámica está desactivada — las tarjetas mostrarán sus imágenes individuales en el landing.
                </div>
              ) : null}

              <div className="category-carousel-grid">
                {previewCategories.map((cat, index) => (
                  <CategoryCard
                    key={cat.id}
                    imageUrl={cat.imageUrl}
                    name={cat.name}
                    panoramaIndex={index}
                    panoramaTotal={previewCategories.length}
                    panoramaUrl={panoramaPreviewUrl}
                    slug={cat.slug}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
