import { NextResponse } from "next/server";

import { uploadProductImage } from "@/features/admin/services/product-admin-service";

type Params = { id: string };

export async function POST(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const formData = await request.formData();

    const file = formData.get("file");
    const isMain = String(formData.get("isMain") ?? "false") === "true";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "validation_error", message: "file is required." },
        { status: 400 },
      );
    }

    const result = await uploadProductImage(id, file, isMain);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("POST /api/admin/productos/[id]/imagenes failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not upload product image." },
      { status: 500 },
    );
  }
}
