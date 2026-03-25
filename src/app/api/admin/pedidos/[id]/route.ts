import { NextResponse } from "next/server";

import { getOrderDetailAdmin } from "@/features/admin/services/order-admin-service";

type Params = { id: string };

export async function GET(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const detail = await getOrderDetailAdmin(id);

    if (!detail) {
      return NextResponse.json({ error: "not_found", message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ data: detail });
  } catch (error) {
    console.error("GET /api/admin/pedidos/[id] failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not load order detail.",
      },
      { status: 500 },
    );
  }
}
