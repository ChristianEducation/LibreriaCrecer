import { NextResponse } from "next/server";
import { z } from "zod";

import { publishSelectionSnapshot } from "@/features/admin/services/selection-history-service";

type Params = { id: string };

export async function POST(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    if (!z.string().uuid().safeParse(id).success) {
      return NextResponse.json({ error: "not_found", message: "No se encontró la selección." }, { status: 404 });
    }

    const result = await publishSelectionSnapshot(id);
    if (!result.success) {
      return NextResponse.json(
        { error: result.code, message: result.message },
        { status: result.code === "not_found" ? 404 : 400 },
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("POST /api/admin/landing/seleccion/historial/[id]/publicar failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo publicar la selección." },
      { status: 500 },
    );
  }
}
