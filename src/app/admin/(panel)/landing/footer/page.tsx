"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";

type FooterMetadata = {
  opacity: number;
  fadeStart: number;
  fadeEnd: number;
  imgWidth: number;
  artSpaceWidth: number;
  textTone: "current" | "dark";
};

type FooterNumericMetadataKey = Exclude<keyof FooterMetadata, "textTone">;

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
  textTone: "current",
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

function parsePreviewLinks(raw: string): { label: string; href: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("::").map((part) => part.trim());
      return {
        label: label || "Link",
        href: href || "#",
      };
    });
}

function SpinnerIcon() {
  return (
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
  );
}

function MetadataSlider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <label className="block rounded-[10px] border border-border bg-[#faf9f6] p-4">
      <span className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-text-mid">{label}</span>
        <span className="admin-slider-value">
          {value}
          {suffix}
        </span>
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
    </label>
  );
}

function FooterPreview({
  brandDescription,
  catalogLinksUi,
  infoLinksUi,
  address,
  mapsUrl,
  copyrightText,
  designCredit,
  imageUrl,
  isActive,
  metadata,
}: {
  brandDescription: string;
  catalogLinksUi: string;
  infoLinksUi: string;
  address: string;
  mapsUrl: string;
  copyrightText: string;
  designCredit: string;
  imageUrl: string | null;
  isActive: boolean;
  metadata: FooterMetadata;
}) {
  const mid = Math.round((metadata.fadeStart + metadata.fadeEnd) / 2);
  const hasIllustration = Boolean(imageUrl && isActive);
  const catalogLinks = parsePreviewLinks(catalogLinksUi);
  const infoLinks = parsePreviewLinks(infoLinksUi);
  const isDarkTone = metadata.textTone === "dark";
  const primaryTextColor = isDarkTone ? "var(--text)" : "var(--text-mid)";
  const bodyTextColor = isDarkTone ? "var(--text)" : "var(--text-light)";

  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-[#f7f4e7] shadow-[0_18px_60px_rgba(58,48,1,0.10)]">
      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Preview público
          </p>
          <p className="mt-1 text-[12px] text-text-light">
            Refleja el formulario actual antes de guardar.
          </p>
        </div>
        <span className={`admin-badge ${isActive ? "admin-badge--active" : "admin-badge--inactive"}`}>
          <span className="admin-badge-dot" />
          {isActive ? "Ilustración activa" : "Ilustración inactiva"}
        </span>
      </div>

      <footer className="relative overflow-hidden" style={{ background: "var(--beige-warm)" }}>
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, color-mix(in srgb, var(--gold) 35%, transparent), transparent)",
            zIndex: 4,
          }}
        />

        {hasIllustration ? (
          <>
            <div className="absolute inset-0 z-[1] overflow-hidden">
              <div
                aria-hidden="true"
                className="h-full bg-cover bg-left"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  width: `${metadata.imgWidth}%`,
                  opacity: metadata.opacity,
                }}
              />
            </div>
            <div
              className="absolute inset-0 z-[2]"
              style={{
                background: `linear-gradient(to right,
                  rgba(237,233,212,0) 0%,
                  rgba(237,233,212,0) ${metadata.fadeStart}%,
                  rgba(237,233,212,0.78) ${mid}%,
                  rgba(237,233,212,0.97) ${metadata.fadeEnd}%,
                  rgba(237,233,212,1) 100%
                )`,
              }}
            />
          </>
        ) : null}

        {!isActive && imageUrl ? (
          <div className="absolute left-4 top-4 z-[5] rounded border border-warning/25 bg-white/85 px-3 py-2 text-[12px] text-warning shadow-sm">
            La ilustración existe, pero está inactiva y no se verá en el sitio.
          </div>
        ) : null}

        <div className="relative z-[3] flex min-h-[280px] items-stretch">
          {hasIllustration ? <div style={{ width: `${metadata.artSpaceWidth}%` }} /> : null}

          <div className="flex-1 page-px" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>
            <div className="grid grid-cols-1 gap-7 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
              <div>
                <div
                  aria-hidden="true"
                  className="mb-3 h-11 w-11 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: "url(/images/Logo-Crecer.png)" }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-castoro)",
                    fontSize: "18px",
                    color: "var(--text)",
                    fontWeight: 400,
                  }}
                >
                  Crecer Librería
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: "12px",
                    marginTop: "2px",
                  }}
                >
                  Fe, lectura y formación
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: bodyTextColor,
                    maxWidth: "240px",
                  }}
                >
                  {brandDescription}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>
                  Catálogo
                </h4>
                <div className="flex flex-col gap-2">
                  {catalogLinks.map((link) => (
                    <a
                      href={link.href}
                      key={`${link.label}-${link.href}`}
                      style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: primaryTextColor, lineHeight: 2, textDecoration: "none" }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>
                  Información
                </h4>
                <div className="flex flex-col gap-2">
                  {infoLinks.map((link) => (
                    <a
                      href={link.href}
                      key={`${link.label}-${link.href}`}
                      style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: primaryTextColor, lineHeight: 2, textDecoration: "none" }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>
                  Ubicación
                </h4>
                <div className="flex items-start gap-[7px] text-text-mid">
                  <svg aria-hidden="true" className="mt-0.5 size-[14px] shrink-0 text-gold" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 20s6-5.74 6-11a6 6 0 1 0-12 0c0 5.26 6 11 6 11Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="9" fill="currentColor" r="1.75" />
                  </svg>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: primaryTextColor }}>
                    {address}
                  </p>
                </div>
                <a
                  className="mt-3 inline-block border-b border-b-gold/30 text-[9px] font-medium uppercase tracking-[0.1em] text-gold transition-colors hover:border-b-gold"
                  href={mapsUrl || "#"}
                  rel="noreferrer"
                  target="_blank"
                >
                  Ver en el mapa →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative z-[3] page-px flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            paddingBottom: "1.5rem",
            fontFamily: "var(--font-inter)",
            fontSize: "11px",
            color: bodyTextColor,
          }}
        >
          <p>{copyrightText}</p>
          <div className="flex items-center gap-3">
            <p>{designCredit}</p>
            <span style={{ fontSize: "11px", color: bodyTextColor, opacity: 0.5 }}>·</span>
          </div>
        </div>
      </footer>
    </div>
  );
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
          const uploadResponse = await fetch(`/api/admin/landing/banners/${bannerId}/imagen`, {
            method: "POST",
            body: uploadData,
          });

          if (!uploadResponse.ok) {
            const payload = (await uploadResponse.json().catch(() => null)) as { message?: string } | null;
            const message = payload?.message ?? "No se pudo actualizar la imagen del footer.";
            setError(message);
            toast({ message, variant: "error" });
            return;
          }
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
      await loadFooterContent();
    } catch {
      setContentError("Error de red. Intenta nuevamente.");
    } finally {
      setContentSaving(false);
    }
  }

  function updateMetadata<K extends FooterNumericMetadataKey>(key: K, value: number) {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  }

  function updateTextTone(value: FooterMetadata["textTone"]) {
    setMetadata((prev) => ({ ...prev, textTone: value }));
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Footer</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Ajusta el contenido público, la ilustración editorial y revisa una preview en vivo antes de guardar.
          </p>
        </div>
        <Link
          className="text-sm text-text-mid transition-colors hover:text-text"
          href="/admin/landing"
        >
          ← Índice landing
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.16fr)_minmax(340px,0.84fr)]">
        <form className="min-w-0" onSubmit={(event) => { void handleContentSubmit(event); }}>
          <div className="editor-card h-full">
            <div className="editor-card-header flex items-start justify-between gap-4">
              <div>
                <p className="admin-section-label">Contenido de texto</p>
                <h2 className="mt-1 text-[15px] font-semibold text-text">
                  Informacion visible del footer
                </h2>
                <p className="mt-0.5 text-[12px] text-text-light">
                  Branding, ubicacion y enlaces secundarios del pie publico.
                </p>
              </div>
              <span className="admin-badge admin-badge--active">
                <span className="admin-badge-dot" />
                footer_content
              </span>
            </div>

            <div className="editor-card-body">
              {contentLoading ? <p className="text-sm text-text-light">Cargando contenido...</p> : null}
              {contentError ? <div className="admin-error-block">{contentError}</div> : null}

              {!contentLoading ? (
                <>
                  <section className="admin-fieldset">
                    <p className="admin-section-label">Branding</p>
                    <label>
                      <span className="admin-field-label">Descripcion</span>
                      <textarea
                        className="admin-input"
                        onChange={(event) => setBrandDescription(event.target.value)}
                        rows={3}
                        style={{
                          height: "auto",
                          minHeight: 92,
                          paddingBottom: 9,
                          paddingTop: 9,
                          resize: "vertical",
                        }}
                        value={brandDescription}
                      />
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label>
                        <span className="admin-field-label">Copyright</span>
                        <input
                          className="admin-input"
                          onChange={(event) => setCopyrightText(event.target.value)}
                          value={copyrightText}
                        />
                      </label>
                      <label>
                        <span className="admin-field-label">Credito de diseno</span>
                        <input
                          className="admin-input"
                          onChange={(event) => setDesignCredit(event.target.value)}
                          value={designCredit}
                        />
                      </label>
                    </div>
                  </section>

                  <section className="admin-fieldset">
                    <p className="admin-section-label">Ubicacion</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label>
                        <span className="admin-field-label">Direccion</span>
                        <input
                          className="admin-input"
                          onChange={(event) => setAddress(event.target.value)}
                          value={address}
                        />
                      </label>
                      <label>
                        <span className="admin-field-label">URL Google Maps</span>
                        <input
                          className="admin-input"
                          onChange={(event) => setMapsUrl(event.target.value)}
                          placeholder="https://maps.google.com/..."
                          value={mapsUrl}
                        />
                      </label>
                    </div>
                  </section>

                  <section className="admin-fieldset">
                    <p className="admin-section-label">Links</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label>
                        <span className="admin-field-label">Catalogo</span>
                        <textarea
                          className="admin-input font-mono"
                          onChange={(event) => setCatalogLinksUi(event.target.value)}
                          style={{
                            height: "auto",
                            minHeight: 132,
                            paddingBottom: 9,
                            paddingTop: 9,
                            resize: "vertical",
                          }}
                          value={catalogLinksUi}
                        />
                        <p className="admin-field-help">Un link por linea: Nombre :: /ruta</p>
                      </label>
                      <label>
                        <span className="admin-field-label">Informacion</span>
                        <textarea
                          className="admin-input font-mono"
                          onChange={(event) => setInfoLinksUi(event.target.value)}
                          style={{
                            height: "auto",
                            minHeight: 132,
                            paddingBottom: 9,
                            paddingTop: 9,
                            resize: "vertical",
                          }}
                          value={infoLinksUi}
                        />
                        <p className="admin-field-help">Un link por linea: Nombre :: /ruta</p>
                      </label>
                    </div>
                  </section>
                </>
              ) : null}
            </div>

            <div className="editor-card-footer">
              <button className="admin-btn-primary" disabled={contentSaving || contentLoading} type="submit">
                {contentSaving ? (
                  <>
                    <SpinnerIcon />
                    Guardando...
                  </>
                ) : (
                  "Guardar contenido"
                )}
              </button>
            </div>
          </div>
        </form>

        <form className="min-w-0" onSubmit={(event) => { void handleSubmit(event); }}>
          <div className="editor-card h-full">
            <div className="editor-card-header flex items-start justify-between gap-4">
              <div>
                <p className="admin-section-label">Imagen ilustrativa</p>
                <h2 className="mt-1 text-[15px] font-semibold text-text">Arte del footer</h2>
                <p className="mt-0.5 text-[12px] text-text-light">
                  Sube la ilustracion y define si se muestra en el sitio.
                </p>
              </div>
              <span className={`admin-badge ${isActive ? "admin-badge--active" : "admin-badge--inactive"}`}>
                <span className="admin-badge-dot" />
                {isActive ? "Activa" : "Inactiva"}
              </span>
            </div>

            <div className="editor-card-body">
              {loading ? <p className="text-sm text-text-light">Cargando configuracion...</p> : null}
              {error ? <div className="admin-error-block">{error}</div> : null}

              {!loading ? (
                <section className="admin-fieldset">
                  <AdminUploadZone
                    hint="Recomendado: arte horizontal con buena mezcla sobre beige."
                    onFileSelect={setImageFile}
                    previewUrl={previewUrl}
                  />
                  <div className="rounded-[10px] border border-border bg-[#faf9f6] px-4">
                    <AdminToggle
                      checked={isActive}
                      description="Si esta inactiva, el footer conserva los textos y oculta la ilustracion."
                      label="Mostrar ilustracion en el sitio"
                      onChange={setIsActive}
                    />
                  </div>
                  <p className="admin-field-help">
                    Los ajustes de composicion estan separados abajo para mantener este bloque enfocado.
                  </p>
                </section>
              ) : null}
            </div>

            <div className="editor-card-footer">
              <button className="admin-btn-primary" disabled={saving || loading} type="submit">
                {saving ? (
                  <>
                    <SpinnerIcon />
                    Guardando...
                  </>
                ) : (
                  "Guardar imagen"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-[1.35rem] text-text">Preview del footer público</h2>
            <p className="mt-1 text-sm font-light text-text-light">
              Usa los valores actuales del formulario; no requiere guardar para actualizarse.
            </p>
          </div>
          <span className={`admin-badge ${isActive ? "admin-badge--active" : "admin-badge--inactive"}`}>
            <span className="admin-badge-dot" />
            {isActive ? "Ilustración visible" : "Ilustración oculta"}
          </span>
        </div>
        <FooterPreview
          address={address}
          brandDescription={brandDescription}
          catalogLinksUi={catalogLinksUi}
          copyrightText={copyrightText}
          designCredit={designCredit}
          imageUrl={previewUrl}
          infoLinksUi={infoLinksUi}
          isActive={isActive}
          mapsUrl={mapsUrl}
          metadata={metadata}
        />
      </section>

      <form onSubmit={(event) => { void handleSubmit(event); }}>
        <div className="editor-card">
          <div className="editor-card-header flex items-start justify-between gap-4">
            <div>
              <p className="admin-section-label">Parametros visuales</p>
              <h2 className="mt-1 text-[15px] font-semibold text-text">Composicion de la ilustracion</h2>
              <p className="mt-0.5 text-[12px] text-text-light">
                Ajusta la presencia, el fade y el espacio reservado para el arte del footer.
              </p>
            </div>
            <span className="admin-badge admin-badge--active">
              <span className="admin-badge-dot" />
              sliders
            </span>
          </div>

          <div className="editor-card-body">
            {loading ? <p className="text-sm text-text-light">Cargando configuracion...</p> : null}
            {error ? <div className="admin-error-block">{error}</div> : null}

            {!loading ? (
              <section className="admin-fieldset">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <MetadataSlider
                    label="Opacidad"
                    max={1}
                    min={0}
                    onChange={(value) => updateMetadata("opacity", value)}
                    step={0.05}
                    suffix=""
                    value={metadata.opacity}
                  />
                  <MetadataSlider
                    label="Inicio fade"
                    max={100}
                    min={0}
                    onChange={(value) => updateMetadata("fadeStart", value)}
                    step={1}
                    suffix="%"
                    value={metadata.fadeStart}
                  />
                  <MetadataSlider
                    label="Fin fade"
                    max={100}
                    min={0}
                    onChange={(value) => updateMetadata("fadeEnd", value)}
                    step={1}
                    suffix="%"
                    value={metadata.fadeEnd}
                  />
                  <MetadataSlider
                    label="Ancho imagen"
                    max={100}
                    min={0}
                    onChange={(value) => updateMetadata("imgWidth", value)}
                    step={1}
                    suffix="%"
                    value={metadata.imgWidth}
                  />
                  <MetadataSlider
                    label="Espacio arte"
                    max={100}
                    min={0}
                    onChange={(value) => updateMetadata("artSpaceWidth", value)}
                    step={1}
                    suffix="%"
                    value={metadata.artSpaceWidth}
                  />
                </div>
                <label className="mt-4 block max-w-xs">
                  <span className="admin-field-label">Tono del texto</span>
                  <select
                    className="admin-input"
                    onChange={(event) =>
                      updateTextTone(event.target.value === "dark" ? "dark" : "current")
                    }
                    value={metadata.textTone}
                  >
                    <option value="current">Actual</option>
                    <option value="dark">Oscuro</option>
                  </select>
                  <p className="admin-field-help">
                    Oscuro usa texto mas legible sobre el beige sin cambiar el acento dorado.
                  </p>
                </label>
              </section>
            ) : null}
          </div>

          <div className="editor-card-footer">
            <button className="admin-btn-primary" disabled={saving || loading} type="submit">
              {saving ? (
                <>
                  <SpinnerIcon />
                  Guardando...
                </>
              ) : (
                "Guardar parametros"
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
