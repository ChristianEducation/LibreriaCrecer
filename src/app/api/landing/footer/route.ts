import { ok, serverError } from "@/features/catalogo/http";
import { getFooterContent } from "@/features/catalogo/services/landing-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getFooterContent();
    return ok(content);
  } catch (error) {
    console.error("GET /api/landing/footer failed", error);
    return serverError("Could not load footer content.");
  }
}
