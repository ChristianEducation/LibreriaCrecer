import { NextResponse } from "next/server";

import { UpdateEncounterSchema } from "@/features/admin/schemas/encounter-schemas";
import { deleteEncounter, getEncounterByIdAdmin, updateEncounter } from "@/features/admin/services/encounter-admin-service";
import { uploadEncounterImage } from "@/integrations/supabase";

type Params = { id: string };

export async function GET(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const data = await getEncounterByIdAdmin(id);

    if (!data) {
      return NextResponse.json(
        { error: "not_found", message: "Encounter not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/encuentros/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load encounter." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("file");

    const payload: Record<string, unknown> = {};

    if (formData.has("title")) payload.title = formData.get("title")?.toString();
    if (formData.has("event_date")) payload.event_date = formData.get("event_date")?.toString();
    if (formData.has("excerpt")) payload.excerpt = formData.get("excerpt")?.toString();
    if (formData.has("description")) payload.description = formData.get("description")?.toString();
    if (formData.has("video_url")) payload.video_url = formData.get("video_url")?.toString() || undefined;
    if (formData.has("location")) payload.location = formData.get("location")?.toString();
    if (formData.has("display_order")) payload.display_order = Number(formData.get("display_order"));
    if (formData.has("is_active")) payload.is_active = formData.get("is_active") === "true";

    const parsed = UpdateEncounterSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid encounter payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    let coverImageUrl: string | undefined;

    if (file instanceof File) {
      const upload = await uploadEncounterImage(file, "portadas");
      if (!upload.success) {
        return NextResponse.json(
          { error: "upload_failed", message: upload.error.message },
          { status: 500 },
        );
      }
      coverImageUrl = upload.publicUrl;
    }

    const updated = await updateEncounter(id, { ...parsed.data, coverImageUrl });
    
    if (!updated) {
      return NextResponse.json(
        { error: "not_found", message: "Encounter not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PUT /api/admin/encuentros/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update encounter." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const deleted = await deleteEncounter(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "not_found", message: "Encounter not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/admin/encuentros/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not delete encounter." },
      { status: 500 },
    );
  }
}
