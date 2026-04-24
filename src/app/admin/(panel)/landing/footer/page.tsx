"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";

type FooterMetadata = {
  opacity: number;
  fadeStart: number;
  fadeEnd: number;
  imgWidth: number;
  artSpaceWidth: number;
};

type FooterBanner = {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
  isActive: boolean;
  metadata?: FooterMetadata | null;
};

type FooterContentData = {
  id?: string;
  brandDescription?: string | null;
  catalogLinks?: string | null;
  infoLinks?: string | null;
  address?: string | null;
  mapsUrl?: string | null;
  copyrightText?: string | null;
  designCredit?: string | null;
};

const defaultMetadata: FooterMetadata = {
  opacity: 0.8,
  fadeStart: 40,
  fadeEnd: 70,
  imgWidth: 72,
  artSpaceWidth: 36,
};

function toUiFormat(raw: string) {
  return raw
    .split("|||")
    .filter(Boolean)
    .map((l) => l.replace("::", " :: "))
    .join("\n");
}

function toDbFormat(raw: string) {
  return raw
    .split("\n")
    .filter(Boolean)
    .map((l) => l.trim().replace(" :: ", "::"))
    .join("|||");
}

export default function AdminLandingFooterPage() {
  const { toast } = useToast();

  // --- Imagen ilustrativa ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [title, setTitle] = useState("Ilustracion footer");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [metadata, setMetadata] = useState<FooterMetadata>(defaultMetadata);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // --- Contenido de texto ---
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [brandDescription, setBrandDescription] = useState(
    "Una librería católica pensada para acompañar el estudio, la devoción y la vida diaria con una selección curada de títulos.",
  );
  const [catalogLinksUi, setCatalogLinksUi] = useState(
    "Coleccion completa :: /productos\nNovedades :: /productos?filter=nuevo\nOfertas :: /productos?filter=oferta",
  );
  const [infoLinksUi, setInfoLinksUi] = useState("Mi carrito :: /carrito\nCheckout :: /checkout");
  const [address, setAddress] = useState("Arturo Prat 470 / Antofagasta, Chile");
  const [mapsUrl, setMapsUrl] = useState("https://maps.google.com/?q=Arturo+Prat+470+Antofagasta");
  const [copyrightText, setCopyrightText] = useState("© 2026 Crecer Libreria. Todos los derechos reservados.");
  const [designCredit, setDesignCredit] = useState("Diseño: Hultur Studio");

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

  async function loadFooterBanner() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/landing/banners", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as
        | { data?: FooterBanner[]; message?: string }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudo cargar la configuracion del footer.");
        return;
      }

      const footerBanner = (payload?.data ?? []).find((item) => item.position === "footer_illustration") ?? null;
      if (footerBanner) {
        setBannerId(footerBanner.id);
        setTitle(footerBanner.title ?? "Ilustracion footer");
        setDescription(footerBanner.description ?? "");
        setLinkUrl(footerBanner.linkUrl ?? "");
        setIsActive(footerBanner.isActive);
        setCurrentImageUrl(footerBanner.imageUrl ?? null);
        setMetadata({
          ...defaultMetadata,
          ...(footerBanner.metadata ?? {}),
        });
      }
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function loadFooterContent() {
    setContentLoading(true);
    setContentError(null);

    try {
      const response = await fetch("/api/admin/landing/footer-content", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as
        | { data?: FooterContentData | null; message?: string }
        | null;

      if (!response.ok) {
        setContentError(payload?.message ?? "No se pudo cargar el contenido del footer.");
        return;
      }

      const data = payload?.data;
      if (data) {
        if (data.brandDescription) setBrandDescription(data.brandDescription);
        if (data.catalogLinks) setCatalogLinksUi(toUiFormat(data.catalogLinks));
        if (data.infoLinks) setInfoLinksUi(toUiFormat(data.infoLinks));
        if (data.address) setAddress(data.address);
        if (data.mapsUrl) setMapsUrl(data.mapsUrl);
        if (data.copyrightText) setCopyrightText(data.copyrightText);
        if (data.designCredit) setDesignCredit(data.designCredit);
      }
    } catch {
      setContentError("Error de red. Intenta nuevamente.");
    } finally {
      setContentLoading(false);
    }
  }

  useEffect(() => {
    void loadFooterBanner();
    void loadFooterContent();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!bannerId && !imageFile) {
        const message = "Debes subir una imagen para crear el footer.";
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
            description,
            link_url: linkUrl,
            position: "footer_illustration",
            is_active: isActive,
            metadata,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo actualizar el footer.";
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
        formData.append("description", description);
        formData.append("link_url", linkUrl);
        formData.append("position", "footer_illustration");
        formData.append("is_active", String(isActive));
        formData.append("metadata", JSON.stringify(metadata));
        formData.append("file", imageFile as File);

        const response = await fetch("/api/admin/landing/banners", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = payload?.message ?? "No se pudo crear el footer.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }
      }

      toast({ message: "Footer guardado correctamente." });
      setImageFile(null);
      await loadFooterBanner();
    } finally {
      setSaving(false);
    }
  }

  async function handleContentSubmit(event: React.FormEvent) {
    event.preventDefault();
    setContentSaving(true);
    setContentError(null);

    try {
      const response = await fetch("/api/admin/landing/footer-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandDescription,
          catalogLinks: toDbFormat(catalogLinksUi),
          infoLinks: toDbFormat(infoLinksUi),
          address,
          mapsUrl,
          copyrightText,
          designCredit,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        const message = payload?.message ?? "No se pudo guardar el contenido.";
        setContentError(message);
        toast({ message, variant: "error" });
        return;
      }

      toast({ message: "Contenido del footer guardado correctamente." });
    } catch {
      setContentError("Error de red. Intenta nuevamente.");
    } finally {
      setContentSaving(false);
    }
  }

  function updateMetadata<K extends keyof FooterMetadata>(key: K, value: number) {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <section className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Footer</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Ajusta la ilustracion editorial del footer, su comportamiento visual y el contenido de texto.
          </p>
        </div>
        <Link
          href="/admin/landing"
          className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid"
        >
          Volver a landing
        </Link>
      </div>

      {/* Sección imagen */}
      <div className="space-y-6">
        <h2 className="font-serif text-[1.35rem] text-text">Imagen ilustrativa</h2>
        {loading ? <p className="text-sm text-text-light">Cargando configuracion del footer...</p> : null}
        {error ? <p className="text-sm text-error">{error}</p> : null}

        {!loading ? (
          <form className="space-y-6" onSubmit={(e) => { void handleSubmit(e); }}>
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <section className="rounded-[2px] border border-border bg-white p-6">
                <h3 className="mb-4 text-[0.82rem] font-semibold text-text">Contenido</h3>
                <div className="space-y-4">
                  <label className="block space-y-1">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Titulo</span>
                    <input
                      className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                      onChange={(event) => setTitle(event.target.value)}
                      value={title}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Descripcion</span>
                    <textarea
                      className="min-h-28 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                      onChange={(event) => setDescription(event.target.value)}
                      value={description}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Link opcional</span>
                    <input
                      className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                      onChange={(event) => setLinkUrl(event.target.value)}
                      placeholder="https://..."
                      value={linkUrl}
                    />
                  </label>
                  <AdminToggle checked={isActive} label="Footer activo" onChange={setIsActive} />
                </div>
              </section>

              <section className="rounded-[2px] border border-border bg-white p-6">
                <h3 className="mb-4 text-[0.82rem] font-semibold text-text">Ilustracion</h3>
                <AdminUploadZone
                  hint="Recomendado: arte horizontal con buena mezcla sobre beige."
                  onFileSelect={setImageFile}
                  previewUrl={previewUrl}
                />
              </section>
            </div>

            <section className="rounded-[2px] border border-border bg-white p-6">
              <h3 className="mb-4 text-[0.82rem] font-semibold text-text">Parametros visuales</h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {[
                  { key: "opacity", label: "Opacidad", step: 0.05, min: 0, max: 1 },
                  { key: "fadeStart", label: "Inicio fade", step: 1, min: 0, max: 100 },
                  { key: "fadeEnd", label: "Fin fade", step: 1, min: 0, max: 100 },
                  { key: "imgWidth", label: "Ancho imagen", step: 1, min: 0, max: 100 },
                  { key: "artSpaceWidth", label: "Espacio arte", step: 1, min: 0, max: 100 },
                ].map((field) => (
                  <label className="space-y-1" key={field.key}>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">{field.label}</span>
                    <input
                      className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                      max={field.max}
                      min={field.min}
                      onChange={(event) =>
                        updateMetadata(field.key as keyof FooterMetadata, Number(event.target.value))
                      }
                      step={field.step}
                      type="number"
                      value={metadata[field.key as keyof FooterMetadata]}
                    />
                  </label>
                ))}
              </div>
            </section>

            <div className="flex gap-3">
              <button
                className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? "Guardando..." : "Guardar footer"}
              </button>
            </div>
          </form>
        ) : null}
      </div>

      {/* Sección contenido de texto */}
      <div className="space-y-6">
        <h2 className="font-serif text-[1.35rem] text-text">Contenido de texto</h2>
        {contentLoading ? <p className="text-sm text-text-light">Cargando contenido...</p> : null}
        {contentError ? <p className="text-sm text-error">{contentError}</p> : null}

        {!contentLoading ? (
          <form className="space-y-6" onSubmit={(e) => { void handleContentSubmit(e); }}>
            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-[2px] border border-border bg-white p-6">
                <h3 className="mb-4 text-[0.82rem] font-semibold text-text">Branding</h3>
                <div className="space-y-4">
                  <label className="block space-y-1">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Descripción</span>
                    <textarea
                      className="min-h-[80px] w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                      onChange={(e) => setBrandDescription(e.target.value)}
                      rows={3}
                      value={brandDescription}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Copyright</span>
                    <input
                      className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                      onChange={(e) => setCopyrightText(e.target.value)}
                      value={copyrightText}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Crédito de diseño</span>
                    <input
                      className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                      onChange={(e) => setDesignCredit(e.target.value)}
                      value={designCredit}
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-[2px] border border-border bg-white p-6">
                <h3 className="mb-4 text-[0.82rem] font-semibold text-text">Ubicación</h3>
                <div className="space-y-4">
                  <label className="block space-y-1">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Dirección</span>
                    <input
                      className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                      onChange={(e) => setAddress(e.target.value)}
                      value={address}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">URL Google Maps</span>
                    <input
                      className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                      onChange={(e) => setMapsUrl(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      value={mapsUrl}
                    />
                  </label>
                </div>
              </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-[2px] border border-border bg-white p-6">
                <h3 className="mb-4 text-[0.82rem] font-semibold text-text">Links de catálogo</h3>
                <label className="block space-y-1">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">
                    Un link por línea — formato: <code>Nombre :: /ruta</code>
                  </span>
                  <textarea
                    className="min-h-[120px] w-full rounded-[8px] border border-border px-3 py-2.5 font-mono text-sm focus:border-gold focus:outline-none"
                    onChange={(e) => setCatalogLinksUi(e.target.value)}
                    value={catalogLinksUi}
                  />
                </label>
              </section>

              <section className="rounded-[2px] border border-border bg-white p-6">
                <h3 className="mb-4 text-[0.82rem] font-semibold text-text">Links de información</h3>
                <label className="block space-y-1">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">
                    Un link por línea — formato: <code>Nombre :: /ruta</code>
                  </span>
                  <textarea
                    className="min-h-[120px] w-full rounded-[8px] border border-border px-3 py-2.5 font-mono text-sm focus:border-gold focus:outline-none"
                    onChange={(e) => setInfoLinksUi(e.target.value)}
                    value={infoLinksUi}
                  />
                </label>
              </section>
            </div>

            <div className="flex gap-3">
              <button
                className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                disabled={contentSaving}
                type="submit"
              >
                {contentSaving ? "Guardando..." : "Guardar contenido"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
