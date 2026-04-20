"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";

type PanoramaBanner = {
  id: string;
  title: string | null;
  imageUrl: string;
  position: string;
  isActive: boolean;
};

export default function AdminLandingCategoriasPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [title, setTitle] = useState("Panorámica categorías");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : currentImageUrl),
    [currentImageUrl, imageFile],
  );

  useEffect(() => {
    return () => {
      if (imageFile && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageFile, previewUrl]);

  async function loadBanner() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/landing/banners", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as
        | { data?: PanoramaBanner[]; message?: string }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudo cargar la imagen panorámica.");
        return;
      }

      const banner = (payload?.data ?? []).find((item) => item.position === "categories_panorama") ?? null;
      if (banner) {
        setBannerId(banner.id);
        setTitle(banner.title ?? "Panorámica categorías");
        setIsActive(banner.isActive);
        setCurrentImageUrl(banner.imageUrl ?? null);
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
        setSaving(false);
        return;
      }

      if (bannerId) {
        const response = await fetch(`/api/admin/landing/banners/${bannerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            position: "categories_panorama",
            is_active: isActive,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo actualizar la imagen.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }

        if (imageFile) {
          const uploadData = new FormData();
          uploadData.append("file", imageFile);
          await fetch(`/api/admin/landing/banners/${bannerId}/imagen`, { method: "POST", body: uploadData });
        }
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("position", "categories_panorama");
        formData.append("is_active", String(isActive));
        formData.append("file", imageFile as File);

        const response = await fetch("/api/admin/landing/banners", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo crear la imagen.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }
      }

      toast({ message: "Imagen guardada correctamente." });
      setImageFile(null);
      await loadBanner();
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Imagen de categorías</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Imagen panorámica que se divide entre las tarjetas de categorías en el landing.
          </p>
        </div>
        <Link
          className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid"
          href="/admin/landing"
        >
          Volver a landing
        </Link>
      </div>

      {loading ? <p className="text-sm text-text-light">Cargando imagen de categorías...</p> : null}
      {error ? <p className="text-sm text-error">{error}</p> : null}

      {!loading ? (
        <form className="space-y-6" onSubmit={(e) => { void handleSubmit(e); }}>
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <section className="rounded-[2px] border border-border bg-white p-6">
              <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Contenido</h2>
              <div className="space-y-4">
                <label className="block space-y-1">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Titulo</span>
                  <input
                    className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                    onChange={(event) => setTitle(event.target.value)}
                    value={title}
                  />
                </label>
                <AdminToggle checked={isActive} label="Imagen activa" onChange={setIsActive} />
              </div>
            </section>

            <section className="rounded-[2px] border border-border bg-white p-6">
              <h2 className="mb-4 text-[0.82rem] font-semibold text-text">Imagen panorámica</h2>
              <AdminUploadZone
                hint="Recomendado: imagen horizontal amplia, mínimo 1600px de ancho."
                onFileSelect={setImageFile}
                previewUrl={previewUrl}
              />
            </section>
          </div>

          <div className="flex gap-3">
            <button
              className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving ? "Guardando..." : "Guardar imagen"}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
