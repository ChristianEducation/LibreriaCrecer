import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { AdminTopbar } from "@/features/admin/components/AdminTopbar";
import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";
import { getAdminById, verifyToken } from "@/features/admin/services/auth-service";

type AdminPanelLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const payload = await verifyToken(token).catch(() => null);
  if (!payload) {
    redirect("/admin/login");
  }

  const admin = await getAdminById(payload.adminId).catch(() => null);
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-beige">
      <AdminSidebar adminName={admin.name} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar initialAdminName={admin.name} />
        <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.28),transparent_220px)] p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
