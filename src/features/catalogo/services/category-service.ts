import { and, asc, count, eq, inArray } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { categories, productCategories, products } from "@/integrations/drizzle/schema";

import type { CatalogCategory, CategoryWithProducts } from "../types";
import { getProducts } from "./product-service";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

export async function getCategories(): Promise<CatalogCategory[]> {
  const categoryRows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      imageUrl: categories.imageUrl,
      headerImageUrl: categories.headerImageUrl,
      parentId: categories.parentId,
      featured: categories.featured,
      displayOrder: categories.displayOrder,
    })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.displayOrder), asc(categories.name));

  if (categoryRows.length === 0) {
    return [];
  }

  const categoryIds = categoryRows.map((category) => category.id);

  const productCountRows = await db
    .select({
      categoryId: productCategories.categoryId,
      productCount: count(productCategories.productId),
    })
    .from(productCategories)
    .innerJoin(products, eq(products.id, productCategories.productId))
    .where(and(inArray(productCategories.categoryId, categoryIds), eq(products.isActive, true)))
    .groupBy(productCategories.categoryId);

  const productCountByCategory = new Map(
    productCountRows.map((row) => [row.categoryId, Number(row.productCount)]),
  );

  return categoryRows.map((category) => ({
    ...category,
    productCount: productCountByCategory.get(category.id) ?? 0,
  }));
}

export async function getCategoryBySlug(
  slug: string,
  options?: { page?: number; limit?: number },
): Promise<CategoryWithProducts | null> {
  const page = options?.page ?? DEFAULT_PAGE;
  const limit = options?.limit ?? DEFAULT_LIMIT;

  const [category] = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      imageUrl: categories.imageUrl,
      headerImageUrl: categories.headerImageUrl,
      parentId: categories.parentId,
      featured: categories.featured,
      displayOrder: categories.displayOrder,
    })
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);

  if (!category) {
    return null;
  }

  const result = await getProducts({
    page,
    limit,
    categorySlug: slug,
    sortBy: "newest",
    onlyActive: true,
    onlyInStock: false,
  });

  return {
    category,
    products: result.products,
    pagination: {
      page: result.page,
      limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  };
}

export async function getFeaturedCategories(): Promise<CatalogCategory[]> {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      imageUrl: categories.imageUrl,
      headerImageUrl: categories.headerImageUrl,
      parentId: categories.parentId,
      featured: categories.featured,
      displayOrder: categories.displayOrder,
    })
    .from(categories)
    .where(and(eq(categories.featured, true), eq(categories.isActive, true)))
    .orderBy(asc(categories.displayOrder), asc(categories.name));
}
