import { NextResponse } from "next/server";

import { generateChilexpressOtAdmin } from "@/features/admin/services/shipping-admin-service";

type Params = { id: string };

export async function POST(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const result = await generateChilexpressOtAdmin(id);

    if (!result.success) {
      const statusCode = result.code === "order_not_found" ? 404 : 400;
      return NextResponse.json(
        {
          error: result.code,
          message: result.message,
        },
        { status: statusCode },
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("POST /api/admin/pedidos/[id]/generar-ot failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not generate Chilexpress OT." },
      { status: 500 },
    );
  }
}
