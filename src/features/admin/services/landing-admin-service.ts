import { and, asc, eq, inArray } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { banners, featuredProducts, heroSlides, landingSectionCopy, products } from "@/integrations/drizzle/schema";
import { deleteImage, STORAGE_BUCKETS, uploadBannerImage as uploadBannerImageToStorage } from "@/integrations/supabase";
import {
  type LandingSectionKey,
  MONTHLY_SELECTION_SECTION,
  MONTHLY_SELECTION_SECTION_ALIASES,
  normalizeCuratedSection,
} from "@/shared/config/landing";

import type {
  BannerInput,
  CuratedProductInput,
  FooterBannerMetadataInput,
  HeroSlideInput,
  LandingSectionCopyInput,
  UpdateBannerInput,
  UpdateCuratedProductInput,
  UpdateHeroSlideInput,
  UpdateLandingSectionCopyInput,
} from "../schemas/landing-schemas";

function extractStoragePathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${STORAGE_BUCKETS.BANNERS}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex >= 0) {
    return url.substring(markerIndex + marker.length);
  }

  const genericMarker = `/${STORAGE_BUCKETS.BANNERS}/`;
  const genericIndex = url.indexOf(genericMarker);
  if (genericIndex >= 0) {
    return url.substring(genericIndex + genericMarker.length);
  }

  return null;
}

export async function getHeroSlidesAdmin() {
  return db
    .select({
      id: heroSlides.id,
      title: heroSlides.title,
      subtitle: heroSlides.subtitle,
      imageUrl: heroSlides.imageUrl,
      linkUrl: heroSlides.linkUrl,
      ctaText: heroSlides.ctaText,
      showContent: heroSlides.showContent,
      textPosition: heroSlides.textPosition,
      textAlign: heroSlides.textAlign,
      overlayVariant: heroSlides.overlayVariant,
      overlayOpacity: heroSlides.overlayOpacity,
      contentTheme: heroSlides.contentTheme,
      displayOrder: heroSlides.displayOrder,
      isActive: heroSlides.isActive,
      createdAt: heroSlides.createdAt,
      updatedAt: heroSlides.updatedAt,
    })
    .from(heroSlides)
    .orderBy(asc(heroSlides.displayOrder), asc(heroSlides.createdAt));
}

export async function createHeroSlide(data: HeroSlideInput & { imageUrl: string }) {
  const [created] = await db
    .insert(heroSlides)
    .values({
      title: data.title ?? null,
      subtitle: data.subtitle ?? null,
      imageUrl: data.imageUrl,
      linkUrl: data.link_url ?? null,
      ctaText: data.cta_text ?? null,
      showContent: data.show_content,
      textPosition: data.text_position,
      textAlign: data.text_align,
      overlayVariant: data.overlay_variant,
      overlayOpacity: data.overlay_opacity,
      contentTheme: data.content_theme,
      displayOrder: data.display_order,
      isActive: data.is_active,
    })
    .returning();

  return created;
}

export async function updateHeroSlide(id: string, data: UpdateHeroSlideInput & { imageUrl?: string }) {
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if ("title" in data) updateData.title = data.title ?? null;
  if ("subtitle" in data) updateData.subtitle = data.subtitle ?? null;
  if ("link_url" in data) updateData.linkUrl = data.link_url ?? null;
  if ("cta_text" in data) updateData.ctaText = data.cta_text ?? null;
  if ("show_content" in data && typeof data.show_content === "boolean")
    updateData.showContent = data.show_content;
  if ("text_position" in data && typeof data.text_position === "string")
    updateData.textPosition = data.text_position;
  if ("text_align" in data && typeof data.text_align === "string")
    updateData.textAlign = data.text_align;
  if ("overlay_variant" in data && typeof data.overlay_variant === "string")
    updateData.overlayVariant = data.overlay_variant;
  if ("overlay_opacity" in data && typeof data.overlay_opacity === "number")
    updateData.overlayOpacity = data.overlay_opacity;
  if ("content_theme" in data && typeof data.content_theme === "string")
    updateData.contentTheme = data.content_theme;
  if ("display_order" in data && typeof data.display_order === "number")
    updateData.displayOrder = data.display_order;
  if ("is_active" in data && typeof data.is_active === "boolean") updateData.isActive = data.is_active;
  if ("imageUrl" in data && data.imageUrl) updateData.imageUrl = data.imageUrl;

  const [updated] = await db.update(heroSlides).set(updateData).where(eq(heroSlides.id, id)).returning();
  return updated ?? null;
}

export async function deleteHeroSlide(id: string) {
  const [row] = await db.select({ imageUrl: heroSlides.imageUrl }).from(heroSlides).where(eq(heroSlides.id, id)).limit(1);
  if (!row) return false;

  const path = extractStoragePathFromPublicUrl(row.imageUrl);
  if (path) {
    await deleteImage(STORAGE_BUCKETS.BANNERS, path);
  }

  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  return true;
}

export async function uploadHeroImage(file: File) {
  const uploadResult = await uploadBannerImageToStorage(file, "hero");
  if (uploadResult.success) {
    return { url: uploadResult.publicUrl };
  }

  throw new Error(uploadResult.error.message);
}

export async function reorderHeroSlides(slideIds: string[]) {
  await db.transaction(async (tx) => {
    for (let index = 0; index < slideIds.length; index += 1) {
      await tx
        .update(heroSlides)
        .set({ displayOrder: index, updatedAt: new Date() })
        .where(eq(heroSlides.id, slideIds[index]));
    }
  });

  return true;
}

export async function getBannersAdmin() {
  return db
    .select({
      id: banners.id,
      title: banners.title,
      description: banners.description,
      eyebrow: banners.eyebrow,
      ctaLabel: banners.ctaLabel,
      imageUrl: banners.imageUrl,
      linkUrl: banners.linkUrl,
      position: banners.position,
      metadata: banners.metadata,
      isActive: banners.isActive,
      createdAt: banners.createdAt,
      updatedAt: banners.updatedAt,
    })
    .from(banners)
    .orderBy(asc(banners.position), asc(banners.createdAt));
}

export async function createBanner(data: BannerInput & { imageUrl: string }) {
  const [created] = await db
    .insert(banners)
    .values({
      title: data.title ?? null,
      description: data.description ?? null,
      eyebrow: data.eyebrow ?? null,
      ctaLabel: data.cta_label ?? null,
      imageUrl: data.imageUrl,
      linkUrl: data.link_url ?? null,
      position: data.position,
      metadata: (data.metadata as FooterBannerMetadataInput | undefined) ?? null,
      isActive: data.is_active,
    })
    .returning();

  return created;
}

export async function updateBanner(id: string, data: UpdateBannerInput & { imageUrl?: string }) {
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if ("title" in data) updateData.title = data.title ?? null;
  if ("description" in data) updateData.description = data.description ?? null;
  if ("eyebrow" in data) updateData.eyebrow = data.eyebrow ?? null;
  if ("cta_label" in data) updateData.ctaLabel = data.cta_label ?? null;
  if ("link_url" in data) updateData.linkUrl = data.link_url ?? null;
  if ("position" in data && typeof data.position === "string") updateData.position = data.position;
  if ("metadata" in data) updateData.metadata = data.metadata ?? null;
  if ("is_active" in data && typeof data.is_active === "boolean") updateData.isActive = data.is_active;
  if ("imageUrl" in data && data.imageUrl) updateData.imageUrl = data.imageUrl;

  const [updated] = await db.update(banners).set(updateData).where(eq(banners.id, id)).returning();
  return updated ?? null;
}

export async function deleteBanner(id: string) {
  const [row] = await db.select({ imageUrl: banners.imageUrl }).from(banners).where(eq(banners.id, id)).limit(1);
  if (!row) return false;

  const path = extractStoragePathFromPublicUrl(row.imageUrl);
  if (path) {
    await deleteImage(STORAGE_BUCKETS.BANNERS, path);
  }

  await db.delete(banners).where(eq(banners.id, id));
  return true;
}

export async function uploadBannerImage(file: File) {
  const uploadResult = await uploadBannerImageToStorage(file, "promo");
  if (uploadResult.success) {
    return { url: uploadResult.publicUrl };
  }

  throw new Error(uploadResult.error.message);
}

function getCuratedSectionCondition(section?: string) {
  const normalizedSection = normalizeCuratedSection(section);
  return normalizedSection === MONTHLY_SELECTION_SECTION
    ? inArray(featuredProducts.section, [...MONTHLY_SELECTION_SECTION_ALIASES])
    : eq(featuredProducts.section, normalizedSection);
}

export async function getCuratedProductsAdmin(section?: string) {
  const whereClause = getCuratedSectionCondition(section);

  const rows = await db
    .select({
      id: featuredProducts.id,
      productId: featuredProducts.productId,
      section: featuredProducts.section,
      description: featuredProducts.description,
      displayOrder: featuredProducts.displayOrder,
      isActive: featuredProducts.isActive,
      createdAt: featuredProducts.createdAt,
      updatedAt: featuredProducts.updatedAt,
      productTitle: products.title,
      productAuthor: products.author,
      productImage: products.mainImageUrl,
      productPrice: products.price,
      productSalePrice: products.salePrice,
      productIsActive: products.isActive,
    })
    .from(featuredProducts)
    .innerJoin(products, eq(products.id, featuredProducts.productId))
    .where(whereClause)
    .orderBy(asc(featuredProducts.displayOrder), asc(featuredProducts.createdAt));

  return rows.map((row) => ({
    ...row,
    section: normalizeCuratedSection(row.section),
  }));
}

export async function addCuratedProduct(data: CuratedProductInput) {
  const [created] = await db
    .insert(featuredProducts)
    .values({
      productId: data.product_id,
      section: normalizeCuratedSection(data.section),
      description: data.description ?? null,
      displayOrder: data.display_order,
      isActive: data.is_active,
    })
    .returning();

  const [withProduct] = await getCuratedProductsAdmin(MONTHLY_SELECTION_SECTION).then((rows) =>
    rows.filter((row) => row.id === created.id),
  );
  return withProduct ?? created;
}

export async function updateCuratedProduct(id: string, data: UpdateCuratedProductInput) {
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if ("product_id" in data && data.product_id) updateData.productId = data.product_id;
  if ("section" in data && data.section) updateData.section = normalizeCuratedSection(data.section);
  if ("description" in data) updateData.description = data.description ?? null;
  if ("display_order" in data && typeof data.display_order === "number")
    updateData.displayOrder = data.display_order;
  if ("is_active" in data && typeof data.is_active === "boolean") updateData.isActive = data.is_active;

  const [updated] = await db
    .update(featuredProducts)
    .set(updateData)
    .where(eq(featuredProducts.id, id))
    .returning({ id: featuredProducts.id });

  if (!updated) return null;

  const rows = await getCuratedProductsAdmin(MONTHLY_SELECTION_SECTION);
  return rows.find((row) => row.id === updated.id) ?? null;
}

export async function removeCuratedProduct(id: string) {
  const [removed] = await db
    .delete(featuredProducts)
    .where(eq(featuredProducts.id, id))
    .returning({ id: featuredProducts.id });
  return Boolean(removed);
}

export async function reorderCuratedProducts(section: string, productIds: string[]) {
  const rows = await db
    .select({ id: featuredProducts.id })
    .from(featuredProducts)
    .where(and(getCuratedSectionCondition(section), inArray(featuredProducts.id, productIds)));

  const ids = new Set(rows.map((row) => row.id));

  await db.transaction(async (tx) => {
    for (let index = 0; index < productIds.length; index += 1) {
      if (!ids.has(productIds[index])) continue;

      await tx
        .update(featuredProducts)
        .set({
          section: normalizeCuratedSection(section),
          displayOrder: index,
          updatedAt: new Date(),
        })
        .where(eq(featuredProducts.id, productIds[index]));
    }
  });

  return true;
}

export async function getSectionCopies() {
  return db
    .select({
      id: landingSectionCopy.id,
      sectionKey: landingSectionCopy.sectionKey,
      eyebrow: landingSectionCopy.eyebrow,
      title: landingSectionCopy.title,
      body: landingSectionCopy.body,
      ctaLabel: landingSectionCopy.ctaLabel,
      ctaHref: landingSectionCopy.ctaHref,
      isActive: landingSectionCopy.isActive,
      createdAt: landingSectionCopy.createdAt,
      updatedAt: landingSectionCopy.updatedAt,
    })
    .from(landingSectionCopy)
    .orderBy(asc(landingSectionCopy.sectionKey));
}

export async function getSectionCopyByKey(key: LandingSectionKey) {
  const [row] = await db
    .select({
      id: landingSectionCopy.id,
      sectionKey: landingSectionCopy.sectionKey,
      eyebrow: landingSectionCopy.eyebrow,
      title: landingSectionCopy.title,
      body: landingSectionCopy.body,
      ctaLabel: landingSectionCopy.ctaLabel,
      ctaHref: landingSectionCopy.ctaHref,
      isActive: landingSectionCopy.isActive,
      createdAt: landingSectionCopy.createdAt,
      updatedAt: landingSectionCopy.updatedAt,
    })
    .from(landingSectionCopy)
    .where(eq(landingSectionCopy.sectionKey, key))
    .limit(1);

  return row ?? null;
}

export async function upsertSectionCopy(
  key: LandingSectionKey,
  data: LandingSectionCopyInput | (UpdateLandingSectionCopyInput & { section_key?: LandingSectionKey }),
) {
  const existing = await getSectionCopyByKey(key);

  if (!existing) {
    const [created] = await db
      .insert(landingSectionCopy)
      .values({
        sectionKey: key,
        eyebrow: data.eyebrow ?? null,
        title: data.title ?? null,
        body: data.body ?? null,
        ctaLabel: data.cta_label ?? null,
        ctaHref: data.cta_href ?? null,
        isActive: data.is_active ?? true,
      })
      .returning();

    return created;
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if ("eyebrow" in data) updateData.eyebrow = data.eyebrow ?? null;
  if ("title" in data) updateData.title = data.title ?? null;
  if ("body" in data) updateData.body = data.body ?? null;
  if ("cta_label" in data) updateData.ctaLabel = data.cta_label ?? null;
  if ("cta_href" in data) updateData.ctaHref = data.cta_href ?? null;
  if ("is_active" in data && typeof data.is_active === "boolean") updateData.isActive = data.is_active;

  const [updated] = await db
    .update(landingSectionCopy)
    .set(updateData)
    .where(eq(landingSectionCopy.sectionKey, key))
    .returning();

  return updated ?? null;
}
