import { and, asc, count, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";

import { updateOrderStatus } from "@/features/checkout/services/order-service";
import { db } from "@/integrations/drizzle";
import { coupons, orderAddresses, orderCustomers, orderItems, orders } from "@/integrations/drizzle/schema";

type OrderSortBy = "newest" | "oldest" | "total_asc" | "total_desc";
type OrderStatus = "pending" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled";
type DeliveryMethod = "pickup" | "shipping";

type GetOrdersAdminParams = {
  page: number;
  limit: number;
  status?: OrderStatus;
  deliveryMethod?: DeliveryMethod;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: OrderSortBy;
  includePending?: boolean;
};

// "preparing" ya no se usa: despacho pasa directo de "paid" a "shipped"
// (al generar el ticket Chilexpress) y retiro pasa directo de "paid" a
// "delivered" (al entregar el libro). Se conserva como origen valido solo
// como red de seguridad por si un pedido historico quedo en ese estado.
function getAllowedTransitions(status: OrderStatus, deliveryMethod: DeliveryMethod): OrderStatus[] {
  switch (status) {
    case "pending":
      return ["paid", "cancelled"];
    case "paid":
      return deliveryMethod === "pickup" ? ["delivered", "cancelled"] : ["shipped", "cancelled"];
    case "preparing":
      return ["shipped", "delivered", "cancelled"];
    default:
      return [];
  }
}

function getOrderBy(sortBy: OrderSortBy | undefined) {
  switch (sortBy) {
    case "oldest":
      return [asc(orders.createdAt)];
    case "total_asc":
      return [asc(orders.total), desc(orders.createdAt)];
    case "total_desc":
      return [desc(orders.total), desc(orders.createdAt)];
    case "newest":
    default:
      return [desc(orders.createdAt)];
  }
}

export async function getOrdersAdmin(params: GetOrdersAdminParams) {
  const page = Math.max(1, params.page);
  const limit = Math.max(1, params.limit);
  const offset = (page - 1) * limit;

  const filters = [];

  if (params.status) {
    filters.push(eq(orders.status, params.status));
  } else if (!params.includePending) {
    filters.push(inArray(orders.status, ["paid", "preparing", "shipped", "delivered"]));
  }

  if (params.deliveryMethod) {
    filters.push(eq(orders.deliveryMethod, params.deliveryMethod));
  }

  if (params.search?.trim()) {
    const term = `%${params.search.trim()}%`;
    filters.push(or(ilike(orders.orderNumber, term), ilike(orderCustomers.email, term)));
  }

  if (params.dateFrom) {
    filters.push(gte(orders.createdAt, new Date(params.dateFrom)));
  }

  if (params.dateTo) {
    const endDate = new Date(params.dateTo);
    endDate.setHours(23, 59, 59, 999);
    filters.push(lte(orders.createdAt, endDate));
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  const [{ total }] = await db
    .select({ total: count(orders.id) })
    .from(orders)
    .innerJoin(orderCustomers, eq(orderCustomers.orderId, orders.id))
    .where(whereClause);

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
      deliveryMethod: orders.deliveryMethod,
      customerFirstName: orderCustomers.firstName,
      customerLastName: orderCustomers.lastName,
      customerEmail: orderCustomers.email,
    })
    .from(orders)
    .innerJoin(orderCustomers, eq(orderCustomers.orderId, orders.id))
    .where(whereClause)
    .orderBy(...getOrderBy(params.sortBy))
    .limit(limit)
    .offset(offset);

  const totalItems = Number(total);

  return {
    orders: rows.map((row) => ({
      id: row.id,
      orderNumber: row.orderNumber,
      status: row.status as OrderStatus,
      total: row.total,
      createdAt: row.createdAt,
      deliveryMethod: row.deliveryMethod as DeliveryMethod,
      customerName: `${row.customerFirstName} ${row.customerLastName}`.trim(),
      customerEmail: row.customerEmail,
    })),
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages: totalItems === 0 ? 1 : Math.ceil(totalItems / limit),
    },
  };
}

export async function getOrderDetailAdmin(orderId: string) {
  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      subtotal: orders.subtotal,
      shippingCost: orders.shippingCost,
      discountAmount: orders.discountAmount,
      total: orders.total,
      deliveryMethod: orders.deliveryMethod,
      paymentMethod: orders.paymentMethod,
      paymentReference: orders.paymentReference,
      chilexpressServiceTypeCode: orders.chilexpressServiceTypeCode,
      chilexpressServiceDescription: orders.chilexpressServiceDescription,
      chilexpressOriginCoverageCode: orders.chilexpressOriginCoverageCode,
      chilexpressDestinationCoverageCode: orders.chilexpressDestinationCoverageCode,
      chilexpressTransportOrderNumber: orders.chilexpressTransportOrderNumber,
      chilexpressLabelUrl: orders.chilexpressLabelUrl,
      adminNotes: orders.adminNotes,
      couponId: orders.couponId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    return null;
  }

  const [customer] = await db
    .select({
      firstName: orderCustomers.firstName,
      lastName: orderCustomers.lastName,
      email: orderCustomers.email,
      phone: orderCustomers.phone,
    })
    .from(orderCustomers)
    .where(eq(orderCustomers.orderId, order.id))
    .limit(1);

  const [address] = await db
    .select({
      street: orderAddresses.street,
      number: orderAddresses.number,
      apartment: orderAddresses.apartment,
      commune: orderAddresses.commune,
      city: orderAddresses.city,
      region: orderAddresses.region,
      zipCode: orderAddresses.zipCode,
      deliveryInstructions: orderAddresses.deliveryInstructions,
    })
    .from(orderAddresses)
    .where(eq(orderAddresses.orderId, order.id))
    .limit(1);

  const items = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      sku: orderItems.sku,
      productTitle: orderItems.productTitle,
      unitPrice: orderItems.unitPrice,
      quantity: orderItems.quantity,
      subtotal: orderItems.subtotal,
      createdAt: orderItems.createdAt,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.createdAt));

  const [coupon] = order.couponId
    ? await db
        .select({
          id: coupons.id,
          code: coupons.code,
          discountType: coupons.discountType,
          discountValue: coupons.discountValue,
        })
        .from(coupons)
        .where(eq(coupons.id, order.couponId))
        .limit(1)
    : [null];

  const status = order.status as OrderStatus;

  return {
    ...order,
    status,
    deliveryMethod: order.deliveryMethod as DeliveryMethod,
    customer: customer
      ? {
          ...customer,
          fullName: `${customer.firstName} ${customer.lastName}`.trim(),
        }
      : null,
    address: address ?? null,
    items,
    coupon: coupon ?? null,
    paymentHistory: [
      {
        status,
        paymentMethod: order.paymentMethod,
        paymentReference: order.paymentReference,
        date: order.updatedAt,
      },
    ],
    allowedTransitions: getAllowedTransitions(status, order.deliveryMethod as DeliveryMethod),
  };
}

export async function updateOrderStatusAdmin(orderId: string, newStatus: OrderStatus, adminNotes?: string) {
  const result = await updateOrderStatus(orderId, newStatus, adminNotes);
  if (!result.success) {
    return result;
  }

  const detail = await getOrderDetailAdmin(orderId);
  if (!detail) {
    return {
      success: false as const,
      code: "order_not_found",
      message: "Order not found after update.",
    };
  }

  return {
    success: true as const,
    data: detail,
  };
}

export async function getOrderStats() {
  const statusRows = await db
    .select({
      status: orders.status,
      count: count(orders.id),
    })
    .from(orders)
    .groupBy(orders.status);

  const statusCounts = {
    pending: 0,
    paid: 0,
    preparing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  for (const row of statusRows) {
    const key = row.status as keyof typeof statusCounts;
    statusCounts[key] = Number(row.count);
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Ventas del día: se cuentan por fecha de pago real (paidAt), no por fecha de
  // creación del pedido. Un pedido creado ayer y pagado hoy debe sumar hoy.
  const [{ salesToday }] = await db
    .select({
      salesToday: sql<number>`coalesce(sum(${orders.total}), 0)`,
    })
    .from(orders)
    .where(gte(orders.paidAt, startOfDay));

  const [{ paidTodayCount }] = await db
    .select({
      paidTodayCount: count(orders.id),
    })
    .from(orders)
    .where(gte(orders.paidAt, startOfDay));

  // Solo cuenta pedidos que llegaron a pagarse (excluye "pending" — carritos
  // sin pagar — y "cancelled"). Se incluyen paid/shipped/delivered para que
  // el numero no baje cuando un pedido avanza de etapa dentro del mismo mes
  // ("preparing" queda solo por seguridad para pedidos historicos).
  const PAID_ONWARD_STATUSES: OrderStatus[] = ["paid", "preparing", "shipped", "delivered"];

  const [{ ordersThisMonth }] = await db
    .select({
      ordersThisMonth: count(orders.id),
    })
    .from(orders)
    .where(and(inArray(orders.status, PAID_ONWARD_STATUSES), gte(orders.createdAt, startOfMonth)));

  // "Cerrados del mes": pedidos que llegaron a su recorrido final —
  // "shipped" o "delivered" son ambos estados terminales desde que
  // "preparing" quedo obsoleto. Se agrupa por deliveryMethod (no se asume
  // que shipped = despacho y delivered = retiro): un pedido de despacho
  // historico marcado "delivered" antes de este cambio de flujo debe seguir
  // contando como despacho, no como retiro.
  const CLOSED_STATUSES: OrderStatus[] = ["shipped", "delivered"];

  const [{ closedPickupThisMonth }] = await db
    .select({
      closedPickupThisMonth: count(orders.id),
    })
    .from(orders)
    .where(
      and(
        inArray(orders.status, CLOSED_STATUSES),
        eq(orders.deliveryMethod, "pickup"),
        gte(orders.createdAt, startOfMonth),
      ),
    );

  const [{ closedShippingThisMonth }] = await db
    .select({
      closedShippingThisMonth: count(orders.id),
    })
    .from(orders)
    .where(
      and(
        inArray(orders.status, CLOSED_STATUSES),
        eq(orders.deliveryMethod, "shipping"),
        gte(orders.createdAt, startOfMonth),
      ),
    );

  // Desglose de "Por preparar": cuantos pagados esperan generar ticket de
  // despacho vs. cuantos esperan entrega en persona por retiro.
  const [{ paidShippingCount }] = await db
    .select({
      paidShippingCount: count(orders.id),
    })
    .from(orders)
    .where(and(eq(orders.status, "paid"), eq(orders.deliveryMethod, "shipping")));

  const [{ paidPickupCount }] = await db
    .select({
      paidPickupCount: count(orders.id),
    })
    .from(orders)
    .where(and(eq(orders.status, "paid"), eq(orders.deliveryMethod, "pickup")));

  return {
    byStatus: statusCounts,
    salesToday: Number(salesToday),
    paidTodayCount: Number(paidTodayCount),
    ordersThisMonth: Number(ordersThisMonth),
    closedPickupThisMonth: Number(closedPickupThisMonth),
    closedShippingThisMonth: Number(closedShippingThisMonth),
    paidShippingCount: Number(paidShippingCount),
    paidPickupCount: Number(paidPickupCount),
  };
}
