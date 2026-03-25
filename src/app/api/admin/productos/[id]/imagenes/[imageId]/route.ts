import { NextResponse } from "next/server";

import { deleteProductImage } from "@/features/admin/services/product-admin-service";

type Params = { imageId: string };

export async function DELETE(_: Request, context: { params: Promise<Params> }) {
  try {
    const { imageId } = await context.params;
    const success = await deleteProductImage(imageId);

    if (!success) {
      return NextResponse.json({ error: "not_found", message: "Image not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: { success: true },
    });
  } catch (error) {
    console.error("DELETE /api/admin/productos/[id]/imagenes/[imageId] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not delete product image." },
      { status: 500 },
    );
  }
}
