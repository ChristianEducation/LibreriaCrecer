"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AdminToggle, AdminUploadZone } from "@/features/admin/components";
import { useToast } from "@/shared/hooks";

type AboutSection = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  imagePosition: string;
  displayOrder: number;
  isActive: boolean;
};

type FormState = {
  id?: string;
  title: string;
  content: string;
  imagePosition: string;
  isActive: boolean;
};

const initialForm: FormState = {
  title: "",
  content: "",
  imagePosition: "right",
  isActive: true,
};

export default function AdminNosotrosPage() {
  const { toast } = useToast();
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : (form.id ? sections.find((s) => s.id === form.id)?.imageUrl ?? null : null)),
    [imageFile, form.id, sections],
  );

  useEffect(() => {
    return () => {
      if (imageFile && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageFile, previewUrl]);

  async function fetchSections() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/nosotros", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as { data?: AboutSection[]; message?: string } | null;
      if (!response.ok) {
        setError(payload?.message ?? "No se pudieron cargar las secciones.");
        return;
      }
      setSections(payload?.data ?? []);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchSections();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      const message = "El título y el contenido son obligatorios.";
      setError(message);
      toast({ message, variant: "error" });
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const endpoint = form.id ? `/api/admin/nosotros/${form.id}` : "/api/admin/nosotros";
      const method = form.id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          imagePosition: form.imagePosition,
          isActive: form.isActive,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        const message = payload?.message ?? "No se pudo guardar la sección.";
        setError(message);
        toast({ message, variant: "error" });
        setSaving(false);
        return;
      }

      const saved = ((await response.json()) as { data?: AboutSection }).data;

      if (imageFile && saved?.id) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        await fetch(`/api/admin/nosotros/${saved.id}/imagen`, { method: "POST", body: uploadData });
      }

      toast({ message: form.id ? "Sección actualizada." : "Sección creada." });
      setForm(initialForm);
      setImageFile(null);
      await fetchSections();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/admin/nosotros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    await fetchSections();
  }

  async function softDelete(id: string) {
    if (!window.confirm("¿Desactivar esta sección?")) return;
    const response = await fetch(`/api/admin/nosotros/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast({ message: "No se pudo eliminar la sección.", variant: "error" });
      return;
    }
    toast({ message: "Sección desactivada." });
    await fetchSections();
  }

  function startEdit(section: AboutSection) {
    setForm({
      id: section.id,
      title: section.title,
      content: section.content,
      imagePosition: section.imagePosition,
      isActive: section.isActive,
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Página Conócenos</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Secciones de texto e imagen que componen la página /nosotros.
          </p>
        </div>
        <Link
          className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid"
          href="/admin"
        >
          Volver al panel
        </Link>
      </div>

      {/* Formulario crear / editar */}
      <form className="space-y-6 rounded-[2px] border border-border bg-white p-6" onSubmit={(e) => { void handleSubmit(e); }}>
        <h2 className="text-[0.82rem] font-semibold text-text">
          {form.id ? "Editar sección" : "Nueva sección"}
        </h2>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <label className="block space-y-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Título</span>
              <input
                className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                value={form.title}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Contenido</span>
              <textarea
                className="min-h-[160px] w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                value={form.content}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-text-light">Posición de imagen</span>
              <select
                className="w-full rounded-[8px] border border-border px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
                onChange={(e) => setForm((prev) => ({ ...prev, imagePosition: e.target.value }))}
                value={form.imagePosition}
              >
                <option value="right">Imagen a la derecha</option>
                <option value="left">Imagen a la izquierda</option>
              </select>
            </label>
            <AdminToggle
              checked={form.isActive}
              label="Sección activa"
              onChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
            />
          </div>

          <div>
            <span className="mb-2 block text-[11px] uppercase tracking-[0.12em] text-text-light">Imagen (opcional)</span>
            <AdminUploadZone
              hint="Recomendado: imagen 4:3, mínimo 800×600px."
              onFileSelect={setImageFile}
              previewUrl={previewUrl}
            />
          </div>
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <div className="flex gap-3">
          <button
            className="rounded-[8px] bg-moss px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            disabled={saving}
            type="submit"
          >
            {saving ? "Guardando..." : form.id ? "Actualizar sección" : "Crear sección"}
          </button>
          {form.id ? (
            <button
              className="rounded-[8px] border border-border px-4 py-2 text-sm text-text-mid"
              onClick={() => { setForm(initialForm); setImageFile(null); }}
              type="button"
            >
              Cancelar edición
            </button>
          ) : null}
        </div>
      </form>

      {/* Listado */}
      {loading ? <p className="text-sm text-text-light">Cargando secciones...</p> : null}
      {!loading && sections.length === 0 ? (
        <p className="text-sm text-text-light">No hay secciones creadas aún.</p>
      ) : null}
      {!loading && sections.length > 0 ? (
        <div className="space-y-3">
          {sections.map((section) => (
            <article
              key={section.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-[2px] border border-border bg-white p-4"
            >
              <div className="flex items-start gap-4">
                {section.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    alt={section.title}
                    className="h-16 w-24 rounded-[2px] object-cover"
                    src={section.imageUrl}
                  />
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center rounded-[2px] bg-beige-warm text-[10px] text-text-light">
                    Sin imagen
                  </div>
                )}
                <div>
                  <p className="font-medium text-text">{section.title}</p>
                  <p className="mt-1 text-xs text-text-light">
                    Imagen: {section.imagePosition === "right" ? "derecha" : "izquierda"} · Orden: {section.displayOrder}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-text-light">{section.content}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AdminToggle
                  checked={section.isActive}
                  label=""
                  onChange={() => { void toggleActive(section.id, section.isActive); }}
                />
                <button
                  className="rounded-[8px] border border-border px-3 py-1.5 text-xs text-text-mid"
                  onClick={() => startEdit(section)}
                  type="button"
                >
                  Editar
                </button>
                <button
                  className="rounded-[8px] border border-error/30 px-3 py-1.5 text-xs text-error"
                  onClick={() => { void softDelete(section.id); }}
                  type="button"
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
