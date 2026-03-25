import { NextResponse } from "next/server";

import { getOrderStats } from "@/features/admin/services/order-admin-service";

export async function GET() {
  try {
    const stats = await getOrderStats();
    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("GET /api/admin/pedidos/stats failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not load order stats.",
      },
      { status: 500 },
    );
  }
}
