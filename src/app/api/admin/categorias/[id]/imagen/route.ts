import { NextResponse } from "next/server";

import { uploadCategoryImage } from "@/features/admin/services/category-admin-service";

type Params = { id: string };

export async function POST(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("file");
    const targetValue = formData.get("target");
    const target = targetValue === "header" ? "header" : "cover";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "validation_error", message: "file is required." },
        { status: 400 },
      );
    }

    const result = await uploadCategoryImage(id, file, target);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("POST /api/admin/categorias/[id]/imagen failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not upload category image." },
      { status: 500 },
    );
  }
}
