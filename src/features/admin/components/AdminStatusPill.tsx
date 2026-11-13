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
  pending: "bg-[rgba(201,138,43,0.12)] text-[#a8691a]",
  paid: "bg-[rgba(63,143,107,0.12)] text-[#2f7a58]",
  preparing: "bg-[rgba(79,127,168,0.12)] text-[#3a6a92]",
  shipped: "bg-[rgba(90,111,176,0.12)] text-[#4a5f9f]",
  delivered: "bg-[rgba(197,160,77,0.18)] text-[#8f6c1f]",
  cancelled: "bg-[rgba(185,74,72,0.10)] text-[#a33f3d]",
  active: "bg-[rgba(63,143,107,0.12)] text-[#2f7a58]",
  inactive: "bg-[rgba(41,70,95,0.08)] text-text-light",
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
