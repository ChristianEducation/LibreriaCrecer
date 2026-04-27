import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createShippingPackageAdmin,
  getShippingPackagesAdmin,
} from "@/features/admin/services/shipping-admin-service";

const ShippingPackageSchema = z.object({
  name: z.string().trim().min(1),
  maxWeightGrams: z.number().int().min(1),
  packageWeightGrams: z.number().int().min(0),
  heightCm: z.number().int().min(1),
  widthCm: z.number().int().min(1),
  lengthCm: z.number().int().min(1),
  maxItems: z.number().int().min(1),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    const packages = await getShippingPackagesAdmin();
    return NextResponse.json({ data: packages });
  } catch (error) {
    console.error("GET /api/admin/shipping/packages failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load shipping packages." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ShippingPackageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid shipping package payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const created = await createShippingPackageAdmin(parsed.data);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/shipping/packages failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not create shipping package." },
      { status: 500 },
    );
  }
}
