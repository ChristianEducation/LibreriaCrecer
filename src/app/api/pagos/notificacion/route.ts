import { NextResponse } from "next/server";

import { processGetnetNotification } from "@/features/checkout/services/payment-service";
import type { GetnetNotificationPayload } from "@/integrations/payments/getnet";

const INVALID_NOTIFICATION_CODES = new Set(["invalid_payload", "invalid_signature"]);
const DATA_MISMATCH_CODES = new Set(["payment_reference_mismatch", "payment_data_mismatch"]);

export async function POST(request: Request) {
  let body: GetnetNotificationPayload;

  try {
    body = (await request.json()) as GetnetNotificationPayload;
  } catch {
    console.warn("[payments] Getnet notification rejected", { reason: "invalid_json" });
    return NextResponse.json({ ok: false, accepted: false }, { status: 400 });
  }

  try {
    const result = await processGetnetNotification(body);

    if (!result.success) {
      const status = INVALID_NOTIFICATION_CODES.has(result.code)
        ? 400
        : DATA_MISMATCH_CODES.has(result.code)
          ? 409
          : 503;

      console.warn("[payments] Getnet notification not processed", {
        requestId: body.requestId ?? null,
        reference: body.reference ?? null,
        code: result.code,
      });

      return NextResponse.json({ ok: false, accepted: false, error: result.code }, { status });
    }

    return NextResponse.json({
      ok: true,
      accepted: true,
      orderNumber: result.data.orderNumber,
    });
  } catch (error) {
    console.error("[payments] Getnet notification failed", {
      requestId: body.requestId ?? null,
      reference: body.reference ?? null,
      error,
    });
    return NextResponse.json({ ok: false, accepted: false }, { status: 503 });
  }
}
