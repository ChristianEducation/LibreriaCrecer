import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

import { productCategories } from "./products";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  headerImageUrl: text("header_image_url"),
  parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
    onDelete: "set null",
  }),
  featured: boolean("featured").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_parent",
  }),
  children: many(categories, {
    relationName: "category_parent",
  }),
  productCategories: many(productCategories),
}));
