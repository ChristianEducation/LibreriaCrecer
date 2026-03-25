import { NextResponse } from "next/server";

import { UpdateProductSchema } from "@/features/admin/schemas/product-schemas";
import { deleteProduct, getProductAdmin, updateProduct } from "@/features/admin/services/product-admin-service";

type Params = { id: string };

export async function GET(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const product = await getProductAdmin(id);

    if (!product) {
      return NextResponse.json({ error: "not_found", message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("GET /api/admin/productos/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load product." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = UpdateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid product payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const product = await updateProduct(id, parsed.data);
    if (!product) {
      return NextResponse.json({ error: "not_found", message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("PUT /api/admin/productos/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update product." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const success = await deleteProduct(id);

    if (!success) {
      return NextResponse.json({ error: "not_found", message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: { success: true },
    });
  } catch (error) {
    console.error("DELETE /api/admin/productos/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not delete product." },
      { status: 500 },
    );
  }
}
