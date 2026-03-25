import { ok, serverError } from "@/features/catalogo/http";
import { getHeroSlides } from "@/features/catalogo/services/landing-service";

export async function GET() {
  try {
    const slides = await getHeroSlides();
    return ok(slides);
  } catch (error) {
    console.error("GET /api/landing/hero failed", error);
    return serverError("Could not load hero slides.");
  }
}
