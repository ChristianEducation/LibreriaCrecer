/**
 * Utilidades de routing por hostname para el panel admin (admin.libreriacrecer.cl).
 *
 * Isomorficas: se usan en middleware (Edge Runtime), Server Components (via headers())
 * y Client Components (via window.location.hostname). Sin dependencias de Node/next/headers
 * para que sigan siendo validas en el Edge Runtime.
 *
 * Si NEXT_PUBLIC_ADMIN_HOSTNAME no esta configurada (caso local/desarrollo), todas las
 * funciones se comportan como si el subdominio no existiera: no hay rewrite ni redirect,
 * el panel sigue viviendo en /admin/* exactamente como antes.
 */

export const ADMIN_HOSTNAME = process.env.NEXT_PUBLIC_ADMIN_HOSTNAME || "";

export function hostnameOnly(host: string | null | undefined): string {
  if (!host) return "";
  return host.split(":")[0] ?? "";
}

export function isAdminHostname(hostname: string | null | undefined): boolean {
  if (!ADMIN_HOSTNAME || !hostname) return false;
  return hostname.toLowerCase() === ADMIN_HOSTNAME.toLowerCase();
}

/**
 * Quita el prefijo "/admin" de un path, ej: "/admin/productos" -> "/productos", "/admin" -> "/".
 * Paths que ya vienen limpios (sin prefijo) se devuelven sin cambios.
 */
export function toCleanAdminPath(pathname: string): string {
  if (pathname === "/admin") return "/";
  if (pathname.startsWith("/admin/")) return pathname.slice("/admin".length);
  return pathname;
}

/**
 * Construye el href correcto para navegar dentro del panel admin segun si ya estamos
 * en el subdominio (path limpio) o no (localhost / dominio principal -> prefijo /admin).
 * `cleanPath` puede incluir query string, ej: "/productos?page=2".
 */
export function adminHref(cleanPath: string, onAdminHost: boolean): string {
  const path = cleanPath || "/";
  if (onAdminHost) return path;
  return path === "/" ? "/admin" : `/admin${path}`;
}
