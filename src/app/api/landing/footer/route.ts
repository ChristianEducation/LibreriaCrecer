import { ok, serverError } from "@/features/catalogo/http";
import { db } from "@/integrations/drizzle";
import { footerContent } from "@/integrations/drizzle/schema";

export async function GET() {
  try {
    const rows = await db.select().from(footerContent).limit(1);
    return ok(rows[0] ?? null);
  } catch (error) {
    console.error("GET /api/landing/footer failed", error);
    return serverError("Could not load footer content.");
  }
}
