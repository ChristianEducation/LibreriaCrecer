import { NextResponse } from "next/server";

import { deleteEncounterImage } from "@/features/admin/services/encounter-admin-service";

type Params = { id: string; imageId: string };

export async function DELETE(request: Request, context: { params: Promise<Params> }) {
  try {
    const { imageId } = await context.params;
    const deleted = await deleteEncounterImage(imageId);

    if (!deleted) {
      return NextResponse.json(
        { error: "not_found", message: "Image not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/admin/encuentros/[id]/imagenes/[imageId] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not delete image." },
      { status: 500 },
    );
  }
}
