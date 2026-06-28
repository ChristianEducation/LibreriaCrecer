import { eq, and, desc, asc } from "drizzle-orm";
import { db } from "@/integrations/drizzle";
import { encounters, encounterImages } from "@/integrations/drizzle/schema";

export async function getPublishedEncounters() {
  const data = await db
    .select({
      id: encounters.id,
      slug: encounters.slug,
      title: encounters.title,
      eventDate: encounters.eventDate,
      excerpt: encounters.excerpt,
      coverImageUrl: encounters.coverImageUrl,
    })
    .from(encounters)
    .where(eq(encounters.isActive, true))
    .orderBy(asc(encounters.displayOrder), desc(encounters.eventDate));

  return data;
}

export async function getEncounterBySlug(slug: string) {
  const encounter = await db.query.encounters.findFirst({
    where: and(eq(encounters.slug, slug), eq(encounters.isActive, true)),
    with: {
      images: {
        orderBy: asc(encounterImages.displayOrder),
      },
    },
  });

  return encounter ?? null;
}
