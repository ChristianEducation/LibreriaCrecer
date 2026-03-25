import { type NextRequest } from "next/server";

import { badRequest, ok, parsePositiveIntParam, serverError } from "@/features/catalogo/http";
import { getNewProducts } from "@/features/catalogo/services/product-service";

export async function GET(request: NextRequest) {
  try {
    const limitResult = parsePositiveIntParam(request.nextUrl.searchParams.get("limit"), 6, "limit");
    if (limitResult.error) {
      return badRequest("invalid_query_params", limitResult.error);
    }

    const products = await getNewProducts(limitResult.value);
    return ok(products);
  } catch (error) {
    console.error("GET /api/productos/novedades failed", error);
    return serverError("Could not load new products.");
  }
}
