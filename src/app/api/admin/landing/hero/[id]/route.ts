import { NextResponse } from "next/server";

import { UpdateHeroSlideSchema } from "@/features/admin/schemas/landing-schemas";
import { deleteHeroSlide, updateHeroSlide } from "@/features/admin/services/landing-admin-service";

type Params = { id: string };

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = UpdateHeroSlideSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid hero slide payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const imageUrl =
      typeof body.image_url === "string" && body.image_url.trim().length > 0
        ? body.image_url.trim()
        : undefined;

    const updated = await updateHeroSlide(id, { ...parsed.data, imageUrl });
    if (!updated) {
      return NextResponse.json({ error: "not_found", message: "Hero slide not found." }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/landing/hero/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update hero slide." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const deleted = await deleteHeroSlide(id);
    if (!deleted) {
      return NextResponse.json({ error: "not_found", message: "Hero slide not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/admin/landing/hero/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not delete hero slide." },
      { status: 500 },
    );
  }
}
