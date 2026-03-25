import { NextResponse } from "next/server";
import { z } from "zod";

import { reorderCuratedProducts } from "@/features/admin/services/landing-admin-service";

const ReorderCuratedSchema = z.object({
  section: z.string().trim().min(1),
  productIds: z.array(z.string().uuid()),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = ReorderCuratedSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid reorder payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await reorderCuratedProducts(parsed.data.section, parsed.data.productIds);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("PUT /api/admin/landing/seleccion/reorder failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not reorder curated products." },
      { status: 500 },
    );
  }
}
