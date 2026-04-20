import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { footerContent } from "@/integrations/drizzle/schema";

export async function GET() {
  try {
    const rows = await db.select().from(footerContent).limit(1);
    return NextResponse.json({ data: rows[0] ?? null });
  } catch (error) {
    console.error("GET /api/admin/landing/footer-content failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load footer content." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      brandDescription?: string;
      catalogLinks?: string;
      infoLinks?: string;
      address?: string;
      mapsUrl?: string;
      copyrightText?: string;
      designCredit?: string;
    };

    const rows = await db.select({ id: footerContent.id }).from(footerContent).limit(1);
    const existingId = rows[0]?.id;

    if (existingId) {
      const [row] = await db
        .update(footerContent)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(footerContent.id, existingId))
        .returning();
      return NextResponse.json({ data: row });
    } else {
      const [row] = await db.insert(footerContent).values(body).returning();
      return NextResponse.json({ data: row }, { status: 201 });
    }
  } catch (error) {
    console.error("POST /api/admin/landing/footer-content failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not save footer content." },
      { status: 500 },
    );
  }
}
