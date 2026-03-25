import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { products } from "./products";

export interface FooterBannerMetadata {
  opacity: number;
  fadeStart: number;
  fadeEnd: number;
  imgWidth: number;
  artSpaceWidth: number;
}

export const heroSlides = pgTable("hero_slides", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title"),
  subtitle: text("subtitle"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const banners = pgTable("banners", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title"),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  position: text("position").notNull(),
  metadata: jsonb("metadata").$type<FooterBannerMetadata>(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const featuredProducts = pgTable("featured_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  section: text("section").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const featuredProductsRelations = relations(featuredProducts, ({ one }) => ({
  product: one(products, {
    fields: [featuredProducts.productId],
    references: [products.id],
  }),
}));
