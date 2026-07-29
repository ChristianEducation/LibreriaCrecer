import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

import { ADMIN_HOSTNAME, hostnameOnly, toCleanAdminPath } from "@/features/admin/routing";

const ADMIN_SESSION_COOKIE = "admin-session";

function getJwtSecretKey(): Uint8Array | null {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    return null;
  }
  return new TextEncoder().encode(secret);
}

async function isValidSession(token: string): Promise<boolean> {
  const secret = getJwtSecretKey();
  if (!secret) {
    return false;
  }

  try {
    await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Nunca tocar internals de Next ni archivos estaticos (tienen extension).
  if (pathname.startsWith("/_next") || /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // /api/* nunca se reescribe por hostname. Solo /api/admin/* queda protegido por sesion,
  // exactamente igual en el dominio principal, en el subdominio admin o en localhost.
  if (pathname.startsWith("/api")) {
    if (!pathname.startsWith("/api/admin") || pathname === "/api/admin/auth/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = token ? await isValidSession(token) : false;
    if (valid) {
      return NextResponse.next();
    }

    return NextResponse.json(
      { error: "unauthorized", message: "Authentication required." },
      { status: 401 },
    );
  }

  const subdomainEnabled = Boolean(ADMIN_HOSTNAME);
  const requestHostname = hostnameOnly(request.headers.get("host"));
  const onAdminHost = subdomainEnabled && requestHostname === ADMIN_HOSTNAME;
  const isAdminPrefixed = pathname.startsWith("/admin");
  const isAdminPagePath = onAdminHost || isAdminPrefixed;

  if (!isAdminPagePath) {
    return NextResponse.next();
  }

  // Path publico del panel, sin el prefijo "/admin": "/", "/login", "/productos", ...
  const cleanPath = toCleanAdminPath(pathname);
  const isLoginPath = cleanPath === "/login";

  if (!isLoginPath) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = token ? await isValidSession(token) : false;

    if (!valid) {
      const loginUrl = subdomainEnabled
        ? new URL(`https://${ADMIN_HOSTNAME}/login`, request.url)
        : new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", cleanPath + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (!subdomainEnabled) {
    // Local/desarrollo: sin subdominio configurado, el panel sigue viviendo en /admin/* tal cual.
    return NextResponse.next();
  }

  if (onAdminHost && isAdminPrefixed) {
    // Link/redirect legacy con prefijo /admin seguido ya desde el subdominio -> corrige a la URL limpia.
    const target = request.nextUrl.clone();
    target.pathname = cleanPath;
    return NextResponse.redirect(target);
  }

  if (!onAdminHost) {
    // URL antigua del dominio principal -> redirige al subdominio admin, preservando query.
    const target = new URL(`https://${ADMIN_HOSTNAME}${cleanPath}`, request.url);
    target.search = search;
    return NextResponse.redirect(target);
  }

  // En el subdominio admin con un path ya limpio: rewrite interno a la ruta real /admin/...
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = cleanPath === "/" ? "/admin" : `/admin${cleanPath}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png).*)"],
};
