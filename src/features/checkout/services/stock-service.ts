import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { products } from "@/integrations/drizzle/schema";

import type { CreateOrderItemInput, StockValidationError, StockValidationResult } from "../types";

type DbTx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbExecutor = typeof db | DbTx;

function normalizeItems(items: CreateOrderItemInput[]): CreateOrderItemInput[] {
  const map = new Map<string, number>();

  for (const item of items) {
    if (!item.productId) continue;
    const nextQuantity = (map.get(item.productId) ?? 0) + Math.max(0, Math.trunc(item.quantity));
    map.set(item.productId, nextQuantity);
  }

  return Array.from(map.entries()).map(([productId, quantity]) => ({ productId, quantity }));
}

export async function validateStock(
  items: CreateOrderItemInput[],
  executor: DbExecutor = db,
): Promise<StockValidationResult> {
  const normalized = normalizeItems(items).filter((item) => item.quantity > 0);
  if (normalized.length === 0) {
    return { valid: false, errors: [{ productId: "", requested: 0, available: 0 }] };
  }

  const productIds = normalized.map((item) => item.productId);

  const stockRows = await executor
    .select({
      id: products.id,
      isActive: products.isActive,
      inStock: products.inStock,
      stockQuantity: products.stockQuantity,
    })
    .from(products)
    .where(inArray(products.id, productIds));

  const stockById = new Map(stockRows.map((row) => [row.id, row]));

  const errors: StockValidationError[] = [];
  for (const item of normalized) {
    const product = stockById.get(item.productId);
    if (!product || !product.isActive || !product.inStock || product.stockQuantity < item.quantity) {
      errors.push({
        productId: item.productId,
        requested: item.quantity,
        available: product?.stockQuantity ?? 0,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function decrementStock(
  items: CreateOrderItemInput[],
  executor?: DbExecutor,
): Promise<StockValidationResult> {
  if (!executor) {
    throw new Error("decrementStock must be used within a transaction.");
  }

  const normalized = normalizeItems(items).filter((item) => item.quantity > 0);
  if (normalized.length === 0) {
    return { valid: false, errors: [{ productId: "", requested: 0, available: 0 }] };
  }

  const errors: StockValidationError[] = [];

  for (const item of normalized) {
    const updatedRows = await executor
      .update(products)
      .set({
        stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
        inStock: sql`(${products.stockQuantity} - ${item.quantity}) > 0`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(products.id, item.productId),
          eq(products.isActive, true),
          eq(products.inStock, true),
          sql`${products.stockQuantity} >= ${item.quantity}`,
        ),
      )
      .returning({
        id: products.id,
      });

    if (updatedRows.length === 0) {
      const [current] = await executor
        .select({ stockQuantity: products.stockQuantity })
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      errors.push({
        productId: item.productId,
        requested: item.quantity,
        available: current?.stockQuantity ?? 0,
      });
    }
  }

  return { valid: errors.length === 0, errors };
}
