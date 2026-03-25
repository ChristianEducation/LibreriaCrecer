import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  minPurchaseAmount: integer("min_purchase_amount"),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
