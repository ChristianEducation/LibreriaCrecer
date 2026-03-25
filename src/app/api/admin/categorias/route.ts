import { NextResponse } from "next/server";

import { CreateCategorySchema } from "@/features/admin/schemas/category-schemas";
import { createCategory, getCategoriesAdmin } from "@/features/admin/services/category-admin-service";

export async function GET() {
  try {
    const categories = await getCategoriesAdmin();
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("GET /api/admin/categorias failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load categories." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid category payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const created = await createCategory(parsed.data);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/categorias failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not create category." },
      { status: 500 },
    );
  }
}
