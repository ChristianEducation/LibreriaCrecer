import { NextResponse } from "next/server";
import { asc, count } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { aboutSections } from "@/integrations/drizzle/schema";
import { ABOUT_OFFERING_ICONS } from "@/shared/config/about";

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
      sectionType?: string;
      icon?: string;
      linkUrl?: string;
      linkLabel?: string;
    };

    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "validation_error", message: "title and content are required." },
        { status: 400 },
      );
    }

    const sectionType = body.sectionType === "offering" ? "offering" : "story";

    if (sectionType === "offering") {
      if (!body.icon || !(ABOUT_OFFERING_ICONS as readonly string[]).includes(body.icon)) {
        return NextResponse.json(
          { error: "validation_error", message: "Invalid icon for offering." },
          { status: 400 },
        );
      }
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
        sectionType,
        icon: sectionType === "offering" ? body.icon : null,
        linkUrl: sectionType === "offering" ? (body.linkUrl || null) : null,
        linkLabel: sectionType === "offering" ? (body.linkLabel || null) : null,
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
