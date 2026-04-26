import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/integrations/drizzle";
import { banners } from "@/integrations/drizzle/schema";

export async function GET() {
  try {
    const [row] = await db
      .select({
        id: banners.id,
        title: banners.title,
        description: banners.description,
        linkUrl: banners.linkUrl,
        isActive: banners.isActive,
      })
      .from(banners)
      .where(eq(banners.position, "top_banner"))
      .limit(1);

    return NextResponse.json({ data: row ?? null });
  } catch (error) {
    console.error("GET /api/admin/landing/top-banner failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not load top banner." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: unknown;
      description?: unknown;
      link_url?: unknown;
      is_active?: unknown;
    };

    const titleVal =
      typeof body.title === "string" && body.title.trim() ? body.title.trim() : null;
    const descriptionVal =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;
    const linkUrlVal =
      typeof body.link_url === "string" && body.link_url.trim()
        ? body.link_url.trim()
        : null;
    const isActiveVal =
      typeof body.is_active === "boolean" ? body.is_active : true;

    const [existing] = await db
      .select({ id: banners.id })
      .from(banners)
      .where(eq(banners.position, "top_banner"))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(banners)
        .set({
          title: titleVal,
          description: descriptionVal,
          linkUrl: linkUrlVal,
          isActive: isActiveVal,
          updatedAt: new Date(),
        })
        .where(eq(banners.id, existing.id))
        .returning({
          id: banners.id,
          title: banners.title,
          description: banners.description,
          linkUrl: banners.linkUrl,
          isActive: banners.isActive,
        });

      return NextResponse.json({ data: updated });
    }

    // Top Banner doesn't use an image — imageUrl stored as empty string (NOT NULL satisfied).
    const [created] = await db
      .insert(banners)
      .values({
        title: titleVal,
        description: descriptionVal,
        linkUrl: linkUrlVal,
        imageUrl: "",
        position: "top_banner",
        isActive: isActiveVal,
      })
      .returning({
        id: banners.id,
        title: banners.title,
        description: banners.description,
        linkUrl: banners.linkUrl,
        isActive: banners.isActive,
      });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("PUT /api/admin/landing/top-banner failed", error);
    return NextResponse.json(
      { error: "internal_server_error", message: "Could not save top banner." },
      { status: 500 },
    );
  }
}
