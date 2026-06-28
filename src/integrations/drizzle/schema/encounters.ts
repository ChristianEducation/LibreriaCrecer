import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const encounters = pgTable("encounters", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  eventDate: date("event_date").notNull(),
  excerpt: text("excerpt"),
  description: text("description"),
  coverImageUrl: text("cover_image_url").notNull(),
  videoUrl: text("video_url"),
  location: text("location"),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const encounterImages = pgTable("encounter_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  encounterId: uuid("encounter_id")
    .notNull()
    .references(() => encounters.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const encountersRelations = relations(encounters, ({ many }) => ({
  images: many(encounterImages),
}));

export const encounterImagesRelations = relations(encounterImages, ({ one }) => ({
  encounter: one(encounters, {
    fields: [encounterImages.encounterId],
    references: [encounters.id],
  }),
}));
