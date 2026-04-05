import { createHash } from "crypto";
import { and, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { orderCustomers, orderItems, orders } from "@/integrations/drizzle/schema";
import {
  createPaymentSession,
  getGetnetCancelUrl,
  getGetnetReturnUrl,
  getPaymentStatus,
  getnetConfig,
  mapGetnetStatusToInternal,
  type GetnetSessionStatus,
} from "@/integrations/payments/getnet";

import type { OrderStatus, ServiceResult } from "../types";
import { decrementStock } from "./stock-service";

type ProcessPaymentResult = {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: GetnetSessionStatus | "UNKNOWN";
};

type NotificationPayload = {
  requestId?: number | string;
  reference?: string;
  status?: string;
  date?: string;
  signature?: string;
};

function parseRequestId(value: string | number | undefined): number | null {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }

  return null;
}

function buildPaymentNotes(input: { authorization?: string; receipt?: string; existingNotes?: string | null }) {
  const chunks = [input.existingNotes?.trim()].filter(Boolean);
  if (input.authorization) {
    chunks.push(`getnet_authorization:${input.authorization}`);
  }
  if (input.receipt) {
    chunks.push(`getnet_receipt:${input.receipt}`);
  }
  return chunks.join(" | ").slice(0, 4000);
}

export async function initializePayment(
  orderId: string,
  metadata?: { ipAddress?: string; userAgent?: string },
): Promise<ServiceResult<{ processUrl: string; requestId: number }>> {
  try {
    const [order] = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        total: orders.total,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return { success: false, code: "order_not_found", message: "Order not found." };
    }

    if (order.status !== "pending") {
      return {
        success: false,
        code: "validation_error",
        message: "Only pending orders can initialize payment.",
      };
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

    if (!customer) {
      return {
        success: false,
        code: "validation_error",
        message: "Order customer data not found.",
      };
    }

    const session = await createPaymentSession({
      reference: order.orderNumber,
      description: `Pago pedido ${order.orderNumber}`,
      amount: order.total,
      buyer: {
        name: customer.firstName,
        surname: customer.lastName,
        email: customer.email,
        mobile: customer.phone,
      },
      returnUrl: getGetnetReturnUrl(order.orderNumber),
      cancelUrl: getGetnetCancelUrl(order.orderNumber),
      ipAddress: metadata?.ipAddress ?? "127.0.0.1",
      userAgent: metadata?.userAgent ?? "CrecerLibreria/1.0",
    });

    await db
      .update(orders)
      .set({
        paymentReference: String(session.requestId),
        paymentMethod: "getnet",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    return {
      success: true,
      data: {
        processUrl: session.processUrl,
        requestId: session.requestId,
      },
    };
  } catch (error) {
    console.error("initializePayment failed:", error);
    return {
      success: false,
      code: "validation_error",
      message: "Could not initialize payment session.",
    };
  }
}

export async function processPaymentResult(
  requestId: number,
): Promise<ServiceResult<ProcessPaymentResult>> {
  try {
    const [order] = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        adminNotes: orders.adminNotes,
      })
      .from(orders)
      .where(eq(orders.paymentReference, String(requestId)))
      .limit(1);

    if (!order) {
      return {
        success: false,
        code: "order_not_found",
        message: "Order associated to payment request was not found.",
      };
    }

    const paymentInfo = await getPaymentStatus(requestId);
    const paymentStatus =
      paymentInfo.request?.status?.status ?? paymentInfo.payment?.[0]?.status?.status ?? "UNKNOWN";
    const mappedStatus = mapGetnetStatusToInternal(
      paymentStatus === "UNKNOWN" ? undefined : paymentStatus,
    );

    if (mappedStatus === "paid") {
      const firstPayment = paymentInfo.payment?.[0];
      const paymentMethod =
        firstPayment?.franchise ??
        firstPayment?.paymentMethod ??
        firstPayment?.processorFields?.paymentMethod ??
        "getnet";
      const authorization =
        firstPayment?.authorization ?? firstPayment?.processorFields?.authorization;
      const receipt = firstPayment?.receipt ?? firstPayment?.processorFields?.receipt;

      await db.transaction(async (tx) => {
        // Guard: solo proceder si la orden sigue en "pending"
        const [currentOrder] = await tx
          .select({ id: orders.id, adminNotes: orders.adminNotes })
          .from(orders)
          .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
          .limit(1);

        if (!currentOrder) {
          // Ya fue procesada (ej: webhook llegó primero). No hacer nada.
          return;
        }

        // Obtener items para descontar stock
        const itemRows = await tx
          .select({
            productId: orderItems.productId,
            quantity: orderItems.quantity,
          })
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        // Descontar stock (best-effort: el pago ya fue confirmado, no lanzar error)
        const validItemRows = itemRows.filter((r): r is { productId: string; quantity: number } => r.productId !== null);
        if (validItemRows.length > 0) {
          try {
            await decrementStock(validItemRows, tx);
          } catch (stockError) {
            console.error(`Stock decrement failed for order ${order.id}:`, stockError);
          }
        }

        await tx
          .update(orders)
          .set({
            status: "paid",
            paymentMethod,
            paymentReference: String(requestId),
            adminNotes: buildPaymentNotes({
              authorization,
              receipt,
              existingNotes: currentOrder.adminNotes,
            }),
            updatedAt: new Date(),
          })
          .where(eq(orders.id, order.id));
      });

      return {
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status: "paid",
          paymentStatus,
        },
      };
    }

    if (mappedStatus === "cancelled") {
      if (order.status === "pending" || order.status === "paid") {
        await db
          .update(orders)
          .set({
            status: "cancelled",
            paymentReference: String(requestId),
            updatedAt: new Date(),
          })
          .where(eq(orders.id, order.id));
      }

      return {
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status: "cancelled",
          paymentStatus,
        },
      };
    }

    return {
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status as OrderStatus,
        paymentStatus,
      },
    };
  } catch {
    return {
      success: false,
      code: "validation_error",
      message: "Could not process payment result.",
    };
  }
}

export async function processPaymentResultByOrderNumber(
  orderNumber: string,
): Promise<ServiceResult<ProcessPaymentResult>> {
  const [order] = await db
    .select({
      paymentReference: orders.paymentReference,
    })
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) {
    return { success: false, code: "order_not_found", message: "Order not found." };
  }

  const requestId = parseRequestId(order.paymentReference ?? undefined);
  if (!requestId) {
    return {
      success: false,
      code: "validation_error",
      message: "Order does not have an initialized payment session.",
    };
  }

  return processPaymentResult(requestId);
}

export function validateNotification(body: NotificationPayload): ServiceResult<{ accepted: boolean }> {
  const requestId = parseRequestId(body.requestId);
  const status = body.status;
  const date = body.date;
  const signature = body.signature;

  if (!requestId || !status || !date || !signature) {
    return {
      success: false,
      code: "validation_error",
      message: "Invalid notification payload.",
    };
  }

  const expectedSignature = createHash("sha1")
    .update(`${requestId}${status}${date}${getnetConfig.secretKey}`)
    .digest("hex");

  const isValid = expectedSignature.toLowerCase() === signature.toLowerCase();
  if (!isValid) {
    return {
      success: false,
      code: "validation_error",
      message: "Invalid notification signature.",
    };
  }

  // Non-blocking update to keep webhook response fast.
  void processPaymentResult(requestId);

  return {
    success: true,
    data: { accepted: true },
  };
}
