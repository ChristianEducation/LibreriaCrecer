import { type NextRequest } from "next/server";

import { ok, serverError } from "@/features/catalogo/http";
import { getBanners } from "@/features/catalogo/services/landing-service";

export async function GET(request: NextRequest) {
  try {
    const position = request.nextUrl.searchParams.get("position") ?? undefined;
    const banners = await getBanners(position);
    return ok(banners);
  } catch (error) {
    console.error("GET /api/landing/banners failed", error);
    return serverError("Could not load landing banners.");
  }
}
