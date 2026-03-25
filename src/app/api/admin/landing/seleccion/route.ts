import { NextResponse, type NextRequest } from "next/server";

import { CuratedProductSchema } from "@/features/admin/schemas/landing-schemas";
import { addCuratedProduct, getCuratedProductsAdmin } from "@/features/admin/services/landing-admin-service";

export async function GET(request: NextRequest) {
  try {
    const section = request.nextUrl.searchParams.get("section") ?? undefined;
    const items = await getCuratedProductsAdmin(section);
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("GET /api/admin/landing/seleccion failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load curated products." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CuratedProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid curated product payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const created = await addCuratedProduct(parsed.data);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/landing/seleccion failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not create curated product." },
      { status: 500 },
    );
  }
}
