import { NextResponse } from "next/server";

import { EncounterSchema } from "@/features/admin/schemas/encounter-schemas";
import { createEncounter, getEncountersAdmin } from "@/features/admin/services/encounter-admin-service";
import { uploadEncounterImage } from "@/integrations/supabase";

export async function GET() {
  try {
    const data = await getEncountersAdmin();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/admin/encuentros failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load encounters." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "validation_error", message: "file (cover image) is required." },
        { status: 400 }
      );
    }

    const payload = {
      title: formData.get("title")?.toString() || "",
      event_date: formData.get("event_date")?.toString() || "",
      excerpt: formData.get("excerpt")?.toString() || undefined,
      description: formData.get("description")?.toString() || undefined,
      video_url: formData.get("video_url")?.toString() || undefined,
      location: formData.get("location")?.toString() || undefined,
      display_order: formData.has("display_order") ? Number(formData.get("display_order")) : 0,
      is_active: formData.has("is_active") ? formData.get("is_active") === "true" : true,
    };

    const parsed = EncounterSchema.safeParse(payload);
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

    const upload = await uploadEncounterImage(file, "portadas");
    if (!upload.success) {
      return NextResponse.json(
        { error: "upload_failed", message: upload.error.message },
        { status: 500 },
      );
    }

    const created = await createEncounter({ ...parsed.data, coverImageUrl: upload.publicUrl });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/encuentros failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not create encounter." },
      { status: 500 },
    );
  }
}
