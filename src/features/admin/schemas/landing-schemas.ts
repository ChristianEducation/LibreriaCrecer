import { z } from "zod";

import {
  BANNER_POSITIONS,
  HERO_CONTENT_THEMES,
  HERO_CONTENT_THEME_DEFAULT,
  HERO_OVERLAY_OPACITY_DEFAULT,
  HERO_OVERLAY_OPACITY_MAX,
  HERO_OVERLAY_OPACITY_MIN,
  HERO_OVERLAY_VARIANTS,
  HERO_OVERLAY_VARIANT_DEFAULT,
  HERO_TEXT_ALIGNS,
  HERO_TEXT_ALIGN_DEFAULT,
  HERO_TEXT_POSITIONS,
  HERO_TEXT_POSITION_DEFAULT,
  LANDING_SECTION_KEYS,
  MONTHLY_SELECTION_SECTION,
  normalizeCuratedSection,
} from "@/shared/config/landing";

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))
  .refine((value) => !value || /^https?:\/\//i.test(value), {
    message: "Invalid URL",
  });

const FooterBannerMetadataSchema = z.object({
  opacity: z.number().min(0).max(1),
  fadeStart: z.number().int().min(0).max(100),
  fadeEnd: z.number().int().min(0).max(100),
  imgWidth: z.number().int().min(0).max(100),
  artSpaceWidth: z.number().int().min(0).max(100),
  textTone: z.enum(["current", "dark"]).optional(),
});

export const HeroSlideSchema = z.object({
  title: optionalString,
  subtitle: optionalString,
  link_url: optionalUrl,
  cta_text: optionalString,
  show_content: z.boolean().default(true),
  text_position: z.enum(HERO_TEXT_POSITIONS).default(HERO_TEXT_POSITION_DEFAULT),
  text_align: z.enum(HERO_TEXT_ALIGNS).default(HERO_TEXT_ALIGN_DEFAULT),
  overlay_variant: z.enum(HERO_OVERLAY_VARIANTS).default(HERO_OVERLAY_VARIANT_DEFAULT),
  overlay_opacity: z
    .number()
    .int()
    .min(HERO_OVERLAY_OPACITY_MIN)
    .max(HERO_OVERLAY_OPACITY_MAX)
    .default(HERO_OVERLAY_OPACITY_DEFAULT),
  content_theme: z.enum(HERO_CONTENT_THEMES).default(HERO_CONTENT_THEME_DEFAULT),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const UpdateHeroSlideSchema = HeroSlideSchema.partial();

export const BannerSchema = z.object({
  title: optionalString,
  description: optionalString,
  eyebrow: optionalString,
  cta_label: optionalString,
  link_url: optionalUrl,
  position: z.enum(BANNER_POSITIONS),
  metadata: FooterBannerMetadataSchema.optional(),
  is_active: z.boolean().default(true),
});

export const UpdateBannerSchema = BannerSchema.partial();

export const LandingSectionCopySchema = z.object({
  section_key: z.enum(LANDING_SECTION_KEYS),
  eyebrow: optionalString,
  title: optionalString,
  body: optionalString,
  cta_label: optionalString,
  cta_href: optionalUrl,
  is_active: z.boolean().default(true),
});

export const UpdateLandingSectionCopySchema = LandingSectionCopySchema.partial();

export const CuratedProductSchema = z.object({
  product_id: z.string().uuid(),
  section: z.string().trim().min(1).default(MONTHLY_SELECTION_SECTION).transform(normalizeCuratedSection),
  description: optionalString,
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const UpdateCuratedProductSchema = CuratedProductSchema.partial();

export type HeroSlideInput = z.infer<typeof HeroSlideSchema>;
export type UpdateHeroSlideInput = z.infer<typeof UpdateHeroSlideSchema>;
export type BannerInput = z.infer<typeof BannerSchema>;
export type UpdateBannerInput = z.infer<typeof UpdateBannerSchema>;
export type CuratedProductInput = z.infer<typeof CuratedProductSchema>;
export type UpdateCuratedProductInput = z.infer<typeof UpdateCuratedProductSchema>;
export type FooterBannerMetadataInput = z.infer<typeof FooterBannerMetadataSchema>;
export type LandingSectionCopyInput = z.infer<typeof LandingSectionCopySchema>;
export type UpdateLandingSectionCopyInput = z.infer<typeof UpdateLandingSectionCopySchema>;
