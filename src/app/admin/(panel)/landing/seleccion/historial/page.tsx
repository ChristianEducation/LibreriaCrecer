"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useToast } from "@/shared/hooks";
import { formatDate } from "@/shared/utils/formatters";

type Summary = {
  id: string;
  status: "draft" | "archived";
  periodLabel: string | null;
  title: string | null;
  itemCount: number;
  availableCount: number;
  covers: string[];
  autoSaved: boolean;
  createdAt: string;
  updatedAt: string;
};

type PublishPayload = {
  data?: { published: number; skipped: string[]; backedUp: boolean };
  message?: string;
};

function Covers({ covers }: { covers: string[] }) {
  if (covers.length === 0) {
    return <div style={{ width: 34, height: 48, borderRadius: 4, background: "var(--beige-warm)", flexShrink: 0 }} />;
  }

  return (
    <div style={{ display: "flex", flexShrink: 0 }}>
      {covers.map((url, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${url}-${index}`}
          alt=""
          src={url}
          style={{
            width: 34,
            height: 48,
            objectFit: "cover",
            borderRadius: 4,
            border: "2px solid white",
            marginLeft: index === 0 ? 0 : -12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        />
      ))}
    </div>
  );
}

export default function AdminSeleccionHistorialPage() {
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Summary[]>([]);
  const [archived, setArchived] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/landing/seleccion/historial", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        data?: { drafts: Summary[]; archived: Summary[] };
        message?: string;
      } | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudo cargar el historial.");
        return;
      }

      setDrafts(payload?.data?.drafts ?? []);
      setArchived(payload?.data?.archived ?? []);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  async function createDraft(action: "blank_draft" | "draft_from_current") {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/landing/seleccion/historial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, periodLabel: newLabel }),
      });
      const payload = (await response.json().catch(() => null)) as { data?: { id: string }; message?: string } | null;

      if (!response.ok || !payload?.data) {
        toast({ message: payload?.message ?? "No se pudo crear el borrador.", variant: "error" });
        return;
      }

      window.location.href = `/admin/landing/seleccion/historial/${payload.data.id}`;
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function duplicate(id: string) {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/landing/seleccion/historial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", sourceId: id }),
      });
      const payload = (await response.json().catch(() => null)) as { data?: { id: string }; message?: string } | null;

      if (!response.ok || !payload?.data) {
        toast({ message: payload?.message ?? "No se pudo copiar la selección.", variant: "error" });
        return;
      }

      window.location.href = `/admin/landing/seleccion/historial/${payload.data.id}`;
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function publish(summary: Summary) {
    const name = summary.periodLabel || summary.title || "esta selección";
    const ok = window.confirm(
      `¿Publicar «${name}» en la tienda?\n\nReemplaza la selección que se ve hoy. La actual se guarda sola en el historial.`,
    );
    if (!ok) return;

    setBusy(true);
    try {
      const response = await fetch(`/api/admin/landing/seleccion/historial/${summary.id}/publicar`, {
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as PublishPayload | null;

      if (!response.ok || !payload?.data) {
        toast({ message: payload?.message ?? "No se pudo publicar la selección.", variant: "error" });
        return;
      }

      const { published, skipped, backedUp } = payload.data;
      const parts = [`Selección publicada (${published} libro${published !== 1 ? "s" : ""}).`];
      if (backedUp) parts.push("La anterior quedó en el historial.");
      if (skipped.length > 0) parts.push(`No se incluyeron ${skipped.length} libro(s) que ya no están activos.`);
      toast({ message: parts.join(" "), variant: skipped.length > 0 ? "error" : "success" });
      await fetchAll();
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function remove(summary: Summary) {
    const name = summary.periodLabel || summary.title || "esta selección";
    if (!window.confirm(`¿Eliminar «${name}»? No se puede deshacer.`)) return;

    setBusy(true);
    try {
      const response = await fetch(`/api/admin/landing/seleccion/historial/${summary.id}`, { method: "DELETE" });
      if (!response.ok) {
        toast({ message: "No se pudo eliminar.", variant: "error" });
        return;
      }
      toast({ message: "Eliminada." });
      await fetchAll();
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  function renderRow(summary: Summary) {
    const isDraft = summary.status === "draft";
    const name = summary.periodLabel || (summary.autoSaved ? "Respaldo automático" : "Sin nombre");
    const unavailable = summary.itemCount - summary.availableCount;

    return (
      <article
        key={summary.id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 20px",
          borderTop: "1px solid var(--border)",
          flexWrap: "wrap",
        }}
      >
        <Covers covers={summary.covers} />
        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
            {name}
            {summary.autoSaved && summary.periodLabel ? (
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: "var(--text-light)" }}>
                respaldo automático
              </span>
            ) : null}
          </p>
          {summary.title ? (
            <p
              style={{
                fontSize: 12.5,
                color: "var(--text-mid)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {summary.title}
            </p>
          ) : null}
          <p style={{ marginTop: 2, fontSize: 12, color: "var(--text-light)" }}>
            {summary.itemCount} libro{summary.itemCount !== 1 ? "s" : ""}
            {unavailable > 0 ? ` · ${unavailable} sin stock u ocultos` : ""}
            {" · "}
            {isDraft ? "editado" : "guardado"} {formatDate(isDraft ? summary.updatedAt : summary.createdAt)}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flexShrink: 0 }}>
          <Link
            className="admin-btn-secondary"
            href={`/admin/landing/seleccion/historial/${summary.id}`}
            style={{ height: 34 }}
          >
            {isDraft ? "Editar" : "Ver"}
          </Link>
          {!isDraft ? (
            <button
              className="admin-btn-secondary"
              disabled={busy}
              onClick={() => { void duplicate(summary.id); }}
              style={{ height: 34 }}
              type="button"
            >
              Copiar como borrador
            </button>
          ) : null}
          <button
            className="admin-btn-primary"
            disabled={busy}
            onClick={() => { void publish(summary); }}
            style={{ height: 34 }}
            type="button"
          >
            {isDraft ? "Publicar" : "Publicar de nuevo"}
          </button>
          <button
            className="admin-btn-secondary"
            disabled={busy}
            onClick={() => { void remove(summary); }}
            style={{ height: 34, color: "var(--error)" }}
            type="button"
          >
            Eliminar
          </button>
        </div>
      </article>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Historial de selecciones</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Registro interno. Nada de esto se ve en la tienda hasta que publiques una selección.
          </p>
        </div>
        <Link className="text-sm text-text-mid transition-colors hover:text-text" href="/admin/landing/seleccion">
          ← Selección vigente
        </Link>
      </div>

      {error ? <div className="admin-error-block">{error}</div> : null}

      <div className="editor-card">
        <div className="editor-card-header">
          <h2 className="text-[15px] font-semibold text-text">Borradores</h2>
          <p className="mt-0.5 text-[12px] text-text-light">
            Prepara la selección del próximo mes con calma y publícala cuando quieras.
          </p>
        </div>
        <div className="editor-card-body">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 220px", maxWidth: 320 }}>
              <label className="admin-field-label" htmlFor="new-label">Nombre del borrador (opcional)</label>
              <input
                className="admin-input"
                id="new-label"
                onChange={(event) => setNewLabel(event.target.value)}
                placeholder="Ej: Diciembre 2026"
                value={newLabel}
              />
            </div>
            <button
              className="admin-btn-primary"
              disabled={busy}
              onClick={() => { void createDraft("blank_draft"); }}
              type="button"
            >
              Nuevo borrador vacío
            </button>
            <button
              className="admin-btn-secondary"
              disabled={busy}
              onClick={() => { void createDraft("draft_from_current"); }}
              type="button"
            >
              Copiar la selección vigente
            </button>
          </div>
        </div>
        {loading ? (
          <p style={{ padding: 20, fontSize: 13, color: "var(--text-light)" }}>Cargando...</p>
        ) : drafts.length === 0 ? (
          <p style={{ padding: "16px 20px 20px", fontSize: 13, color: "var(--text-light)", borderTop: "1px solid var(--border)" }}>
            No hay borradores.
          </p>
        ) : (
          <div>{drafts.map((summary) => renderRow(summary))}</div>
        )}
      </div>

      <div className="editor-card">
        <div className="editor-card-header">
          <h2 className="text-[15px] font-semibold text-text">Historial</h2>
          <p className="mt-0.5 text-[12px] text-text-light">
            Selecciones guardadas. Al publicar otra, la que estaba en la tienda se guarda aquí sola.
          </p>
        </div>
        {loading ? (
          <p style={{ padding: 20, fontSize: 13, color: "var(--text-light)" }}>Cargando...</p>
        ) : archived.length === 0 ? (
          <p style={{ padding: "16px 20px 20px", fontSize: 13, color: "var(--text-light)" }}>
            Aún no hay selecciones guardadas. Usa «Guardar en el historial» en la pantalla de la selección vigente.
          </p>
        ) : (
          <div>{archived.map((summary) => renderRow(summary))}</div>
        )}
      </div>
    </section>
  );
}
