import { NextResponse } from "next/server";
import { z } from "zod";

import {
  deleteShippingPackageAdmin,
  updateShippingPackageAdmin,
} from "@/features/admin/services/shipping-admin-service";

const UpdateShippingPackageSchema = z.object({
  name: z.string().trim().min(1).optional(),
  maxWeightGrams: z.number().int().min(1).optional(),
  packageWeightGrams: z.number().int().min(0).optional(),
  heightCm: z.number().int().min(1).optional(),
  widthCm: z.number().int().min(1).optional(),
  lengthCm: z.number().int().min(1).optional(),
  maxItems: z.number().int().min(1).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type Params = { id: string };

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = UpdateShippingPackageSchema.safeParse(body);

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

    const updated = await updateShippingPackageAdmin(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "not_found", message: "Shipping package not found." }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/shipping/packages/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update shipping package." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const deleted = await deleteShippingPackageAdmin(id);

    if (!deleted) {
      return NextResponse.json({ error: "not_found", message: "Shipping package not found." }, { status: 404 });
    }

    return NextResponse.json({ data: deleted });
  } catch (error) {
    console.error("DELETE /api/admin/shipping/packages/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not deactivate shipping package." },
      { status: 500 },
    );
  }
}
