import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

import { AdminLoginPanel } from "@/features/admin/components/admin-login-panel";
import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";
import { verifyToken } from "@/features/admin/services/auth-service";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next;

  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    const session = await verifyToken(token);
    if (session) {
      redirect("/admin");
    }
  }

  return (
    <main className="relative min-h-screen w-full lg:flex" style={{ background: "var(--beige)" }}>
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
              "linear-gradient(180deg, rgba(58,48,1,0.35) 0%, rgba(58,48,1,0.55) 55%, rgba(58,48,1,0.8) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "400px",
            background: "rgba(245,243,232,0.97)",
            backdropFilter: "blur(20px)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.2)",
            padding: "2rem",
          }}
        >
          <AdminLoginPanel nextPath={nextPath} />
        </div>
      </div>
    </main>
  );
}
