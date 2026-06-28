import { NextResponse } from "next/server";

import { EncounterImageSchema } from "@/features/admin/schemas/encounter-schemas";
import { addEncounterImage, getEncounterByIdAdmin } from "@/features/admin/services/encounter-admin-service";
import { uploadEncounterImage } from "@/integrations/supabase";

type Params = { id: string };

export async function GET(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const encounter = await getEncounterByIdAdmin(id);

    if (!encounter) {
      return NextResponse.json(
        { error: "not_found", message: "Encounter not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: encounter.images });
  } catch (error) {
    console.error("GET /api/admin/encuentros/[id]/imagenes failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load images." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "validation_error", message: "file is required." },
        { status: 400 }
      );
    }

    const payload = {
      alt_text: formData.get("alt_text")?.toString() || undefined,
    };

    const parsed = EncounterImageSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid image payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const upload = await uploadEncounterImage(file, "galeria");
    if (!upload.success) {
      return NextResponse.json(
        { error: "upload_failed", message: upload.error.message },
        { status: 500 },
      );
    }

    const created = await addEncounterImage(id, { ...parsed.data, url: upload.publicUrl });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/encuentros/[id]/imagenes failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not upload image." },
      { status: 500 },
    );
  }
}
