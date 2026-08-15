"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_INTERVAL_MS = 15_000;

type AutoRefreshOptions = {
  /** Si se pasa, se llama en vez de router.refresh() cuando cambia el signal. */
  onChange?: () => void;
  /** Si es false, no hace polling (util para pausar mientras hay una edicion en curso). */
  enabled?: boolean;
};

/**
 * Detecta cambios en el servidor sin que el usuario recargue la página.
 * `fetchSignal` debe devolver un valor liviano (ej. `updated_at`) que cambia
 * cuando cambian los datos relevantes. La primera lectura solo establece la
 * base — recién a partir de la segunda se compara y, si difiere, se llama
 * `router.refresh()` (o `onChange`, si se pasa uno — util cuando el
 * componente mantiene su propio estado en vez de depender solo de props del
 * servidor).
 *
 * Solo hace polling mientras la pestaña está visible y `enabled` es true, y
 * siempre revisa una vez de inmediato al recuperar el foco (sin esperar el
 * próximo intervalo).
 */
export function useAutoRefreshOnChange(
  fetchSignal: () => Promise<string | null>,
  intervalMs: number = DEFAULT_INTERVAL_MS,
  options?: AutoRefreshOptions,
) {
  const router = useRouter();
  const fetchSignalRef = useRef(fetchSignal);
  fetchSignalRef.current = fetchSignal;
  const onChangeRef = useRef(options?.onChange);
  onChangeRef.current = options?.onChange;
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let lastSignal: string | null | undefined;

    async function check() {
      const signal = await fetchSignalRef.current().catch(() => undefined);
      if (cancelled || signal === undefined) return;

      if (lastSignal === undefined) {
        lastSignal = signal;
        return;
      }

      if (signal !== lastSignal) {
        lastSignal = signal;
        if (onChangeRef.current) {
          onChangeRef.current();
        } else {
          router.refresh();
        }
      }
    }

    void check();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void check();
      }
    }, intervalMs);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void check();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, intervalMs, enabled]);
}
