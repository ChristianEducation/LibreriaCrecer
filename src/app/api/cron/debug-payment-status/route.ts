import { NextResponse, type NextRequest } from "next/server";

import { getPaymentStatus } from "@/integrations/payments/getnet/client";
import { getGetnetSessionStatus } from "@/integrations/payments/getnet/types";

// Ruta temporal de solo lectura para diagnostico manual.
// No modifica la base de datos ni dispara emails. Borrar despues de usar.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestIdParam = request.nextUrl.searchParams.get("requestId");
  const requestId = requestIdParam ? Number(requestIdParam) : NaN;

  if (!Number.isInteger(requestId) || requestId <= 0) {
    return NextResponse.json({ error: "invalid_request_id" }, { status: 400 });
  }

  try {
    const paymentInfo = await getPaymentStatus(requestId);
    const status = getGetnetSessionStatus(paymentInfo);

    return NextResponse.json({ ok: true, status, raw: paymentInfo });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown_error" },
      { status: 502 },
    );
  }
}
