import { NextResponse } from "next/server";

import { getChilexpressLabelAccess } from "@/features/admin/services/shipping-admin-service";

type Params = { id: string };

// Protegido por el middleware de admin (/api/admin/*): solo un admin
// autenticado puede pedir la signed URL temporal de una etiqueta.
export async function GET(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const access = await getChilexpressLabelAccess(id);

    if (!access) {
      return NextResponse.json(
        { error: "not_found", message: "Este pedido no tiene etiqueta Chilexpress disponible." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: access });
  } catch (error) {
    console.error("GET /api/admin/pedidos/[id]/etiqueta failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo obtener la etiqueta Chilexpress." },
      { status: 500 },
    );
  }
}
