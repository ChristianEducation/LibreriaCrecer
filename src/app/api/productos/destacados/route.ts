import { ok, serverError } from "@/features/catalogo/http";
import { getFeaturedProducts } from "@/features/catalogo/services/product-service";

export async function GET() {
  try {
    const products = await getFeaturedProducts();
    return ok(products);
  } catch (error) {
    console.error("GET /api/productos/destacados failed", error);
    return serverError("Could not load featured products.");
  }
}
