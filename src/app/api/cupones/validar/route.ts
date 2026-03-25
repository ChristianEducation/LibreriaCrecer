import { NextResponse } from "next/server";

import { ValidateCouponSchema } from "@/features/checkout/schemas";
import { validateCoupon } from "@/features/checkout/services/coupon-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ValidateCouponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid coupon validation payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await validateCoupon(parsed.data.code, parsed.data.subtotal);

    return NextResponse.json({
      data: {
        valid: result.valid,
        discount: result.discount,
        couponCode: result.couponCode ?? parsed.data.code.toUpperCase(),
        error: result.error,
      },
    });
  } catch (error) {
    console.error("POST /api/cupones/validar failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not validate coupon.",
      },
      { status: 500 },
    );
  }
}
