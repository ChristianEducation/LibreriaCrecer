import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

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
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminLoginApi = pathname === "/api/admin/auth/login";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (isAdminLoginPage || isAdminLoginApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = token ? await isValidSession(token) : false;

  if (valid) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: "Authentication required.",
      },
      { status: 401 },
    );
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
