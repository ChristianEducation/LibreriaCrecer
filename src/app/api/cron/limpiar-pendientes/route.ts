import { and, eq, lt, sql } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/integrations/drizzle";
import { coupons, orders } from "@/integrations/drizzle/schema";

export async function GET(request: NextRequest) {
  // Verificar autorización de Vercel Cron
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Obtener pedidos pending > 24h que serán cancelados
    const expiredOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        couponId: orders.couponId,
      })
      .from(orders)
      .where(
        and(
          eq(orders.status, "pending"),
          lt(orders.createdAt, cutoff),
        ),
      );

    if (expiredOrders.length === 0) {
      return NextResponse.json({ ok: true, cancelled: 0 });
    }

    const orderIds = expiredOrders.map((o) => o.id);
    const couponIds = expiredOrders
      .map((o) => o.couponId)
      .filter((id): id is string => id !== null && id !== undefined);

    await db.transaction(async (tx) => {
      // Cancelar todos los pedidos expirados
      for (const id of orderIds) {
        await tx
          .update(orders)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(orders.id, id));
      }

      // Revertir currentUses de cupones usados
      for (const couponId of couponIds) {
        await tx
          .update(coupons)
          .set({
            currentUses: sql`greatest(${coupons.currentUses} - 1, 0)`,
            updatedAt: new Date(),
          })
          .where(eq(coupons.id, couponId));
      }
    });

    console.warn(`[cron] limpiar-pendientes: cancelados ${expiredOrders.length} pedidos`);

    return NextResponse.json({
      ok: true,
      cancelled: expiredOrders.length,
      orderNumbers: expiredOrders.map((o) => o.orderNumber),
    });
  } catch (error) {
    console.error("[cron] limpiar-pendientes failed:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 },
    );
  }
}
