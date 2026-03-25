import { notFound, ok, serverError } from "@/features/catalogo/http";
import { getProductBySlug } from "@/features/catalogo/services/product-service";

type Params = {
  slug: string;
};

export async function GET(_: Request, context: { params: Promise<Params> }) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return notFound("Product not found.");
    }

    return ok(product);
  } catch (error) {
    console.error("GET /api/productos/[slug] failed", error);
    return serverError("Could not load product detail.");
  }
}
