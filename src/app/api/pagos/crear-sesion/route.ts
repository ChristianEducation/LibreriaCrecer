import { NextResponse } from "next/server";
import { z } from "zod";

import { initializePayment } from "@/features/checkout/services/payment-service";

const CreatePaymentSessionSchema = z.object({
  orderId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreatePaymentSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid payment session payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await initializePayment(parsed.data.orderId, {
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1",
      userAgent: request.headers.get("user-agent") ?? "CrecerLibreria/1.0",
    });

    if (!result.success) {
      const status = result.code === "order_not_found" ? 404 : 400;
      return NextResponse.json(
        {
          error: result.code,
          message: result.message,
        },
        { status },
      );
    }

    return NextResponse.json({
      data: {
        processUrl: result.data.processUrl,
        requestId: result.data.requestId,
      },
    });
  } catch (error) {
    console.error("POST /api/pagos/crear-sesion failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not create payment session.",
      },
      { status: 500 },
    );
  }
}
