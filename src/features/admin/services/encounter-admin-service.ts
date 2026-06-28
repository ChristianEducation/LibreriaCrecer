import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { encounterImages, encounters } from "@/integrations/drizzle/schema";
import { deleteImage, STORAGE_BUCKETS } from "@/integrations/supabase";

import type { EncounterImageInput, EncounterInput, UpdateEncounterInput } from "../schemas/encounter-schemas";
import { generateUniqueEncounterSlug } from "./slug";

function extractStoragePathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${STORAGE_BUCKETS.ENCOUNTERS}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex >= 0) {
    return url.substring(markerIndex + marker.length);
  }

  const genericMarker = `/${STORAGE_BUCKETS.ENCOUNTERS}/`;
  const genericIndex = url.indexOf(genericMarker);
  if (genericIndex >= 0) {
    return url.substring(genericIndex + genericMarker.length);
  }

  return null;
}

export async function getEncountersAdmin() {
  const rows = await db
    .select({
      id: encounters.id,
      slug: encounters.slug,
      title: encounters.title,
      eventDate: encounters.eventDate,
      excerpt: encounters.excerpt,
      description: encounters.description,
      coverImageUrl: encounters.coverImageUrl,
      videoUrl: encounters.videoUrl,
      location: encounters.location,
      displayOrder: encounters.displayOrder,
      isActive: encounters.isActive,
      createdAt: encounters.createdAt,
      updatedAt: encounters.updatedAt,
    })
    .from(encounters)
    .orderBy(asc(encounters.displayOrder), desc(encounters.createdAt));

  const allImages = await db
    .select({
      id: encounterImages.id,
      encounterId: encounterImages.encounterId,
      url: encounterImages.url,
      altText: encounterImages.altText,
      displayOrder: encounterImages.displayOrder,
    })
    .from(encounterImages)
    .orderBy(asc(encounterImages.displayOrder));

  const imagesByEncounterId = allImages.reduce((acc, img) => {
    if (!acc[img.encounterId]) {
      acc[img.encounterId] = [];
    }
    acc[img.encounterId].push(img);
    return acc;
  }, {} as Record<string, typeof allImages>);

  return rows.map((row) => ({
    ...row,
    images: imagesByEncounterId[row.id] || [],
  }));
}

export async function getEncounterByIdAdmin(id: string) {
  const [row] = await db
    .select({
      id: encounters.id,
      slug: encounters.slug,
      title: encounters.title,
      eventDate: encounters.eventDate,
      excerpt: encounters.excerpt,
      description: encounters.description,
      coverImageUrl: encounters.coverImageUrl,
      videoUrl: encounters.videoUrl,
      location: encounters.location,
      displayOrder: encounters.displayOrder,
      isActive: encounters.isActive,
      createdAt: encounters.createdAt,
      updatedAt: encounters.updatedAt,
    })
    .from(encounters)
    .where(eq(encounters.id, id))
    .limit(1);

  if (!row) return null;

  const images = await db
    .select({
      id: encounterImages.id,
      url: encounterImages.url,
      altText: encounterImages.altText,
      displayOrder: encounterImages.displayOrder,
      createdAt: encounterImages.createdAt,
    })
    .from(encounterImages)
    .where(eq(encounterImages.encounterId, id))
    .orderBy(asc(encounterImages.displayOrder));

  return { ...row, images };
}

export async function createEncounter(data: EncounterInput & { coverImageUrl: string }) {
  const slug = await generateUniqueEncounterSlug(data.title);

  const [created] = await db
    .insert(encounters)
    .values({
      slug,
      title: data.title,
      eventDate: data.event_date,
      excerpt: data.excerpt ?? null,
      description: data.description ?? null,
      coverImageUrl: data.coverImageUrl,
      videoUrl: data.video_url ?? null,
      location: data.location ?? null,
      displayOrder: data.display_order,
      isActive: data.is_active,
    })
    .returning();

  return created;
}

export async function updateEncounter(id: string, data: UpdateEncounterInput & { coverImageUrl?: string }) {
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if ("title" in data && data.title) updateData.title = data.title;
  if ("event_date" in data && data.event_date) updateData.eventDate = data.event_date;
  if ("excerpt" in data) updateData.excerpt = data.excerpt ?? null;
  if ("description" in data) updateData.description = data.description ?? null;
  if ("video_url" in data) updateData.videoUrl = data.video_url ?? null;
  if ("location" in data) updateData.location = data.location ?? null;
  if ("display_order" in data && typeof data.display_order === "number") updateData.displayOrder = data.display_order;
  if ("is_active" in data && typeof data.is_active === "boolean") updateData.isActive = data.is_active;
  if ("coverImageUrl" in data && data.coverImageUrl) updateData.coverImageUrl = data.coverImageUrl;

  const [updated] = await db.update(encounters).set(updateData).where(eq(encounters.id, id)).returning();
  return updated ?? null;
}

export async function deleteEncounter(id: string) {
  const encounter = await getEncounterByIdAdmin(id);
  if (!encounter) return false;

  const pathsToDelete: string[] = [];

  const coverPath = extractStoragePathFromPublicUrl(encounter.coverImageUrl);
  if (coverPath) pathsToDelete.push(coverPath);

  for (const img of encounter.images) {
    const p = extractStoragePathFromPublicUrl(img.url);
    if (p) pathsToDelete.push(p);
  }

  for (const path of pathsToDelete) {
    await deleteImage(STORAGE_BUCKETS.ENCOUNTERS, path);
  }

  await db.delete(encounters).where(eq(encounters.id, id));
  return true;
}

export async function reorderEncounters(ids: string[]) {
  await db.transaction(async (tx) => {
    for (let index = 0; index < ids.length; index += 1) {
      await tx
        .update(encounters)
        .set({ displayOrder: index, updatedAt: new Date() })
        .where(eq(encounters.id, ids[index]));
    }
  });

  return true;
}

export async function addEncounterImage(encounterId: string, data: EncounterImageInput & { url: string }) {
  const rows = await db
    .select({ maxOrder: encounterImages.displayOrder })
    .from(encounterImages)
    .where(eq(encounterImages.encounterId, encounterId))
    .orderBy(desc(encounterImages.displayOrder))
    .limit(1);

  const nextOrder = (rows[0]?.maxOrder ?? -1) + 1;

  const [created] = await db
    .insert(encounterImages)
    .values({
      encounterId,
      url: data.url,
      altText: data.alt_text ?? null,
      displayOrder: nextOrder,
    })
    .returning();

  return created;
}

export async function deleteEncounterImage(imageId: string) {
  const [row] = await db
    .select({ url: encounterImages.url })
    .from(encounterImages)
    .where(eq(encounterImages.id, imageId))
    .limit(1);

  if (!row) return false;

  const path = extractStoragePathFromPublicUrl(row.url);
  if (path) {
    await deleteImage(STORAGE_BUCKETS.ENCOUNTERS, path);
  }

  await db.delete(encounterImages).where(eq(encounterImages.id, imageId));
  return true;
}
