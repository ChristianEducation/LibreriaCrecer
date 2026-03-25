import { type NextRequest } from "next/server";

import { ok, serverError } from "@/features/catalogo/http";
import { getCuratedProducts } from "@/features/catalogo/services/landing-service";

export async function GET(request: NextRequest) {
  try {
    const section = request.nextUrl.searchParams.get("section") ?? undefined;
    const curatedProducts = await getCuratedProducts(section);
    return ok(curatedProducts);
  } catch (error) {
    console.error("GET /api/landing/seleccion failed", error);
    return serverError("Could not load curated products.");
  }
}
