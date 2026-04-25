import { type NextRequest } from "next/server";

import { ok, serverError } from "@/features/catalogo/http";
import { getBanners } from "@/features/catalogo/services/landing-service";
import { isBannerPosition } from "@/shared/config/landing";

export async function GET(request: NextRequest) {
  try {
    const rawPosition = request.nextUrl.searchParams.get("position");
    const position = rawPosition && isBannerPosition(rawPosition) ? rawPosition : undefined;
    const banners = await getBanners(position);
    return ok(banners);
  } catch (error) {
    console.error("GET /api/landing/banners failed", error);
    return serverError("Could not load landing banners.");
  }
}
