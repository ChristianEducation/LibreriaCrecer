import { ok, serverError } from "@/features/catalogo/http";
import { getFeaturedCategories } from "@/features/catalogo/services/category-service";

export async function GET() {
  try {
    const categories = await getFeaturedCategories();
    return ok(categories);
  } catch (error) {
    console.error("GET /api/categorias/destacadas failed", error);
    return serverError("Could not load featured categories.");
  }
}
