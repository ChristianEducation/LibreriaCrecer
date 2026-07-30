import { NextResponse, type NextRequest } from "next/server";

import { CreateProductSchema } from "@/features/admin/schemas/product-schemas";
import {
  createProduct,
  getProductAdminStats,
  getProductsAdmin,
} from "@/features/admin/services/product-admin-service";

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBooleanOptional(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;
    // Las estadisticas globales (stock total, productos activos, etc.) no dependen
    // de la busqueda/filtros del listado: solo se calculan cuando el cliente las pide
    // explicitamente (primera carga), no en cada tecla de una busqueda.
    const includeStats = query.get("includeStats") !== "false";

    const [result, stats] = await Promise.all([
      getProductsAdmin({
        page: parsePositiveInt(query.get("page"), 1),
        limit: parsePositiveInt(query.get("limit"), 20),
        search: query.get("search") ?? undefined,
        categoryId: query.get("categoryId") ?? undefined,
        isActive: parseBooleanOptional(query.get("isActive")),
        onlineSaleEnabled: parseBooleanOptional(query.get("onlineSaleEnabled")),
      }),
      includeStats ? getProductAdminStats() : Promise.resolve(undefined),
    ]);

    return NextResponse.json({
      data: result.products,
      pagination: result.pagination,
      ...(stats ? { stats } : {}),
    });
  } catch (error) {
    console.error("GET /api/admin/productos failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load products." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateProductSchema.safeParse(body);

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

    const created = await createProduct(parsed.data);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/productos failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not create product." },
      { status: 500 },
    );
  }
}
