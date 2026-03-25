import { NextResponse } from "next/server";

import { getOrderByNumber } from "@/features/checkout/services/order-service";

type Params = {
  orderNumber: string;
};

export async function GET(_: Request, context: { params: Promise<Params> }) {
  try {
    const { orderNumber } = await context.params;
    const order = await getOrderByNumber(orderNumber);

    if (!order) {
      return NextResponse.json(
        {
          error: "not_found",
          message: "Order not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: order,
    });
  } catch (error) {
    console.error("GET /api/ordenes/[orderNumber] failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not load order.",
      },
      { status: 500 },
    );
  }
}
