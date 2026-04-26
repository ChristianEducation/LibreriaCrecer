import { and, asc, eq, inArray } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import {
  banners,
  featuredProducts,
  footerContent,
  heroSlides,
  landingSectionCopy,
  products,
} from "@/integrations/drizzle/schema";
import {
  type BannerPosition,
  type LandingSectionKey,
  MONTHLY_SELECTION_SECTION,
  MONTHLY_SELECTION_SECTION_ALIASES,
  normalizeCuratedSection,
} from "@/shared/config/landing";

import type { CuratedProduct, ProductCategoryRef } from "../types";

export async function getHeroSlides() {
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
    })
    .from(heroSlides)
    .where(eq(heroSlides.isActive, true))
    .orderBy(asc(heroSlides.displayOrder));
}

export async function getBanners(position?: BannerPosition) {
  const whereClause = position
    ? and(eq(banners.isActive, true), eq(banners.position, position))
    : eq(banners.isActive, true);

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
      createdAt: banners.createdAt,
    })
    .from(banners)
    .where(whereClause)
    .orderBy(asc(banners.position), asc(banners.createdAt));
}

export async function getHeroIntermedio() {
  const result = await getBanners("hero_intermedio");
  return result[0] ?? null;
}

export async function getCatalogoHeaderBanner() {
  const result = await getBanners("catalogo_header");
  return result[0] ?? null;
}

export async function getCategoriesPanorama() {
  const result = await getBanners("categories_panorama");
  return result[0] ?? null;
}

export async function getFooterIllustration() {
  const result = await getBanners("footer_illustration");
  return result[0] ?? null;
}

export async function getFooterContent() {
  const [row] = await db
    .select({
      brandDescription: footerContent.brandDescription,
      catalogLinks: footerContent.catalogLinks,
      infoLinks: footerContent.infoLinks,
      address: footerContent.address,
      mapsUrl: footerContent.mapsUrl,
      copyrightText: footerContent.copyrightText,
      designCredit: footerContent.designCredit,
    })
    .from(footerContent)
    .limit(1);

  return row ?? null;
}

export async function getSectionCopy(key: LandingSectionKey) {
  const [row] = await db
    .select({
      id: landingSectionCopy.id,
      sectionKey: landingSectionCopy.sectionKey,
      eyebrow: landingSectionCopy.eyebrow,
      title: landingSectionCopy.title,
      body: landingSectionCopy.body,
      ctaLabel: landingSectionCopy.ctaLabel,
      ctaHref: landingSectionCopy.ctaHref,
    })
    .from(landingSectionCopy)
    .where(and(eq(landingSectionCopy.sectionKey, key), eq(landingSectionCopy.isActive, true)))
    .limit(1);

  return row ?? null;
}

export async function getCuratedProducts(section?: string): Promise<CuratedProduct[]> {
  const normalizedSection = normalizeCuratedSection(section);
  const sectionCondition =
    normalizedSection === MONTHLY_SELECTION_SECTION
      ? inArray(featuredProducts.section, [...MONTHLY_SELECTION_SECTION_ALIASES])
      : eq(featuredProducts.section, normalizedSection);
  const whereClause = and(
    eq(featuredProducts.isActive, true),
    eq(products.isActive, true),
    eq(products.inStock, true),
    sectionCondition,
  );

  const curatedRows = await db
    .select({
      id: featuredProducts.id,
      section: featuredProducts.section,
      description: featuredProducts.description,
      displayOrder: featuredProducts.displayOrder,
      productId: products.id,
      title: products.title,
      slug: products.slug,
      author: products.author,
      price: products.price,
      salePrice: products.salePrice,
      mainImageUrl: products.mainImageUrl,
      sku: products.sku,
      inStock: products.inStock,
      stockQuantity: products.stockQuantity,
      createdAt: products.createdAt,
    })
    .from(featuredProducts)
    .innerJoin(products, eq(products.id, featuredProducts.productId))
    .where(whereClause)
    .orderBy(asc(featuredProducts.displayOrder));

  return curatedRows.map((row) => ({
      id: row.id,
      section: row.section,
      description: row.description,
      displayOrder: row.displayOrder,
      product: {
        id: row.productId,
        title: row.title,
        slug: row.slug,
        author: row.author,
        price: row.price,
        salePrice: row.salePrice,
        effectivePrice: row.salePrice ?? row.price,
        hasDiscount: row.salePrice !== null && row.salePrice < row.price,
        discountPercentage:
          row.salePrice !== null && row.salePrice < row.price
            ? Math.round(((row.price - row.salePrice) / row.price) * 100)
            : 0,
        mainImageUrl: row.mainImageUrl,
        sku: row.sku,
        inStock: row.inStock,
        stockQuantity: row.stockQuantity,
        createdAt: row.createdAt,
        categories: [] as ProductCategoryRef[],
      },
    }));
}
