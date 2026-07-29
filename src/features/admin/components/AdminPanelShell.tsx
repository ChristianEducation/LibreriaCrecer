"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { ChangePasswordModal } from "./ChangePasswordModal";

export interface AdminPanelShellProps {
  adminName: string;
  mustChangePassword: boolean;
  children: React.ReactNode;
}

export function AdminPanelShell({ adminName, mustChangePassword, children }: AdminPanelShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="admin-panel-layout flex overflow-hidden bg-[#f5f4f1]">
      <AdminSidebar
        adminName={adminName}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMenu={() => setMobileMenuOpen(true)} />
        <main className="admin-panel-scroll min-w-0 flex-1 overflow-y-auto bg-[#f5f4f1]">
          <div className="admin-main-canvas">{children}</div>
        </main>
      </div>
      <ChangePasswordModal initiallyOpen={mustChangePassword} />
    </div>
  );
}
