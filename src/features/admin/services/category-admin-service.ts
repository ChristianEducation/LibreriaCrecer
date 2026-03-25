import { and, asc, count, eq, inArray } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { categories, productCategories, products } from "@/integrations/drizzle/schema";
import {
  deleteImage as deleteStorageImage,
  STORAGE_BUCKETS,
  uploadCategoryImage as uploadCategoryImageToStorage,
} from "@/integrations/supabase";

import type { CreateCategoryInput, UpdateCategoryInput } from "../schemas/category-schemas";
import { generateUniqueCategorySlug } from "./slug";

function extractStoragePathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${STORAGE_BUCKETS.CATEGORIES}/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex >= 0) {
    return url.substring(markerIndex + marker.length);
  }

  const genericMarker = `/${STORAGE_BUCKETS.CATEGORIES}/`;
  const genericIndex = url.indexOf(genericMarker);
  if (genericIndex >= 0) {
    return url.substring(genericIndex + genericMarker.length);
  }

  return null;
}

export async function getCategoriesAdmin() {
  const rows = await db
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
      isActive: categories.isActive,
    })
    .from(categories)
    .orderBy(asc(categories.displayOrder), asc(categories.name));

  if (rows.length === 0) {
    return [];
  }

  const ids = rows.map((row) => row.id);
  const countRows = await db
    .select({
      categoryId: productCategories.categoryId,
      productCount: count(productCategories.productId),
    })
    .from(productCategories)
    .innerJoin(products, eq(products.id, productCategories.productId))
    .where(and(inArray(productCategories.categoryId, ids), eq(products.isActive, true)))
    .groupBy(productCategories.categoryId);

  const countMap = new Map(countRows.map((row) => [row.categoryId, Number(row.productCount)]));

  return rows.map((row) => ({
    ...row,
    productCount: countMap.get(row.id) ?? 0,
  }));
}

export async function getCategoryAdmin(id: string) {
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
      isActive: categories.isActive,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  if (!category) {
    return null;
  }

  return category;
}

export async function createCategory(data: CreateCategoryInput) {
  const slug = await generateUniqueCategorySlug(data.name);

  const [created] = await db
    .insert(categories)
    .values({
      name: data.name,
      slug,
      description: data.description ?? null,
      parentId: data.parentId ?? null,
      featured: data.featured,
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    })
    .returning({
      id: categories.id,
    });

  return getCategoryAdmin(created.id);
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const current = await getCategoryAdmin(id);
  if (!current) {
    return null;
  }

  let slug: string | undefined;
  if (typeof data.name === "string" && data.name.trim() && data.name !== current.name) {
    slug = await generateUniqueCategorySlug(data.name, id);
  }

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (typeof data.name === "string") updateData.name = data.name;
  if (slug) updateData.slug = slug;
  if ("description" in data) updateData.description = data.description ?? null;
  if ("parentId" in data) updateData.parentId = data.parentId ?? null;
  if ("featured" in data && typeof data.featured === "boolean") updateData.featured = data.featured;
  if ("displayOrder" in data && typeof data.displayOrder === "number")
    updateData.displayOrder = data.displayOrder;
  if ("isActive" in data && typeof data.isActive === "boolean") updateData.isActive = data.isActive;

  await db.update(categories).set(updateData).where(eq(categories.id, id));

  return getCategoryAdmin(id);
}

export async function deleteCategory(id: string) {
  const [{ activeProductCount }] = await db
    .select({
      activeProductCount: count(productCategories.productId),
    })
    .from(productCategories)
    .innerJoin(products, eq(products.id, productCategories.productId))
    .where(and(eq(productCategories.categoryId, id), eq(products.isActive, true)));

  if (Number(activeProductCount) > 0) {
    return {
      success: false,
      message: "Cannot deactivate category with active associated products.",
    };
  }

  await db
    .update(categories)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id));

  return {
    success: true,
  };
}

export async function uploadCategoryImage(categoryId: string, file: File, target: "cover" | "header" = "cover") {
  const uploadResult = await uploadCategoryImageToStorage(file, categoryId, target);
  if (!uploadResult.success) {
    throw new Error(uploadResult.error.message);
  }

  await db
    .update(categories)
    .set({
      imageUrl: target === "cover" ? uploadResult.publicUrl : undefined,
      headerImageUrl: target === "header" ? uploadResult.publicUrl : undefined,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, categoryId));

  return {
    url: uploadResult.publicUrl,
    target,
  };
}

export async function reorderCategories(categoryIds: string[]) {
  await db.transaction(async (tx) => {
    for (let index = 0; index < categoryIds.length; index += 1) {
      await tx
        .update(categories)
        .set({
          displayOrder: index,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, categoryIds[index]));
    }
  });

  return true;
}

export async function clearCategoryImage(categoryId: string) {
  const [category] = await db
    .select({
      imageUrl: categories.imageUrl,
    })
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  if (!category) {
    return false;
  }

  const path = extractStoragePathFromPublicUrl(category.imageUrl);
  if (path) {
    await deleteStorageImage(STORAGE_BUCKETS.CATEGORIES, path);
  }

  await db
    .update(categories)
    .set({
      imageUrl: null,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, categoryId));

  return true;
}
