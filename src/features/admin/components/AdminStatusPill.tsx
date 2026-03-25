"use client";

import { cx } from "class-variance-authority";

type AdminStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "active"
  | "inactive";

export interface AdminStatusPillProps {
  status: AdminStatus;
  children?: React.ReactNode;
  className?: string;
}

const statusMap: Record<AdminStatus, string> = {
  pending: "bg-[rgba(230,126,34,0.08)] text-[#E67E22]",
  paid: "bg-[rgba(39,174,96,0.10)] text-[#27AE60]",
  preparing: "bg-[rgba(41,128,185,0.08)] text-[#2980B9]",
  shipped: "bg-[rgba(139,92,246,0.08)] text-[#8B5CF6]",
  delivered: "bg-[rgba(39,174,96,0.10)] text-[#27AE60]",
  cancelled: "bg-[rgba(192,57,43,0.08)] text-[#C0392B]",
  active: "bg-[rgba(39,174,96,0.10)] text-[#27AE60]",
  inactive: "bg-[rgba(115,96,2,0.08)] text-text-light",
};

const labelMap: Record<AdminStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  active: "Activo",
  inactive: "Inactivo",
};

export function AdminStatusPill({ status, children, className }: AdminStatusPillProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-[20px] px-[9px] py-[3px] text-[0.68rem] font-semibold",
        statusMap[status],
        className,
      )}
    >
      <span className="size-[5px] rounded-full bg-current" />
      <span>{children ?? labelMap[status]}</span>
    </span>
  );
}
