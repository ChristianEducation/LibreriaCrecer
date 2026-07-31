export const ADMIN_SESSION_COOKIE = "admin-session";
export const ADMIN_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;

export const ORDER_STATUS_LABELS: Record<
  "pending" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled",
  string
> = {
  pending: "Pendiente",
  paid: "Pagado",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};
