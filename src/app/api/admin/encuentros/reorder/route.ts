import { NextResponse } from "next/server";

import { ReorderEncountersSchema } from "@/features/admin/schemas/encounter-schemas";
import { reorderEncounters } from "@/features/admin/services/encounter-admin-service";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = ReorderEncountersSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid reorder payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await reorderEncounters(parsed.data.ids);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("PUT /api/admin/encuentros/reorder failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not reorder encounters." },
      { status: 500 },
    );
  }
}
