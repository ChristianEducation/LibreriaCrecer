import { NextResponse } from "next/server";

import { updateBanner, uploadBannerImage } from "@/features/admin/services/landing-admin-service";

type Params = { id: string };

export async function POST(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "validation_error", message: "file is required." }, { status: 400 });
    }

    const upload = await uploadBannerImage(file);
    await updateBanner(id, { imageUrl: upload.url });
    return NextResponse.json({ data: { url: upload.url } });
  } catch (error) {
    console.error("POST /api/admin/landing/banners/[id]/imagen failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not upload banner image." },
      { status: 500 },
    );
  }
}
