import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminPanelShell } from "@/features/admin/components/AdminPanelShell";
import { ADMIN_SESSION_COOKIE } from "@/features/admin/constants";
import { adminHref, hostnameOnly, isAdminHostname } from "@/features/admin/routing";
import { getAdminById, verifyToken } from "@/features/admin/services/auth-service";

type AdminPanelLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  const onAdminHost = isAdminHostname(hostnameOnly((await headers()).get("host")));
  const loginHref = adminHref("/login", onAdminHost);

  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    redirect(loginHref);
  }

  const payload = await verifyToken(token).catch(() => null);
  if (!payload) {
    redirect(loginHref);
  }

  const admin = await getAdminById(payload.adminId).catch(() => null);
  if (!admin) {
    redirect(loginHref);
  }

  return (
    <AdminPanelShell adminName={admin.name} mustChangePassword={admin.mustChangePassword} onAdminHost={onAdminHost}>
      {children}
    </AdminPanelShell>
  );
}
