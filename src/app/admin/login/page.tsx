import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { AdminLoginForm } from "@/features/admin/components/admin-login-form";
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-moss p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(217,186,30,0.06)_0%,transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(217,186,30,0.04)_0%,transparent_55%),radial-gradient(ellipse_at_50%_50%,rgba(138,115,2,0.4)_0%,transparent_70%)]" />
      <div className="absolute left-12 top-12 h-12 w-12 opacity-[0.06] before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-gold before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-gold after:content-['']" />
      <div className="absolute bottom-12 right-12 h-8 w-8 opacity-[0.06] before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-gold before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-gold after:content-['']" />

      <Link
        className="absolute top-7 text-[11px] tracking-[0.08em] text-white/30 transition-colors hover:text-white/60"
        href="/"
      >
        Volver al sitio
      </Link>

      <AdminLoginForm nextPath={nextPath} />
    </main>
  );
}
