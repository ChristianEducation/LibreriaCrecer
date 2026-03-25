import { NextResponse } from "next/server";

import { UpdateCuratedProductSchema } from "@/features/admin/schemas/landing-schemas";
import { removeCuratedProduct, updateCuratedProduct } from "@/features/admin/services/landing-admin-service";

type Params = { id: string };

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = UpdateCuratedProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid curated payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const updated = await updateCuratedProduct(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "not_found", message: "Curated product not found." }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/landing/seleccion/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update curated product." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const deleted = await removeCuratedProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: "not_found", message: "Curated product not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/admin/landing/seleccion/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not delete curated product." },
      { status: 500 },
    );
  }
}
