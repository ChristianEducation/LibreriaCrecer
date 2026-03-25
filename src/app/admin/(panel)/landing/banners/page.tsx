"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";

type BannerRow = {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
  isActive: boolean;
};

type BannerFormState = {
  id?: string;
  title: string;
  description: string;
  link_url: string;
  position: string;
  is_active: boolean;
  imageFile: File | null;
};

const initialForm: BannerFormState = {
  title: "",
  description: "",
  link_url: "",
  position: "between_sections_1",
  is_active: true,
  imageFile: null,
};

export default function AdminLandingBannersPage() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<BannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BannerFormState>(initialForm);

  const previewUrl = useMemo(() => (form.imageFile ? URL.createObjectURL(form.imageFile) : null), [form.imageFile]);
  const visibleBanners = useMemo(
    () => banners.filter((item) => item.position !== "footer_illustration"),
    [banners],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function fetchBanners() {
    setLoading(true);
    const response = await fetch("/api/admin/landing/banners", { cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as { data?: BannerRow[]; message?: string } | null;

    if (!response.ok) {
      setError(payload?.message ?? "No se pudieron cargar banners.");
      setLoading(false);
      return;
    }

    setBanners(payload?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void fetchBanners();
  }, []);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (form.id) {
        const payload = {
          title: form.title || undefined,
          description: form.description || undefined,
          link_url: form.link_url || undefined,
          position: form.position,
          is_active: form.is_active,
        };

        const response = await fetch(`/api/admin/landing/banners/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = data?.message ?? "No se pudo actualizar banner.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }

        if (form.imageFile) {
          const uploadData = new FormData();
          uploadData.append("file", form.imageFile);
          await fetch(`/api/admin/landing/banners/${form.id}/imagen`, { method: "POST", body: uploadData });
        }
      } else {
        if (!form.imageFile) {
          const message = "La imagen es obligatoria para crear un banner.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }

        const createData = new FormData();
        createData.append("title", form.title);
        createData.append("description", form.description);
        createData.append("link_url", form.link_url);
        createData.append("position", form.position);
        createData.append("is_active", String(form.is_active));
        createData.append("file", form.imageFile);

        const response = await fetch("/api/admin/landing/banners", {
          method: "POST",
          body: createData,
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { message?: string } | null;
          const message = data?.message ?? "No se pudo crear banner.";
          setError(message);
          toast({ message, variant: "error" });
          setSaving(false);
          return;
        }
      }

      setForm(initialForm);
      toast({ message: "Banners actualizados correctamente." });
      await fetchBanners();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: BannerRow) {
    setForm({
      id: item.id,
      title: item.title ?? "",
      description: item.description ?? "",
      link_url: item.linkUrl ?? "",
      position: item.position,
      is_active: item.isActive,
      imageFile: null,
    });
  }

  async function removeBanner(id: string) {
    if (!window.confirm("Eliminar este banner?")) return;

    const response = await fetch(`/api/admin/landing/banners/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const message = "No se pudo eliminar banner.";
      setError(message);
      toast({ message, variant: "error" });
      return;
    }

    toast({ message: "Banner eliminado." });
    await fetchBanners();
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Banners intermedios</h1>
          <p className="mt-2 text-sm font-light text-text-light">Bloques visuales entre secciones del home.</p>
        </div>
        <Link href="/admin/landing" className="rounded-[8px] border border-border px-3 py-2 text-sm text-text-mid">
          Volver a Landing
        </Link>
      </div>

      <form onSubmit={submitForm} className="space-y-4 rounded-[2px] border border-border bg-white p-6">
        <h2 className="text-[0.82rem] font-semibold text-text">{form.id ? "Editar banner" : "Nuevo banner"}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            placeholder="Titulo"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
          <select
            value={form.position}
            onChange={(event) => setForm((prev) => ({ ...prev, position: event.target.value }))}
            className="rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
          >
            <option value="between_sections_1">between_sections_1</option>
            <option value="between_sections_2">between_sections_2</option>
            <option value="between_sections_3">between_sections_3</option>
          </select>
          <input
            placeholder="https://..."
            value={form.link_url}
            onChange={(event) => setForm((prev) => ({ ...prev, link_url: event.target.value }))}
            className="rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none md:col-span-2"
          />
          <textarea
            placeholder="Descripcion"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="min-h-24 rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none md:col-span-2"
          />
        </div>

        <AdminUploadZone
          hint="Banner promocional entre secciones."
          onFileSelect={(file) => setForm((prev) => ({ ...prev, imageFile: file }))}
          previewUrl={previewUrl}
        />

        <AdminToggle
          checked={form.is_active}
          label="Banner activo"
          onChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
        />

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white">
            {saving ? "Guardando..." : form.id ? "Actualizar" : "Crear"}
          </button>
          {form.id ? (
            <button type="button" onClick={() => setForm(initialForm)} className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid">
              Cancelar edicion
            </button>
          ) : null}
        </div>
      </form>

      {loading ? <p className="text-sm text-text-light">Cargando banners...</p> : null}
      {!loading ? (
        <div className="space-y-2 rounded-[2px] border border-border bg-white p-4">
          {visibleBanners.map((item) => (
            <article key={item.id} className="flex items-center justify-between rounded-[10px] border border-border p-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.title ?? "Banner"} className="h-14 w-24 rounded-[8px] object-cover" />
                <div>
                  <p className="font-medium text-text">{item.title ?? "(Sin titulo)"}</p>
                  <p className="text-xs text-text-light">{item.position}</p>
                  <p className="text-xs text-text-light">{item.linkUrl ?? "Sin link"}</p>
                  <p className="text-xs text-text-light">{item.isActive ? "Activo" : "Inactivo"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => startEdit(item)} className="rounded-[8px] border border-border px-2 py-1 text-sm text-text-mid">
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => removeBanner(item.id)}
                  className="rounded-[8px] border border-error/30 px-2 py-1 text-sm text-error"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
