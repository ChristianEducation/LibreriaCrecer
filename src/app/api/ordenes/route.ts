import { NextResponse } from "next/server";

import { CreateOrderSchema } from "@/features/checkout/schemas";
import { createOrder } from "@/features/checkout/services/order-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid order payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await createOrder(parsed.data);

    if (!result.success) {
      if (result.code === "stock_insufficient") {
        return NextResponse.json(
          {
            error: "stock_insufficient",
            details: result.details ?? [],
          },
          { status: 409 },
        );
      }

      if (result.code === "invalid_coupon") {
        return NextResponse.json(
          {
            error: "invalid_coupon",
            message: result.message,
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error: result.code,
          message: result.message,
          details: result.details,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        data: {
          orderNumber: result.data.orderNumber,
          orderId: result.data.orderId,
          total: result.data.total,
          status: result.data.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/ordenes failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not create order.",
      },
      { status: 500 },
    );
  }
}
