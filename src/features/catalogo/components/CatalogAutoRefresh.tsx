"use client";

import { useAutoRefreshOnChange } from "@/shared/hooks";

async function fetchCatalogChangeSignal(): Promise<string | null> {
  const response = await fetch("/api/productos/estado", { cache: "no-store" });
  if (!response.ok) return null;
  const payload = (await response.json().catch(() => null)) as { data?: { signal: string | null } } | null;
  return payload?.data?.signal ?? null;
}

/**
 * Componente invisible: revisa periódicamente si cambió algo en el catálogo
 * (precio, stock, venta web habilitada, etc.) y refresca la página sin que
 * el usuario tenga que recargar. Ver useAutoRefreshOnChange.
 */
export function CatalogAutoRefresh() {
  useAutoRefreshOnChange(fetchCatalogChangeSignal);
  return null;
}
