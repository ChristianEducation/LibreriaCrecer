"use client";

import { useState } from "react";

import { useToast } from "@/shared/hooks";

type TemplateChoice = "original" | "libro" | "piedra";

type ProductTemplatePickerProps = {
  productId: string;
  originalUrl: string | null;
  libroUrl: string | null;
  piedraUrl: string | null;
  /** Imagen que hoy muestra la tienda (`studio_image_url`); nula = la original. */
  currentUrl: string | null;
};

function initialChoice({ libroUrl, piedraUrl, currentUrl }: ProductTemplatePickerProps): TemplateChoice {
  if (currentUrl && currentUrl === libroUrl) return "libro";
  if (currentUrl && currentUrl === piedraUrl) return "piedra";
  return "original";
}

/**
 * Elige la imagen que ve el cliente en la tienda: la portada original o una de las dos versiones
 * con plantilla. El cambio se guarda al tocar (no espera al botón "Guardar producto").
 */
export function ProductTemplatePicker(props: ProductTemplatePickerProps) {
  const { productId, originalUrl, libroUrl, piedraUrl } = props;
  const { toast } = useToast();
  const [choice, setChoice] = useState<TemplateChoice>(() => initialChoice(props));
  const [saving, setSaving] = useState<TemplateChoice | null>(null);

  if (!libroUrl && !piedraUrl) return null;

  const options: Array<{ key: TemplateChoice; label: string; url: string | null }> = [
    { key: "original", label: "Original", url: originalUrl },
    { key: "libro", label: "En libro", url: libroUrl },
    { key: "piedra", label: "Sobre piedra", url: piedraUrl },
  ];

  async function select(next: TemplateChoice) {
    if (next === choice || saving) return;
    setSaving(next);
    try {
      const response = await fetch(`/api/admin/productos/${productId}/plantilla`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: next }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        toast({ message: payload?.message ?? "No se pudo cambiar la plantilla.", variant: "error" });
        return;
      }
      setChoice(next);
      toast({ message: "Plantilla cambiada. Ya se ve en la tienda." });
    } catch {
      toast({ message: "Error de red. Intenta nuevamente.", variant: "error" });
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <p className="pf-group-label">Cómo se ve en la tienda</p>
      <div className="pf-tpl">
        {options.map((option) => {
          const available = Boolean(option.url);
          const selected = choice === option.key;
          return (
            <button
              key={option.key}
              aria-pressed={selected}
              className={`pf-tpl-opt${selected ? " pf-tpl-opt--on" : ""}`}
              disabled={!available || saving !== null}
              onClick={() => {
                void select(option.key);
              }}
              type="button"
            >
              <span className={`pf-tpl-img${option.key === "original" ? " pf-tpl-img--orig" : ""}`}>
                {option.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={option.label} loading="lazy" src={option.url} />
                ) : (
                  <small>No disponible</small>
                )}
              </span>
              <span className="pf-tpl-name">{saving === option.key ? "Guardando…" : option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
