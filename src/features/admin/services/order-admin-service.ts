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
};

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["preparing", "cancelled"],
  preparing: ["shipped", "delivered"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

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
    allowedTransitions: STATUS_TRANSITIONS[status] ?? [],
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

  const salesStatuses: OrderStatus[] = ["paid", "preparing", "shipped", "delivered"];

  const [{ salesToday }] = await db
    .select({
      salesToday: sql<number>`coalesce(sum(${orders.total}), 0)`,
    })
    .from(orders)
    .where(and(inArray(orders.status, salesStatuses), gte(orders.createdAt, startOfDay)));

  const [{ paidTodayCount }] = await db
    .select({
      paidTodayCount: count(orders.id),
    })
    .from(orders)
    .where(and(eq(orders.status, "paid"), gte(orders.createdAt, startOfDay)));

  const [{ ordersThisMonth }] = await db
    .select({
      ordersThisMonth: count(orders.id),
    })
    .from(orders)
    .where(gte(orders.createdAt, startOfMonth));

  return {
    byStatus: statusCounts,
    salesToday: Number(salesToday),
    paidTodayCount: Number(paidTodayCount),
    ordersThisMonth: Number(ordersThisMonth),
  };
}
