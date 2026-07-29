import { ok, serverError } from "@/features/catalogo/http";
import { getCatalogChangeSignal } from "@/features/catalogo/services/product-service";

export async function GET() {
  try {
    const signal = await getCatalogChangeSignal();
    return ok({ signal });
  } catch (error) {
    console.error("GET /api/productos/estado failed", error);
    return serverError("Could not load catalog change signal.");
  }
}
