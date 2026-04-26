"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminToggle } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";

type TopBannerRow = {
  id: string;
  title: string | null;
  description: string | null;
  linkUrl: string | null;
  isActive: boolean;
};

type FormState = {
  title: string;
  description: string;
  link_url: string;
  is_active: boolean;
};

const initialForm: FormState = {
  title: "",
  description: "",
  link_url: "",
  is_active: true,
};

export default function AdminTopBannerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [existing, setExisting] = useState<TopBannerRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  async function fetchRecord() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/landing/top-banner", { cache: "no-store" });
      const payload = (await res.json().catch(() => null)) as {
        data?: TopBannerRow | null;
        message?: string;
      } | null;

      if (!res.ok) {
        setError(payload?.message ?? "No se pudo cargar el banner.");
        return;
      }

      const row = payload?.data ?? null;
      setExisting(row);
      if (row) {
        setForm({
          title: row.title ?? "",
          description: row.description ?? "",
          link_url: row.linkUrl ?? "",
          is_active: row.isActive,
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

    try {
      const res = await fetch("/api/admin/landing/top-banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title || undefined,
          description: form.description || undefined,
          link_url: form.link_url || undefined,
          is_active: form.is_active,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        const message = data?.message ?? "No se pudo guardar.";
        setError(message);
        toast({ message, variant: "error" });
        return;
      }

      toast({ message: "Top Banner guardado correctamente." });
      await fetchRecord();
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setSaving(false);
    }
  }

  const previewTitle = form.title || "Tu mensaje aquí";

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Top Banner</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Franja informativa visible sobre el header de la tienda.
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
                  {existing ? "Editar Top Banner" : "Crear Top Banner"}
                </h2>
                <p className="mt-0.5 text-[12px] text-text-light">
                  {existing
                    ? "Actualiza el contenido del banner superior."
                    : "El banner aún no existe. Completa los campos para crearlo."}
                </p>
              </div>
              {existing ? (
                <span
                  className={`admin-badge ${existing.isActive ? "admin-badge--active" : "admin-badge--inactive"}`}
                >
                  <span className="admin-badge-dot" />
                  {existing.isActive ? "Activo" : "Inactivo"}
                </span>
              ) : null}
            </div>

            <div className="editor-card-body">
              <section className="admin-fieldset">
                <p className="admin-section-label">Contenido</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="admin-field-label" htmlFor="top-banner-title">
                      Mensaje principal
                    </label>
                    <input
                      id="top-banner-title"
                      className="admin-input"
                      placeholder="Ej: Envíos gratis en pedidos sobre $30.000"
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="admin-field-label" htmlFor="top-banner-desc">
                      Texto secundario (opcional)
                    </label>
                    <input
                      id="top-banner-desc"
                      className="admin-input"
                      placeholder="Detalle adicional breve"
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-field-label" htmlFor="top-banner-link">
                      URL de destino (opcional)
                    </label>
                    <input
                      id="top-banner-link"
                      className="admin-input"
                      placeholder="https://..."
                      value={form.link_url}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, link_url: e.target.value }))
                      }
                    />
                    <p className="admin-field-help">
                      Si hay URL, el mensaje se convierte en enlace.
                    </p>
                  </div>
                </div>
              </section>

              <section className="admin-fieldset">
                <p className="admin-section-label">Visibilidad</p>
                <div className="rounded-[10px] border border-border bg-[#faf9f6] px-4">
                  <AdminToggle
                    checked={form.is_active}
                    label="Banner activo"
                    description="Si está activo, aparece sobre el header de la tienda."
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
                ) : existing ? (
                  "Actualizar"
                ) : (
                  "Crear"
                )}
              </button>
            </div>
          </form>

          {/* Preview a ancho completo — espejo fiel del TopBannerClient público */}
          <div className="editor-card" style={{ overflow: "hidden" }}>
            <div className="editor-card-header">
              <h3 className="text-[14px] font-semibold text-text">Preview en vivo</h3>
              <p className="mt-0.5 text-[12px] text-text-light">
                Así se ve la franja sobre el header del sitio.
              </p>
            </div>
            <div
              className="bg-moss"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.5rem 3rem",
                textAlign: "center",
              }}
            >
              <div>
                {form.link_url ? (
                  <span
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                      color: "rgba(255,255,255,0.9)",
                      textDecoration: "underline",
                      textDecorationColor: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {previewTitle}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {previewTitle}
                  </span>
                )}
                {form.description ? (
                  <p
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.6)",
                      marginTop: "1px",
                    }}
                  >
                    {form.description}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
