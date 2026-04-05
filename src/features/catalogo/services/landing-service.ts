import { and, asc, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { banners, featuredProducts, products, heroSlides } from "@/integrations/drizzle/schema";

import type { CuratedProduct, ProductCategoryRef } from "../types";

export async function getHeroSlides() {
  return db
    .select({
      id: heroSlides.id,
      title: heroSlides.title,
      subtitle: heroSlides.subtitle,
      imageUrl: heroSlides.imageUrl,
      linkUrl: heroSlides.linkUrl,
      displayOrder: heroSlides.displayOrder,
    })
    .from(heroSlides)
    .where(eq(heroSlides.isActive, true))
    .orderBy(asc(heroSlides.displayOrder));
}

export async function getBanners(position?: string) {
  const whereClause = position
    ? and(eq(banners.isActive, true), eq(banners.position, position))
    : eq(banners.isActive, true);

  return db
    .select({
      id: banners.id,
      title: banners.title,
      description: banners.description,
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

export async function getCuratedProducts(section?: string): Promise<CuratedProduct[]> {
  const whereClause = section
    ? and(
        eq(featuredProducts.isActive, true),
        eq(products.isActive, true),
        eq(products.inStock, true),
        eq(featuredProducts.section, section),
      )
    : and(eq(featuredProducts.isActive, true), eq(products.isActive, true), eq(products.inStock, true));

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
