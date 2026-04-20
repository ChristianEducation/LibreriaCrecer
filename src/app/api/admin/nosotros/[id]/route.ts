import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { aboutSections } from "@/integrations/drizzle/schema";

type Params = { id: string };

export async function PUT(request: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      title?: string;
      content?: string;
      imagePosition?: string;
      displayOrder?: number;
      isActive?: boolean;
    };

    const [row] = await db
      .update(aboutSections)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(aboutSections.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "not_found", message: "Section not found." }, { status: 404 });
    }

    return NextResponse.json({ data: row });
  } catch (error) {
    console.error("PUT /api/admin/nosotros/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not update section." },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params;

    const [row] = await db
      .update(aboutSections)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(aboutSections.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "not_found", message: "Section not found." }, { status: 404 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/admin/nosotros/[id] failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not delete section." },
      { status: 500 },
    );
  }
}
