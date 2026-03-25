import { NextResponse } from "next/server";
import { z } from "zod";

import { updateOrderStatusAdmin } from "@/features/admin/services/order-admin-service";

const UpdateOrderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "preparing", "shipped", "delivered", "cancelled"]),
  adminNotes: z.string().trim().optional(),
});

type Params = { id: string };

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = UpdateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid status payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await updateOrderStatusAdmin(id, parsed.data.status, parsed.data.adminNotes);

    if (!result.success) {
      const statusCode = result.code === "order_not_found" ? 404 : 400;
      const maybeDetails = "details" in result ? result.details : undefined;
      return NextResponse.json(
        { error: result.code, message: result.message, details: maybeDetails },
        { status: statusCode },
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("PUT /api/admin/pedidos/[id]/estado failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not update order status.",
      },
      { status: 500 },
    );
  }
}
