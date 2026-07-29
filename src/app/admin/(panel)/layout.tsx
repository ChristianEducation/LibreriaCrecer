import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminPanelShell } from "@/features/admin/components/AdminPanelShell";
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
    <AdminPanelShell adminName={admin.name} mustChangePassword={admin.mustChangePassword}>
      {children}
    </AdminPanelShell>
  );
}
