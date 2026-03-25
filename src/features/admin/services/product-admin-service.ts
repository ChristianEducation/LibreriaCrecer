import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  max,
  sql,
} from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { categories, productCategories, productImages, products } from "@/integrations/drizzle/schema";
import {
  deleteImage as deleteStorageImage,
  STORAGE_BUCKETS,
  uploadProductImage as uploadProductImageToStorage,
} from "@/integrations/supabase";

import type { CreateProductInput, UpdateProductInput } from "../schemas/product-schemas";
import { generateUniqueProductSlug } from "./slug";

type ProductAdminListParams = {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
};

function extractStoragePathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${STORAGE_BUCKETS.PRODUCTS}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex >= 0) {
    return url.substring(markerIndex + marker.length);
  }

  const genericMarker = `/${STORAGE_BUCKETS.PRODUCTS}/`;
  const genericIndex = url.indexOf(genericMarker);
  if (genericIndex >= 0) {
    return url.substring(genericIndex + genericMarker.length);
  }

  return null;
}

async function getCategoryMapForProducts(productIds: string[]) {
  if (productIds.length === 0) {
    return new Map<string, Array<{ id: string; name: string; slug: string }>>();
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
    .where(inArray(productCategories.productId, productIds));

  return rows.reduce((acc, row) => {
    const current = acc.get(row.productId) ?? [];
    current.push({
      id: row.categoryId,
      name: row.categoryName,
      slug: row.categorySlug,
    });
    acc.set(row.productId, current);
    return acc;
  }, new Map<string, Array<{ id: string; name: string; slug: string }>>());
}

export async function getProductsAdmin(params: ProductAdminListParams) {
  const page = Math.max(1, params.page);
  const limit = Math.max(1, params.limit);
  const offset = (page - 1) * limit;

  const filters = [];
  if (params.search?.trim()) {
    const term = `%${params.search.trim()}%`;
    filters.push(sql`(${ilike(products.title, term)} OR ${ilike(products.author, term)})`);
  }
  if (params.categoryId) {
    const subquery = db
      .select({ productId: productCategories.productId })
      .from(productCategories)
      .where(eq(productCategories.categoryId, params.categoryId));
    filters.push(inArray(products.id, subquery));
  }
  if (typeof params.isActive === "boolean") {
    filters.push(eq(products.isActive, params.isActive));
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  const [{ total }] = await db
    .select({ total: count(products.id) })
    .from(products)
    .where(whereClause);

  const rows = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      author: products.author,
      price: products.price,
      salePrice: products.salePrice,
      mainImageUrl: products.mainImageUrl,
      inStock: products.inStock,
      stockQuantity: products.stockQuantity,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(whereClause)
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);

  const categoryMap = await getCategoryMapForProducts(rows.map((row) => row.id));
  const totalItems = Number(total);

  return {
    products: rows.map((row) => ({
      ...row,
      categories: categoryMap.get(row.id) ?? [],
      hasDiscount: row.salePrice !== null && row.salePrice < row.price,
      effectivePrice: row.salePrice !== null && row.salePrice < row.price ? row.salePrice : row.price,
    })),
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages: totalItems === 0 ? 1 : Math.ceil(totalItems / limit),
    },
  };
}

export async function getProductAdmin(id: string) {
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
      isFeatured: products.isFeatured,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!product) {
    return null;
  }

  const categoryRows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(productCategories)
    .innerJoin(categories, eq(categories.id, productCategories.categoryId))
    .where(eq(productCategories.productId, id))
    .orderBy(asc(categories.name));

  const imageRows = await db
    .select({
      id: productImages.id,
      url: productImages.url,
      altText: productImages.altText,
      displayOrder: productImages.displayOrder,
    })
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.displayOrder), asc(productImages.createdAt));

  return {
    ...product,
    categories: categoryRows,
    images: imageRows,
  };
}

export async function createProduct(data: CreateProductInput) {
  const slug = await generateUniqueProductSlug(data.title);

  return db.transaction(async (tx) => {
    const [product] = await tx
      .insert(products)
      .values({
        title: data.title,
        slug,
        code: data.code ?? null,
        sku: data.sku ?? null,
        author: data.author ?? null,
        description: data.description ?? null,
        price: data.price,
        salePrice: data.salePrice ?? null,
        coverType: data.coverType ?? null,
        pages: data.pages ?? null,
        inStock: data.inStock,
        stockQuantity: data.stockQuantity,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
      })
      .returning({
        id: products.id,
      });

    if (data.categoryIds.length > 0) {
      await tx.insert(productCategories).values(
        data.categoryIds.map((categoryId) => ({
          productId: product.id,
          categoryId,
        })),
      );
    }

    return getProductAdmin(product.id);
  });
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  const current = await getProductAdmin(id);
  if (!current) {
    return null;
  }

  let nextSlug: string | undefined;
  if (typeof data.title === "string" && data.title.trim() && data.title !== current.title) {
    nextSlug = await generateUniqueProductSlug(data.title, id);
  }

  await db.transaction(async (tx) => {
    const updateData: Record<string, unknown> = {};

    if (typeof data.title === "string") updateData.title = data.title;
    if (nextSlug) updateData.slug = nextSlug;
    if ("author" in data) updateData.author = data.author ?? null;
    if ("description" in data) updateData.description = data.description ?? null;
    if ("price" in data && typeof data.price === "number") updateData.price = data.price;
    if ("salePrice" in data) updateData.salePrice = data.salePrice ?? null;
    if ("code" in data) updateData.code = data.code ?? null;
    if ("sku" in data) updateData.sku = data.sku ?? null;
    if ("coverType" in data) updateData.coverType = data.coverType ?? null;
    if ("pages" in data) updateData.pages = data.pages ?? null;
    if ("inStock" in data && typeof data.inStock === "boolean") updateData.inStock = data.inStock;
    if ("stockQuantity" in data && typeof data.stockQuantity === "number")
      updateData.stockQuantity = data.stockQuantity;
    if ("isFeatured" in data && typeof data.isFeatured === "boolean")
      updateData.isFeatured = data.isFeatured;
    if ("isActive" in data && typeof data.isActive === "boolean") updateData.isActive = data.isActive;
    updateData.updatedAt = new Date();

    if (Object.keys(updateData).length > 0) {
      await tx.update(products).set(updateData).where(eq(products.id, id));
    }

    if (data.categoryIds) {
      await tx.delete(productCategories).where(eq(productCategories.productId, id));

      if (data.categoryIds.length > 0) {
        await tx.insert(productCategories).values(
          data.categoryIds.map((categoryId) => ({
            productId: id,
            categoryId,
          })),
        );
      }
    }
  });

  return getProductAdmin(id);
}

export async function deleteProduct(id: string) {
  const [updated] = await db
    .update(products)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning({
      id: products.id,
    });

  return Boolean(updated);
}

export async function uploadProductImage(productId: string, file: File, isMain: boolean) {
  const uploadResult = await uploadProductImageToStorage(file, productId);
  if (!uploadResult.success) {
    throw new Error(uploadResult.error.message);
  }

  if (isMain) {
    await db
      .update(products)
      .set({
        mainImageUrl: uploadResult.publicUrl,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    return {
      url: uploadResult.publicUrl,
    };
  }

  const [{ maxOrder }] = await db
    .select({
      maxOrder: max(productImages.displayOrder),
    })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  const [createdImage] = await db
    .insert(productImages)
    .values({
      productId,
      url: uploadResult.publicUrl,
      displayOrder: (maxOrder ?? -1) + 1,
    })
    .returning({
      id: productImages.id,
      url: productImages.url,
    });

  return {
    url: createdImage.url,
    imageId: createdImage.id,
  };
}

export async function deleteProductImage(imageId: string) {
  const [image] = await db
    .select({
      id: productImages.id,
      productId: productImages.productId,
      url: productImages.url,
    })
    .from(productImages)
    .where(eq(productImages.id, imageId))
    .limit(1);

  if (!image) {
    return false;
  }

  const path = extractStoragePathFromPublicUrl(image.url);
  if (path) {
    const deleted = await deleteStorageImage(STORAGE_BUCKETS.PRODUCTS, path);
    if (!deleted.success) {
      throw new Error(deleted.error.message);
    }
  }

  await db.delete(productImages).where(eq(productImages.id, imageId));

  const [product] = await db
    .select({
      id: products.id,
      mainImageUrl: products.mainImageUrl,
    })
    .from(products)
    .where(eq(products.id, image.productId))
    .limit(1);

  if (product?.mainImageUrl === image.url) {
    await db
      .update(products)
      .set({
        mainImageUrl: null,
        updatedAt: new Date(),
      })
      .where(eq(products.id, product.id));
  }

  return true;
}

export async function reorderProductImages(productId: string, imageIds: string[]) {
  await db.transaction(async (tx) => {
    for (let index = 0; index < imageIds.length; index += 1) {
      await tx
        .update(productImages)
        .set({ displayOrder: index })
        .where(and(eq(productImages.id, imageIds[index]), eq(productImages.productId, productId)));
    }
  });

  return true;
}

export async function clearProductMainImage(productId: string) {
  const [product] = await db
    .select({
      mainImageUrl: products.mainImageUrl,
    })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) return false;

  const path = extractStoragePathFromPublicUrl(product.mainImageUrl);
  if (path) {
    await deleteStorageImage(STORAGE_BUCKETS.PRODUCTS, path);
  }

  await db
    .update(products)
    .set({
      mainImageUrl: null,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  return true;
}
