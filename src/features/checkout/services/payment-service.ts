import { and, eq, sql } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import {
  coupons,
  orderAddresses,
  orderCustomers,
  orderItems,
  orders,
} from "@/integrations/drizzle/schema";
import {
  assertGetnetRuntimeConfig,
  createPaymentSession,
  getGetnetCancelUrl,
  getGetnetReturnUrl,
  getGetnetSessionStatus,
  getPaymentStatus,
  getnetConfig,
  mapGetnetStatusToInternal,
  verifyGetnetNotification,
  type GetnetNotificationPayload,
  type GetnetSessionStatus,
} from "@/integrations/payments/getnet";
import { sendOrderConfirmationEmail } from "@/integrations/email";

import type { OrderStatus, ServiceResult } from "../types";
import { decrementStock } from "./stock-service";

type ProcessPaymentResult = {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: GetnetSessionStatus | "UNKNOWN";
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

function buildPaymentNotes(input: {
  authorization?: string;
  receipt?: string;
  existingNotes?: string | null;
}) {
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

    if (
      session.status?.status !== "OK" ||
      !Number.isInteger(session.requestId) ||
      !session.processUrl
    ) {
      throw new Error("Getnet returned an invalid session response.");
    }

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
  options?: {
    expectedOrderNumber?: string;
    notificationStatus?: GetnetSessionStatus;
  },
): Promise<ServiceResult<ProcessPaymentResult>> {
  try {
    const [order] = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        total: orders.total,
        couponId: orders.couponId,
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

    if (options?.expectedOrderNumber && options.expectedOrderNumber !== order.orderNumber) {
      return {
        success: false,
        code: "payment_reference_mismatch",
        message: "The notification reference does not match the order.",
      };
    }

    const paymentInfo = await getPaymentStatus(requestId);
    const paymentStatus = getGetnetSessionStatus(paymentInfo) ?? "UNKNOWN";
    const mappedStatus = mapGetnetStatusToInternal(
      paymentStatus === "UNKNOWN" ? undefined : paymentStatus,
    );
    const paymentEntry =
      paymentInfo.payment?.find((payment) => payment.status?.status === paymentStatus) ??
      paymentInfo.payment?.[0];
    const providerReference = paymentEntry?.reference ?? paymentInfo.request?.payment?.reference;
    const providerAmount =
      paymentEntry?.amount?.from?.total ?? paymentInfo.request?.payment?.amount?.total;
    const providerCurrency =
      paymentEntry?.amount?.from?.currency ?? paymentInfo.request?.payment?.amount?.currency;

    if (
      paymentInfo.requestId !== requestId ||
      providerReference !== order.orderNumber ||
      providerAmount !== order.total ||
      providerCurrency !== "CLP"
    ) {
      console.error("[payments] Getnet data mismatch", {
        requestId,
        orderNumber: order.orderNumber,
        providerReference,
        providerAmount,
        providerCurrency,
      });
      return {
        success: false,
        code: "payment_data_mismatch",
        message: "Getnet payment data does not match the order.",
      };
    }

    if (options?.notificationStatus && options.notificationStatus !== paymentStatus) {
      console.warn("[payments] Notification status differs from Getnet query", {
        requestId,
        orderNumber: order.orderNumber,
        notificationStatus: options.notificationStatus,
        queriedStatus: paymentStatus,
      });
      return {
        success: false,
        code: "provider_error",
        message: "Getnet notification status has not been confirmed yet.",
      };
    }
    if (mappedStatus === "paid") {
      const firstPayment =
        paymentInfo.payment?.find((payment) => payment.status?.status === "APPROVED") ??
        paymentInfo.payment?.[0];
      const paymentMethod =
        firstPayment?.franchise ??
        firstPayment?.paymentMethod ??
        firstPayment?.processorFields?.paymentMethod ??
        "getnet";
      const authorization =
        firstPayment?.authorization ?? firstPayment?.processorFields?.authorization;
      const receipt = firstPayment?.receipt ?? firstPayment?.processorFields?.receipt;

      let wasAlreadyProcessed = false;

      await db.transaction(async (tx) => {
        // Guard: solo proceder si la orden sigue en "pending"
        const [currentOrder] = await tx
          .select({ id: orders.id, adminNotes: orders.adminNotes })
          .from(orders)
          .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
          .for("update")
          .limit(1);

        if (!currentOrder) {
          // Ya fue procesada (ej: webhook llego primero). No hacer nada.
          wasAlreadyProcessed = true;
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
        const validItemRows = itemRows.filter(
          (r): r is { productId: string; quantity: number } => r.productId !== null,
        );
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

      if (!wasAlreadyProcessed) {
        // SELECT order data for email
        const [fullOrder] = await db
          .select({
            subtotal: orders.subtotal,
            shippingCost: orders.shippingCost,
            total: orders.total,
            deliveryMethod: orders.deliveryMethod,
          })
          .from(orders)
          .where(eq(orders.id, order.id))
          .limit(1);

        const [customer] = await db
          .select({
            firstName: orderCustomers.firstName,
            lastName: orderCustomers.lastName,
            email: orderCustomers.email,
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
          })
          .from(orderAddresses)
          .where(eq(orderAddresses.orderId, order.id))
          .limit(1);

        const items = await db
          .select({
            productTitle: orderItems.productTitle,
            quantity: orderItems.quantity,
            unitPrice: orderItems.unitPrice,
            subtotal: orderItems.subtotal,
          })
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        if (fullOrder && customer) {
          await sendOrderConfirmationEmail({
            toEmail: customer.email,
            orderNumber: order.orderNumber,
            customerName: customer.firstName,
            items,
            subtotal: fullOrder.subtotal,
            shippingCost: fullOrder.shippingCost,
            total: fullOrder.total,
            deliveryMethod: fullOrder.deliveryMethod,
            address,
          });
        }
      }

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
      let wasCancelled = false;

      if (order.status === "pending") {
        await db.transaction(async (tx) => {
          const [cancelledOrder] = await tx
            .update(orders)
            .set({
              status: "cancelled",
              paymentReference: String(requestId),
              updatedAt: new Date(),
            })
            .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
            .returning({ id: orders.id });

          if (!cancelledOrder) return;
          wasCancelled = true;

          if (order.couponId) {
            await tx
              .update(coupons)
              .set({
                currentUses: sql`greatest(${coupons.currentUses} - 1, 0)`,
                updatedAt: new Date(),
              })
              .where(eq(coupons.id, order.couponId));
          }
        });
      }

      return {
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status:
            order.status === "paid"
              ? "paid"
              : wasCancelled || order.status === "cancelled"
                ? "cancelled"
                : (order.status as OrderStatus),
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
  } catch (error) {
    console.error("[payments] Could not process Getnet result", { requestId, error });
    return {
      success: false,
      code: "provider_error",
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

export async function processGetnetNotification(
  body: GetnetNotificationPayload,
): Promise<ServiceResult<{ accepted: boolean; orderNumber: string }>> {
  assertGetnetRuntimeConfig();
  const notification = verifyGetnetNotification(body, getnetConfig.secretKey);

  if (!notification.success) {
    return {
      success: false,
      code: notification.code,
      message: "Invalid Getnet notification.",
    };
  }

  const result = await processPaymentResult(notification.data.requestId, {
    expectedOrderNumber: notification.data.reference,
    notificationStatus: notification.data.status,
  });

  if (!result.success) return result;

  console.warn("[payments] Getnet notification processed", {
    requestId: notification.data.requestId,
    orderNumber: result.data.orderNumber,
    notificationStatus: notification.data.status,
    paymentStatus: result.data.paymentStatus,
    orderStatus: result.data.status,
  });

  return {
    success: true,
    data: { accepted: true, orderNumber: result.data.orderNumber },
  };
}
