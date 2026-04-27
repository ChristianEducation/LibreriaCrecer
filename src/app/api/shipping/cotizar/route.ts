import { NextResponse } from "next/server";
import { z } from "zod";

import { calculateShippingCost } from "@/features/checkout/services/shipping-service";

const QuoteShippingSchema = z.object({
  destination: z.object({
    commune: z.string().trim().min(1),
    regionCode: z.string().trim().min(1).optional(),
  }),
  package: z
    .object({
      weightKg: z.number().positive(),
      heightCm: z.number().positive(),
      widthCm: z.number().positive(),
      lengthCm: z.number().positive(),
    })
    .optional(),
  declaredWorth: z.number().int().min(0).optional(),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody.trim()) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Shipping quote payload is required.",
        },
        { status: 400 },
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody) as unknown;
    } catch {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid JSON payload.",
        },
        { status: 400 },
      );
    }

    const parsed = QuoteShippingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid shipping quote payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await calculateShippingCost(parsed.data);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.code,
          message: result.message,
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("POST /api/shipping/cotizar failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not quote shipping.",
      },
      { status: 500 },
    );
  }
}
