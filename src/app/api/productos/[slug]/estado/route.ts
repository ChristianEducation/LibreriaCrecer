import { notFound, ok, serverError } from "@/features/catalogo/http";
import { getProductChangeSignal } from "@/features/catalogo/services/product-service";

type Params = {
  slug: string;
};

export async function GET(_: Request, context: { params: Promise<Params> }) {
  try {
    const { slug } = await context.params;
    const signal = await getProductChangeSignal(slug);

    if (signal === null) {
      return notFound("Product not found.");
    }

    return ok({ signal });
  } catch (error) {
    console.error("GET /api/productos/[slug]/estado failed", error);
    return serverError("Could not load product change signal.");
  }
}
