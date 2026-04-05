"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";

type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  displayOrder: number;
  isActive: boolean;
};

type HeroFormState = {
  id?: string;
  title: string;
  subtitle: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
  imageFile: File | null;
};

const initialForm: HeroFormState = {
  title: "",
  subtitle: "",
  link_url: "",
  display_order: 0,
  is_active: true,
  imageFile: null,
};

export default function AdminLandingHeroPage() {
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<HeroFormState>(initialForm);

  const previewUrl = useMemo(() => (form.imageFile ? URL.createObjectURL(form.imageFile) : null), [form.imageFile]);

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
    } finally {
      setSaving(false);
    }
  }

  function startEdit(slide: HeroSlide) {
    setForm({
      id: slide.id,
      title: slide.title ?? "",
      subtitle: slide.subtitle ?? "",
      link_url: slide.linkUrl ?? "",
      display_order: slide.displayOrder,
      is_active: slide.isActive,
      imageFile: null,
    });
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
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Hero Slides</h1>
          <p className="mt-2 text-sm font-light text-text-light">Portadas principales del home con orden y CTA.</p>
        </div>
        <Link href="/admin/landing" className="rounded-[8px] border border-border px-3 py-2 text-sm text-text-mid">
          Volver a Landing
        </Link>
      </div>

      <form onSubmit={submitForm} className="space-y-4 rounded-[2px] border border-border bg-white p-6">
        <h2 className="text-[0.82rem] font-semibold text-text">{form.id ? "Editar slide" : "Nuevo slide"}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            placeholder="Titulo"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className="rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
          <input
            placeholder="Subtitulo"
            value={form.subtitle}
            onChange={(event) => setForm((prev) => ({ ...prev, subtitle: event.target.value }))}
            className="rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
          <input
            placeholder="https://..."
            value={form.link_url}
            onChange={(event) => setForm((prev) => ({ ...prev, link_url: event.target.value }))}
            className="rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
          <input
            type="number"
            value={form.display_order}
            onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value || 0) }))}
            className="rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
        </div>

        <AdminUploadZone
          hint="Ideal para desktop y mobile."
          onFileSelect={(file) => setForm((prev) => ({ ...prev, imageFile: file }))}
          previewUrl={previewUrl}
        />

        <AdminToggle
          checked={form.is_active}
          label="Slide activo"
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

      {loading ? <p className="text-sm text-text-light">Cargando slides...</p> : null}
      {!loading ? (
        <div className="space-y-2 rounded-[2px] border border-border bg-white p-4">
          {slides.map((slide, index) => (
            <article key={slide.id} className="flex items-center justify-between rounded-[10px] border border-border p-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.imageUrl} alt={slide.title ?? "Hero"} className="h-14 w-24 rounded-[8px] object-cover" />
                <div>
                  <p className="font-medium text-text">{slide.title ?? "(Sin titulo)"}</p>
                  <p className="text-xs text-text-light">{slide.linkUrl ?? "Sin link"}</p>
                  <p className="text-xs text-text-light">
                    Orden: {slide.displayOrder} | {slide.isActive ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveSlide(slide.id, "up")}
                  disabled={index === 0}
                  className="rounded-[8px] border border-border px-2 py-1 text-sm text-text-mid disabled:opacity-50"
                >
                  Arriba
                </button>
                <button
                  type="button"
                  onClick={() => moveSlide(slide.id, "down")}
                  disabled={index === slides.length - 1}
                  className="rounded-[8px] border border-border px-2 py-1 text-sm text-text-mid disabled:opacity-50"
                >
                  Abajo
                </button>
                <button type="button" onClick={() => startEdit(slide)} className="rounded-[8px] border border-border px-2 py-1 text-sm text-text-mid">
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => removeSlide(slide.id)}
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
