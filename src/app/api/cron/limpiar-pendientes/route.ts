import { and, asc, eq, isNotNull, isNull, lt, sql } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import { processPaymentResult } from "@/features/checkout/services/payment-service";
import { db } from "@/integrations/drizzle";
import { coupons, orders } from "@/integrations/drizzle/schema";
import { sendPaymentAlertEmail } from "@/integrations/email";
import { buildAdminOrderUrl } from "@/integrations/email/config";

const MAX_RECONCILIATIONS_PER_RUN = 20;
const ORPHAN_ORDER_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const STUCK_PENDING_ALERT_AGE_MS = 24 * 60 * 60 * 1000;

const ALERTABLE_ERROR_CODES = new Set(["payment_data_mismatch", "provider_error"]);

function parseRequestId(value: string | null): number | null {
  if (!value) return null;
  const requestId = Number(value);
  return Number.isInteger(requestId) && requestId > 0 ? requestId : null;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pendingOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        paymentReference: orders.paymentReference,
      })
      .from(orders)
      .where(and(eq(orders.status, "pending"), isNotNull(orders.paymentReference)))
      .orderBy(asc(orders.createdAt))
      .limit(MAX_RECONCILIATIONS_PER_RUN);

    const reconciliation = {
      checked: 0,
      paid: [] as string[],
      cancelled: [] as string[],
      pending: [] as string[],
      errors: [] as Array<{ orderId: string; orderNumber: string; code: string }>,
    };

    for (const order of pendingOrders) {
      const requestId = parseRequestId(order.paymentReference);
      if (!requestId) continue;

      reconciliation.checked += 1;
      const result = await processPaymentResult(requestId, {
        expectedOrderNumber: order.orderNumber,
      });

      if (!result.success) {
        reconciliation.errors.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          code: result.code,
        });
        continue;
      }

      if (result.data.status === "paid") {
        reconciliation.paid.push(order.orderNumber);
      } else if (result.data.status === "cancelled") {
        reconciliation.cancelled.push(order.orderNumber);
      } else {
        reconciliation.pending.push(order.orderNumber);
      }
    }

    const cutoff = new Date(Date.now() - ORPHAN_ORDER_MAX_AGE_MS);
    const orphanOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        couponId: orders.couponId,
      })
      .from(orders)
      .where(
        and(
          eq(orders.status, "pending"),
          isNull(orders.paymentReference),
          lt(orders.createdAt, cutoff),
        ),
      )
      .limit(MAX_RECONCILIATIONS_PER_RUN);

    const orphanOrdersCancelled: string[] = [];

    await db.transaction(async (tx) => {
      for (const order of orphanOrders) {
        const [cancelledOrder] = await tx
          .update(orders)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
          .returning({ id: orders.id });

        if (!cancelledOrder) continue;
        orphanOrdersCancelled.push(order.orderNumber);

        if (order.couponId) {
          await tx
            .update(coupons)
            .set({
              currentUses: sql`greatest(${coupons.currentUses} - 1, 0)`,
              updatedAt: new Date(),
            })
            .where(eq(coupons.id, order.couponId));
        }
      }
    });

    const alertableErrors = reconciliation.errors.filter((error) =>
      ALERTABLE_ERROR_CODES.has(error.code),
    );

    for (const error of alertableErrors) {
      await sendPaymentAlertEmail({
        orderNumber: error.orderNumber,
        reason:
          error.code === "payment_data_mismatch"
            ? "Los datos del pago no coinciden con el pedido"
            : "Error al consultar el estado del pago en Getnet",
        detail: `code: ${error.code}`,
        adminOrderUrl: buildAdminOrderUrl(error.orderId),
      });
    }

    const alertedOrderNumbers = new Set(alertableErrors.map((error) => error.orderNumber));
    const stuckCutoff = new Date(Date.now() - STUCK_PENDING_ALERT_AGE_MS);
    const stuckOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
      })
      .from(orders)
      .where(
        and(
          eq(orders.status, "pending"),
          isNotNull(orders.paymentReference),
          lt(orders.createdAt, stuckCutoff),
        ),
      )
      .limit(MAX_RECONCILIATIONS_PER_RUN);

    for (const order of stuckOrders) {
      if (alertedOrderNumbers.has(order.orderNumber)) continue;
      await sendPaymentAlertEmail({
        orderNumber: order.orderNumber,
        reason: "Pedido con pago iniciado lleva más de 24 horas sin resolverse",
        detail: "Sin errores explícitos en la reconciliación automática",
        adminOrderUrl: buildAdminOrderUrl(order.id),
      });
    }

    console.warn("[cron] Getnet reconciliation completed", {
      checked: reconciliation.checked,
      paid: reconciliation.paid.length,
      cancelled: reconciliation.cancelled.length,
      stillPending: reconciliation.pending.length,
      errors: reconciliation.errors.length,
      orphanOrdersCancelled: orphanOrdersCancelled.length,
    });

    return NextResponse.json({
      ok: true,
      reconciliation,
      orphanOrdersCancelled,
    });
  } catch (error) {
    console.error("[cron] Getnet reconciliation failed", { error });
    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
