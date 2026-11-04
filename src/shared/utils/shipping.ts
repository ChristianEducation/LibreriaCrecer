/**
 * Chilexpress informa el plazo dentro de `serviceDescription`, por ejemplo
 * "BASCX en 3 días háb.". Devuelve los días hábiles o null si no se puede leer.
 */
export function parseEstimatedBusinessDays(description: string | null | undefined): number | null {
  if (!description) return null;
  const match = description.match(/(\d+)\s*d[ií]as?\s*h[aá]b/i);
  if (!match) return null;
  const days = Number(match[1]);
  return Number.isFinite(days) && days > 0 ? days : null;
}

/** Texto para el cliente. El plazo corre desde que la tienda despacha el pedido. */
export function formatEstimatedDelivery(days: number): string {
  return `${days} ${days === 1 ? "día hábil" : "días hábiles"}`;
}
