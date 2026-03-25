import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { categories, productCategories, productImages, products } from "@/integrations/drizzle/schema";

import type {
  CatalogProduct,
  CatalogProductDetail,
  ProductCategoryRef,
  ProductListResult,
  ProductQueryParams,
  ProductSortBy,
} from "../types";

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  price: number;
  salePrice: number | null;
  mainImageUrl: string | null;
  sku: string | null;
  inStock: boolean;
  stockQuantity: number;
  createdAt: Date;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const DEFAULT_SLIDER_LIMIT = 6;

function calculateDiscountPercentage(price: number, salePrice: number | null): number {
  if (!salePrice || salePrice >= price) {
    return 0;
  }

  return Math.round(((price - salePrice) / price) * 100);
}

function mapProduct(row: ProductRow, categoriesForProduct: ProductCategoryRef[]): CatalogProduct {
  const hasDiscount = row.salePrice !== null && row.salePrice < row.price;
  const effectivePrice = hasDiscount && row.salePrice !== null ? row.salePrice : row.price;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    author: row.author,
    price: row.price,
    salePrice: row.salePrice,
    effectivePrice,
    hasDiscount,
    discountPercentage: calculateDiscountPercentage(row.price, row.salePrice),
    mainImageUrl: row.mainImageUrl,
    sku: row.sku,
    inStock: row.inStock,
    stockQuantity: row.stockQuantity,
    createdAt: row.createdAt,
    categories: categoriesForProduct,
  };
}

async function getCategoryRefsByProductIds(productIds: string[]) {
  if (productIds.length === 0) {
    return new Map<string, ProductCategoryRef[]>();
  }

  const rows = await db
    .select({
      productId: productCategories.productId,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(productCategories)
    .innerJoin(categories, eq(categories.id, productCategories.categoryId))
    .where(and(inArray(productCategories.productId, productIds), eq(categories.isActive, true)));

  return rows.reduce((acc, row) => {
    const current = acc.get(row.productId) ?? [];
    current.push({
      id: row.categoryId,
      name: row.categoryName,
      slug: row.categorySlug,
    });
    acc.set(row.productId, current);
    return acc;
  }, new Map<string, ProductCategoryRef[]>());
}

function getSortClause(sortBy: ProductSortBy) {
  const effectivePrice = sql<number>`coalesce(${products.salePrice}, ${products.price})`;

  switch (sortBy) {
    case "price_asc":
      return [asc(effectivePrice), asc(products.title)];
    case "price_desc":
      return [desc(effectivePrice), asc(products.title)];
    case "name":
      return [asc(products.title)];
    case "newest":
    default:
      return [desc(products.createdAt)];
  }
}

function buildProductConditions({
  categorySlug,
  search,
  onlyInStock = true,
  onlyActive = true,
}: Pick<ProductQueryParams, "categorySlug" | "search" | "onlyInStock" | "onlyActive">) {
  const conditions: SQL[] = [];

  if (onlyActive) {
    conditions.push(eq(products.isActive, true));
  }

  if (onlyInStock) {
    conditions.push(eq(products.inStock, true));
  }

  if (search?.trim()) {
    const searchTerm = `%${search.trim()}%`;
    conditions.push(or(ilike(products.title, searchTerm), ilike(products.author, searchTerm)) as SQL);
  }

  if (categorySlug?.trim()) {
    const categoryProductsSubquery = db
      .select({ productId: productCategories.productId })
      .from(productCategories)
      .innerJoin(categories, eq(categories.id, productCategories.categoryId))
      .where(and(eq(categories.slug, categorySlug.trim()), eq(categories.isActive, true)));

    conditions.push(inArray(products.id, categoryProductsSubquery));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function getProducts(params: ProductQueryParams): Promise<ProductListResult> {
  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const sortBy = params.sortBy ?? "newest";
  const offset = (page - 1) * limit;

  const whereClause = buildProductConditions(params);

  const [{ total }] = await db
    .select({ total: count(products.id) })
    .from(products)
    .where(whereClause);

  const totalItems = Number(total);
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / limit);

  const productRows = await db
    .select({
      id: products.id,
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
    .from(products)
    .where(whereClause)
    .orderBy(...getSortClause(sortBy))
    .limit(limit)
    .offset(offset);

  const categoryMap = await getCategoryRefsByProductIds(productRows.map((row) => row.id));

  return {
    products: productRows.map((row) => mapProduct(row, categoryMap.get(row.id) ?? [])),
    total: totalItems,
    page,
    totalPages,
  };
}

export async function getProductBySlug(slug: string): Promise<CatalogProductDetail | null> {
  const [product] = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      code: products.code,
      sku: products.sku,
      author: products.author,
      description: products.description,
      price: products.price,
      salePrice: products.salePrice,
      coverType: products.coverType,
      pages: products.pages,
      inStock: products.inStock,
      stockQuantity: products.stockQuantity,
      mainImageUrl: products.mainImageUrl,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);

  if (!product) {
    return null;
  }

  const categoryMap = await getCategoryRefsByProductIds([product.id]);

  const images = await db
    .select({
      id: productImages.id,
      url: productImages.url,
      altText: productImages.altText,
      displayOrder: productImages.displayOrder,
    })
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(asc(productImages.displayOrder));

  const baseProduct = mapProduct(product, categoryMap.get(product.id) ?? []);

  return {
    ...baseProduct,
    description: product.description,
    code: product.code,
    coverType: product.coverType,
    pages: product.pages,
    images,
  };
}

async function getSimpleProductCollection(
  whereClause: SQL | undefined,
  limit: number,
  orderByClauses: SQL[],
): Promise<CatalogProduct[]> {
  const rows = await db
    .select({
      id: products.id,
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
    .from(products)
    .where(whereClause)
    .orderBy(...orderByClauses)
    .limit(limit);

  const categoryMap = await getCategoryRefsByProductIds(rows.map((row) => row.id));
  return rows.map((row) => mapProduct(row, categoryMap.get(row.id) ?? []));
}

export async function getNewProducts(limit = DEFAULT_SLIDER_LIMIT): Promise<CatalogProduct[]> {
  return getSimpleProductCollection(
    and(eq(products.isActive, true), eq(products.inStock, true)),
    limit,
    [desc(products.createdAt)],
  );
}

export async function getOnSaleProducts(limit = DEFAULT_SLIDER_LIMIT): Promise<CatalogProduct[]> {
  return getSimpleProductCollection(
    and(eq(products.isActive, true), eq(products.inStock, true), isNotNull(products.salePrice)),
    limit,
    [desc(products.createdAt)],
  );
}

export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  return getSimpleProductCollection(
    and(eq(products.isActive, true), eq(products.inStock, true), eq(products.isFeatured, true)),
    24,
    [asc(products.title)],
  );
}
