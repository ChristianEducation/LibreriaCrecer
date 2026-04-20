import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { aboutSections } from "@/integrations/drizzle/schema";
import { uploadBannerImage } from "@/integrations/supabase/storage";

type Params = { id: string };

export async function POST(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "validation_error", message: "file is required." }, { status: 400 });
    }

    const uploaded = await uploadBannerImage(file, "promo");
    if (!uploaded.success) {
      return NextResponse.json(
        { error: "upload_error", message: uploaded.error.message },
        { status: 500 },
      );
    }

    const [row] = await db
      .update(aboutSections)
      .set({ imageUrl: uploaded.publicUrl, updatedAt: new Date() })
      .where(eq(aboutSections.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "not_found", message: "Section not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { imageUrl: uploaded.publicUrl } });
  } catch (error) {
    console.error("POST /api/admin/nosotros/[id]/imagen failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not upload image." },
      { status: 500 },
    );
  }
}
