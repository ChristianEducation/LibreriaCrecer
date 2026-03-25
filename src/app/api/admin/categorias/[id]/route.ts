import { NextResponse } from "next/server";

import { UpdateCategorySchema } from "@/features/admin/schemas/category-schemas";
import { deleteCategory, getCategoryAdmin, updateCategory } from "@/features/admin/services/category-admin-service";

type Params = { id: string };

export async function GET(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const category = await getCategoryAdmin(id);

    if (!category) {
      return NextResponse.json({ error: "not_found", message: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error("GET /api/admin/categorias/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load category." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = UpdateCategorySchema.safeParse(body);

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

    const category = await updateCategory(id, parsed.data);
    if (!category) {
      return NextResponse.json({ error: "not_found", message: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error("PUT /api/admin/categorias/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update category." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const result = await deleteCategory(id);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: result.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/admin/categorias/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not delete category." },
      { status: 500 },
    );
  }
}
