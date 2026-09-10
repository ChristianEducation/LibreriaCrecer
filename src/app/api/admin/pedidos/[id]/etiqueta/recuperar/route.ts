import { NextResponse } from "next/server";

import { reprintChilexpressLabelAdmin } from "@/features/admin/services/shipping-admin-service";
import { getSignedChilexpressLabelUrl } from "@/integrations/shipping/chilexpress/label-storage";

type Params = { id: string };

// Protegido por el middleware de admin (/api/admin/*). Solo recupera la
// etiqueta de una OT que YA existe (POST /transport-orders-labels) — nunca
// genera una OT nueva.
export async function POST(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const result = await reprintChilexpressLabelAdmin(id);

    if (!result.success) {
      const statusCode = result.code === "order_not_found" ? 404 : 400;
      return NextResponse.json({ error: result.code, message: result.message }, { status: statusCode });
    }

    const url = result.data.chilexpressLabelUrl
      ? await getSignedChilexpressLabelUrl(result.data.chilexpressLabelUrl)
      : null;

    return NextResponse.json({ data: { path: result.data.chilexpressLabelUrl, url } });
  } catch (error) {
    console.error("POST /api/admin/pedidos/[id]/etiqueta/recuperar failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo recuperar la etiqueta Chilexpress." },
      { status: 500 },
    );
  }
}
