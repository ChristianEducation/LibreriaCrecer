import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import {
  HERO_CONTENT_THEME_DEFAULT,
  HERO_OVERLAY_OPACITY_DEFAULT,
  HERO_OVERLAY_VARIANT_DEFAULT,
  HERO_TEXT_ALIGN_DEFAULT,
  HERO_TEXT_POSITION_DEFAULT,
  type BannerPosition,
  type HeroContentTheme,
  type HeroOverlayVariant,
  type HeroTextAlign,
  type HeroTextPosition,
  type LandingSectionKey,
} from "@/shared/config/landing";

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
  ctaText: text("cta_text"),
  showContent: boolean("show_content").default(true).notNull(),
  textPosition: text("text_position").$type<HeroTextPosition>().default(HERO_TEXT_POSITION_DEFAULT).notNull(),
  textAlign: text("text_align").$type<HeroTextAlign>().default(HERO_TEXT_ALIGN_DEFAULT).notNull(),
  overlayVariant: text("overlay_variant").$type<HeroOverlayVariant>().default(HERO_OVERLAY_VARIANT_DEFAULT).notNull(),
  overlayOpacity: integer("overlay_opacity").default(HERO_OVERLAY_OPACITY_DEFAULT).notNull(),
  contentTheme: text("content_theme").$type<HeroContentTheme>().default(HERO_CONTENT_THEME_DEFAULT).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const banners = pgTable("banners", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title"),
  description: text("description"),
  eyebrow: text("eyebrow"),
  ctaLabel: text("cta_label"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  position: text("position").$type<BannerPosition>().notNull(),
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

export const aboutSections = pgTable("about_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  imagePosition: text("image_position").notNull().default("right"),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const footerContent = pgTable("footer_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  brandDescription: text("brand_description"),
  catalogLinks: text("catalog_links"),
  infoLinks: text("info_links"),
  address: text("address"),
  mapsUrl: text("maps_url"),
  copyrightText: text("copyright_text"),
  designCredit: text("design_credit"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const landingSectionCopy = pgTable("landing_section_copy", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionKey: text("section_key").$type<LandingSectionKey>().notNull().unique(),
  eyebrow: text("eyebrow"),
  title: text("title"),
  body: text("body"),
  ctaLabel: text("cta_label"),
  ctaHref: text("cta_href"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
