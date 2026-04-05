import { NextResponse, type NextRequest } from "next/server";

import { getOrdersAdmin } from "@/features/admin/services/order-admin-service";

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;
    const result = await getOrdersAdmin({
      page: parsePositiveInt(query.get("page"), 1),
      limit: parsePositiveInt(query.get("limit"), 20),
      status: (query.get("status") as
        | "pending"
        | "paid"
        | "preparing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | null) ?? undefined,
      deliveryMethod: (query.get("deliveryMethod") as "pickup" | "shipping" | null) ?? undefined,
      search: query.get("search") ?? undefined,
      dateFrom: query.get("dateFrom") ?? undefined,
      dateTo: query.get("dateTo") ?? undefined,
      sortBy: (query.get("sortBy") as "newest" | "oldest" | "total_asc" | "total_desc" | null) ?? undefined,
      includePending: query.get("includePending") === "true",
    });

    return NextResponse.json({
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("GET /api/admin/pedidos failed", error);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: "Could not load orders.",
      },
      { status: 500 },
    );
  }
}
