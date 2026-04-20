import { NextResponse } from "next/server";
import { asc, count } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { aboutSections } from "@/integrations/drizzle/schema";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(aboutSections)
      .orderBy(asc(aboutSections.displayOrder));
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("GET /api/admin/nosotros failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load about sections." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      content?: string;
      imagePosition?: string;
      isActive?: boolean;
    };

    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "validation_error", message: "title and content are required." },
        { status: 400 },
      );
    }

    const [{ maxOrder }] = await db
      .select({ maxOrder: count(aboutSections.id) })
      .from(aboutSections);

    const [row] = await db
      .insert(aboutSections)
      .values({
        title: body.title.trim(),
        content: body.content.trim(),
        imagePosition: body.imagePosition ?? "right",
        displayOrder: Number(maxOrder),
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json({ data: row }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/nosotros failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not create about section." },
      { status: 500 },
    );
  }
}
