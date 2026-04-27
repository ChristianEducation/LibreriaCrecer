import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getShippingConfigAdmin,
  updateShippingConfigAdmin,
} from "@/features/admin/services/shipping-admin-service";

const ShippingConfigSchema = z.object({
  originRegion: z.string().trim().min(1),
  originCommune: z.string().trim().min(1),
  originCoverageCode: z.string().trim().min(1).nullable().optional(),
  estimatedBookWeightGrams: z.number().int().min(1),
  serviceTypeCode: z.string().trim().min(1).nullable().optional(),
  declaredWorth: z.number().int().min(0),
});

export async function GET() {
  try {
    const config = await getShippingConfigAdmin();
    return NextResponse.json({ data: config });
  } catch (error) {
    console.error("GET /api/admin/shipping/config failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load shipping config." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = ShippingConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid shipping config payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const updated = await updateShippingConfigAdmin(parsed.data);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/shipping/config failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update shipping config." },
      { status: 500 },
    );
  }
}
