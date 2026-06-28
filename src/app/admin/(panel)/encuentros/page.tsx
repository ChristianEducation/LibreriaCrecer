"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useToast } from "@/shared/hooks";
import { AdminToggle } from "@/features/admin/components";

type EncounterRow = {
  id: string;
  title: string;
  eventDate: string;
  coverImageUrl: string;
  displayOrder: number;
  isActive: boolean;
};

export default function AdminEncuentrosPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<EncounterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/encuentros", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        data?: EncounterRow[];
        message?: string;
      } | null;

      if (!response.ok) {
        setError(payload?.message ?? "No se pudieron cargar los encuentros.");
        return;
      }

      setItems(payload?.data ?? []);
    } catch {
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchItems();
  }, []);

  async function removeItem(id: string) {
    if (!window.confirm("¿Seguro que deseas eliminar este encuentro? Se borrará su galería de fotos.")) return;

    const response = await fetch(`/api/admin/encuentros/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const message = "No se pudo eliminar el encuentro.";
      setError(message);
      toast({ message, variant: "error" });
      return;
    }

    toast({ message: "Encuentro eliminado." });
    await fetchItems();
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const sectionItems = [...items];
    const currentIndex = sectionItems.findIndex((item) => item.id === id);
    if (currentIndex < 0) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sectionItems.length) return;

    const reordered = [...sectionItems];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    // Optimistic UI update
    setItems(reordered);

    const response = await fetch("/api/admin/encuentros/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: reordered.map((item) => item.id),
      }),
    });

    if (!response.ok) {
      toast({ message: "Error al reordenar", variant: "error" });
      await fetchItems(); // revert
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    const response = await fetch(`/api/admin/encuentros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !currentStatus }),
    });

    if (!response.ok) {
      toast({ message: "Error al cambiar estado", variant: "error" });
      return;
    }
    
    toast({ message: `Encuentro ${!currentStatus ? "publicado" : "ocultado"}` });
    await fetchItems();
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[2rem] leading-none text-text">Encuentros Crecer</h1>
          <p className="mt-2 text-sm font-light text-text-light">
            Gestión de crónicas de eventos, reuniones y galerías.
          </p>
        </div>
        <Link className="admin-btn-primary" href="/admin/encuentros/nuevo">
          Nuevo encuentro
        </Link>
      </div>

      {error ? <div className="admin-error-block">{error}</div> : null}

      <div className="editor-card">
        <div className="editor-card-header flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold text-text">Listado de encuentros</h2>
            <p className="mt-0.5 text-[12px] text-text-light">
              El orden aquí define cómo se muestran en la galería de la tienda.
            </p>
          </div>
          {items.length > 0 ? (
            <span className="admin-badge admin-badge--active">
              <span className="admin-badge-dot" />
              {items.filter((i) => i.isActive).length} publicado
              {items.filter((i) => i.isActive).length !== 1 ? "s" : ""}
            </span>
          ) : null}
        </div>

        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "var(--text-light)" }}>Cargando...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--beige-warm)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <svg fill="none" height="22" stroke="var(--text-light)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="22">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
              Aún no hay encuentros
            </p>
            <p style={{ fontSize: 12.5, color: "var(--text-light)", marginTop: 4 }}>
              Crea tu primer encuentro para empezar a armar la galería.
            </p>
          </div>
        ) : (
          <div>
            {items.map((item, index) => (
              <article
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 20px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                {/* Portada */}
                {item.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={item.title}
                    src={item.coverImageUrl}
                    style={{
                      width: 56,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 56,
                      height: 40,
                      borderRadius: 4,
                      background: "var(--beige-warm)",
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "var(--text)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 1 }}>
                    {item.eventDate ? new Date(item.eventDate).toLocaleDateString("es-CL", { timeZone: "UTC" }) : "Sin fecha"}
                  </p>
                </div>

                {/* Toggle Activo */}
                <div style={{ flexShrink: 0, transform: "scale(0.85)" }}>
                   <AdminToggle
                    checked={item.isActive}
                    label=""
                    onChange={() => { void toggleActive(item.id, item.isActive); }}
                  />
                </div>

                {/* Badges */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                    width: 70,
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    className={`admin-badge ${item.isActive ? "admin-badge--active" : "admin-badge--inactive"}`}
                  >
                    <span className="admin-badge-dot" />
                    {item.isActive ? "Público" : "Oculto"}
                  </span>
                </div>

                {/* Acciones */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    flexShrink: 0,
                  }}
                >
                  <button
                    disabled={index === 0}
                    onClick={() => { void moveItem(item.id, "up"); }}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      background: "transparent",
                      cursor: index === 0 ? "not-allowed" : "pointer",
                      opacity: index === 0 ? 0.35 : 1,
                      color: "var(--text-mid)",
                      fontSize: 13,
                    }}
                    title="Mover arriba"
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    disabled={index === items.length - 1}
                    onClick={() => { void moveItem(item.id, "down"); }}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      background: "transparent",
                      cursor: index === items.length - 1 ? "not-allowed" : "pointer",
                      opacity: index === items.length - 1 ? 0.35 : 1,
                      color: "var(--text-mid)",
                      fontSize: 13,
                    }}
                    title="Mover abajo"
                    type="button"
                  >
                    ↓
                  </button>
                  <Link
                    href={`/admin/encuentros/${item.id}/editar`}
                    className="admin-btn-secondary"
                    style={{ padding: "4px 12px", fontSize: 12, textDecoration: "none" }}
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => { void removeItem(item.id); }}
                    style={{
                      padding: "4px 12px",
                      fontSize: 12,
                      border: "1px solid rgba(192, 57, 43, 0.25)",
                      borderRadius: 6,
                      background: "transparent",
                      color: "var(--error)",
                      cursor: "pointer",
                    }}
                    type="button"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
