import { and, eq, ne } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { categories, products } from "@/integrations/drizzle/schema";

function baseSlug(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "item";
}

export async function generateUniqueProductSlug(title: string, excludeId?: string): Promise<string> {
  const root = baseSlug(title);
  let candidate = root;
  let suffix = 1;

  while (true) {
    const [existing] = await db
      .select({ id: products.id })
      .from(products)
      .where(
        excludeId
          ? and(eq(products.slug, candidate), ne(products.id, excludeId))
          : eq(products.slug, candidate),
      )
      .limit(1);

    if (!existing) {
      return candidate;
    }

    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
}

export async function generateUniqueCategorySlug(name: string, excludeId?: string): Promise<string> {
  const root = baseSlug(name);
  let candidate = root;
  let suffix = 1;

  while (true) {
    const [existing] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        excludeId
          ? and(eq(categories.slug, candidate), ne(categories.id, excludeId))
          : eq(categories.slug, candidate),
      )
      .limit(1);

    if (!existing) {
      return candidate;
    }

    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
}
