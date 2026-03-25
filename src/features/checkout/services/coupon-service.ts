import { and, eq } from "drizzle-orm";

import { db } from "@/integrations/drizzle";
import { coupons } from "@/integrations/drizzle/schema";

import type { CouponValidationResult } from "../types";

type DbTx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbExecutor = typeof db | DbTx;

function toClpInteger(value: number): number {
  return Math.max(0, Math.trunc(value));
}

export async function validateCoupon(
  code: string,
  subtotal: number,
  executor: DbExecutor = db,
): Promise<CouponValidationResult> {
  const normalizedCode = code.trim().toUpperCase();
  const safeSubtotal = toClpInteger(subtotal);

  if (!normalizedCode) {
    return { valid: false, discount: 0, error: "Coupon code is required." };
  }

  const [coupon] = await executor
    .select({
      id: coupons.id,
      code: coupons.code,
      discountType: coupons.discountType,
      discountValue: coupons.discountValue,
      minPurchaseAmount: coupons.minPurchaseAmount,
      startsAt: coupons.startsAt,
      expiresAt: coupons.expiresAt,
      maxUses: coupons.maxUses,
      currentUses: coupons.currentUses,
      isActive: coupons.isActive,
    })
    .from(coupons)
    .where(and(eq(coupons.code, normalizedCode), eq(coupons.isActive, true)))
    .limit(1);

  if (!coupon) {
    return { valid: false, discount: 0, error: "Coupon does not exist or is inactive." };
  }

  const now = new Date();

  if (coupon.startsAt && coupon.startsAt > now) {
    return { valid: false, discount: 0, error: "Coupon is not active yet." };
  }

  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { valid: false, discount: 0, error: "Coupon has expired." };
  }

  if (coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses) {
    return { valid: false, discount: 0, error: "Coupon usage limit reached." };
  }

  if (coupon.minPurchaseAmount !== null && safeSubtotal < coupon.minPurchaseAmount) {
    return {
      valid: false,
      discount: 0,
      error: `Minimum purchase amount is ${coupon.minPurchaseAmount} CLP.`,
    };
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = toClpInteger((safeSubtotal * coupon.discountValue) / 100);
  } else if (coupon.discountType === "fixed") {
    discount = toClpInteger(coupon.discountValue);
  } else {
    return { valid: false, discount: 0, error: "Unsupported coupon type." };
  }

  return {
    valid: true,
    discount: Math.min(discount, safeSubtotal),
    couponCode: coupon.code,
    couponId: coupon.id,
  };
}
