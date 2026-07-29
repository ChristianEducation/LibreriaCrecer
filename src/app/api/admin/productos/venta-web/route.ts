import { NextResponse } from "next/server";

import { SetAllProductsOnlineSaleSchema } from "@/features/admin/schemas/product-schemas";
import { setAllProductsOnlineSale } from "@/features/admin/services/product-admin-service";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = SetAllProductsOnlineSaleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await setAllProductsOnlineSale(parsed.data.enabled);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("PUT /api/admin/productos/venta-web failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update online sale status." },
      { status: 500 },
    );
  }
}
