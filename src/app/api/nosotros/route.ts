import { asc, eq } from "drizzle-orm";

import { ok, serverError } from "@/features/catalogo/http";
import { db } from "@/integrations/drizzle";
import { aboutSections } from "@/integrations/drizzle/schema";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(aboutSections)
      .where(eq(aboutSections.isActive, true))
      .orderBy(asc(aboutSections.displayOrder));
    return ok(rows);
  } catch (error) {
    console.error("GET /api/nosotros failed", error);
    return serverError("Could not load about sections.");
  }
}
