import { NextResponse } from "next/server";
import { z } from "zod";

import { UpdateSelectionSnapshotSchema } from "@/features/admin/schemas/selection-schemas";
import {
  deleteSelectionSnapshot,
  getSelectionSnapshot,
  updateSelectionSnapshot,
} from "@/features/admin/services/selection-history-service";

type Params = { id: string };

const IdSchema = z.string().uuid();

function invalidId() {
  return NextResponse.json({ error: "not_found", message: "No se encontró la selección." }, { status: 404 });
}

export async function GET(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    if (!IdSchema.safeParse(id).success) return invalidId();

    const snapshot = await getSelectionSnapshot(id);
    if (!snapshot) return invalidId();

    return NextResponse.json({ data: snapshot });
  } catch (error) {
    console.error("GET /api/admin/landing/seleccion/historial/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo cargar la selección." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    if (!IdSchema.safeParse(id).success) return invalidId();

    const body = await request.json().catch(() => null);
    const parsed = UpdateSelectionSnapshotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation_error", message: "Datos no válidos.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await updateSelectionSnapshot(id, parsed.data);
    if (!result.success) {
      return NextResponse.json(
        { error: result.code, message: result.message },
        { status: result.code === "not_found" ? 404 : 400 },
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("PUT /api/admin/landing/seleccion/historial/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo guardar la selección." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    if (!IdSchema.safeParse(id).success) return invalidId();

    const deleted = await deleteSelectionSnapshot(id);
    if (!deleted) return invalidId();

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/admin/landing/seleccion/historial/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "No se pudo eliminar la selección." },
      { status: 500 },
    );
  }
}
