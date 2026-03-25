import { ok, serverError } from "@/features/catalogo/http";
import { getCategories } from "@/features/catalogo/services/category-service";

export async function GET() {
  try {
    const categories = await getCategories();
    return ok(categories);
  } catch (error) {
    console.error("GET /api/categorias failed", error);
    return serverError("Could not load categories.");
  }
}
