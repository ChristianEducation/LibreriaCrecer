import { NextResponse } from "next/server";
import { z } from "zod";

import { reorderHeroSlides } from "@/features/admin/services/landing-admin-service";

const ReorderHeroSchema = z.object({
  slideIds: z.array(z.string().uuid()),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = ReorderHeroSchema.safeParse(body);

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

    await reorderHeroSlides(parsed.data.slideIds);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("PUT /api/admin/landing/hero/reorder failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not reorder hero slides." },
      { status: 500 },
    );
  }
}
