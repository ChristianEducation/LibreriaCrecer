"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cx } from "class-variance-authority";

export interface AdminLogoutButtonProps {
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  showLabel?: boolean;
  title?: string;
}

export function AdminLogoutButton({
  className,
  label = "Cerrar sesion",
  icon,
  showLabel = true,
  title,
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

  const visibleLabel = loading ? "Cerrando..." : label;

  return (
    <button
      aria-label={!showLabel ? label : undefined}
      className={cx(className, "disabled:opacity-60")}
      disabled={loading}
      onClick={handleLogout}
      title={title ?? (!showLabel ? label : undefined)}
      type="button"
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {showLabel ? <span>{visibleLabel}</span> : null}
    </button>
  );
}
