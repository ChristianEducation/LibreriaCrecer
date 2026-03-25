"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cx } from "class-variance-authority";

export interface AdminLogoutButtonProps {
  className?: string;
  label?: string;
}

export function AdminLogoutButton({
  className,
  label = "Cerrar sesion",
}: AdminLogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={cx(className, "disabled:opacity-60")}
    >
      {loading ? "Cerrando..." : label}
    </button>
  );
}
