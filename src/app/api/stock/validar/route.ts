import { NextResponse } from "next/server";

import { ValidateStockSchema } from "@/features/checkout/schemas";
import { validateStock } from "@/features/checkout/services/stock-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ValidateStockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid stock validation payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await validateStock(parsed.data.items);

    return NextResponse.json({
      data: {
        valid: result.valid,
        errors: result.errors.length > 0 ? result.errors : undefined,
      },
    });
  } catch (error) {
    console.error("POST /api/stock/validar failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not validate stock.",
      },
      { status: 500 },
    );
  }
}
