import { NextResponse } from "next/server";

import { validateNotification } from "@/features/checkout/services/payment-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      requestId?: number | string;
      reference?: string;
      status?: string;
      date?: string;
      signature?: string;
    };

    const result = validateNotification(body);

    // Always acknowledge quickly to avoid repeated retries from provider.
    if (!result.success) {
      return NextResponse.json(
        {
          ok: true,
          accepted: false,
          error: result.code,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        accepted: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/pagos/notificacion failed", error);
    return NextResponse.json(
      {
        ok: true,
        accepted: false,
      },
      { status: 200 },
    );
  }
}
