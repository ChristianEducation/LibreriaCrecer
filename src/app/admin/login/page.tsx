import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

import { AdminLoginPanel } from "@/features/admin/components/admin-login-panel";
import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";
import { adminHref, hostnameOnly, isAdminHostname } from "@/features/admin/routing";
import { verifyToken } from "@/features/admin/services/auth-service";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next;

  const onAdminHost = isAdminHostname(hostnameOnly((await headers()).get("host")));

  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    const session = await verifyToken(token);
    if (session) {
      redirect(adminHref("/", onAdminHost));
    }
  }

  return (
    <main className="relative min-h-screen w-full lg:flex" style={{ background: "#f7f5f0" }}>
      {/* Desktop — 60% foto de la librería */}
      <div className="relative hidden lg:block lg:w-3/5 lg:shrink-0">
        <Image
          alt="Interior de Crecer Librería"
          fill
          priority
          sizes="60vw"
          src="/images/login-libreria.jpg"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* Velo azul suave para unir la foto con el panel */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(41,70,95,0.2) 0%, rgba(41,70,95,0.6) 100%)" }}
        />
      </div>

      {/* Desktop — 40% panel de acceso, plano, sin tarjeta flotante */}
      <div
        className="hidden lg:flex lg:w-2/5 lg:shrink-0 page-px"
        style={{ minHeight: "100vh", alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <AdminLoginPanel nextPath={nextPath} />
        </div>
      </div>

      {/* Mobile — foto de fondo a pantalla completa + tarjeta flotante */}
      <div className="relative flex min-h-screen items-center justify-center p-6 lg:hidden">
        <Image
          alt="Interior de Crecer Librería"
          fill
          priority
          sizes="100vw"
          src="/images/login-libreria.jpg"
          style={{ objectFit: "cover" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(41,70,95,0.4) 0%, rgba(41,70,95,0.6) 55%, rgba(34,64,91,0.85) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "320px",
            background: "rgba(247,245,240,0.92)",
            backdropFilter: "blur(20px)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
            padding: "1.5rem",
          }}
        >
          <AdminLoginPanel nextPath={nextPath} />
        </div>
      </div>
    </main>
  );
}
