import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { coupons, orderAddresses, orderCustomers, orderItems, orders, products } from "@/integrations/drizzle/schema";

import type {
  CreateOrderInput,
  CreateOrderItemInput,
  CreateOrderSuccess,
  OrderDetail,
  OrderStatus,
  ServiceResult,
} from "../types";
import { validateCoupon } from "./coupon-service";
import { decrementStock, validateStock } from "./stock-service";

const MAX_ORDER_NUMBER_ATTEMPTS = 3;
type DbTx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbExecutor = typeof db | DbTx;

const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["preparing", "cancelled"],
  preparing: ["shipped", "delivered"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

class CheckoutServiceError extends Error {
  code: "invalid_coupon" | "stock_insufficient" | "invalid_transition" | "order_not_found" | "validation_error";
  details?: unknown;

  constructor(
    code: "invalid_coupon" | "stock_insufficient" | "invalid_transition" | "order_not_found" | "validation_error",
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

function normalizeItems(items: CreateOrderItemInput[]): CreateOrderItemInput[] {
  const aggregated = new Map<string, number>();

  for (const item of items) {
    const quantity = Math.max(0, Math.trunc(item.quantity));
    if (!item.productId || quantity <= 0) {
      continue;
    }

    aggregated.set(item.productId, (aggregated.get(item.productId) ?? 0) + quantity);
  }

  return Array.from(aggregated.entries()).map(([productId, quantity]) => ({ productId, quantity }));
}

async function generateNextOrderNumber(executor: DbExecutor): Promise<string> {
  const [{ maxSeq }] = await executor
    .select({
      maxSeq: sql<number>`coalesce(max(cast(substring(${orders.orderNumber} from 5) as integer)), 0)`,
    })
    .from(orders);

  const nextValue = Number(maxSeq) + 1;
  return `ORD-${String(nextValue).padStart(4, "0")}`;
}

function isUniqueOrderNumberViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { code?: string; cause?: { code?: string }; message?: string };
  return (
    maybeError.code === "23505" ||
    maybeError.cause?.code === "23505" ||
    maybeError.message?.includes("orders_order_number_unique") === true
  );
}

function toServiceErrorResult(error: unknown): ServiceResult<never> {
  if (error instanceof CheckoutServiceError) {
    return {
      success: false,
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  return {
    success: false,
    code: "validation_error",
    message: "Unexpected error processing order.",
  };
}

async function getOrderDetailByWhere(
  whereClause: ReturnType<typeof eq>,
): Promise<OrderDetail | null> {
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
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .where(whereClause)
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

  const itemRows = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      sku: orderItems.sku,
      productTitle: orderItems.productTitle,
      unitPrice: orderItems.unitPrice,
      quantity: orderItems.quantity,
      subtotal: orderItems.subtotal,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(desc(orderItems.createdAt));

  if (!customer) {
    return null;
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status as OrderStatus,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    discountAmount: order.discountAmount,
    total: order.total,
    deliveryMethod: order.deliveryMethod as "pickup" | "shipping",
    paymentMethod: order.paymentMethod,
    paymentReference: order.paymentReference,
    adminNotes: order.adminNotes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: itemRows,
    customer,
    address: address ?? null,
  };
}

export async function createOrder(data: CreateOrderInput): Promise<ServiceResult<CreateOrderSuccess>> {
  const normalizedItems = normalizeItems(data.items);
  if (normalizedItems.length === 0) {
    return {
      success: false,
      code: "validation_error",
      message: "Order must contain at least one valid item.",
    };
  }

  for (let attempt = 1; attempt <= MAX_ORDER_NUMBER_ATTEMPTS; attempt += 1) {
    try {
      const result = await db.transaction(async (tx) => {
        const stockValidation = await validateStock(normalizedItems, tx);
        if (!stockValidation.valid) {
          throw new CheckoutServiceError(
            "stock_insufficient",
            "One or more products do not have enough stock.",
            stockValidation.errors,
          );
        }

        const productIds = normalizedItems.map((item) => item.productId);
        const productRows = await tx
          .select({
            id: products.id,
            title: products.title,
            sku: products.sku,
            price: products.price,
            salePrice: products.salePrice,
          })
          .from(products)
          .where(and(inArray(products.id, productIds), eq(products.isActive, true)));

        if (productRows.length !== productIds.length) {
          throw new CheckoutServiceError(
            "validation_error",
            "Some products are missing or inactive.",
          );
        }

        const productMap = new Map(productRows.map((product) => [product.id, product]));

        const subtotal = normalizedItems.reduce((sum, item) => {
          const product = productMap.get(item.productId);
          if (!product) {
            return sum;
          }
          const effectivePrice = product.salePrice !== null ? product.salePrice : product.price;
          return sum + effectivePrice * item.quantity;
        }, 0);

        let discountAmount = 0;
        let couponId: string | null = null;
        if (data.couponCode) {
          const couponValidation = await validateCoupon(data.couponCode, subtotal, tx);
          if (!couponValidation.valid) {
            throw new CheckoutServiceError(
              "invalid_coupon",
              couponValidation.error ?? "Invalid coupon.",
            );
          }
          discountAmount = couponValidation.discount;
          couponId = couponValidation.couponId ?? null;
        }

        const shippingCost = 0;
        const total = Math.max(0, subtotal - discountAmount + shippingCost);
        const orderNumber = await generateNextOrderNumber(tx);

        const [createdOrder] = await tx
          .insert(orders)
          .values({
            orderNumber,
            status: "pending",
            subtotal,
            shippingCost,
            total,
            deliveryMethod: data.deliveryMethod,
            couponId,
            discountAmount,
          })
          .returning({
            id: orders.id,
            orderNumber: orders.orderNumber,
            total: orders.total,
            status: orders.status,
          });

        await tx.insert(orderItems).values(
          normalizedItems.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) {
              throw new CheckoutServiceError("validation_error", "Invalid product in order items.");
            }

            const unitPrice = product.salePrice !== null ? product.salePrice : product.price;
            return {
              orderId: createdOrder.id,
              productId: product.id,
              sku: product.sku,
              productTitle: product.title,
              unitPrice,
              quantity: item.quantity,
              subtotal: unitPrice * item.quantity,
            };
          }),
        );

        await tx.insert(orderCustomers).values({
          orderId: createdOrder.id,
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          email: data.customer.email,
          phone: data.customer.phone,
        });

        if (data.deliveryMethod === "shipping") {
          if (!data.address) {
            throw new CheckoutServiceError(
              "validation_error",
              "Shipping orders require an address.",
            );
          }

          await tx.insert(orderAddresses).values({
            orderId: createdOrder.id,
            street: data.address.street,
            number: data.address.number,
            apartment: data.address.apartment,
            commune: data.address.commune,
            city: data.address.city,
            region: data.address.region,
            zipCode: data.address.zipCode,
            deliveryInstructions: data.address.deliveryInstructions,
          });
        }

        const decrementResult = await decrementStock(normalizedItems, tx);
        if (!decrementResult.valid) {
          throw new CheckoutServiceError(
            "stock_insufficient",
            "Stock changed during checkout.",
            decrementResult.errors,
          );
        }

        if (couponId) {
          await tx
            .update(coupons)
            .set({
              currentUses: sql`${coupons.currentUses} + 1`,
              updatedAt: new Date(),
            })
            .where(eq(coupons.id, couponId));
        }

        return {
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          total: createdOrder.total,
          status: createdOrder.status as OrderStatus,
        };
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (isUniqueOrderNumberViolation(error) && attempt < MAX_ORDER_NUMBER_ATTEMPTS) {
        continue;
      }

      return toServiceErrorResult(error);
    }
  }

  return {
    success: false,
    code: "validation_error",
    message: "Could not generate a unique order number.",
  };
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDetail | null> {
  return getOrderDetailByWhere(eq(orders.orderNumber, orderNumber));
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  return getOrderDetailByWhere(eq(orders.id, id));
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  adminNotes?: string,
): Promise<ServiceResult<{ id: string; status: OrderStatus }>> {
  try {
    const [currentOrder] = await db
      .select({
        id: orders.id,
        status: orders.status,
        deliveryMethod: orders.deliveryMethod,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!currentOrder) {
      return { success: false, code: "order_not_found", message: "Order not found." };
    }

    const fromStatus = currentOrder.status as OrderStatus;
    const allowedTransitions = VALID_STATUS_TRANSITIONS[fromStatus] ?? [];
    if (!allowedTransitions.includes(status)) {
      return {
        success: false,
        code: "invalid_transition",
        message: `Cannot transition order from ${fromStatus} to ${status}.`,
      };
    }

    if (fromStatus === "preparing" && status === "shipped" && currentOrder.deliveryMethod !== "shipping") {
      return {
        success: false,
        code: "invalid_transition",
        message: "Only shipping orders can transition to shipped.",
      };
    }

    if (fromStatus === "preparing" && status === "delivered" && currentOrder.deliveryMethod !== "pickup") {
      return {
        success: false,
        code: "invalid_transition",
        message: "Shipping orders must transition to shipped before delivered.",
      };
    }

    const [updated] = await db
      .update(orders)
      .set({
        status,
        adminNotes: adminNotes ?? null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning({
        id: orders.id,
        status: orders.status,
      });

    return {
      success: true,
      data: {
        id: updated.id,
        status: updated.status as OrderStatus,
      },
    };
  } catch {
    return {
      success: false,
      code: "validation_error",
      message: "Could not update order status.",
    };
  }
}

export async function updatePaymentInfo(
  orderId: string,
  paymentMethod: string,
  paymentReference: string,
): Promise<ServiceResult<{ id: string; status: OrderStatus }>> {
  try {
    const [updated] = await db
      .update(orders)
      .set({
        paymentMethod,
        paymentReference,
        status: "paid",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning({
        id: orders.id,
        status: orders.status,
      });

    if (!updated) {
      return { success: false, code: "order_not_found", message: "Order not found." };
    }

    return {
      success: true,
      data: {
        id: updated.id,
        status: updated.status as OrderStatus,
      },
    };
  } catch {
    return {
      success: false,
      code: "validation_error",
      message: "Could not update payment info.",
    };
  }
}
