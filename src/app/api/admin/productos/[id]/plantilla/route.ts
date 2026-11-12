import { NextResponse } from "next/server";
import { z } from "zod";

import { setProductTemplate } from "@/features/admin/services/product-admin-service";

type Params = { id: string };

const BodySchema = z.object({ choice: z.enum(["original", "libro", "piedra"]) });

/** Elige la imagen que muestra la tienda: original, libro o piedra. */
export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const parsed = BodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation_error", message: "choice debe ser original, libro o piedra." },
        { status: 400 },
      );
    }

    const result = await setProductTemplate(id, parsed.data.choice);
    if (result === null) {
      return NextResponse.json({ error: "not_found", message: "Producto no encontrado." }, { status: 404 });
    }
    if (result === "unavailable") {
      return NextResponse.json(
        { error: "unavailable", message: "Esa versión no está disponible para este producto." },
        { status: 409 },
      );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("PUT /api/admin/productos/[id]/plantilla failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo cambiar la plantilla." },
      { status: 500 },
    );
  }
}
