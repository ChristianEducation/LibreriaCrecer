import { NextResponse } from "next/server";

import { CreateSelectionSnapshotSchema } from "@/features/admin/schemas/selection-schemas";
import {
  createSelectionSnapshot,
  listSelectionSnapshots,
} from "@/features/admin/services/selection-history-service";

export async function GET() {
  try {
    const data = await listSelectionSnapshots();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/landing/seleccion/historial failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo cargar el historial." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = CreateSelectionSnapshotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation_error", message: "Datos no válidos.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await createSelectionSnapshot(parsed.data);
    if (!result.success) {
      return NextResponse.json(
        { error: result.code, message: result.message },
        { status: result.code === "not_found" ? 404 : 400 },
      );
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/landing/seleccion/historial failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo guardar en el historial." },
      { status: 500 },
    );
  }
}
