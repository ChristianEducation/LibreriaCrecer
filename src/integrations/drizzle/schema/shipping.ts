import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type ShippingPackageDimensions = {
  weightKg: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
};

export const shippingConfig = pgTable("shipping_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  provider: text("provider").notNull().default("chilexpress"),
  originRegion: text("origin_region").notNull(),
  originCommune: text("origin_commune").notNull(),
  originCoverageCode: text("origin_coverage_code"),
  estimatedBookWeightGrams: integer("estimated_book_weight_grams").default(300).notNull(),
  tcc: text("tcc"),
  senderRut: text("sender_rut"),
  serviceTypeCode: text("service_type_code"),
  productType: integer("product_type").default(3).notNull(),
  contentType: integer("content_type").default(1).notNull(),
  declaredWorth: integer("declared_worth").default(1000).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const shippingPackages = pgTable("shipping_packages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  dimensions: jsonb("dimensions").$type<ShippingPackageDimensions>().notNull(),
  maxWeightGrams: integer("max_weight_grams").default(1000).notNull(),
  packageWeightGrams: integer("package_weight_grams").default(0).notNull(),
  maxItems: integer("max_items").default(1).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
